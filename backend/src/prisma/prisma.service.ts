import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * PrismaService is our single gateway to the database.
 *
 * It extends Prisma's generated client, so anywhere we inject this service we
 * can write things like `this.prisma.user.findUnique(...)`. NestJS creates ONE
 * shared instance (a "singleton"), which means the app opens its database
 * connection once and reuses it — exactly how you want it in production.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  // Runs automatically when the module starts up: open the DB connection.
  async onModuleInit() {
    await this.$connect();
  }
}
