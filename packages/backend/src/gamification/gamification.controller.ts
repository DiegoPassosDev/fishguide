import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { GamificationService } from './gamification.service.js';
import { ListRankingQueryDto } from './dto/list-ranking-query.dto.js';

@ApiTags('Gamificação')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('gamification')
export class GamificationController {
  constructor(private gamification: GamificationService) {}

  @Get('me')
  @ApiOperation({
    summary: 'Perfil de gamificação do usuário logado (XP, nível, conquistas)',
  })
  getMyProfile(@Req() req: Request) {
    const user = req.user as { id: string };
    return this.gamification.getProfile(user.id);
  }

  @Get('ranking')
  @ApiOperation({ summary: 'Ranking de pescadores por XP' })
  getRanking(@Req() req: Request, @Query() query: ListRankingQueryDto) {
    const user = req.user as { id: string };
    return this.gamification.getRanking(
      query.page ?? 1,
      query.limit ?? 20,
      user.id,
    );
  }
}
