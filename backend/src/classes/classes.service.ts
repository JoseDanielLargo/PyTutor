import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClassType, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateClassDto } from './dto/create-class.dto.js';
import { UpdateClassDto } from './dto/update-class.dto.js';
import { calculatePrice, MAX_GROUP_SIZE } from './pricing.js';
import type { AuthUser } from '../auth/current-user.decorator.js';

@Injectable()
export class ClassesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creating a class does several things together, so we wrap them in a
   * transaction (all-or-nothing):
   *   1. Verify every student belongs to this tutor.
   *   2. Work out how many students are taking their FIRST class.
   *   3. Calculate the price from the business rules (pricing.ts).
   *   4. Create the Class row + one ClassStudent link per student.
   *   5. Bump each student's counters (classes/hours) and mark first class done.
   */
  async create(user: AuthUser, dto: CreateClassDto) {
    // De-duplicate the incoming student ids.
    const studentIds = [...new Set(dto.studentIds)];

    // 1. Load the students and confirm ownership.
    const students = await this.prisma.student.findMany({
      where: { id: { in: studentIds } },
    });
    if (students.length !== studentIds.length) {
      throw new BadRequestException('One or more students do not exist');
    }
    for (const s of students) {
      if (user.role !== 'ADMIN' && s.tutorId !== user.id) {
        throw new ForbiddenException('One or more students are not yours');
      }
    }

    // Optional subject must also be owned.
    if (dto.subjectId) {
      const subject = await this.prisma.subject.findUnique({
        where: { id: dto.subjectId },
      });
      if (!subject) throw new BadRequestException('subjectId does not exist');
      if (user.role !== 'ADMIN' && subject.tutorId !== user.id) {
        throw new ForbiddenException('That subject is not yours');
      }
    }

    // 2. First-timers among the attendees.
    const firstTimers = students.filter((s) => !s.hadFirstClass);
    const firstTimeCount = firstTimers.length;
    const studentCount = students.length;

    // 3. Price.
    const price = calculatePrice({
      durationHours: dto.durationHours,
      studentCount,
      firstTimeCount,
      manualDiscount: dto.manualDiscount ?? 0,
      manualTotal: dto.manualTotal,
    });

    // Decide the class type from the roster size.
    const type: ClassType =
      studentCount > MAX_GROUP_SIZE
        ? ClassType.SPECIAL
        : studentCount >= 2
          ? ClassType.GROUP
          : ClassType.INDIVIDUAL;

    // Even split of the total across students (for per-student records).
    const perStudentValue = Math.round(price.totalValue / studentCount);

    // 4 + 5. Do everything in one transaction.
    return this.prisma.$transaction(async (tx) => {
      const created = await tx.class.create({
        data: {
          date: new Date(dto.date),
          startTime: dto.startTime,
          endTime: dto.endTime,
          durationHours: dto.durationHours,
          type,
          baseValue: price.baseValue,
          groupDiscount: price.groupDiscount,
          firstTimeDiscount: price.firstTimeDiscount,
          manualDiscount: price.manualDiscount,
          totalValue: price.totalValue,
          topicWorked: dto.topicWorked,
          classLog: dto.classLog,
          difficulties: dto.difficulties,
          nextTopics: dto.nextTopics,
          notes: dto.notes,
          tutorId: user.id,
          subjectId: dto.subjectId,
          studentLinks: {
            create: students.map((s) => ({
              studentId: s.id,
              individualValue: perStudentValue,
              firstTimeDiscountApplied: !s.hadFirstClass,
              attended: false,
            })),
          },
        },
        include: { studentLinks: true },
      });

      // Update each student's running counters.
      for (const s of students) {
        await tx.student.update({
          where: { id: s.id },
          data: {
            classesTaken: { increment: 1 },
            hoursTaken: { increment: dto.durationHours },
            hadFirstClass: true,
          },
        });
      }

      return created;
    });
  }

  /**
   * Preview the price for a would-be class WITHOUT saving anything. Handy for
   * the frontend to show "this class will cost X" as the tutor fills the form.
   * Looks up the students only to count how many are first-timers.
   */
  async previewPrice(user: AuthUser, dto: CreateClassDto) {
    const studentIds = [...new Set(dto.studentIds)];
    const students = await this.prisma.student.findMany({
      where: { id: { in: studentIds } },
    });
    if (students.length !== studentIds.length) {
      throw new BadRequestException('One or more students do not exist');
    }
    for (const s of students) {
      if (user.role !== 'ADMIN' && s.tutorId !== user.id) {
        throw new ForbiddenException('One or more students are not yours');
      }
    }
    const firstTimeCount = students.filter((s) => !s.hadFirstClass).length;
    return calculatePrice({
      durationHours: dto.durationHours,
      studentCount: students.length,
      firstTimeCount,
      manualDiscount: dto.manualDiscount ?? 0,
      manualTotal: dto.manualTotal,
    });
  }

  findAll(user: AuthUser) {
    const where = user.role === 'ADMIN' ? {} : { tutorId: user.id };
    return this.prisma.class.findMany({
      where,
      orderBy: { date: 'desc' },
      include: {
        subject: { select: { id: true, name: true } },
        studentLinks: {
          include: { student: { select: { id: true, name: true } } },
        },
      },
    });
  }

  async findOne(user: AuthUser, id: string) {
    const klass = await this.prisma.class.findUnique({
      where: { id },
      include: {
        subject: { select: { id: true, name: true } },
        studentLinks: {
          include: { student: { select: { id: true, name: true } } },
        },
        payments: true,
      },
    });
    if (!klass) throw new NotFoundException('Class not found');
    if (user.role !== 'ADMIN' && klass.tutorId !== user.id) {
      throw new ForbiddenException('You do not have access to this class');
    }
    return klass;
  }

  async update(user: AuthUser, id: string, dto: UpdateClassDto) {
    const existing = await this.findOne(user, id);

    // If a new manual discount is given, recompute the total using the stored
    // base and other discounts (so the total stays consistent).
    const data: Prisma.ClassUpdateInput = { ...dto };
    if (dto.manualDiscount !== undefined) {
      const newTotal = Math.max(
        0,
        existing.baseValue -
          existing.groupDiscount -
          existing.firstTimeDiscount -
          dto.manualDiscount,
      );
      data.totalValue = newTotal;
    }

    return this.prisma.class.update({ where: { id }, data });
  }

  /**
   * Deleting a class also rolls back the counters it added to each student,
   * so the numbers stay honest. Done in a transaction.
   */
  async remove(user: AuthUser, id: string) {
    const klass = await this.findOne(user, id);

    return this.prisma.$transaction(async (tx) => {
      for (const link of klass.studentLinks) {
        await tx.student.update({
          where: { id: link.studentId },
          data: {
            classesTaken: { decrement: 1 },
            hoursTaken: { decrement: klass.durationHours },
          },
        });
      }
      // ClassStudent links are removed automatically (onDelete: Cascade).
      await tx.class.delete({ where: { id } });
      return { deleted: true, id };
    });
  }
}
