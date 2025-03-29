// src/modules/statistics/dto/update-pair-statistics-after-match.dto.ts
import { IsNotEmpty, IsUUID, IsBoolean } from 'class-validator';

export class UpdatePairStatisticsAfterMatchDto {
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
  @IsBoolean()
  won: boolean;
}