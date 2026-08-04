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
import { FishingSpotsService } from './fishing-spots.service.js';
import { CreateFishingSpotDto } from './dto/create-fishing-spot.dto.js';
import { UpdateFishingSpotDto } from './dto/update-fishing-spot.dto.js';
import { QueryFishingSpotsDto } from './dto/query-fishing-spots.dto.js';

@ApiTags('Pesqueiros')
@Controller('fishing-spots')
export class FishingSpotsController {
  constructor(private fishingSpots: FishingSpotsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar pesqueiros (público)' })
  findAll(@Query() query: QueryFishingSpotsDto) {
    return this.fishingSpots.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter detalhes de um pesqueiro (público)' })
  findOne(@Param('id') id: string) {
    return this.fishingSpots.findOne(id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Criar pesqueiro (autenticado)' })
  create(@Req() req: Request, @Body() dto: CreateFishingSpotDto) {
    const user = req.user as { id: string; role: string };
    return this.fishingSpots.create(user, dto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Atualizar pesqueiro (proprietário ou moderador)' })
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateFishingSpotDto,
  ) {
    const user = req.user as { id: string; role: string };
    return this.fishingSpots.update(user, id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Excluir pesqueiro (proprietário ou moderador)' })
  remove(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as { id: string; role: string };
    return this.fishingSpots.remove(user, id);
  }
}
