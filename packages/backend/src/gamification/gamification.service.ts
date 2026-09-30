import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  ACHIEVEMENTS,
  getLevel,
  XP_RULES,
  type AchievementDefinition,
} from './gamification.config.js';

interface UserStats {
  posts: number;
  likesReceived: number;
  commentsReceived: number;
  followers: number;
  following: number;
  trips: number;
  catches: number;
  species: number;
  reviews: number;
  spots: number;
  favorites: number;
  distinctSpots: number;
  biggestCatchKg: number | null;
}

export interface XpBreakdown {
  posts: number;
  likesReceived: number;
  commentsReceived: number;
  followers: number;
  trips: number;
  catches: number;
  reviews: number;
  spots: number;
  favorites: number;
}

export interface AchievementResult {
  id: string;
  name: string;
  description: string;
  emoji: string;
  current: number;
  target: number;
  unlocked: boolean;
  progress: number;
}

export interface GamificationUserProfile {
  userId: string;
  name: string;
  avatar: string | null;
  verified: boolean;
  xp: number;
  xpBreakdown: XpBreakdown;
  level: ReturnType<typeof getLevel>;
  achievements: AchievementResult[];
  stats: UserStats;
}

export interface RankingItem {
  position: number;
  userId: string;
  name: string;
  avatar: string | null;
  verified: boolean;
  city: string | null;
  xp: number;
  levelNumber: number;
  levelName: string;
  unlockedCount: number;
}

type StatsMap = Map<string, UserStats>;

@Injectable()
export class GamificationService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string): Promise<GamificationUserProfile> {
    const user = await this.prisma.client.user.findFirst({
      where: { id: userId, deletedAt: null },
      select: {
        id: true,
        name: true,
        avatar: true,
        verified: true,
      },
    });
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const stats = (await this.loadStats([userId])).get(userId);
    if (!stats) {
      throw new Error('Usuário não encontrado');
    }

