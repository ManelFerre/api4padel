// src/modules/groups/entities/group-member.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Group } from './group.entity';
import { User } from '../../users/entities/user.entity';

@Entity('group_members')
export class GroupMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  group_id: string;

  @Column()
  user_id: string;

  @Column({ default: 'player' })
  role: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  joined_at: Date;

  @Column({ default: 'active' })
  status: string;

  @ManyToOne(() => Group, group => group.members)
  @JoinColumn({ name: 'group_id' })
  group: Group;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}