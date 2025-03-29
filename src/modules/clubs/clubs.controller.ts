// src/modules/clubs/clubs.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ClubsService } from './clubs.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';

@ApiTags('clubs')
@Controller('clubs')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ClubsController {
  constructor(private readonly clubsService: ClubsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo club' })
  @ApiResponse({ status: 201, description: 'Club creado correctamente' })
  create(@GetUser() user, @Body() createClubDto: CreateClubDto) {
    return this.clubsService.create(createClubDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los clubes' })
  @ApiResponse({ status: 200, description: 'Lista de clubes obtenida correctamente' })
  findAll(@Query('country') country?: string, @Query('province') province?: string) {
    return this.clubsService.findAll(country, province);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un club por ID' })
  @ApiResponse({ status: 200, description: 'Club obtenido correctamente' })
  @ApiResponse({ status: 404, description: 'Club no encontrado' })
  findOne(@Param('id') id: string) {
    return this.clubsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un club' })
  @ApiResponse({ status: 200, description: 'Club actualizado correctamente' })
  update(@Param('id') id: string, @Body() updateClubDto: UpdateClubDto) {
    return this.clubsService.update(id, updateClubDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un club' })
  @ApiResponse({ status: 200, description: 'Club eliminado correctamente' })
  remove(@Param('id') id: string) {
    return this.clubsService.remove(id);
  }

  @Get(':id/groups')
  @ApiOperation({ summary: 'Obtener grupos de un club' })
  @ApiResponse({ status: 200, description: 'Grupos obtenidos correctamente' })
  findGroups(@Param('id') id: string) {
    return this.clubsService.findGroups(id);
  }
}