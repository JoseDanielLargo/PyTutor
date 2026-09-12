import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateSubjectDto } from './dto/create-subject.dto.js';
import { UpdateSubjectDto } from './dto/update-subject.dto.js';
import type { AuthUser } from '../auth/current-user.decorator.js';

/**
 * SubjectsService holds all the business logic for subjects.
 *
 * The key idea here is TUTOR-SCOPING. Every method takes the logged-in `user`
 * and only touches rows that belong to them (via `tutorId`). This is what
 * keeps one tutor from seeing another's data — and it's exactly the design
 * that lets us go multi-tutor later without a rewrite.
 *
 * ADMIN is treated as a super-user: an admin can read/modify any subject.
 */
@Injectable()
export class SubjectsService {
  constructor(private readonly prisma: PrismaService) {}

  create(user: AuthUser, dto: CreateSubjectDto) {
    return this.prisma.subject.create({
      data: {
        name: dto.name,
        description: dto.description,
        tutorId: user.id, // stamp the owner = the logged-in tutor
      },
    });
  }

  findAll(user: AuthUser) {
    // A tutor sees only their own subjects. An admin sees all of them.
    const where = user.role === 'ADMIN' ? {} : { tutorId: user.id };
    return this.prisma.subject.findMany({
      where,
      orderBy: { name: 'asc' },
    });
  }

  async findOne(user: AuthUser, id: string) {
    const subject = await this.prisma.subject.findUnique({ where: { id } });
    if (!subject) {
      throw new NotFoundException('Subject not found');
    }
    // Ownership check: unless you're an admin, it must be yours.
    if (user.role !== 'ADMIN' && subject.tutorId !== user.id) {
      throw new ForbiddenException('You do not have access to this subject');
    }
    return subject;
  }

  async update(user: AuthUser, id: string, dto: UpdateSubjectDto) {
    // Reuse findOne so the same not-found + ownership checks apply.
    await this.findOne(user, id);
    return this.prisma.subject.update({
      where: { id },
      data: dto,
    });
  }

  async remove(user: AuthUser, id: string) {
    await this.findOne(user, id);
    await this.prisma.subject.delete({ where: { id } });
    return { deleted: true, id };
  }
}
