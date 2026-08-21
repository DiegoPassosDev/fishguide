import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TidesController } from './tides.controller.js';
import { TidesService } from './tides.service.js';

@Module({
  imports: [HttpModule],
  controllers: [TidesController],
  providers: [TidesService],
  exports: [TidesService],
})
export class TidesModule {}
