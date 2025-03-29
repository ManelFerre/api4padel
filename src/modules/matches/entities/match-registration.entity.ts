// src/modules/matches/entities/match-registration.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Match } from './match.entity';
import { User } from '../../users/entities/user.entity';

@Entity('match_registrations')
export class MatchRegistration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  match_id: string;

  @Column()
  user_id: string;

  @Column({ default: 5 })
  level: number;

  @Column({ nullable: true })
  availability: string;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @ManyToOne(() => Match, match => match.registrations)
  @JoinColumn({ name: 'match_id' })
  match: Match;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}