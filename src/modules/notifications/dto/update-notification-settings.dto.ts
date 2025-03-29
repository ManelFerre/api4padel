// src/modules/notifications/dto/update-notification-settings.dto.ts
import { IsOptional, IsBoolean } from 'class-validator';

export class UpdateNotificationSettingsDto {
  @IsOptional()
  @IsBoolean()
  email_match_creation?: boolean;

  @IsOptional()
  @IsBoolean()
  email_match_reminder?: boolean;

  @IsOptional()
  @IsBoolean()
  email_match_results?: boolean;

  @IsOptional()
  @IsBoolean()
  push_match_creation?: boolean;

  @IsOptional()
  @IsBoolean()
  push_match_reminder?: boolean;

  @IsOptional()
  @IsBoolean()
  push_match_results?: boolean;
}