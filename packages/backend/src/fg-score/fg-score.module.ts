import { Module } from '@nestjs/common';
import { FgScoreService } from './fg-score.service.js';
import { FgScoreController } from './fg-score.controller.js';
import { WeatherModule } from '../weather/weather.module.js';
import { TidesModule } from '../tides/tides.module.js';
import { AstronomyModule } from '../astronomy/astronomy.module.js';

@Module({
  imports: [WeatherModule, TidesModule, AstronomyModule],
  controllers: [FgScoreController],
  providers: [FgScoreService],
})
export class FgScoreModule {}
