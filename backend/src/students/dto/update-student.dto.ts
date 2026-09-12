import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { StudentStatus } from '@prisma/client';
import { CreateStudentDto } from './create-student.dto.js';

/**
 * On update, all create fields become optional (PartialType). We also allow
 * changing `status` here so a tutor can mark a student Active/Inactive.
 * (The count fields stay system-managed and are not editable through the API.)
 */
export class UpdateStudentDto extends PartialType(CreateStudentDto) {
  @IsOptional()
  @IsEnum(StudentStatus, { message: 'status must be ACTIVE or INACTIVE' })
  status?: StudentStatus;
}