    return this.buildProfile(user, stats);
  }

  async getRanking(
    page = 1,
    limit = 20,
    viewerId?: string,
  ): Promise<{
    items: RankingItem[];
    total: number;
    page: number;
    limit: number;
    myPosition: number | null;
  }> {
    const users = await this.prisma.client.user.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        name: true,
        avatar: true,
        verified: true,
        city: true,
      },
      orderBy: { name: 'asc' },
    });

    if (users.length === 0) {
      return { items: [], total: 0, page, limit, myPosition: null };
    }

    const statsMap = await this.loadStats(users.map((user) => user.id));

    const ranked = users
      .map((user) => {
        const stats = statsMap.get(user.id) ?? this.emptyStats();
        const xp = this.computeXp(stats);
        const achievements = this.buildAchievements(stats, getLevel(xp).number);
        return {
          userId: user.id,
          xp,
          unlockedCount: achievements.filter(
            (achievement) => achievement.unlocked,
          ).length,
        };
      })
      .sort((a, b) => {
        if (b.xp !== a.xp) return b.xp - a.xp;
        return a.userId.localeCompare(b.userId, 'pt-BR');
      });

    const total = ranked.length;
    const start = (page - 1) * limit;
    const slice = ranked.slice(start, start + limit);
    const userById = new Map(users.map((user) => [user.id, user]));

    const items: RankingItem[] = slice.map((entry) => {
      const user = userById.get(entry.userId);
      const level = getLevel(entry.xp);
      return {
        position: ranked.indexOf(entry) + 1,
        userId: entry.userId,
        name: user?.name ?? 'Pescador',
        avatar: user?.avatar ?? null,
        verified: user?.verified ?? false,
        city: user?.city ?? null,
        xp: entry.xp,
        levelNumber: level.number,
        levelName: level.name,
        unlockedCount: entry.unlockedCount,
      };
    });

    const myPosition = viewerId
      ? ranked.findIndex((entry) => entry.userId === viewerId)
      : -1;

    return {
      items,
      total,
      page,
      limit,
      myPosition: myPosition >= 0 ? myPosition + 1 : null,
    };
  }

  private async loadStats(userIds: string[]): Promise<StatsMap> {
    const map = new Map<string, UserStats>();
    for (const userId of userIds) {
      map.set(userId, this.emptyStats());
    }
    if (userIds.length === 0) return map;

    const whereUser = { userId: { in: userIds } };

    const [
      posts,
      comments,
      followers,
      following,
      trips,
      catches,
      reviews,
      spots,
      favorites,
    ] = await Promise.all([
      this.prisma.client.post.groupBy({
        by: ['userId'],
        where: { ...whereUser, deletedAt: null },
        _count: { userId: true },
        _sum: { likes: true },
      }),
      this.prisma.client.comment.findMany({
        where: { post: { deletedAt: null } },
        select: { post: { select: { userId: true } } },
      }),
      this.prisma.client.follow.groupBy({
        by: ['followingId'],
        where: { followingId: { in: userIds } },
        _count: true,
      }),
      this.prisma.client.follow.groupBy({
        by: ['followerId'],
        where: { followerId: { in: userIds } },
        _count: true,
      }),
      this.prisma.client.fishingTrip.findMany({
        where: {
          userId: { in: userIds },
          status: 'finished',
          deletedAt: null,
        },
        select: { userId: true, spotId: true },
      }),
      this.prisma.client.catch.findMany({
        where: { trip: { deletedAt: null } },
        select: {
          speciesId: true,
          weight: true,
          trip: { select: { userId: true } },
        },
      }),
      this.prisma.client.review.groupBy({
        by: ['userId'],
        where: whereUser,
        _count: true,
      }),
      this.prisma.client.fishingSpot.groupBy({
        by: ['userId'],
        where: { ...whereUser, deletedAt: null },
        _count: true,
      }),
      this.prisma.client.favorite.groupBy({
        by: ['userId'],
        where: whereUser,
        _count: true,
      }),
    ]);

    for (const row of posts) {
      const stats = map.get(row.userId);
      if (!stats) continue;
      stats.posts += row._count.userId;
      stats.likesReceived += row._sum.likes ?? 0;
    }

    for (const row of comments) {
      const stats = map.get(row.post.userId);
      if (!stats) continue;
      stats.commentsReceived += 1;
    }

    for (const row of followers) {
      const stats = map.get(row.followingId);
      if (!stats) continue;
      stats.followers += row._count;
    }

    for (const row of following) {
      const stats = map.get(row.followerId);
      if (!stats) continue;
      stats.following += row._count;
    }

    const distinctSpotsByUser = new Map<string, Set<string>>();
    for (const row of trips) {
      const stats = map.get(row.userId);
      if (!stats) continue;
      stats.trips += 1;
      if (row.spotId) {
        let set = distinctSpotsByUser.get(row.userId);
        if (!set) {
          set = new Set();
          distinctSpotsByUser.set(row.userId, set);
        }
        set.add(row.spotId);
      }
    }
    for (const [userId, set] of distinctSpotsByUser) {
      const stats = map.get(userId);
      if (stats) stats.distinctSpots = set.size;
    }

    const speciesByUser = new Map<string, Set<string>>();
    const catchesByUser = new Map<string, number>();
    const biggestByUser = new Map<string, number>();
    for (const row of catches) {
      const userId = row.trip.userId;
      if (!map.has(userId)) continue;
      catchesByUser.set(userId, (catchesByUser.get(userId) ?? 0) + 1);
      let set = speciesByUser.get(userId);
      if (!set) {
        set = new Set();
        speciesByUser.set(userId, set);
      }
      set.add(row.speciesId);
      if (row.weight !== null) {
        const current = biggestByUser.get(userId) ?? 0;
        if (row.weight > current) biggestByUser.set(userId, row.weight);
      }
    }
    for (const [userId, count] of catchesByUser) {
      const stats = map.get(userId);
      if (stats) stats.catches += count;
    }
    for (const [userId, set] of speciesByUser) {
      const stats = map.get(userId);
      if (stats) stats.species += set.size;
    }
    for (const [userId, weight] of biggestByUser) {
      const stats = map.get(userId);
      if (stats) stats.biggestCatchKg = weight;
    }

    for (const row of reviews) {
      const stats = map.get(row.userId);
      if (!stats) continue;
      stats.reviews += row._count;
    }

    for (const row of spots) {
      const stats = map.get(row.userId);
      if (!stats) continue;
      stats.spots += row._count;
    }

    for (const row of favorites) {
      const stats = map.get(row.userId);
      if (!stats) continue;
      stats.favorites += row._count;
    }

    return map;
  }

  private emptyStats(): UserStats {
    return {
      posts: 0,
      likesReceived: 0,
      commentsReceived: 0,
      followers: 0,
      following: 0,
      trips: 0,
      catches: 0,
      species: 0,
      reviews: 0,
      spots: 0,
      favorites: 0,
      distinctSpots: 0,
      biggestCatchKg: null,
    };
  }

  private computeXp(stats: UserStats): number {
    return (
      stats.posts * XP_RULES.postCreated +
      stats.likesReceived * XP_RULES.likeReceived +
      stats.commentsReceived * XP_RULES.commentReceived +
      stats.followers * XP_RULES.follower +
      stats.trips * XP_RULES.tripFinished +
      stats.catches * XP_RULES.catch +
      stats.reviews * XP_RULES.reviewGiven +
      stats.spots * XP_RULES.spotCreated +
      stats.favorites * XP_RULES.favoriteGiven
    );
  }

  private buildXpBreakdown(stats: UserStats): XpBreakdown {
    return {
      posts: stats.posts * XP_RULES.postCreated,
      likesReceived: stats.likesReceived * XP_RULES.likeReceived,
      commentsReceived: stats.commentsReceived * XP_RULES.commentReceived,
      followers: stats.followers * XP_RULES.follower,
      trips: stats.trips * XP_RULES.tripFinished,
      catches: stats.catches * XP_RULES.catch,
      reviews: stats.reviews * XP_RULES.reviewGiven,
      spots: stats.spots * XP_RULES.spotCreated,
      favorites: stats.favorites * XP_RULES.favoriteGiven,
    };
  }

  private buildAchievements(
    stats: UserStats,
    levelNumber: number,
  ): AchievementResult[] {
    const currentByCriterion = (achievement: AchievementDefinition): number => {
      switch (achievement.id) {
        case 'first-catch':
        case 'prolific':
          return stats.catches;
        case 'collector':
          return stats.species;
        case 'first-post':
        case 'voice':
          return achievement.id === 'first-post'
            ? stats.posts
            : stats.likesReceived;
        case 'commenter':
          return stats.commentsReceived;
        case 'networker':
          return stats.followers;
        case 'explorer':
          return stats.distinctSpots;
        case 'weekend-warrior':
          return stats.trips;
        case 'critic':
          return stats.reviews;
        case 'cartographer':
          return stats.spots;
        case 'legend':
          return levelNumber;
        default:
          return 0;
      }
    };

    return ACHIEVEMENTS.map((achievement) => {
      const current = currentByCriterion(achievement);
      return {
        id: achievement.id,
        name: achievement.name,
        description: achievement.description,
        emoji: achievement.emoji,
        current,
        target: achievement.target,
        unlocked: current >= achievement.target,
        progress: Math.min(1, current / achievement.target),
      };
    });
  }

  private buildProfile(
    user: {
      id: string;
      name: string;
      avatar: string | null;
      verified: boolean;
    },
    stats: UserStats,
  ): GamificationUserProfile {
    const xp = this.computeXp(stats);
    const level = getLevel(xp);
    return {
      userId: user.id,
      name: user.name,
      avatar: user.avatar,
      verified: user.verified,
      xp,
      xpBreakdown: this.buildXpBreakdown(stats),
      level,
      achievements: this.buildAchievements(stats, level.number),
      stats,
    };
  }
}
