import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import { Match } from './entities/match.entity';
import { MatchRegistration } from './entities/match-registration.entity';
import { MatchPair } from './entities/match-pair.entity';
import { MatchResult } from './entities/match-result.entity';
import { GroupsModule } from '../groups/groups.module';
import { UsersModule } from '../users/users.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { StatisticsModule } from '../statistics/statistics.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Match, MatchRegistration, MatchPair, MatchResult]),
    GroupsModule,
    UsersModule,
    NotificationsModule,
    StatisticsModule,
  ],
  controllers: [MatchesController],
  providers: [MatchesService],
  exports: [MatchesService],
})
export class MatchesModule {}