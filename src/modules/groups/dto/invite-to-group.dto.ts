// src/modules/groups/dto/invite-to-group.dto.ts
import { IsNotEmpty, IsEmail } from 'class-validator';

export class InviteToGroupDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}