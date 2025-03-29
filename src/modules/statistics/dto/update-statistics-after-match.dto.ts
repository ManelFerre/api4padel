// src/modules/statistics/dto/update-statistics-after-match.dto.ts
import { IsNotEmpty, IsUUID, IsBoolean, IsNumber, Min, Max } from 'class-validator';

export class UpdateStatisticsAfterMatchDto {
  @IsNotEmpty()
  @IsUUID()
  user_id: string;

  @IsNotEmpty()
  @IsUUID()
  group_id: string;

  @IsNotEmpty()
  @IsBoolean()
  won: boolean;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(3)
  sets_won: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(3)
  sets_lost: number;
}