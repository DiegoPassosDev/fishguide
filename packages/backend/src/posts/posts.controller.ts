import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { PostsService } from './posts.service.js';
import { CreatePostDto } from './dto/create-post.dto.js';
import { UpdatePostDto } from './dto/update-post.dto.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { ListPostsQueryDto } from './dto/list-posts-query.dto.js';

@ApiTags('Comunidade')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private posts: PostsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar publicação' })
  create(@Req() req: Request, @Body() dto: CreatePostDto) {
    const user = req.user as { id: string };
    return this.posts.create(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar publicações do feed' })
  findAll(@Req() req: Request, @Query() query: ListPostsQueryDto) {
    const user = req.user as { id: string };
    return this.posts.findAll(user.id, query);
  }

  @Get('topics')
  @ApiOperation({ summary: 'Listar tópicos com contagem de publicações' })
  findTopics() {
    return this.posts.findTopics();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhe da publicação' })
  findOne(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as { id: string };
    return this.posts.findOne(id, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir publicação própria' })
  remove(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as { id: string };
    return this.posts.remove(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Editar publicação própria (ou moderação)' })
  update(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() dto: UpdatePostDto,
  ) {
    const user = req.user as { id: string };
    return this.posts.update(id, user.id, dto);
  }

  @Post(':id/like')
  @ApiOperation({ summary: 'Curtir ou descurtir publicação' })
  toggleLike(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as { id: string };
    return this.posts.toggleLike(id, user.id);
  }

  @Post(':id/share')
  @ApiOperation({ summary: 'Compartilhar publicação' })
  share(@Param('id') id: string) {
    return this.posts.share(id);
  }

  @Post(':id/follow')
  @ApiOperation({ summary: 'Seguir ou deixar de seguir o autor' })
  toggleFollow(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as { id: string };
    return this.posts.toggleFollow(id, user.id);
  }

  @Get(':id/comments')
  @ApiOperation({ summary: 'Listar comentários da publicação' })
  listComments(@Param('id') id: string) {
    return this.posts.listComments(id);
  }

  @Post(':id/comments')
  @ApiOperation({ summary: 'Comentar na publicação' })
  addComment(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() dto: CreateCommentDto,
  ) {
    const user = req.user as { id: string };
    return this.posts.addComment(id, user.id, dto);
  }

  @Delete(':id/comments/:commentId')
  @ApiOperation({ summary: 'Excluir comentário próprio' })
  removeComment(
    @Param('id') id: string,
    @Param('commentId') commentId: string,
    @Req() req: Request,
  ) {
    const user = req.user as { id: string };
    return this.posts.removeComment(id, commentId, user.id);
  }
}
