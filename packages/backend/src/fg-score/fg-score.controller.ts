import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FgScoreService } from './fg-score.service.js';
import { FgScoreQueryDto } from './dto/fg-score-query.dto.js';

@ApiTags('FG Score')
@Controller('fg-score')
export class FgScoreController {
  constructor(private fgScore: FgScoreService) {}

  @Get()
  @ApiOperation({ summary: 'Calcular FG Score para uma localização' })
  getScore(@Query() query: FgScoreQueryDto) {
    return this.fgScore.getScore(query.lat, query.lon, query.state);
  }
}
