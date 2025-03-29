// src/modules/statistics/dto/update-pair-statistics.dto.ts
import { IsNotEmpty, IsUUID, IsNumber, Min, IsOptional, IsDateString } from 'class-validator';

export class UpdatePairStatisticsDto {
  @IsNotEmpty()
  @IsUUID()
  player1_id: string;

  @IsNotEmpty()
  @IsUUID()
  player2_id: string;

  @IsNotEmpty()
  @IsUUID()
  group_id: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  matches_played: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  matches_won: number;

  @IsOptional()
  @IsDateString()
  last_played?: string;
}