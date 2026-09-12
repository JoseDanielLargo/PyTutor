import {
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import { PaymentMethod, PaymentStatus } from '@prisma/client';

/**
 * Recording a payment. A payment always belongs to a student, and may
 * optionally be tied to a specific class it pays for.
 */
export class CreatePaymentDto {
  @IsString()
  studentId: string;

  @IsOptional()
  @IsString()
  classId?: string;

  @IsInt()
  @IsPositive({ message: 'amount must be greater than 0' })
  amount: number;

  @IsEnum(PaymentMethod, {
    message: 'method must be NEQUI, CASH, BANCOLOMBIA or LLAVE',
  })
  method: PaymentMethod;

  @IsOptional()
  @IsEnum(PaymentStatus, {
    message: 'status must be PENDING, PARTIAL or PAID',
  })
  status?: PaymentStatus;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
