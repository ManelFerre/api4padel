// src/modules/statistics/dto/create-pair-statistics.dto.ts
import { IsNotEmpty, IsUUID, IsNumber, Min, IsOptional, IsDateString } from 'class-validator';

export class CreatePairStatisticsDto {
  @IsNotEmpty()
  @IsUUID()
  player1_id: string;

  @IsNotEmpty()
  @IsUUID()
  player2_id: string;

  @IsNotEmpty()
  @IsUUID()
  group_id: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  matches_played?: number = 0;

  @IsOptional()
  @IsNumber()
  @Min(0)
  matches_won?: number = 0;

  @IsOptional()
  @IsDateString()
  last_played?: string;
}