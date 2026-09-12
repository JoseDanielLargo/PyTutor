import { Module } from '@nestjs/common';
import { SubjectsService } from './subjects.service.js';
import { SubjectsController } from './subjects.controller.js';
import { AuthModule } from '../auth/auth.module.js';

/**
 * Bundles the subjects feature. We import AuthModule so JwtAuthGuard (which
 * relies on the JWT/Passport setup) resolves correctly here. PrismaService is
 * already global, so no need to import it.
 */
@Module({
  imports: [AuthModule],
  controllers: [SubjectsController],
  providers: [SubjectsService],
})
export class SubjectsModule {}
