// src/modules/matches/dto/create-match.dto.ts
import { IsNotEmpty, IsString, IsOptional, IsNumber, IsDateString, Min, Max } from 'class-validator';

export class CreateMatchDto {
  @IsNotEmpty()
  @IsString()
  group_id: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsDateString()
  match_date: string;

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

  @IsNotEmpty()
  @IsNumber()
  @Min(4)
  max_players: number;

  @IsNotEmpty()
  @IsDateString()
  registration_deadline: string;

  @IsOptional()
  @IsString()
  location?: string;
}