// src/modules/groups/dto/create-group.dto.ts
import { IsNotEmpty, IsString, IsOptional, IsEnum, IsInt, IsBoolean, Min, Max, MaxLength } from 'class-validator';

enum GroupStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  ARCHIVED = 'ARCHIVED'
}

enum GroupGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  MIXED = 'MIXED'
}

enum GroupLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  PROFESSIONAL = 'PROFESSIONAL'
}

export class CreateGroupDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(GroupStatus)
  status?: GroupStatus;

  @IsOptional()
  @IsEnum(GroupGender)
  gender?: GroupGender;

  @IsOptional()
  @IsEnum(GroupLevel)
  level?: GroupLevel;

  @IsOptional()
  @IsInt()
  @Min(2)
  @Max(100)
  maxMembers?: number;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @IsOptional()
  @IsBoolean()
  requiresApproval?: boolean;

  @IsNotEmpty()
  @IsString()
  clubId: string;
}