// src/modules/groups/entities/group.entity.ts (archivo completo)
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Match } from '../../matches/entities/match.entity';
import { Club } from '../../clubs/entities/club.entity';
import { GroupMember } from './group-member.entity';
import { GroupInvitation } from './group-invitation.entity';

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: 'OPEN' })
  status: string;

  @Column({ default: 'MIXED' })
  gender: string;

  @Column({ default: 'INTERMEDIATE' })
  level: string;

  @Column({ default: 20 })
  maxMembers: number;

  @Column({ default: true })
  isPublic: boolean;

  @Column({ default: false })
  requiresApproval: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, user => user.ownedGroups)
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Column()
  ownerId: string;

  @ManyToOne(() => Club, club => club.groups)
  @JoinColumn({ name: 'club_id' })
  club: Club;

  @Column()
  clubId: string;

  @OneToMany(() => Match, match => match.group)
  matches: Match[];

  // Añadir estas relaciones que faltan
  @OneToMany(() => GroupMember, member => member.group)
  members: GroupMember[];

  @OneToMany(() => GroupInvitation, invitation => invitation.group)
  invitations: GroupInvitation[];
}