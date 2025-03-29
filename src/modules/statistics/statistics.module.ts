import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { UserStatistics } from './entities/user-statistics.entity';
import { PairStatistics } from './entities/pair-statistics.entity';
import { PairStatisticsService } from './pair-statistics.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserStatistics, PairStatistics]),
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService, PairStatisticsService],
  exports: [StatisticsService, PairStatisticsService],
})
export class StatisticsModule {}