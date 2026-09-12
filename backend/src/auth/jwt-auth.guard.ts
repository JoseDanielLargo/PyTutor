import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * A "guard" decides whether a request is allowed to reach a route.
 * Put @UseGuards(JwtAuthGuard) on any endpoint that requires being logged in;
 * it runs the JwtStrategy above and rejects the request if the token is
 * missing or invalid. We'll reuse this on every protected feature.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
