import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';

/**
 * @Global() means: once this module is imported once (in AppModule), every
 * other module in the app can inject PrismaService without importing it again.
 * Databases are used everywhere, so making it global keeps things tidy.
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
