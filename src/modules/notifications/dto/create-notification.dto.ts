// src/modules/notifications/dto/create-notification.dto.ts
import { IsNotEmpty, IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateNotificationDto {
  @IsNotEmpty()
  @IsUUID()
  user_id: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  related_entity_type?: string;

  @IsOptional()
  @IsUUID()
  related_entity_id?: string;
}