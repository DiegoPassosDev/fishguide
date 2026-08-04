import { Module } from '@nestjs/common';
import { FishingSpotsController } from './fishing-spots.controller.js';
import { FishingSpotsService } from './fishing-spots.service.js';

@Module({
  controllers: [FishingSpotsController],
  providers: [FishingSpotsService],
  exports: [FishingSpotsService],
})
export class FishingSpotsModule {}
