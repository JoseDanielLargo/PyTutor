import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { StudentLevel } from '@prisma/client';

/**
 * Fields the tutor types in when adding a student.
 * The system manages the rest automatically (classesTaken, hoursTaken,
 * hadFirstClass, status) — see StudentsService.create — matching user story
 * HU01: new students start with 0 classes/hours, active, no first class yet.
 */
export class CreateStudentDto {
  @IsString()
  @MinLength(1, { message: 'Student name is required' })
  @MaxLength(120)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  phone?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email must be valid if provided' })
  email?: string;

  @IsOptional()
  @IsEnum(StudentLevel, {
    message: 'level must be BASIC, INTERMEDIATE, ADVANCED or CUSTOM',
  })
  level?: StudentLevel;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
