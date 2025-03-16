// src/modules/statistics/dto/update-user-statistics.dto.ts
import { IsNotEmpty, IsUUID, IsNumber, Min } from 'class-validator';

export class UpdateUserStatisticsDto {
  @IsNotEmpty()
  @IsUUID()
  user_id: string;

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

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  sets_won: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  sets_lost: number;
}