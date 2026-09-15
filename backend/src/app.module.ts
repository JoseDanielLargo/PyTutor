import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { SubjectsModule } from './subjects/subjects.module.js';
import { StudentsModule } from './students/students.module.js';
import { MaterialsModule } from './materials/materials.module.js';
import { ClassesModule } from './classes/classes.module.js';
import { PaymentsModule } from './payments/payments.module.js';

@Module({
  imports: [
    // Loads variables from .env and makes them available everywhere.
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    SubjectsModule,
    StudentsModule,
    MaterialsModule,
    ClassesModule,
    PaymentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
