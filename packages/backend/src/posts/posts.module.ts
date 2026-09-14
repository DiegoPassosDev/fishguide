import { Module } from '@nestjs/common';
import { PostsService } from './posts.service.js';
import { PostsController } from './posts.controller.js';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
