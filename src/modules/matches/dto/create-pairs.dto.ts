// src/modules/matches/dto/create-pairs.dto.ts
import { IsArray, IsNotEmpty, ValidateNested, IsUUID, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PairDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  player1_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  player2_id: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  court_number?: number;
}

export class CreatePairsDto {
  @ApiProperty({ type: [PairDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PairDto)
  pairs: PairDto[];
}