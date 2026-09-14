import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateReviewDto } from './dto/create-review.dto.js';
import { UpdateReviewDto } from './dto/update-review.dto.js';
import { ListReviewsQueryDto } from './dto/list-reviews-query.dto.js';

const REVIEW_SELECT = {
  id: true,
  rating: true,
  comment: true,
  createdAt: true,
  user: { select: { id: true, name: true, avatar: true, verified: true } },
} as const;

interface RequestUser {
  id: string;
  role: string;
}

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  private async ensureSpotExists(spotId: string) {
    const spot = await this.prisma.client.fishingSpot.findFirst({
      where: { id: spotId, deletedAt: null },
      select: { id: true },
    });
    if (!spot) throw new NotFoundException('Pesqueiro não encontrado');
  }

  private async recalculateRating(spotId: string) {
    const aggregation = await this.prisma.client.review.aggregate({
      where: { spotId },
      _avg: { rating: true },
    });

    await this.prisma.client.fishingSpot.update({
      where: { id: spotId },
      data: { rating: Math.round((aggregation._avg.rating ?? 0) * 10) / 10 },
    });
  }

  async create(user: RequestUser, spotId: string, dto: CreateReviewDto) {
    await this.ensureSpotExists(spotId);

    const existing = await this.prisma.client.review.findUnique({
      where: { userId_spotId: { userId: user.id, spotId } },
      select: { id: true },
    });

    const data = {
      rating: dto.rating,
      comment: dto.comment ?? null,
    };

    const review = existing
      ? await this.prisma.client.review.update({
          where: { id: existing.id },
          data,
          select: REVIEW_SELECT,
        })
      : await this.prisma.client.review.create({
          data: { ...data, userId: user.id, spotId },
          select: REVIEW_SELECT,
        });

    await this.recalculateRating(spotId);

    return { ...review, isMine: true };
  }

  async findAll(user: RequestUser, spotId: string, query: ListReviewsQueryDto) {
    await this.ensureSpotExists(spotId);

    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where = { spotId };

    const [items, total, average] = await Promise.all([
      this.prisma.client.review.findMany({
        where,
        select: REVIEW_SELECT,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.client.review.count({ where }),
      this.prisma.client.review.aggregate({
        where,
        _avg: { rating: true },
      }),
    ]);

    return {
      items: items.map((review) => ({
        ...review,
        isMine: review.user.id === user.id,
      })),
      total,
      page,
      limit,
      average: Math.round((average._avg.rating ?? 0) * 10) / 10,
    };
  }

  async update(
    user: RequestUser,
    spotId: string,
    reviewId: string,
    dto: UpdateReviewDto,
  ) {
    const review = await this.findReviewForUser(user, spotId, reviewId);

    const updated = await this.prisma.client.review.update({
      where: { id: review.id },
      data: {
        rating: dto.rating ?? review.rating,
        comment: dto.comment === undefined ? review.comment : dto.comment,
      },
      select: REVIEW_SELECT,
    });

    await this.recalculateRating(spotId);

    return { ...updated, isMine: true };
  }

  async remove(user: RequestUser, spotId: string, reviewId: string) {
    const review = await this.findReviewForUser(user, spotId, reviewId);

    await this.prisma.client.review.delete({ where: { id: review.id } });
    await this.recalculateRating(spotId);

    return { deleted: true };
  }

  private async findReviewForUser(
    user: RequestUser,
    spotId: string,
    reviewId: string,
  ) {
    const review = await this.prisma.client.review.findFirst({
      where: { id: reviewId, spotId },
      select: { id: true, userId: true, rating: true, comment: true },
    });

    if (!review) throw new NotFoundException('Avaliação não encontrada');
    if (
      review.userId !== user.id &&
      user.role !== 'ADMIN' &&
      user.role !== 'MODERATOR'
    ) {
      throw new ForbiddenException('Você não pode modificar esta avaliação');
    }

    return review;
  }
}
