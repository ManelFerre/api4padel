// src/modules/matches/dto/pair.dto.ts
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class PairDto {
  @IsNotEmpty()
  @IsString()
  player1_id: string;

  @IsNotEmpty()
  @IsString()
  player2_id: string;

  @IsNotEmpty()
  @IsNumber()
  court_number: number;
}