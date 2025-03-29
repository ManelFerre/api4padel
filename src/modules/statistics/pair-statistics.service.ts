import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PairStatistics } from './entities/pair-statistics.entity';

@Injectable()
export class PairStatisticsService {
  constructor(
    @InjectRepository(PairStatistics)
    private pairStatisticsRepository: Repository<PairStatistics>,
  ) {}

  async getPairStatistics(groupId: string): Promise<PairStatistics[]> {
    return this.pairStatisticsRepository.find({
      where: { group_id: groupId },
    });
  }

  async updatePairStatistics(
    player1Id: string,
    player2Id: string,
    groupId: string,
    won: boolean,
  ): Promise<PairStatistics> {
    // Ordenar IDs para garantizar consistencia
    const [p1, p2] = [player1Id, player2Id].sort();
    
    // Buscar estadísticas existentes
    let pairStats = await this.pairStatisticsRepository.findOne({
      where: {
        player1_id: p1,
        player2_id: p2,
        group_id: groupId,
      },
    });
    
    if (!pairStats) {
      // Crear nuevas estadísticas si no existen
      pairStats = this.pairStatisticsRepository.create({
        player1_id: p1,
        player2_id: p2,
        group_id: groupId,
        matches_played: 0,
        matches_won: 0,
      });
    }
    
    // Actualizar estadísticas
    pairStats.matches_played += 1;
    if (won) {
      pairStats.matches_won += 1;
    }
    pairStats.last_played = new Date();
    
    return this.pairStatisticsRepository.save(pairStats);
  }
}