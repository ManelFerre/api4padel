// src/modules/notifications/notifications.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { UserNotificationSettings } from './entities/user-notification-settings.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationSettingsDto } from './dto/update-notification-settings.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
    
    @InjectRepository(UserNotificationSettings)
    private settingsRepository: Repository<UserNotificationSettings>,
  ) {}

  async createNotification(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    const notification = this.notificationsRepository.create(createNotificationDto);
    return this.notificationsRepository.save(notification);
  }

  async getUserNotifications(userId: string): Promise<Notification[]> {
    return this.notificationsRepository.find({
      where: { user_id: userId } as any,
      order: { created_at: 'DESC' } as any,
    });
  }

  async markAsRead(id: string, userId: string): Promise<Notification> {
    const notification = await this.notificationsRepository.findOne({
      where: { id, user_id: userId } as any,
    });
    
    if (!notification) {
      throw new NotFoundException('Notificación no encontrada');
    }
    
    notification.read_at = new Date();
    notification.status = 'read';
    
    return this.notificationsRepository.save(notification);
  }

  async getUserSettings(userId: string): Promise<UserNotificationSettings> {
    let settings = await this.settingsRepository.findOne({
      where: { user_id: userId } as any,
    });
    
    if (!settings) {
      // Crear configuración por defecto si no existe
      settings = this.settingsRepository.create({
        user_id: userId,
      });
      await this.settingsRepository.save(settings);
    }
    
    return settings;
  }

  async updateUserSettings(userId: string, updateSettingsDto: UpdateNotificationSettingsDto): Promise<UserNotificationSettings> {
    let settings = await this.getUserSettings(userId);
    
    // Actualizar configuración
    Object.assign(settings, updateSettingsDto);
    
    return this.settingsRepository.save(settings);
  }
}