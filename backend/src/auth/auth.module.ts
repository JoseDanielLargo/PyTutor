import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { JwtStrategy } from './jwt.strategy.js';

/**
 * AuthModule bundles everything related to logging in.
 *
 * JwtModule is configured asynchronously so it can read JWT_SECRET from the
 * environment (via ConfigService). Tokens expire after 7 days here — long
 * enough to be convenient while learning; you can shorten it later.
 */
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  // Export so future feature modules can protect their routes with JwtAuthGuard.
  exports: [PassportModule, JwtModule],
})
export class AuthModule {}
