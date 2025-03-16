// src/modules/statistics/entities/pair-statistics.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Group } from '../../groups/entities/group.entity';

@Entity('pair_statistics')
export class PairStatistics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  player1_id: string;

  @Column()
  player2_id: string;

  @Column()
  group_id: string;

  @Column({ default: 0 })
  matches_played: number;

  @Column({ default: 0 })
  matches_won: number;

  @Column({ nullable: true, type: 'timestamp with time zone' })
  last_played: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'player1_id' })
  player1: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'player2_id' })
  player2: User;

  @ManyToOne(() => Group)
  @JoinColumn({ name: 'group_id' })
  group: Group;
}