// src/modules/matches/matches.service.ts
import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from './entities/match.entity';
import { MatchRegistration } from './entities/match-registration.entity';
import { MatchPair } from './entities/match-pair.entity';
import { MatchResult } from './entities/match-result.entity';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { RegisterToMatchDto } from './dto/register-to-match.dto';
import { CreatePairsDto } from './dto/create-pairs.dto';
import { RecordResultDto } from './dto/record-result.dto';
import { UsersService } from '../users/users.service';
import { GroupsService } from '../groups/groups.service';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private matchesRepository: Repository<Match>,
    
    @InjectRepository(MatchRegistration)
    private registrationsRepository: Repository<MatchRegistration>,
    
    @InjectRepository(MatchPair)
    private pairsRepository: Repository<MatchPair>,
    
    @InjectRepository(MatchResult)
    private resultsRepository: Repository<MatchResult>,
    
    private usersService: UsersService,
    private groupsService: GroupsService,
  ) {}

  async findAll(groupId?: string, status?: string, userId?: string): Promise<Match[]> {
    const query = this.matchesRepository.createQueryBuilder('match');
    
    if (groupId) {
      query.andWhere('match.group_id = :groupId', { groupId });
    }
    
    if (status) {
      query.andWhere('match.status = :status', { status });
    }
    
    if (userId) {
      query.innerJoin('match_registrations', 'reg', 'reg.match_id = match.id')
        .andWhere('reg.user_id = :userId', { userId });
    }
    
    query.orderBy('match.date', 'DESC');
    
    return query.getMany();
  }

  async findById(id: string, userId?: string): Promise<Match> {
    const match = await this.matchesRepository.findOne({
      where: { id } as any,
      relations: ['registrations', 'pairs', 'results'],
    });
    
    if (!match) {
      throw new NotFoundException(`Partido con ID ${id} no encontrado`);
    }
    
    return match;
  }

  async create(userId: string, createMatchDto: CreateMatchDto): Promise<Match> {
    // Verificar que el usuario pertenece al grupo
    if (createMatchDto.group_id) {
      const isMember = await this.groupsService.isGroupMember(createMatchDto.group_id, userId);
      
      if (!isMember) {
        throw new ForbiddenException('No tienes permiso para crear partidos en este grupo');
      }
    }
    
    // Crear partido
    const match = this.matchesRepository.create({
      ...createMatchDto,
      created_by: userId,
    } as any);
    
    return await this.matchesRepository.save(match as any);
  }

  async update(id: string, userId: string, updateMatchDto: UpdateMatchDto): Promise<Match> {
    const match = await this.findById(id);
    
    // Verificar que el usuario es el creador del partido
    if (match.created_by !== userId) {
      throw new ForbiddenException('No tienes permiso para actualizar este partido');
    }
    
    // Verificar que el partido no ha comenzado
    if (match.status !== 'pending') {
      throw new BadRequestException('No se puede actualizar un partido que ya ha comenzado o finalizado');
    }
    
    // Actualizar partido
    Object.assign(match, updateMatchDto);
    
    return await this.matchesRepository.save(match);
  }

  async cancel(id: string, userId: string): Promise<Match> {
    const match = await this.findById(id);
    
    // Verificar que el usuario es el creador del partido
    if (match.created_by !== userId) {
      throw new ForbiddenException('No tienes permiso para cancelar este partido');
    }
    
    // Verificar que el partido no ha finalizado
    if (match.status === 'completed') {
      throw new BadRequestException('No se puede cancelar un partido que ya ha finalizado');
    }
    
    // Cancelar partido
    match.status = 'cancelled';
    
    return await this.matchesRepository.save(match);
  }

  async registerToMatch(userId: string, matchId: string, registerDto: RegisterToMatchDto): Promise<MatchRegistration> {
    const match = await this.findById(matchId);
    
    // Verificar que el partido no ha comenzado
    if (match.status !== 'pending') {
      throw new BadRequestException('No se puede registrar a un partido que ya ha comenzado o finalizado');
    }
    
    // Verificar que el usuario no está ya registrado
    const existingRegistration = await this.registrationsRepository.findOne({
      where: { match_id: matchId, user_id: userId } as any,
    });
    
    if (existingRegistration) {
      throw new BadRequestException('Ya estás registrado en este partido');
    }
    
    // Verificar que hay plazas disponibles
    const registrations = await this.registrationsRepository.find({
      where: { match_id: matchId } as any,
    });
    
    if (registrations.length >= match.max_players) {
      throw new BadRequestException('No hay plazas disponibles para este partido');
    }
    
    // Crear registro
    const registration = this.registrationsRepository.create({
      match_id: matchId,
      user_id: userId,
      level: registerDto.level || 5,
      availability: registerDto.availability,
      notes: registerDto.notes,
    } as any);
    
    return await this.registrationsRepository.save(registration as any);
  }

  async unregisterFromMatch(userId: string, matchId: string): Promise<void> {
    const match = await this.findById(matchId);
    
    // Verificar que el partido no ha comenzado
    if (match.status !== 'pending') {
      throw new BadRequestException('No se puede cancelar el registro de un partido que ya ha comenzado o finalizado');
    }
    
    // Verificar que el usuario está registrado
    const registration = await this.registrationsRepository.findOne({
      where: { match_id: matchId, user_id: userId } as any,
    });
    
    if (!registration) {
      throw new BadRequestException('No estás registrado en este partido');
    }
    
    // Eliminar registro
    await this.registrationsRepository.remove(registration);
  }

  async createPairs(id: string, userId: string, createPairsDto: CreatePairsDto): Promise<MatchPair[]> {
    const match = await this.findById(id);
    
    // Verificar que el usuario es el creador del partido
    if (match.created_by !== userId) {
      throw new ForbiddenException('No tienes permiso para crear parejas en este partido');
    }
    
    // Verificar que el partido no ha finalizado
    if (match.status === 'completed') {
      throw new BadRequestException('No se puede crear parejas para un partido que ya ha finalizado');
    }
    
    // Eliminar parejas existentes
    await this.pairsRepository.delete({ match_id: id } as any);
    
    // Crear nuevas parejas
    const pairsToCreate = createPairsDto.pairs.map(pair => {
      return {
        match_id: id,
        player1_id: pair.player1_id,
        player2_id: pair.player2_id,
        court_number: pair.court_number || 1,
      } as any;
    });
    
    // Actualizar estado del partido
    match.status = 'in_progress';
    await this.matchesRepository.save(match);
    
    const createdPairs = this.pairsRepository.create(pairsToCreate);
    return await this.pairsRepository.save(createdPairs);
  }

  async generatePairs(id: string, userId: string): Promise<MatchPair[]> {
    const match = await this.findById(id);
    
    // Verificar que el usuario es el creador del partido
    if (match.created_by !== userId) {
      throw new ForbiddenException('No tienes permiso para generar parejas en este partido');
    }
    
    // Verificar que el partido no ha finalizado
    if (match.status === 'completed') {
      throw new BadRequestException('No se puede generar parejas para un partido que ya ha finalizado');
    }
    
    // Obtener registros
    const registrations = await this.registrationsRepository.find({
      where: { match_id: id } as any,
    });
    
    if (registrations.length < 4) {
      throw new BadRequestException('Se necesitan al menos 4 jugadores para generar parejas');
    }
    
    // Algoritmo para generar parejas equilibradas
    // Ordenar jugadores por nivel (asumimos que tienen una propiedad level)
    registrations.sort((a: any, b: any) => (b.level || 5) - (a.level || 5));
    
    // Crear parejas equilibradas
    const pairsToCreate: any[] = [];
    const numPairs = Math.floor(registrations.length / 2);
    
    for (let i = 0; i < numPairs; i++) {
      const player1 = registrations[i];
      const player2 = registrations[registrations.length - 1 - i];
      
      pairsToCreate.push({
        match_id: id,
        player1_id: player1.user_id,
        player2_id: player2.user_id,
        court_number: i + 1,
      });
    }
    
    // Eliminar parejas existentes
    await this.pairsRepository.delete({ match_id: id } as any);
    
    // Actualizar estado del partido
    match.status = 'in_progress';
    await this.matchesRepository.save(match);
    
    const createdPairs = this.pairsRepository.create(pairsToCreate);
    return await this.pairsRepository.save(createdPairs);
  }

  async recordResult(id: string, userId: string, recordResultDto: RecordResultDto): Promise<MatchResult> {
    const match = await this.findById(id);
    
    // Verificar que el usuario es el creador del partido
    if (match.created_by !== userId) {
      throw new ForbiddenException('No tienes permiso para registrar resultados en este partido');
    }
    
    // Verificar que el partido está en progreso
    if (match.status !== 'in_progress') {
      throw new BadRequestException('No se puede registrar resultados para un partido que no está en progreso');
    }
    
    // Verificar que las parejas existen
    const pair1 = await this.pairsRepository.findOne({
      where: { id: recordResultDto.pair1_id } as any,
    });
    
    const pair2 = await this.pairsRepository.findOne({
      where: { id: recordResultDto.pair2_id } as any,
    });
    
    if (!pair1 || !pair2) {
      throw new BadRequestException('Una o ambas parejas no existen');
    }
    
    // Crear resultado
    const resultToCreate = {
      match_id: id,
      pair1_id: recordResultDto.pair1_id,
      pair2_id: recordResultDto.pair2_id,
      set1_pair1: recordResultDto.set1_pair1,
      set1_pair2: recordResultDto.set1_pair2,
      set2_pair1: recordResultDto.set2_pair1,
      set2_pair2: recordResultDto.set2_pair2,
      set3_pair1: recordResultDto.set3_pair1,
      set3_pair2: recordResultDto.set3_pair2,
      comments: recordResultDto.comments,
    } as any;
    
    // Actualizar estado del partido si es el último resultado
    const existingResults = await this.resultsRepository.find({
      where: { match_id: id } as any,
    });
    
    if (existingResults.length + 1 === match.courts) {
      match.status = 'completed';
      await this.matchesRepository.save(match);
    }
    
    const createdResult = this.resultsRepository.create(resultToCreate);
    return await this.resultsRepository.save(createdResult as any);
  }
}