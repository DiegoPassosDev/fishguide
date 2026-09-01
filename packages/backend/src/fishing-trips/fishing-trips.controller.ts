import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { FishingTripsService } from './fishing-trips.service.js';
import { CreateTripDto } from './dto/create-trip.dto.js';
import { UpdateTripDto } from './dto/update-trip.dto.js';
import { CreateCatchDto } from './dto/create-catch.dto.js';
import { UpdateCatchDto } from './dto/update-catch.dto.js';

@ApiTags('Pescarias')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('trips')
export class FishingTripsController {
  constructor(private trips: FishingTripsService) {}

  @Post()
  @ApiOperation({ summary: 'Iniciar nova pescaria' })
  create(@Req() req: Request, @Body() dto: CreateTripDto) {
    const user = req.user as { id: string };
    return this.trips.create(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar pescarias do usuário' })
  findAll(@Req() req: Request) {
    const user = req.user as { id: string };
    return this.trips.findAll(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhe da pescaria com capturas' })
  findOne(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as { id: string };
    return this.trips.findOne(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Editar pescaria' })
  update(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() dto: UpdateTripDto,
  ) {
    const user = req.user as { id: string };
    return this.trips.update(id, user.id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir pescaria' })
  remove(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as { id: string };
    return this.trips.remove(id, user.id);
  }

  @Post(':id/finish')
  @ApiOperation({ summary: 'Finalizar pescaria' })
  finish(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as { id: string };
    return this.trips.finish(id, user.id);
  }

  @Post(':id/catches')
  @ApiOperation({ summary: 'Adicionar captura à pescaria' })
  addCatch(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() dto: CreateCatchDto,
  ) {
    const user = req.user as { id: string };
    return this.trips.addCatch(id, user.id, dto);
  }

  @Patch('catches/:catchId')
  @ApiOperation({ summary: 'Editar captura' })
  updateCatch(
    @Param('catchId') catchId: string,
    @Req() req: Request,
    @Body() dto: UpdateCatchDto,
  ) {
    const user = req.user as { id: string };
    return this.trips.updateCatch(catchId, user.id, dto);
  }

  @Delete('catches/:catchId')
  @ApiOperation({ summary: 'Excluir captura' })
  removeCatch(@Param('catchId') catchId: string, @Req() req: Request) {
    const user = req.user as { id: string };
    return this.trips.removeCatch(catchId, user.id);
  }
}
