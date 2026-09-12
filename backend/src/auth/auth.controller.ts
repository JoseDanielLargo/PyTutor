import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtAuthGuard } from './jwt-auth.guard.js';
import { CurrentUser } from './current-user.decorator.js';
import type { AuthUser } from './current-user.decorator.js';

/**
 * A controller maps incoming HTTP requests to code.
 * The @Controller('auth') prefix means every route here starts with /auth.
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /auth/login
   * Body: { email, password }  ->  returns { accessToken, user }.
   * This is the endpoint the Angular login form will call.
   */
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  /**
   * GET /auth/me
   * Protected: requires a valid token. Returns the logged-in user.
   * Handy for the frontend to check "am I still logged in, and who am I?"
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: AuthUser) {
    return user;
  }
}
