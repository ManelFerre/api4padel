// src/modules/matches/entities/match.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { MatchRegistration } from './match-registration.entity';
import { MatchPair } from './match-pair.entity';
import { MatchResult } from './match-result.entity';
import { Group } from '../../groups/entities/group.entity';

@Entity('matches')
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'timestamp with time zone' })
  date: Date;

  @Column()
  duration: number;

  @Column()
  location: string;

  @Column({ nullable: true })
  group_id: string;

  @Column()
  created_by: string;

  @Column({ default: 'pending' })
  status: string;

  @Column({ default: 4 })
  max_players: number;

  @Column({ default: 1 })
  courts: number;

  @Column({ default: false })
  is_private: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;

  @OneToMany(() => MatchRegistration, registration => registration.match)
  registrations: MatchRegistration[];

  @OneToMany(() => MatchPair, pair => pair.match)
  pairs: MatchPair[];

  @OneToMany(() => MatchResult, result => result.match)
  results: MatchResult[];

  @ManyToOne(() => Group, group => group.matches)
  @JoinColumn({ name: 'group_id' })
  group: Group;  
}