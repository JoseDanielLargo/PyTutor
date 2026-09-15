import { Module } from '@nestjs/common';
import { StudentsService } from './students.service.js';
import { StudentsController } from './students.controller.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [AuthModule],
  controllers: [StudentsController],
  providers: [StudentsService],
  // Exported so the Classes feature can reuse student logic later.
  exports: [StudentsService],
})
export class StudentsModule {}
