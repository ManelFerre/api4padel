// src/modules/matches/dto/unregister-from-match.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class UnregisterFromMatchDto {
  @IsNotEmpty()
  @IsString()
  match_id: string;
}