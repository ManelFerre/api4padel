// src/modules/users/users.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { VerificationToken } from './entities/verification-token.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateVerificationTokenDto } from './dto/create-verification-token.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    
    @InjectRepository(VerificationToken)
    private tokensRepository: Repository<VerificationToken>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      select: ['id', 'first_name', 'last_name', 'email', 'profile_picture', 'status', 'created_at'],
    });
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id } as any,
      select: ['id', 'first_name', 'last_name', 'email', 'profile_picture', 'phone', 'status', 'email_verified', 'created_at', 'last_login', 'login_attempts', 'last_failed_login', 'level'],
    });
    
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({
      where: { email } as any,
    });
  }
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Verificar si el email ya existe
    const existingUser = await this.findByEmail(createUserDto.email);
    
    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }
    
    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    // Crear usuario
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
      level: createUserDto.level || 5, // Valor predeterminado si no se proporciona
    });
    
    return await this.usersRepository.save(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    
    // Si se actualiza el email, verificar que no exista
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.findByEmail(updateUserDto.email);
      
      if (existingUser) {
        throw new ConflictException('El email ya está registrado');
      }
    }
    
    // Si se actualiza la contraseña, hashearla
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    
    // Actualizar usuario
    Object.assign(user, updateUserDto);
    
    return this.usersRepository.save(user);
  }

  async createVerificationToken(createTokenDto: CreateVerificationTokenDto): Promise<VerificationToken> {
    // Invalidar tokens anteriores del mismo tipo
    await this.tokensRepository
      .createQueryBuilder()
      .update(VerificationToken)
      .set({ status: 'expired' } as any)
      .where('user_id = :userId', { userId: createTokenDto.user_id })
      .andWhere('type = :type', { type: createTokenDto.type })
      .andWhere('status = :status', { status: 'pending' })
      .execute();
    
    // Crear nuevo token
    const token = this.tokensRepository.create(createTokenDto);
    
    return this.tokensRepository.save(token);
  }

  async findVerificationToken(token: string, type: string): Promise<VerificationToken> {
    return this.tokensRepository
      .createQueryBuilder('token')
      .where('token.token = :tokenValue', { tokenValue: token })
      .andWhere('token.type = :type', { type })
      .andWhere('token.status = :status', { status: 'pending' })
      .leftJoinAndSelect('token.user', 'user')
      .getOne();
  }

  async markTokenAsUsed(id: string): Promise<void> {
    await this.tokensRepository
      .createQueryBuilder()
      .update(VerificationToken)
      .set({ status: 'used' } as any)
      .where('id = :id', { id })
      .execute();
  }

  async markEmailAsVerified(userId: string): Promise<User> {
    const user = await this.findById(userId);
    
    user.email_verified = true;
    if (user.status === 'pending') {
      user.status = 'active';
    }
    
    return this.usersRepository.save(user);
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.usersRepository.update(userId, {
      last_login: new Date(),
    } as any);
  }

  async resetLoginAttempts(userId: string): Promise<void> {
    await this.usersRepository.update(userId, {
      login_attempts: 0,
      last_failed_login: null,
    } as any);
  }

  async incrementLoginAttempts(userId: string): Promise<void> {
    const user = await this.findById(userId);
    await this.usersRepository.update(userId, {
      login_attempts: (user.login_attempts || 0) + 1,
      last_failed_login: new Date(),
    } as any);
  }

  async updatePassword(userId: string, password: string): Promise<void> {
    await this.usersRepository.update(userId, {
      password: password,
    } as any);
  }

  async verifyEmail(userId: string): Promise<User> {
    return this.markEmailAsVerified(userId);
  }
}