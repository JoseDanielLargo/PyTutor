import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { ClassStatus } from '@prisma/client';

/**
 * Updating a class focuses on the academic log, status, and manual discount.
 * (Changing the student roster requires recalculating the price, so we handle
 * that as a dedicated action later rather than a generic field update.)
 */
export class UpdateClassDto {
  @IsOptional()
  @IsEnum(ClassStatus, {
    message: 'status must be SCHEDULED, COMPLETED, CANCELLED or NO_SHOW',
  })
  status?: ClassStatus;

  @IsOptional() @IsString() @MaxLength(150) topicWorked?: string;
  @IsOptional() @IsString() @MaxLength(4000) classLog?: string;
  @IsOptional() @IsString() @MaxLength(2000) difficulties?: string;
  @IsOptional() @IsString() @MaxLength(2000) nextTopics?: string;
  @IsOptional() @IsString() @MaxLength(2000) notes?: string;

  @IsOptional() @IsInt() @Min(0) manualDiscount?: number;
}
