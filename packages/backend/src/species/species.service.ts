import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateSpeciesDto } from './dto/create-species.dto.js';
import { UpdateSpeciesDto } from './dto/update-species.dto.js';
import { QuerySpeciesDto } from './dto/query-species.dto.js';

const SPECIES_SELECT = {
  id: true,
  name: true,
  scientificName: true,
  photo: true,
  averageWeight: true,
  averageLength: true,
  habitat: true,
  feeding: true,
  bestSeason: true,
  bestTide: true,
  bestMoon: true,
  bestBait: true,
  createdAt: true,
  updatedAt: true,
} as const;

const EDITOR_ROLES = ['ADMIN', 'SPECIALIST'];

interface RequestUser {
  id: string;
  role: string;
}

@Injectable()
export class SpeciesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QuerySpeciesDto) {
    const { search, habitat, limit = 50, offset = 0 } = query;

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { scientificName: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (habitat) {
      where.habitat = { contains: habitat, mode: 'insensitive' };
    }

    const [items, total] = await Promise.all([
      this.prisma.client.species.findMany({
        where,
        select: SPECIES_SELECT,
        orderBy: { name: 'asc' },
        take: limit,
        skip: offset,
      }),
      this.prisma.client.species.count({ where }),
    ]);

    return { items, total, limit, offset };
  }

  async findOne(id: string) {
    const species = await this.prisma.client.species.findFirst({
      where: { id },
      select: {
        ...SPECIES_SELECT,
        spots: {
          select: {
            spot: {
              select: {
                id: true,
                name: true,
                latitude: true,
                longitude: true,
                spotType: true,
                rating: true,
              },
            },
          },
        },
      },
    });

    if (!species) throw new NotFoundException('Espécie não encontrada');

    return {
      ...species,
      spots: species.spots.map(({ spot }) => spot),
    };
  }

  async create(user: RequestUser, dto: CreateSpeciesDto) {
    this.assertEditor(user);
    return this.prisma.client.species.create({
      data: {
        name: dto.name,
        scientificName: dto.scientificName,
        photo: dto.photo,
        averageWeight: dto.averageWeight,
        averageLength: dto.averageLength,
        habitat: dto.habitat,
        feeding: dto.feeding,
        bestSeason: dto.bestSeason,
        bestTide: dto.bestTide,
        bestMoon: dto.bestMoon,
        bestBait: dto.bestBait,
      },
      select: SPECIES_SELECT,
    });
  }

  async update(user: RequestUser, id: string, dto: UpdateSpeciesDto) {
    this.assertEditor(user);
    const exists = await this.prisma.client.species.findFirst({
      where: { id },
      select: { id: true },
    });

    if (!exists) throw new NotFoundException('Espécie não encontrada');

    return this.prisma.client.species.update({
      where: { id },
      data: {
        name: dto.name,
        scientificName: dto.scientificName,
        photo: dto.photo,
        averageWeight: dto.averageWeight,
        averageLength: dto.averageLength,
        habitat: dto.habitat,
        feeding: dto.feeding,
        bestSeason: dto.bestSeason,
        bestTide: dto.bestTide,
        bestMoon: dto.bestMoon,
        bestBait: dto.bestBait,
      },
      select: SPECIES_SELECT,
    });
  }

  async remove(user: RequestUser, id: string) {
    this.assertEditor(user);
    const exists = await this.prisma.client.species.findFirst({
      where: { id },
      select: { id: true },
    });

    if (!exists) throw new NotFoundException('Espécie não encontrada');

    await this.prisma.client.species.delete({ where: { id } });
    return { deleted: true };
  }

  private assertEditor(user: RequestUser) {
    if (!EDITOR_ROLES.includes(user.role)) {
      throw new ForbiddenException(
        'Apenas administradores ou especialistas podem gerenciar espécies',
      );
    }
  }
}
