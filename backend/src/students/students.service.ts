import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateStudentDto } from './dto/create-student.dto.js';
import { UpdateStudentDto } from './dto/update-student.dto.js';
import type { AuthUser } from '../auth/current-user.decorator.js';

/**
 * Same tutor-scoped pattern as SubjectsService. The only extra idea here is
 * that some fields are SYSTEM-MANAGED: when creating a student we force the
 * counters to their starting values (HU01), rather than trusting the client.
 */
@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  create(user: AuthUser, dto: CreateStudentDto) {
    return this.prisma.student.create({
      data: {
        name: dto.name,
        phone: dto.phone,
        email: dto.email,
        level: dto.level, // defaults to BASIC in the schema if omitted
        notes: dto.notes,
        tutorId: user.id,
        // System-managed starting values:
        classesTaken: 0,
        hoursTaken: 0,
        hadFirstClass: false,
        // status defaults to ACTIVE in the schema
      },
    });
  }

  findAll(user: AuthUser) {
    const where = user.role === 'ADMIN' ? {} : { tutorId: user.id };
    return this.prisma.student.findMany({
      where,
      orderBy: { name: 'asc' },
    });
  }

  async findOne(user: AuthUser, id: string) {
    const student = await this.prisma.student.findUnique({ where: { id } });
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    if (user.role !== 'ADMIN' && student.tutorId !== user.id) {
      throw new ForbiddenException('You do not have access to this student');
    }
    return student;
  }

  async update(user: AuthUser, id: string, dto: UpdateStudentDto) {
    await this.findOne(user, id);
    return this.prisma.student.update({ where: { id }, data: dto });
  }

  async remove(user: AuthUser, id: string) {
    await this.findOne(user, id);
    await this.prisma.student.delete({ where: { id } });
    return { deleted: true, id };
  }
}
