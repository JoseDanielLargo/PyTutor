import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePaymentDto } from './dto/create-payment.dto.js';
import { UpdatePaymentDto } from './dto/update-payment.dto.js';
import type { AuthUser } from '../auth/current-user.decorator.js';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Confirm the student exists and belongs to this tutor. */
  private async assertStudentOwned(user: AuthUser, studentId: string) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
    });
    if (!student) throw new BadRequestException('studentId does not exist');
    if (user.role !== 'ADMIN' && student.tutorId !== user.id) {
      throw new ForbiddenException('That student is not yours');
    }
    return student;
  }

  async create(user: AuthUser, dto: CreatePaymentDto) {
    await this.assertStudentOwned(user, dto.studentId);

    if (dto.classId) {
      const klass = await this.prisma.class.findUnique({
        where: { id: dto.classId },
      });
      if (!klass) throw new BadRequestException('classId does not exist');
      if (user.role !== 'ADMIN' && klass.tutorId !== user.id) {
        throw new ForbiddenException('That class is not yours');
      }
    }

    return this.prisma.payment.create({
      data: {
        studentId: dto.studentId,
        classId: dto.classId,
        amount: dto.amount,
        method: dto.method,
        status: dto.status,
        notes: dto.notes,
      },
    });
  }

  /** All payments for the tutor's students (all if admin). */
  findAll(user: AuthUser) {
    const where =
      user.role === 'ADMIN' ? {} : { student: { tutorId: user.id } };
    return this.prisma.payment.findMany({
      where,
      orderBy: { paidAt: 'desc' },
      include: { student: { select: { id: true, name: true } } },
    });
  }

  async findOne(user: AuthUser, id: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: { student: true },
    });
    if (!payment) throw new NotFoundException('Payment not found');
    if (user.role !== 'ADMIN' && payment.student.tutorId !== user.id) {
      throw new ForbiddenException('You do not have access to this payment');
    }
    return payment;
  }

  async update(user: AuthUser, id: string, dto: UpdatePaymentDto) {
    await this.findOne(user, id);
    if (dto.studentId) await this.assertStudentOwned(user, dto.studentId);
    return this.prisma.payment.update({ where: { id }, data: dto });
  }

  async remove(user: AuthUser, id: string) {
    await this.findOne(user, id);
    await this.prisma.payment.delete({ where: { id } });
    return { deleted: true, id };
  }

  // -------------------------------------------------------------------------
  // Reporting (HU11, HU14, HU15)
  // -------------------------------------------------------------------------

  /**
   * Debt for one student: total generated (sum of their class totals) vs total
   * paid (sum of their payments) => outstanding balance. (HU11)
   */
  async studentDebt(user: AuthUser, studentId: string) {
    await this.assertStudentOwned(user, studentId);

    const classAgg = await this.prisma.class.aggregate({
      where: { studentLinks: { some: { studentId } } },
      _sum: { totalValue: true },
    });
    const paidAgg = await this.prisma.payment.aggregate({
      where: { studentId },
      _sum: { amount: true },
    });

    const generated = classAgg._sum.totalValue ?? 0;
    const paid = paidAgg._sum.amount ?? 0;
    return {
      studentId,
      generated,
      paid,
      balance: generated - paid,
    };
  }

  /**
   * Income summary for the tutor (HU14): total generated across all classes,
   * total actually received, and the outstanding amount. Optional month filter
   * (YYYY-MM) narrows classes/payments to that month.
   */
  async incomeSummary(user: AuthUser, month?: string) {
    const tutorFilter =
      user.role === 'ADMIN' ? {} : { tutorId: user.id };

    let dateRange: { gte: Date; lt: Date } | undefined;
    if (month) {
      const [y, m] = month.split('-').map(Number);
      if (!y || !m || m < 1 || m > 12) {
        throw new BadRequestException('month must be in YYYY-MM format');
      }
      dateRange = { gte: new Date(y, m - 1, 1), lt: new Date(y, m, 1) };
    }

    const generatedAgg = await this.prisma.class.aggregate({
      where: { ...tutorFilter, ...(dateRange ? { date: dateRange } : {}) },
      _sum: { totalValue: true },
    });

    const paymentWhere =
      user.role === 'ADMIN'
        ? {}
        : { student: { tutorId: user.id } };
    const paidAgg = await this.prisma.payment.aggregate({
      where: {
        ...paymentWhere,
        ...(dateRange ? { paidAt: dateRange } : {}),
      },
      _sum: { amount: true },
    });

    const generated = generatedAgg._sum.totalValue ?? 0;
    const received = paidAgg._sum.amount ?? 0;
    return {
      month: month ?? 'all-time',
      generated,
      received,
      outstanding: generated - received,
    };
  }
}
