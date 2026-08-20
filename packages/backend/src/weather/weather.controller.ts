import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WeatherService } from './weather.service.js';
import { WeatherQueryDto } from './dto/weather-query.dto.js';

@ApiTags('Clima')
@Controller('weather')
export class WeatherController {
  constructor(private weather: WeatherService) {}

  @Get()
  @ApiOperation({ summary: 'Obter clima atual por coordenadas' })
  getCurrentWeather(@Query() query: WeatherQueryDto) {
    return this.weather.getCurrentWeather(query.lat, query.lon);
  }
}
