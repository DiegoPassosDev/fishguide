import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Prisma } from '../../generated/prisma/client.js';
import { CreatePostDto } from './dto/create-post.dto.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { ListPostsQueryDto } from './dto/list-posts-query.dto.js';

const POST_SELECT = {
  id: true,
  content: true,
  topic: true,
  photo: true,
  catchInfo: true,
  likes: true,
  shares: true,
  createdAt: true,
  userId: true,
  user: {
    select: {
      id: true,
      name: true,
      avatar: true,
      verified: true,
    },
  },
  _count: {
    select: {
      comments: true,
    },
  },
} satisfies Prisma.PostSelect;

const COMMENT_SELECT = {
  id: true,
  content: true,
  createdAt: true,
  user: {
    select: {
      id: true,
      name: true,
      avatar: true,
    },
  },
} satisfies Prisma.CommentSelect;

type PostRow = {
  id: string;
  content: string;
  topic: string | null;
  photo: string | null;
  catchInfo: unknown;
  likes: number;
  shares: number;
  createdAt: Date;
  userId: string;
  user: { id: string; name: string; avatar: string | null; verified: boolean };
  _count: { comments: number };
};

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);

  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreatePostDto) {
    const post = (await this.prisma.client.post.create({
      data: {
        userId,
        content: dto.content,
        topic: dto.topic || null,
        photo: dto.photo || null,
        catchInfo: dto.catchInfo ? { ...dto.catchInfo } : undefined,
      },
      select: POST_SELECT,
    })) as PostRow;

    this.logger.log(`Post created: ${post.id} by user ${userId}`);
    return this.toResponse(post, false, false);
  }

  async findAll(userId: string, query: ListPostsQueryDto) {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 20, 50);

    const where = {
      deletedAt: null,
      user: { deletedAt: null },
      ...(query.topic ? { topic: query.topic } : {}),
    };

    const posts = (await this.prisma.client.post.findMany({
      where,
      select: POST_SELECT,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    })) as PostRow[];

    return this.attachFlags(posts, userId);
  }

  async findTopics() {
    const groups = await this.prisma.client.post.groupBy({
      by: ['topic'],
      where: { deletedAt: null, topic: { not: null } },
      _count: { topic: true },
      orderBy: { _count: { topic: 'desc' } },
    });

    return groups
      .map((group) => ({
        name: group.topic as string,
        count: group._count.topic,
      }))
      .sort(
        (a, b) =>
          this.topicPriority(a.name) - this.topicPriority(b.name) ||
          b.count - a.count,
      );
  }

  async findOne(postId: string, userId: string) {
    const post = await this.findPost(postId);

    const liked = await this.prisma.client.postLike.findUnique({
      where: { userId_postId: { userId, postId } },
      select: { userId: true },
    });
    const followed = await this.prisma.client.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: post.userId,
        },
      },
      select: { id: true },
    });

    return this.toResponse(post, Boolean(liked), Boolean(followed));
  }

  async remove(postId: string, userId: string) {
    const post = await this.findPost(postId);

    if (post.userId !== userId) {
      throw new ForbiddenException(
        'Você só pode excluir suas próprias publicações',
      );
    }

    await this.prisma.client.post.update({
      where: { id: postId },
      data: { deletedAt: new Date() },
    });

    return { message: 'Publicação excluída' };
  }

  async toggleLike(postId: string, userId: string) {
    await this.findPost(postId);

    const existing = await this.prisma.client.postLike.findUnique({
      where: { userId_postId: { userId, postId } },
    });

    if (existing) {
      await this.prisma.client.postLike.delete({
        where: { userId_postId: { userId, postId } },
      });
      await this.prisma.client.post.update({
        where: { id: postId },
        data: { likes: { decrement: 1 } },
      });
      return { liked: false, likes: await this.currentLikes(postId) };
    }

    await this.prisma.client.postLike.create({ data: { userId, postId } });
    await this.prisma.client.post.update({
      where: { id: postId },
      data: { likes: { increment: 1 } },
    });

    this.logger.log(`Post liked: ${postId} by user ${userId}`);
    return { liked: true, likes: await this.currentLikes(postId) };
  }

  async share(postId: string) {
    await this.findPost(postId);

    const updated = await this.prisma.client.post.update({
      where: { id: postId },
      data: { shares: { increment: 1 } },
      select: { shares: true },
    });

    return { shares: updated.shares };
  }

  async toggleFollow(postId: string, userId: string) {
    const post = await this.findPost(postId);
    const authorId = post.userId;

    if (authorId === userId) {
      throw new BadRequestException('Você não pode seguir a si mesmo');
    }

    const existing = await this.prisma.client.follow.findUnique({
      where: {
        followerId_followingId: { followerId: userId, followingId: authorId },
      },
    });

    if (existing) {
      await this.prisma.client.follow.delete({
        where: {
          followerId_followingId: { followerId: userId, followingId: authorId },
        },
      });
      return { followed: false, authorId };
    }

    await this.prisma.client.follow.create({
      data: { followerId: userId, followingId: authorId },
    });

    this.logger.log(`User ${userId} followed ${authorId}`);
    return { followed: true, authorId };
  }

  async addComment(postId: string, userId: string, dto: CreateCommentDto) {
    await this.findPost(postId);

    const comment = await this.prisma.client.comment.create({
      data: {
        postId,
        userId,
        content: dto.content,
      },
      select: COMMENT_SELECT,
    });

    return this.mapComment(comment);
  }

  async listComments(postId: string) {
    await this.findPost(postId);

    const comments = await this.prisma.client.comment.findMany({
      where: { postId },
      select: COMMENT_SELECT,
      orderBy: { createdAt: 'asc' },
    });

    return comments.map((c) => this.mapComment(c));
  }

  private mapComment(comment: {
    id: string;
    content: string;
    createdAt: Date;
    user: { id: string; name: string; avatar: string | null };
  }) {
    return {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      author: comment.user,
    };
  }

  async removeComment(postId: string, commentId: string, userId: string) {
    await this.findPost(postId);

    const comment = await this.prisma.client.comment.findUnique({
      where: { id: commentId },
      select: { userId: true },
    });

    if (!comment) {
      throw new NotFoundException('Comentário não encontrado');
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException(
        'Você só pode excluir seus próprios comentários',
      );
    }

    await this.prisma.client.comment.delete({ where: { id: commentId } });

    return { message: 'Comentário excluído' };
  }

  private async findPost(postId: string) {
    const post = await this.prisma.client.post.findFirst({
      where: { id: postId, deletedAt: null },
      select: POST_SELECT,
    });

    if (!post) {
      throw new NotFoundException('Publicação não encontrada');
    }

    return post as PostRow;
  }

  private async currentLikes(postId: string) {
    const post = await this.prisma.client.post.findUnique({
      where: { id: postId },
      select: { likes: true },
    });
    return post?.likes ?? 0;
  }

  private async attachFlags(posts: PostRow[], userId: string) {
    if (posts.length === 0) return [];

    const liked = await this.prisma.client.postLike.findMany({
      where: { userId, postId: { in: posts.map((p) => p.id) } },
      select: { postId: true },
    });
    const likedIds = new Set(liked.map((x) => x.postId));

    const authorIds = [...new Set(posts.map((p) => p.userId))];
    const followed = await this.prisma.client.follow.findMany({
      where: { followerId: userId, followingId: { in: authorIds } },
      select: { followingId: true },
    });
    const followedIds = new Set(followed.map((x) => x.followingId));

    return posts.map((post) =>
      this.toResponse(
        post,
        likedIds.has(post.id),
        followedIds.has(post.userId),
      ),
    );
  }

  private toResponse(post: PostRow, likedByMe: boolean, followedByMe: boolean) {
    return {
      id: post.id,
      content: post.content,
      topic: post.topic,
      photo: post.photo,
      catchInfo: post.catchInfo ?? null,
      likes: post.likes,
      shares: post.shares,
      likedByMe,
      followedByMe,
      commentsCount: post._count.comments,
      createdAt: post.createdAt,
      author: post.user,
    };
  }

  private topicPriority(topic: string) {
    const order = [
      'Robalo',
      'Corvina',
      'Tainha',
      'Dicas',
      'Equipamentos',
      'Eventos',
    ];
    const index = order.findIndex(
      (t) => t.toLowerCase() === topic.toLowerCase(),
    );
    return index === -1 ? order.length : index;
  }
}
