import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';
import { LoginDto } from './dto/login.dto.js';

/**
 * AuthService handles the actual login logic.
 *
 * How login works, step by step:
 *   1. Look up the user by email.
 *   2. Compare the sent password to the stored HASH (never the raw password).
 *      We store only a bcrypt hash, so even if the DB leaked, real passwords
 *      are not exposed. bcrypt.compare re-hashes the input and checks a match.
 *   3. If it matches, we hand back a JWT (JSON Web Token): a signed string the
 *      client stores and sends on every future request. The signature (made
 *      with our JWT_SECRET) lets the server trust it without a DB lookup each
 *      time. Think of it like a wristband at an event — checked once, then
 *      flashed to get back in.
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    // Same error whether the email is unknown OR the password is wrong.
    // Telling attackers *which* one was wrong helps them guess accounts.
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // The "payload" is the data baked into the token. Keep it small and never
    // put secrets in it — a JWT is signed, but its contents are readable.
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = await this.jwt.signAsync(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
