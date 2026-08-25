import { Module } from '@nestjs/common';
import { AstronomyService } from './astronomy.service.js';
import { AstronomyController } from './astronomy.controller.js';

@Module({
  controllers: [AstronomyController],
  providers: [AstronomyService],
  exports: [AstronomyService],
})
export class AstronomyModule {}
