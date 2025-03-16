// src/modules/statistics/dto/create-user-statistics.dto.ts
import { IsNotEmpty, IsUUID, IsNumber, Min, IsOptional } from 'class-validator';

export class CreateUserStatisticsDto {
  @IsNotEmpty()
  @IsUUID()
  user_id: string;

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
  @IsNumber()
  @Min(0)
  sets_won?: number = 0;

  @IsOptional()
  @IsNumber()
  @Min(0)
  sets_lost?: number = 0;
}