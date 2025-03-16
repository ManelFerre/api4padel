// src/modules/matches/entities/match-pair.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Match } from './match.entity';
import { User } from '../../users/entities/user.entity';

@Entity('match_pairs')
export class MatchPair {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  match_id: string;

  @Column()
  player1_id: string;

  @Column()
  player2_id: string;

  @Column({ default: 1 })
  court_number: number;

  @ManyToOne(() => Match, match => match.pairs)
  @JoinColumn({ name: 'match_id' })
  match: Match;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'player1_id' })
  player1: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'player2_id' })
  player2: User;
}