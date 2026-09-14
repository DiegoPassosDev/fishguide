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
import { ReviewsService } from './reviews.service.js';
import { CreateReviewDto } from './dto/create-review.dto.js';
import { UpdateReviewDto } from './dto/update-review.dto.js';
import { ListReviewsQueryDto } from './dto/list-reviews-query.dto.js';

@ApiTags('Avaliações')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('fishing-spots/:spotId/reviews')
export class ReviewsController {
  constructor(private reviews: ReviewsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar ou atualizar a própria avaliação' })
  create(
    @Param('spotId') spotId: string,
    @Req() req: Request,
    @Body() dto: CreateReviewDto,
  ) {
    const user = req.user as { id: string; role: string };
    return this.reviews.create(user, spotId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar avaliações do pesqueiro' })
  findAll(
    @Param('spotId') spotId: string,
    @Req() req: Request,
    @Query() query: ListReviewsQueryDto,
  ) {
    const user = req.user as { id: string; role: string };
    return this.reviews.findAll(user, spotId, query);
  }

  @Patch(':reviewId')
  @ApiOperation({ summary: 'Editar avaliação própria' })
  update(
    @Param('spotId') spotId: string,
    @Param('reviewId') reviewId: string,
    @Req() req: Request,
    @Body() dto: UpdateReviewDto,
  ) {
    const user = req.user as { id: string; role: string };
    return this.reviews.update(user, spotId, reviewId, dto);
  }

  @Delete(':reviewId')
  @ApiOperation({ summary: 'Excluir avaliação própria' })
  remove(
    @Param('spotId') spotId: string,
    @Param('reviewId') reviewId: string,
    @Req() req: Request,
  ) {
    const user = req.user as { id: string; role: string };
    return this.reviews.remove(user, spotId, reviewId);
  }
}
