import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { WeatherService } from '../weather/weather.service.js';
import { TidesService } from '../tides/tides.service.js';
import {
  AstronomyService,
  type AstronomyData,
} from '../astronomy/astronomy.service.js';
import { CreateTripDto } from './dto/create-trip.dto.js';
import { UpdateTripDto } from './dto/update-trip.dto.js';
import { CreateCatchDto } from './dto/create-catch.dto.js';
import { UpdateCatchDto } from './dto/update-catch.dto.js';

const TRIP_SELECT = {
  id: true,
  date: true,
  status: true,
  notes: true,
  location: true,
  privacy: true,
  weatherSnapshot: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
  spotId: true,
  spot: {
    select: {
      id: true,
      name: true,
      latitude: true,
      longitude: true,
      spotType: true,
    },
  },
  catches: {
    select: {
      id: true,
      weight: true,
      length: true,
      photo: true,
      time: true,
      notes: true,
      createdAt: true,
      species: {
        select: {
          id: true,
          name: true,
          photo: true,
        },
      },
    },
  },
};

@Injectable()
export class FishingTripsService {
  private readonly logger = new Logger(FishingTripsService.name);

  constructor(
    private prisma: PrismaService,
    private weather: WeatherService,
    private tides: TidesService,
    private astronomy: AstronomyService,
  ) {}

  async create(userId: string, dto: CreateTripDto) {
    const snapshot = await this.buildRealSnapshot(dto.spotId);

    const trip = await this.prisma.client.fishingTrip.create({
      data: {
        userId,
        date: new Date(),
        status: 'active',
        spotId: dto.spotId || null,
        location: dto.location || null,
        notes: dto.notes || null,
        privacy: dto.privacy || 'public',
        weatherSnapshot: snapshot,
      },
      select: TRIP_SELECT,
    });

    this.logger.log(`Trip created: ${trip.id} by user ${userId}`);
    return trip;
  }

  async findAll(userId: string) {
    return this.prisma.client.fishingTrip.findMany({
      where: { userId, deletedAt: null },
      select: TRIP_SELECT,
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const trip = await this.prisma.client.fishingTrip.findFirst({
      where: { id, deletedAt: null },
      select: TRIP_SELECT,
    });

    if (!trip) {
      throw new NotFoundException('Pescaria não encontrada');
    }

    if (trip.userId !== userId) {
      throw new ForbiddenException('Acesso negado');
    }

    return trip;
  }

  async update(id: string, userId: string, dto: UpdateTripDto) {
    await this.findOne(id, userId);

    const data: Record<string, unknown> = {};
    if (dto.spotId !== undefined) data.spotId = dto.spotId;
    if (dto.location !== undefined) data.location = dto.location;
    if (dto.notes !== undefined) data.notes = dto.notes;
    if (dto.privacy !== undefined) data.privacy = dto.privacy;
    if (dto.date !== undefined) data.date = new Date(dto.date);

    return this.prisma.client.fishingTrip.update({
      where: { id },
      data,
      select: TRIP_SELECT,
    });
  }

  async finish(id: string, userId: string) {
    await this.findOne(id, userId);

    return this.prisma.client.fishingTrip.update({
      where: { id },
      data: { status: 'finished' },
      select: TRIP_SELECT,
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    await this.prisma.client.fishingTrip.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { message: 'Pescaria excluída' };
  }

  async addCatch(tripId: string, userId: string, dto: CreateCatchDto) {
    await this.findOne(tripId, userId);

    const catchItem = await this.prisma.client.catch.create({
      data: {
        tripId,
        speciesId: dto.speciesId,
        weight: dto.weight ?? null,
        length: dto.length ?? null,
        notes: dto.notes || null,
        photo: dto.photo || null,
        time: new Date(),
      },
      select: {
        id: true,
        weight: true,
        length: true,
        photo: true,
        time: true,
        notes: true,
        createdAt: true,
        species: {
          select: {
            id: true,
            name: true,
            photo: true,
          },
        },
      },
    });

    this.logger.log(`Catch added to trip ${tripId}: ${catchItem.id}`);
    return catchItem;
  }

  async updateCatch(catchId: string, userId: string, dto: UpdateCatchDto) {
    const catchItem = await this.prisma.client.catch.findUnique({
      where: { id: catchId },
      select: { id: true, tripId: true, trip: { select: { userId: true } } },
    });

    if (!catchItem) {
      throw new NotFoundException('Captura não encontrada');
    }

    if (catchItem.trip.userId !== userId) {
      throw new ForbiddenException('Acesso negado');
    }

    const data: Record<string, unknown> = {};
    if (dto.speciesId !== undefined) data.speciesId = dto.speciesId;
    if (dto.weight !== undefined) data.weight = dto.weight;
    if (dto.length !== undefined) data.length = dto.length;
    if (dto.notes !== undefined) data.notes = dto.notes;
    if (dto.photo !== undefined) data.photo = dto.photo;

    return this.prisma.client.catch.update({
      where: { id: catchId },
      data,
      select: {
        id: true,
        weight: true,
        length: true,
        photo: true,
        time: true,
        notes: true,
        createdAt: true,
        species: {
          select: {
            id: true,
            name: true,
            photo: true,
          },
        },
      },
    });
  }

  async removeCatch(catchId: string, userId: string) {
    const catchItem = await this.prisma.client.catch.findUnique({
      where: { id: catchId },
      select: { id: true, tripId: true, trip: { select: { userId: true } } },
    });

    if (!catchItem) {
      throw new NotFoundException('Captura não encontrada');
    }

    if (catchItem.trip.userId !== userId) {
      throw new ForbiddenException('Acesso negado');
    }

    await this.prisma.client.catch.delete({ where: { id: catchId } });

    return { message: 'Captura excluída' };
  }

  private async buildRealSnapshot(spotId?: string) {
    let lat = -22.9068;
    let lon = -43.1729;

    if (spotId) {
      const spot = await this.prisma.client.fishingSpot.findUnique({
        where: { id: spotId },
        select: { latitude: true, longitude: true },
      });
      if (spot) {
        lat = spot.latitude;
        lon = spot.longitude;
      }
    }

    let astronomyData: AstronomyData | null = null;
    try {
      astronomyData = this.astronomy.getAstronomyByLocation(lat, lon);
    } catch {
      astronomyData = null;
    }

    const [weatherData, tideData] = await Promise.all([
      this.weather.getCurrentWeather(lat, lon).catch(() => null),
      this.tides.getTidesByLocation(lat, lon).catch(() => null),
    ]);

    return {
      temperature: weatherData?.temperature ?? null,
      condition: weatherData?.condition ?? null,
      pressure: weatherData?.pressure ?? null,
      humidity: weatherData?.humidity ?? null,
      wind: weatherData?.windSpeed ?? null,
      tide: tideData?.agoraStatus ?? null,
      moonPhase: astronomyData?.moonPhase ?? null,
    };
  }
}
