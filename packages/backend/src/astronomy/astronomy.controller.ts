import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AstronomyService } from './astronomy.service.js';
import { AstronomyQueryDto } from './dto/astronomy-query.dto.js';

@ApiTags('Astronomia')
@Controller('astronomy')
export class AstronomyController {
  constructor(private astronomy: AstronomyService) {}

  @Get()
  @ApiOperation({ summary: 'Obter dados astronômicos por coordenadas' })
  getAstronomy(@Query() query: AstronomyQueryDto) {
    return this.astronomy.getAstronomyByLocation(query.lat, query.lon);
  }
}
