import { IsEmail, IsString, MinLength } from 'class-validator';

/**
 * A DTO ("Data Transfer Object") describes the exact shape of data we expect
 * from the client, plus rules for what counts as valid. The decorators below
 * (@IsEmail, etc.) are checked automatically before our code even runs, so
 * garbage requests are rejected at the door. This is a core security habit:
 * never trust raw input from a browser.
 */
export class LoginDto {
  @IsEmail({}, { message: 'A valid email is required' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}
