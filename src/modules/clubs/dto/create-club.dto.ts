// src/modules/clubs/dto/create-club.dto.ts
import { IsNotEmpty, IsString, IsOptional, IsEmail, IsUrl, IsBoolean, IsNumber, MaxLength } from 'class-validator';

export class CreateClubDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  logo?: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(255)
  website?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  contact_email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  contact_phone?: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  country: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  province: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  city: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  address: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}