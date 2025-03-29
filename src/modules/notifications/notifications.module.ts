import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { Notification } from './entities/notification.entity';
import { UserNotificationSettings } from './entities/user-notification-settings.entity';
import { MailModule } from '../../providers/mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification, UserNotificationSettings]),
    MailModule,
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}