// src/modules/groups/groups.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';

@ApiTags('groups')
@Controller('groups')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los grupos' })
  @ApiResponse({ status: 200, description: 'Lista de grupos obtenida correctamente' })
  async findAll(@GetUser() user) {
    return this.groupsService.findAll(user.id);
  }

  @Get('public')
  @ApiOperation({ summary: 'Obtener grupos públicos' })
  @ApiResponse({ status: 200, description: 'Lista de grupos públicos obtenida correctamente' })
  async findPublic() {
    return this.groupsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener grupo por ID' })
  @ApiResponse({ status: 200, description: 'Grupo obtenido correctamente' })
  @ApiResponse({ status: 404, description: 'Grupo no encontrado' })
  async findOne(@Param('id') id: string) {
    return this.groupsService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo grupo' })
  @ApiResponse({ status: 201, description: 'Grupo creado correctamente' })
  async create(@GetUser() user, @Body() createGroupDto: CreateGroupDto) {
    return this.groupsService.create(user.id, createGroupDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un grupo' })
  @ApiResponse({ status: 200, description: 'Grupo actualizado correctamente' })
  @ApiResponse({ status: 404, description: 'Grupo no encontrado' })
  async update(
    @Param('id') id: string,
    @GetUser() user,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    return this.groupsService.update(id, user.id, updateGroupDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un grupo' })
  @ApiResponse({ status: 200, description: 'Grupo eliminado correctamente' })
  @ApiResponse({ status: 404, description: 'Grupo no encontrado' })
  async remove(@Param('id') id: string, @GetUser() user) {
    return this.groupsService.delete(id, user.id);
  }

  @Post(':id/join')
  @ApiOperation({ summary: 'Unirse a un grupo' })
  @ApiResponse({ status: 200, description: 'Unido al grupo correctamente' })
  @ApiResponse({ status: 404, description: 'Grupo no encontrado' })
  async join(@Param('id') id: string, @GetUser() user) {
    return this.groupsService.joinGroup(id, user.id);
  }

  @Post(':id/invite')
  @ApiOperation({ summary: 'Invitar a un usuario a un grupo' })
  @ApiResponse({ status: 200, description: 'Invitación enviada correctamente' })
  @ApiResponse({ status: 404, description: 'Grupo no encontrado' })
  async invite(
    @Param('id') id: string,
    @GetUser() user,
    @Body() body: { email: string },
  ) {
    return this.groupsService.inviteToGroup(id, user.id, body.email);
  }

  @Get(':id/members')
  @ApiOperation({ summary: 'Obtener miembros de un grupo' })
  @ApiResponse({ status: 200, description: 'Lista de miembros obtenida correctamente' })
  @ApiResponse({ status: 404, description: 'Grupo no encontrado' })
  async getMembers(@Param('id') id: string) {
    return this.groupsService.getGroupMembers(id);
  }
}