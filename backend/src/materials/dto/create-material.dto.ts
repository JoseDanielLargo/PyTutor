import {
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { MaterialType, StudentLevel } from '@prisma/client';

/**
 * A teaching resource (PDF, link, video, exercise...). Optionally tied to a
 * subject via subjectId — we check that the subject belongs to the tutor in
 * the service so you can't attach material to someone else's subject.
 */
export class CreateMaterialDto {
  @IsString()
  @MinLength(1, { message: 'Material title is required' })
  @MaxLength(150)
  title: string;

  @IsOptional()
  @IsEnum(MaterialType, {
    message: 'type must be PDF, LINK, VIDEO, EXERCISE, WORKSHOP or OTHER',
  })
  type?: MaterialType;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  topic?: string;

  @IsOptional()
  @IsEnum(StudentLevel, {
    message: 'recommendedLevel must be BASIC, INTERMEDIATE, ADVANCED or CUSTOM',
  })
  recommendedLevel?: StudentLevel;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsUrl({}, { message: 'url must be a valid URL if provided' })
  url?: string;

  @IsOptional()
  @IsString()
  subjectId?: string;
}
