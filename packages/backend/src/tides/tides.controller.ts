import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TidesService } from './tides.service.js';
import { TidesQueryDto } from './dto/tides-query.dto.js';

@ApiTags('Marés')
@Controller('tides')
export class TidesController {
  constructor(private tides: TidesService) {}

  @Get()
  @ApiOperation({ summary: 'Obter maré atual por coordenadas' })
  getTides(@Query() query: TidesQueryDto) {
    return this.tides.getTidesByLocation(query.lat, query.lon, query.state);
  }
}
