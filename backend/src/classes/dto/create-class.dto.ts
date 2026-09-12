import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

/**
 * Creating a class. The tutor provides who/when/what; the SYSTEM calculates
 * the price (base, discounts, total) from the business rules — see
 * ClassesService.create + pricing.ts. That's the whole point of the app.
 */
export class CreateClassDto {
  @IsDateString({}, { message: 'date must be an ISO date, e.g. 2026-09-12' })
  date: string;

  @IsOptional()
  @IsString()
  startTime?: string; // "16:00"

  @IsOptional()
  @IsString()
  endTime?: string; // "18:00"

  @IsNumber()
  @IsPositive({ message: 'durationHours must be greater than 0' })
  durationHours: number;

  @IsOptional()
  @IsString()
  subjectId?: string;

  /** The students attending this class (one or more). */
  @IsArray()
  @ArrayNotEmpty({ message: 'A class needs at least one student' })
  @IsString({ each: true })
  studentIds: string[];

  /** Optional manual discount applied on top of the calculated total. */
  @IsOptional()
  @IsInt()
  @Min(0)
  manualDiscount?: number;

  /** For SPECIAL sessions (>4 students): the manually agreed total. */
  @IsOptional()
  @IsInt()
  @Min(0)
  manualTotal?: number;

  // Academic log fields (all optional).
  @IsOptional() @IsString() @MaxLength(150) topicWorked?: string;
  @IsOptional() @IsString() @MaxLength(4000) classLog?: string;
  @IsOptional() @IsString() @MaxLength(2000) difficulties?: string;
  @IsOptional() @IsString() @MaxLength(2000) nextTopics?: string;
  @IsOptional() @IsString() @MaxLength(2000) notes?: string;
}
