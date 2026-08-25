import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { FishingSpotsModule } from './fishing-spots/fishing-spots.module.js';
import { SpeciesModule } from './species/species.module.js';
import { WeatherModule } from './weather/weather.module.js';
import { TidesModule } from './tides/tides.module.js';
import { AstronomyModule } from './astronomy/astronomy.module.js';
import { FgScoreModule } from './fg-score/fg-score.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule,
    PrismaModule,
    AuthModule,
    UsersModule,
    FishingSpotsModule,
    SpeciesModule,
    WeatherModule,
    TidesModule,
    AstronomyModule,
    FgScoreModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
