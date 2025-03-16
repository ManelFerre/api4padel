// src/modules/matches/matches.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MatchesService } from './matches.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { RegisterToMatchDto } from './dto/register-to-match.dto';
import { CreatePairsDto } from './dto/create-pairs.dto';
import { RecordResultDto } from './dto/record-result.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';

@ApiTags('matches')
@Controller('matches')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener partidos' })
  @ApiResponse({ status: 200, description: 'Lista de partidos obtenida correctamente' })
  async findAll(
    @Query('groupId') groupId?: string,
    @Query('status') status?: string,
  ) {
    return this.matchesService.findAll(groupId, status);
  }

  @Get('my')
  @ApiOperation({ summary: 'Obtener mis partidos' })
  @ApiResponse({ status: 200, description: 'Lista de mis partidos obtenida correctamente' })
  async findMyMatches(@GetUser() user) {
    return this.matchesService.findAll(null, null, user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener partido por ID' })
  @ApiResponse({ status: 200, description: 'Partido obtenido correctamente' })
  @ApiResponse({ status: 404, description: 'Partido no encontrado' })
  async findOne(@Param('id') id: string) {
    return this.matchesService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo partido' })
  @ApiResponse({ status: 201, description: 'Partido creado correctamente' })
  async create(@GetUser() user, @Body() createMatchDto: CreateMatchDto) {
    return this.matchesService.create(user.id, createMatchDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un partido' })
  @ApiResponse({ status: 200, description: 'Partido actualizado correctamente' })
  @ApiResponse({ status: 404, description: 'Partido no encontrado' })
  async update(
    @Param('id') id: string,
    @GetUser() user,
    @Body() updateMatchDto: UpdateMatchDto,
  ) {
    return this.matchesService.update(id, user.id, updateMatchDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancelar un partido' })
  @ApiResponse({ status: 200, description: 'Partido cancelado correctamente' })
  @ApiResponse({ status: 404, description: 'Partido no encontrado' })
  async cancelMatch(@Param('id') id: string, @GetUser() user) {
    return this.matchesService.cancel(id, user.id);
  }

  @Post('register')
  @ApiOperation({ summary: 'Registrarse a un partido' })
  @ApiResponse({ status: 200, description: 'Registro completado correctamente' })
  @ApiResponse({ status: 404, description: 'Partido no encontrado' })
  async registerToMatch(@GetUser() user, @Body() registerDto: RegisterToMatchDto) {
    return this.matchesService.registerToMatch(user.id, registerDto.match_id, registerDto);
  }

  @Post('unregister')
  @ApiOperation({ summary: 'Cancelar registro a un partido' })
  @ApiResponse({ status: 200, description: 'Registro cancelado correctamente' })
  @ApiResponse({ status: 404, description: 'Partido no encontrado' })
  async unregisterFromMatch(@GetUser() user, @Body() body: { match_id: string }) {
    return this.matchesService.unregisterFromMatch(user.id, body.match_id);
  }

  @Post(':id/pairs')
  @ApiOperation({ summary: 'Crear parejas para un partido' })
  @ApiResponse({ status: 200, description: 'Parejas creadas correctamente' })
  @ApiResponse({ status: 404, description: 'Partido no encontrado' })
  async createPairs(
    @Param('id') id: string,
    @GetUser() user,
    @Body() createPairsDto: CreatePairsDto,
  ) {
    return this.matchesService.createPairs(id, user.id, createPairsDto);
  }

  @Post(':id/auto-pairs')
  @ApiOperation({ summary: 'Generar parejas automáticamente' })
  @ApiResponse({ status: 200, description: 'Parejas generadas correctamente' })
  @ApiResponse({ status: 404, description: 'Partido no encontrado' })
  async generatePairs(@Param('id') id: string, @GetUser() user) {
    return this.matchesService.generatePairs(id, user.id);
  }

  @Post(':id/results')
  @ApiOperation({ summary: 'Registrar resultado de un partido' })
  @ApiResponse({ status: 200, description: 'Resultado registrado correctamente' })
  @ApiResponse({ status: 404, description: 'Partido no encontrado' })
  async recordResult(
    @Param('id') id: string,
    @GetUser() user,
    @Body() recordResultDto: RecordResultDto,
  ) {
    return this.matchesService.recordResult(id, user.id, recordResultDto);
  }
}