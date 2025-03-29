// src/modules/statistics/entities/user-statistics.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Group } from '../../groups/entities/group.entity';

@Entity('user_statistics')
export class UserStatistics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Column()
  group_id: string;

  @Column({ default: 0 })
  matches_played: number;

  @Column({ default: 0 })
  matches_won: number;

  @Column({ default: 0 })
  sets_won: number;

  @Column({ default: 0 })
  sets_lost: number;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  last_updated: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Group)
  @JoinColumn({ name: 'group_id' })
  group: Group;
}