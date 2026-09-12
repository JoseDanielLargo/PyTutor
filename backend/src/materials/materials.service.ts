import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateMaterialDto } from './dto/create-material.dto.js';
import { UpdateMaterialDto } from './dto/update-material.dto.js';
import type { AuthUser } from '../auth/current-user.decorator.js';

@Injectable()
export class MaterialsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * If a subjectId is provided, make sure that subject exists AND belongs to
   * this tutor. This prevents attaching material to another tutor's subject.
   */
  private async assertSubjectOwned(user: AuthUser, subjectId?: string | null) {
    if (!subjectId) return;
    const subject = await this.prisma.subject.findUnique({
      where: { id: subjectId },
    });
    if (!subject) {
      throw new BadRequestException('The given subjectId does not exist');
    }
    if (user.role !== 'ADMIN' && subject.tutorId !== user.id) {
      throw new ForbiddenException('That subject is not yours');
    }
  }

  async create(user: AuthUser, dto: CreateMaterialDto) {
    await this.assertSubjectOwned(user, dto.subjectId);
    return this.prisma.material.create({
      data: {
        title: dto.title,
        type: dto.type,
        topic: dto.topic,
        recommendedLevel: dto.recommendedLevel,
        description: dto.description,
        url: dto.url,
        subjectId: dto.subjectId,
        tutorId: user.id,
      },
    });
  }

  findAll(user: AuthUser) {
    const where = user.role === 'ADMIN' ? {} : { tutorId: user.id };
    return this.prisma.material.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(user: AuthUser, id: string) {
    const material = await this.prisma.material.findUnique({ where: { id } });
    if (!material) {
      throw new NotFoundException('Material not found');
    }
    if (user.role !== 'ADMIN' && material.tutorId !== user.id) {
      throw new ForbiddenException('You do not have access to this material');
    }
    return material;
  }

  async update(user: AuthUser, id: string, dto: UpdateMaterialDto) {
    await this.findOne(user, id);
    await this.assertSubjectOwned(user, dto.subjectId);
    return this.prisma.material.update({ where: { id }, data: dto });
  }

  async remove(user: AuthUser, id: string) {
    await this.findOne(user, id);
    await this.prisma.material.delete({ where: { id } });
    return { deleted: true, id };
  }
}
