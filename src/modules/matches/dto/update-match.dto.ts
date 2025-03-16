// src/modules/matches/dto/update-match.dto.ts
import { IsOptional, IsString, IsNumber, IsDateString, Min, Max } from 'class-validator';

export class UpdateMatchDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  match_date?: string;

  @IsOptional()
  @IsNumber()
  @Min(30)
  @Max(240)
  duration_minutes?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  courts_count?: number;

  @IsOptional()
  @IsNumber()
  @Min(4)
  max_players?: number;

  @IsOptional()
  @IsDateString()
  registration_deadline?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  status?: string;
}