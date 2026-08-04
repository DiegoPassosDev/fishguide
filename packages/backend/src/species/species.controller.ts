import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { SpeciesService } from './species.service.js';
import { CreateSpeciesDto } from './dto/create-species.dto.js';
import { UpdateSpeciesDto } from './dto/update-species.dto.js';
import { QuerySpeciesDto } from './dto/query-species.dto.js';

@ApiTags('Espécies')
@Controller('species')
export class SpeciesController {
  constructor(private species: SpeciesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar espécies (público)' })
  findAll(@Query() query: QuerySpeciesDto) {
    return this.species.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter detalhes de uma espécie (público)' })
  findOne(@Param('id') id: string) {
    return this.species.findOne(id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Criar espécie (admin ou especialista)' })
  create(@Req() req: Request, @Body() dto: CreateSpeciesDto) {
    const user = req.user as { id: string; role: string };
    return this.species.create(user, dto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Atualizar espécie (admin ou especialista)' })
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateSpeciesDto,
  ) {
    const user = req.user as { id: string; role: string };
    return this.species.update(user, id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Excluir espécie (admin ou especialista)' })
  remove(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as { id: string; role: string };
    return this.species.remove(user, id);
  }
}
