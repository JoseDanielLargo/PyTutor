import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

/**
 * Shape + rules for creating a subject (e.g. "Python", "Calculus").
 * Same idea as LoginDto: these decorators validate the request before our
 * code runs, so bad data never reaches the database.
 */
export class CreateSubjectDto {
  @IsString()
  @MinLength(1, { message: 'Subject name is required' })
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
