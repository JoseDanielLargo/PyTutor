import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SubjectsService } from './subjects.service.js';
import { CreateSubjectDto } from './dto/create-subject.dto.js';
import { UpdateSubjectDto } from './dto/update-subject.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { CurrentUser } from '../auth/current-user.decorator.js';
import type { AuthUser } from '../auth/current-user.decorator.js';

/**
 * REST endpoints for subjects, all under /subjects.
 *
 * @UseGuards(JwtAuthGuard) on the whole controller means EVERY route here
 * requires a valid login token. @CurrentUser() hands us the logged-in user so
 * the service can scope everything to them. This is the reusable pattern that
 * every future feature (students, classes, ...) will follow.
 *
 * REST verbs map to actions:
 *   POST   /subjects       -> create
 *   GET    /subjects       -> list mine (all if admin)
 *   GET    /subjects/:id   -> read one
 *   PATCH  /subjects/:id   -> update
 *   DELETE /subjects/:id   -> delete
 */
@UseGuards(JwtAuthGuard)
@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateSubjectDto) {
    return this.subjectsService.create(user, dto);
  }

  @Get()
  findAll(@CurrentUser() user: AuthUser) {
    return this.subjectsService.findAll(user);
  }

  @Get(':id')
  findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.subjectsService.findOne(user, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateSubjectDto,
  ) {
    return this.subjectsService.update(user, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.subjectsService.remove(user, id);
  }
}
