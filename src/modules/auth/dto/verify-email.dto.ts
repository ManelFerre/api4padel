// src/modules/auth/dto/verify-email.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyEmailDto {
  @IsNotEmpty()
  @IsString()
  token: string;
}