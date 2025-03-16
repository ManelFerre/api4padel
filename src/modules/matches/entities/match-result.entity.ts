// src/modules/matches/entities/match-result.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Match } from './match.entity';
import { MatchPair } from './match-pair.entity';

@Entity('match_results')
export class MatchResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  match_id: string;

  @Column()
  pair1_id: string;

  @Column()
  pair2_id: string;

  @Column()
  set1_pair1: number;

  @Column()
  set1_pair2: number;

  @Column()
  set2_pair1: number;

  @Column()
  set2_pair2: number;

  @Column({ nullable: true })
  set3_pair1: number;

  @Column({ nullable: true })
  set3_pair2: number;

  @Column({ nullable: true })
  comments: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @ManyToOne(() => Match, match => match.results)
  @JoinColumn({ name: 'match_id' })
  match: Match;

  @ManyToOne(() => MatchPair)
  @JoinColumn({ name: 'pair1_id' })
  pair1: MatchPair;

  @ManyToOne(() => MatchPair)
  @JoinColumn({ name: 'pair2_id' })
  pair2: MatchPair;
}