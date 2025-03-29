// src/modules/clubs/clubs.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Club } from './entities/club.entity';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';

@Injectable()
export class ClubsService {
  constructor(
    @InjectRepository(Club)
    private clubsRepository: Repository<Club>,
  ) {}

  async create(createClubDto: CreateClubDto): Promise<Club> {
    const club = this.clubsRepository.create(createClubDto);
    return this.clubsRepository.save(club);
  }

  async findAll(country?: string, province?: string): Promise<Club[]> {
    const queryBuilder = this.clubsRepository.createQueryBuilder('club');
    
    if (country) {
      queryBuilder.andWhere('club.country = :country', { country });
    }
    
    if (province) {
      queryBuilder.andWhere('club.province = :province', { province });
    }
    
    return queryBuilder.getMany();
  }

  async findOne(id: string): Promise<Club> {
    const club = await this.clubsRepository.findOne({ where: { id } as any });
    if (!club) {
      throw new NotFoundException(`Club con ID ${id} no encontrado`);
    }
    return club;
  }

  async update(id: string, updateClubDto: UpdateClubDto): Promise<Club> {
    const club = await this.findOne(id);
    this.clubsRepository.merge(club, updateClubDto);
    return this.clubsRepository.save(club);
  }

  async remove(id: string): Promise<void> {
    const club = await this.findOne(id);
    await this.clubsRepository.remove(club);
  }

  async findGroups(id: string) {
    const club = await this.clubsRepository.findOne({
      where: { id } as any,
      relations: ['groups'],
    });
    
    if (!club) {
      throw new NotFoundException(`Club con ID ${id} no encontrado`);
    }
    
    return club.groups;
  }
}