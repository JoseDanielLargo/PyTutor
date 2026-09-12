import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * A small convenience decorator so controllers can read the logged-in user
 * directly, e.g.:
 *
 *   @Get('me')
 *   getMe(@CurrentUser() user) { return user; }
 *
 * It just pulls the `user` object that JwtStrategy attached to the request.
 */
export interface AuthUser {
  id: string;
  email: string;
  role: 'TUTOR' | 'ADMIN';
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
