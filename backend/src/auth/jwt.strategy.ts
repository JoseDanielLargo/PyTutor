import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

/**
 * The shape of the data we stored inside the token (see AuthService payload).
 */
export interface JwtPayload {
  sub: string; // the user's id
  email: string;
  role: 'TUTOR' | 'ADMIN';
}

/**
 * JwtStrategy is the "bouncer" for protected routes.
 *
 * On any request that requires login, it:
 *   1. Reads the token from the "Authorization: Bearer <token>" header.
 *   2. Verifies the signature using JWT_SECRET (proves we issued it, unchanged).
 *   3. Returns the user info, which NestJS attaches to `request.user`.
 * If any step fails, the request is rejected with 401 Unauthorized.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    const secret = config.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not set in the environment (.env)');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  // Whatever this returns becomes `request.user` in our controllers.
  validate(payload: JwtPayload) {
    if (!payload?.sub) {
      throw new UnauthorizedException();
    }
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}
