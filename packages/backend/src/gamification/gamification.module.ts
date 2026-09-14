import { Module } from '@nestjs/common';
import { GamificationController } from './gamification.controller.js';
import { GamificationService } from './gamification.service.js';

@Module({
  controllers: [GamificationController],
  providers: [GamificationService],
})
export class GamificationModule {}
