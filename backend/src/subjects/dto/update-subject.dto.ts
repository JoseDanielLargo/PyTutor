import { PartialType } from '@nestjs/mapped-types';
import { CreateSubjectDto } from './create-subject.dto.js';

/**
 * PartialType makes every field from CreateSubjectDto optional. That means an
 * update can change just the name, just the description, or both — while still
 * reusing the same validation rules. Less code, no duplication.
 */
export class UpdateSubjectDto extends PartialType(CreateSubjectDto) {}
