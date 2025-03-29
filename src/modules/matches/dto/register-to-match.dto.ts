// src/modules/matches/dto/register-to-match.dto.ts
import { IsNotEmpty, IsUUID, IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterToMatchDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  match_id: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  level?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  availability?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}