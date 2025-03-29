// src/modules/statistics/statistics.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserStatistics } from './entities/user-statistics.entity';
import { PairStatistics } from './entities/pair-statistics.entity';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(UserStatistics)
    private userStatsRepository: Repository<UserStatistics>,
  ) {}

  async getUserStatistics(userId: string, groupId?: string): Promise<UserStatistics[]> {
    const query = this.userStatsRepository.createQueryBuilder('stats')
      .where('stats.user_id = :userId', { userId });
    
    if (groupId) {
      query.andWhere('stats.group_id = :groupId', { groupId });
    }
    
    return query.getMany();
  }

  async getGroupStatistics(groupId: string): Promise<UserStatistics[]> {
    return this.userStatsRepository.find({
      where: { group_id: groupId },
      order: { matches_won: 'DESC' },
    });
  }

  async getGroupPairStatistics(groupId: string): Promise<PairStatistics[]> {
    // Esta función se implementa en PairStatisticsService
    // Aquí solo se muestra como referencia
    return [];
  }

  async updateUserStatistics(
    userId: string,
    groupId: string,
    won: boolean,
    setsWon: number,
    setsLost: number,
  ): Promise<UserStatistics> {
    let stats = await this.userStatsRepository.findOne({
      where: {
        user_id: userId,
        group_id: groupId,
      },
    });
    
    if (!stats) {
      stats = this.userStatsRepository.create({
        user_id: userId,
        group_id: groupId,
        matches_played: 0,
        matches_won: 0,
        sets_won: 0,
        sets_lost: 0,
      });
    }
    
    // Actualizar estadísticas
    stats.matches_played += 1;
    if (won) {
      stats.matches_won += 1;
    }
    stats.sets_won += setsWon;
    stats.sets_lost += setsLost;
    
    return this.userStatsRepository.save(stats);
  }
}