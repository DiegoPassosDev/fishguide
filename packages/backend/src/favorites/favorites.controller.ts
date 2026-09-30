import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { FavoritesService } from './favorites.service.js';

@ApiTags('Favoritos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('favorites')
export class FavoritesController {
  constructor(private favorites: FavoritesService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar pesqueiros e espécies favoritos do usuário',
  })
  findAll(@Req() req: Request) {
    const user = req.user as { id: string; role: string };
    return this.favorites.findAll(user);
  }

  @Post('spots/:spotId')
  @ApiOperation({ summary: 'Favoritar ou desfavoritar um pesqueiro' })
  toggleSpot(@Param('spotId') spotId: string, @Req() req: Request) {
    const user = req.user as { id: string; role: string };
    return this.favorites.toggleSpot(user, spotId);
  }

  @Post('species/:speciesId')
  @ApiOperation({ summary: 'Favoritar ou desfavoritar uma espécie' })
  toggleSpecies(@Param('speciesId') speciesId: string, @Req() req: Request) {
    const user = req.user as { id: string; role: string };
    return this.favorites.toggleSpecies(user, speciesId);
  }
}
