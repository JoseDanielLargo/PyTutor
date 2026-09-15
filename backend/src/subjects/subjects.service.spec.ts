import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { SubjectsService } from './subjects.service.js';
import type { AuthUser } from '../auth/current-user.decorator.js';

/**
 * These tests check the tutor-scoping RULES without touching a real database.
 * We give the service a FAKE PrismaService (a "mock") whose methods just record
 * how they were called and return canned data. That lets us assert things like
 * "a tutor's list query is filtered by their id" and "accessing someone else's
 * subject throws". Mocking is a core testing skill: test your logic in
 * isolation from slow/external systems like databases.
 */
describe('SubjectsService (tutor-scoping)', () => {
  const tutor: AuthUser = { id: 'tutor-1', email: 't@x.com', role: 'TUTOR' };
  const admin: AuthUser = { id: 'admin-1', email: 'a@x.com', role: 'ADMIN' };

  function makeService(subjectFindUniqueResult?: unknown) {
    const prismaMock = {
      subject: {
        findMany: vi.fn().mockResolvedValue([]),
        findUnique: vi.fn().mockResolvedValue(subjectFindUniqueResult),
        create: vi.fn().mockResolvedValue({ id: 's1' }),
      },
    };
    // Cast because our mock only implements the bits the service uses.
    const service = new SubjectsService(prismaMock as never);
    return { service, prismaMock };
  }

  it('a TUTOR only lists their own subjects', async () => {
    const { service, prismaMock } = makeService();
    await service.findAll(tutor);
    expect(prismaMock.subject.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { tutorId: 'tutor-1' } }),
    );
  });

  it('an ADMIN lists ALL subjects (no tutor filter)', async () => {
    const { service, prismaMock } = makeService();
    await service.findAll(admin);
    expect(prismaMock.subject.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: {} }),
    );
  });

  it('create stamps the subject with the tutor id', async () => {
    const { service, prismaMock } = makeService();
    await service.create(tutor, { name: 'Python' });
    expect(prismaMock.subject.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ tutorId: 'tutor-1' }),
      }),
    );
  });

  it('findOne throws NotFound when the subject does not exist', async () => {
    const { service } = makeService(null);
    await expect(service.findOne(tutor, 'missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('findOne throws Forbidden when the subject belongs to another tutor', async () => {
    const { service } = makeService({ id: 's1', tutorId: 'someone-else' });
    await expect(service.findOne(tutor, 's1')).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });

  it('findOne allows an ADMIN to read any subject', async () => {
    const { service } = makeService({ id: 's1', tutorId: 'someone-else' });
    await expect(service.findOne(admin, 's1')).resolves.toEqual({
      id: 's1',
      tutorId: 'someone-else',
    });
  });
});
