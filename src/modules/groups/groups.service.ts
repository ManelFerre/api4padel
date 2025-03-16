import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './entities/group.entity';
import { GroupMember } from './entities/group-member.entity';
import { GroupInvitation } from './entities/group-invitation.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private groupsRepository: Repository<Group>,
    
    @InjectRepository(GroupMember)
    private membersRepository: Repository<GroupMember>,
    
    @InjectRepository(GroupInvitation)
    private invitationsRepository: Repository<GroupInvitation>,
  ) {}

  async findAll(userId?: string): Promise<Group[]> {
    if (userId) {
      // Obtener grupos donde el usuario es miembro
      const query = this.groupsRepository.createQueryBuilder('group')
        .innerJoin('group_members', 'member', 'member.group_id = group.id')
        .where('member.user_id = :userId', { userId })
        .andWhere('group.status = :status', { status: 'active' });
      
      return query.getMany();
    } else {
      // Obtener todos los grupos públicos activos
      return this.groupsRepository.find({
        where: {
          is_public: true,
          status: 'active',
        },
      });
    }
  }

  async findById(id: string): Promise<Group> {
    const group = await this.groupsRepository.findOne({
      where: { id },
      relations: ['members', 'members.user'],
    });
    
    if (!group) {
      throw new NotFoundException(`Grupo con ID ${id} no encontrado`);
    }
    
    return group;
  }

  async create(userId: string, createGroupDto: CreateGroupDto): Promise<Group> {
    // Crear grupo
    const group = this.groupsRepository.create(createGroupDto);
    const savedGroup = await this.groupsRepository.save(group);
    
    // Agregar creador como administrador
    await this.membersRepository.save({
      group_id: savedGroup.id,
      user_id: userId,
      role: 'admin',
    });
    
    return savedGroup;
  }

  async update(id: string, userId: string, updateGroupDto: UpdateGroupDto): Promise<Group> {
    // Verificar que el grupo existe
    const group = await this.findById(id);
    
    // Verificar que el usuario es administrador
    const isAdmin = await this.isGroupAdmin(id, userId);
    
    if (!isAdmin) {
      throw new ForbiddenException('No tiene permisos para actualizar este grupo');
    }
    
    // Actualizar grupo
    Object.assign(group, updateGroupDto);
    
    return this.groupsRepository.save(group);
  }

  async delete(id: string, userId: string): Promise<void> {
    // Verificar que el grupo existe
    const group = await this.findById(id);
    
    // Verificar que el usuario es administrador
    const isAdmin = await this.isGroupAdmin(id, userId);
    
    if (!isAdmin) {
      throw new ForbiddenException('No tiene permisos para eliminar este grupo');
    }
    
    // Marcar como archivado en lugar de eliminar
    group.status = 'archived';
    await this.groupsRepository.save(group);
  }

  async isGroupMember(groupId: string, userId: string): Promise<boolean> {
    const member = await this.membersRepository.findOne({
      where: {
        group_id: groupId,
        user_id: userId,
        status: 'active',
      },
    });
    
    return !!member;
  }

  async isGroupAdmin(groupId: string, userId: string): Promise<boolean> {
    const member = await this.membersRepository.findOne({
      where: {
        group_id: groupId,
        user_id: userId,
        role: 'admin',
        status: 'active',
      },
    });
    
    return !!member;
  }

  async joinGroup(groupId: string, userId: string): Promise<GroupMember> {
    // Verificar que el grupo existe
    const group = await this.findById(groupId);
    
    // Verificar que el grupo es público
    if (!group.is_public) {
      throw new ForbiddenException('No se puede unir a un grupo privado sin invitación');
    }
    
    // Verificar que el usuario no es ya miembro
    const isMember = await this.isGroupMember(groupId, userId);
    
    if (isMember) {
      throw new ConflictException('Ya es miembro de este grupo');
    }
    
    // Crear membresía
    const member = this.membersRepository.create({
      group_id: groupId,
      user_id: userId,
      role: 'player',
    });
    
    return this.membersRepository.save(member);
  }

  async inviteToGroup(groupId: string, inviterId: string, email: string): Promise<GroupInvitation> {
    // Verificar que el grupo existe
    const group = await this.findById(groupId);
    
    // Verificar que el invitador es miembro
    const isMember = await this.isGroupMember(groupId, inviterId);
    
    if (!isMember) {
      throw new ForbiddenException('No es miembro de este grupo');
    }
    
    // Verificar si ya existe una invitación pendiente
    const existingInvitation = await this.invitationsRepository.findOne({
      where: {
        group_id: groupId,
        email,
        status: 'pending',
      },
    });
    
    if (existingInvitation) {
      throw new ConflictException('Ya existe una invitación pendiente para este email');
    }
    
    // Crear invitación
    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Expira en 7 días
    
    const invitation = this.invitationsRepository.create({
      group_id: groupId,
      email,
      invited_by: inviterId,
      token,
      expires_at: expiresAt,
    });
    
    return this.invitationsRepository.save(invitation);
  }

  async getGroupMembers(groupId: string): Promise<GroupMember[]> {
    return this.membersRepository.find({
      where: {
        group_id: groupId,
        status: 'active',
      },
      relations: ['user'],
    });
  }
}