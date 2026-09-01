import { Module } from '@nestjs/common';
import { FishingTripsService } from './fishing-trips.service.js';
import { FishingTripsController } from './fishing-trips.controller.js';
import { WeatherModule } from '../weather/weather.module.js';
import { TidesModule } from '../tides/tides.module.js';
import { AstronomyModule } from '../astronomy/astronomy.module.js';

@Module({
  imports: [WeatherModule, TidesModule, AstronomyModule],
  controllers: [FishingTripsController],
  providers: [FishingTripsService],
})
export class FishingTripsModule {}
