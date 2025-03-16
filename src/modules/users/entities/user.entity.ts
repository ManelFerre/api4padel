// src/modules/users/entities/user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  profile_picture: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ default: 'pending' })
  status: string;

  @Column({ default: false })
  email_verified: boolean;

  @Column({ default: 0 })
  login_attempts: number;

  @Column({ nullable: true, type: 'timestamp with time zone' })
  last_failed_login: Date;

  @Column({ default: 5 })
  level: number;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;

  @Column({ nullable: true, type: 'timestamp with time zone' })
  last_login: Date;
}