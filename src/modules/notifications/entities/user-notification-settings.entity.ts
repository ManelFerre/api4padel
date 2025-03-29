// src/modules/notifications/entities/user-notification-settings.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('user_notification_settings')
export class UserNotificationSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Column({ default: true })
  email_match_creation: boolean;

  @Column({ default: true })
  email_match_reminder: boolean;

  @Column({ default: true })
  email_match_results: boolean;

  @Column({ default: true })
  push_match_creation: boolean;

  @Column({ default: true })
  push_match_reminder: boolean;

  @Column({ default: true })
  push_match_results: boolean;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
