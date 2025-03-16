// src/modules/users/dto/create-verification-token.dto.ts
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateVerificationTokenDto {
  @IsNotEmpty()
  @IsUUID()
  user_id: string;

  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  expires_at: Date | string;
}