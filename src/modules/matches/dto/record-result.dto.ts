// src/modules/matches/dto/record-result.dto.ts
import { IsNotEmpty, IsUUID, IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RecordResultDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  pair1_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  pair2_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(7)
  set1_pair1: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(7)
  set1_pair2: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(7)
  set2_pair1: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(7)
  set2_pair2: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(7)
  set3_pair1?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(7)
  set3_pair2?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  comments?: string;
}