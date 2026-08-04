import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  CreateFishingSpotDto,
  SpotVisibility,
} from './dto/create-fishing-spot.dto.js';
import { UpdateFishingSpotDto } from './dto/update-fishing-spot.dto.js';
import { QueryFishingSpotsDto } from './dto/query-fishing-spots.dto.js';

const SPOT_SELECT = {
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
  updatedAt: true,
} as const;

interface RequestUser {
  id: string;
  role: string;
}

@Injectable()
export class FishingSpotsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryFishingSpotsDto) {
    const {
      search,
      spotType,
      latitude,
      longitude,
      radiusKm,
      limit = 50,
      offset = 0,
    } = query;

    const where: Record<string, unknown> = {
      deletedAt: null,
      privacy: { not: SpotVisibility.PRIVATE },
    };

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    if (spotType) {
      where.spotType = spotType;
    }

    let items = await this.prisma.client.fishingSpot.findMany({
      where,
      select: { ...SPOT_SELECT, user: { select: { id: true, name: true } } },
      orderBy: { name: 'asc' },
      take: limit,
      skip: offset,
    });

    if (latitude != null && longitude != null && radiusKm != null) {
      items = items.filter((spot) => {
        const distance = this.haversineKm(
          latitude,
          longitude,
          spot.latitude,
          spot.longitude,
        );
        return distance <= radiusKm;
      });
    }

    const [total] = await Promise.all([
      this.prisma.client.fishingSpot.count({ where }),
    ]);

    return {
      items,
      total,
      limit,
      offset,
    };
  }

  async findOne(id: string) {
    const spot = await this.prisma.client.fishingSpot.findFirst({
      where: { id, deletedAt: null },
      select: {
        ...SPOT_SELECT,
        user: { select: { id: true, name: true } },
        species: {
          select: {
            species: {
              select: {
                id: true,
                name: true,
                scientificName: true,
                photo: true,
                averageWeight: true,
                averageLength: true,
                bestBait: true,
              },
            },
          },
        },
        reviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            user: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!spot) throw new NotFoundException('Pesqueiro não encontrado');

    return {
      ...spot,
      species: spot.species.map(({ species }) => species),
    };
  }

  async create(user: RequestUser, dto: CreateFishingSpotDto) {
    return this.prisma.client.fishingSpot.create({
      data: {
        name: dto.name,
        latitude: dto.latitude,
        longitude: dto.longitude,
        description: dto.description,
        spotType: dto.spotType,
        accessType: dto.accessType,
        structure: dto.structure,
        photos: dto.photos ?? [],
        privacy: dto.privacy ?? SpotVisibility.PUBLIC,
        userId: user.id,
      },
      select: SPOT_SELECT,
    });
  }

  async update(user: RequestUser, id: string, dto: UpdateFishingSpotDto) {
    const spot = await this.prisma.client.fishingSpot.findFirst({
      where: { id, deletedAt: null },
      select: { id: true, userId: true },
    });

    if (!spot) throw new NotFoundException('Pesqueiro não encontrado');
    if (
      spot.userId !== user.id &&
      user.role !== 'ADMIN' &&
      user.role !== 'MODERATOR'
    ) {
      throw new ForbiddenException('Você não pode editar este pesqueiro');
    }

    return this.prisma.client.fishingSpot.update({
      where: { id },
      data: {
        name: dto.name,
        latitude: dto.latitude,
        longitude: dto.longitude,
        description: dto.description,
        spotType: dto.spotType,
        accessType: dto.accessType,
        structure: dto.structure,
        photos: dto.photos,
        privacy: dto.privacy,
      },
      select: SPOT_SELECT,
    });
  }

  async remove(user: RequestUser, id: string) {
    const spot = await this.prisma.client.fishingSpot.findFirst({
      where: { id, deletedAt: null },
      select: { id: true, userId: true },
    });

    if (!spot) throw new NotFoundException('Pesqueiro não encontrado');
    if (
      spot.userId !== user.id &&
      user.role !== 'ADMIN' &&
      user.role !== 'MODERATOR'
    ) {
      throw new ForbiddenException('Você não pode excluir este pesqueiro');
    }

    await this.prisma.client.fishingSpot.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { deleted: true };
  }

  private haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(a));
  }
}
