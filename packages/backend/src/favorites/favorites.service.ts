import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

const FAVORITE_SPOT_SELECT = {
  id: true,
  name: true,
  description: true,
  latitude: true,
  longitude: true,
  spotType: true,
  accessType: true,
  structure: true,
  photos: true,
  privacy: true,
  rating: true,
  createdAt: true,
  user: { select: { id: true, name: true } },
} as const;

const FAVORITE_SPECIES_SELECT = {
  id: true,
  name: true,
  scientificName: true,
  photo: true,
  averageWeight: true,
  averageLength: true,
  habitat: true,
  bestSeason: true,
  bestTide: true,
  bestMoon: true,
  bestBait: true,
} as const;

interface RequestUser {
  id: string;
  role: string;
}

export interface FavoriteToggleResult {
  target: 'spot' | 'species';
  id: string;
  favorited: boolean;
  favoritesCount: number;
}

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async toggleSpot(
    user: RequestUser,
    spotId: string,
  ): Promise<FavoriteToggleResult> {
    const spot = await this.prisma.client.fishingSpot.findFirst({
      where: { id: spotId, deletedAt: null },
      select: { id: true },
    });
    if (!spot) throw new NotFoundException('Pesqueiro não encontrado');

    const existing = await this.prisma.client.favorite.findFirst({
      where: { userId: user.id, spotId },
      select: { id: true },
    });

    if (existing) {
      await this.prisma.client.favorite.delete({ where: { id: existing.id } });
    } else {
      await this.prisma.client.favorite.create({
        data: { userId: user.id, spotId },
      });
    }

    return {
      target: 'spot',
      id: spotId,
      favorited: !existing,
      favoritesCount: await this.prisma.client.favorite.count({
        where: { spotId },
      }),
    };
  }

  async toggleSpecies(
    user: RequestUser,
    speciesId: string,
  ): Promise<FavoriteToggleResult> {
    const species = await this.prisma.client.species.findUnique({
      where: { id: speciesId },
      select: { id: true },
    });
    if (!species) throw new NotFoundException('Espécie não encontrada');

    const existing = await this.prisma.client.favorite.findFirst({
      where: { userId: user.id, speciesId },
      select: { id: true },
    });

    if (existing) {
      await this.prisma.client.favorite.delete({ where: { id: existing.id } });
    } else {
      await this.prisma.client.favorite.create({
        data: { userId: user.id, speciesId },
      });
    }

    return {
      target: 'species',
      id: speciesId,
      favorited: !existing,
      favoritesCount: await this.prisma.client.favorite.count({
        where: { speciesId },
      }),
    };
  }

  async findAll(user: RequestUser) {
    const [spotFavorites, speciesFavorites] = await Promise.all([
      this.prisma.client.favorite.findMany({
        where: { userId: user.id, spotId: { not: null } },
        select: { spot: { select: FAVORITE_SPOT_SELECT } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.client.favorite.findMany({
        where: { userId: user.id, speciesId: { not: null } },
        select: { species: { select: FAVORITE_SPECIES_SELECT } },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      spots: spotFavorites.flatMap(({ spot }) => (spot ? [spot] : [])),
      species: speciesFavorites.flatMap(({ species }) =>
        species ? [species] : [],
      ),
    };
  }
}
