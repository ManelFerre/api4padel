// src/modules/notifications/notifications.controller.ts
import { Controller, Get, Post, Body, Param, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { UpdateNotificationSettingsDto } from './dto/update-notification-settings.dto';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener notificaciones del usuario' })
  @ApiResponse({ status: 200, description: 'Notificaciones obtenidas correctamente' })
  async getUserNotifications(@GetUser() user) {
    return this.notificationsService.getUserNotifications(user.id);
  }

  @Post(':id/read')
  @ApiOperation({ summary: 'Marcar notificación como leída' })
  @ApiResponse({ status: 200, description: 'Notificación marcada como leída correctamente' })
  async markAsRead(@Param('id') id: string, @GetUser() user) {
    return this.notificationsService.markAsRead(id, user.id);
  }

  @Get('settings')
  @ApiOperation({ summary: 'Obtener configuración de notificaciones' })
  @ApiResponse({ status: 200, description: 'Configuración obtenida correctamente' })
  async getSettings(@GetUser() user) {
    return this.notificationsService.getUserSettings(user.id);
  }

  @Put('settings')
  @ApiOperation({ summary: 'Actualizar configuración de notificaciones' })
  @ApiResponse({ status: 200, description: 'Configuración actualizada correctamente' })
  async updateSettings(@GetUser() user, @Body() updateSettingsDto: UpdateNotificationSettingsDto) {
    return this.notificationsService.updateUserSettings(user.id, updateSettingsDto);
  }
}