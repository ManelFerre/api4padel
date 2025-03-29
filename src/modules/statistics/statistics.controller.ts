// src/modules/statistics/statistics.controller.ts
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { StatisticsService } from './statistics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';

@ApiTags('statistics')
@Controller('statistics')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('user/:userId')
  @ApiOperation({ summary: 'Obtener estadísticas de un usuario' })
  @ApiResponse({ status: 200, description: 'Estadísticas obtenidas correctamente' })
  async getUserStatistics(@Param('userId') userId: string) {
    return this.statisticsService.getUserStatistics(userId);
  }

  @Get('me')
  @ApiOperation({ summary: 'Obtener mis estadísticas' })
  @ApiResponse({ status: 200, description: 'Estadísticas obtenidas correctamente' })
  async getMyStatistics(@GetUser() user) {
    return this.statisticsService.getUserStatistics(user.id);
  }

  @Get('group/:groupId')
  @ApiOperation({ summary: 'Obtener estadísticas de un grupo' })
  @ApiResponse({ status: 200, description: 'Estadísticas obtenidas correctamente' })
  async getGroupStatistics(@Param('groupId') groupId: string) {
    return this.statisticsService.getGroupStatistics(groupId);
  }

  @Get('group/:groupId/pairs')
  @ApiOperation({ summary: 'Obtener estadísticas de parejas en un grupo' })
  @ApiResponse({ status: 200, description: 'Estadísticas obtenidas correctamente' })
  async getGroupPairStatistics(@Param('groupId') groupId: string) {
    return this.statisticsService.getGroupPairStatistics(groupId);
  }
}