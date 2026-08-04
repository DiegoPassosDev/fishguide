import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { FishingSpotsModule } from './fishing-spots/fishing-spots.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, FishingSpotsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
