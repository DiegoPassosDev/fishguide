import { Injectable, Logger } from '@nestjs/common';
import * as SunCalc from 'suncalc';
import { WeatherService, WeatherData } from '../weather/weather.service.js';
import { TidesService, TideData } from '../tides/tides.service.js';
import {
  AstronomyService,
  AstronomyData,
} from '../astronomy/astronomy.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

export interface SolunarPeriod {
  time: string;
  label: string;
  activity: 'MUITO ALTA' | 'ALTA' | 'MÉDIA' | 'BAIXA';
}

export interface SolunarData {
  major: SolunarPeriod[];
  minor: SolunarPeriod[];
}

export interface Opportunity {
  speciesId: string;
  name: string;
  photo: string | null;
  score: number;
  location: string;
  spotType: string | null;
  timeStart: string;
  timeEnd: string;
}

export interface ScoreFactor {
  name: string;
  value: number;
  weight: number;
  contribution: number;
}

export interface FgScoreData {
  score: number;
  confidence: number;
  subtitle: string;
  summary: { text: string };
  solunar: SolunarData;
  opportunities: Opportunity[];
  reasons: string[];
  factors: ScoreFactor[];
  engineVersion: string;
}

interface SpeciesRecord {
  id: string;
  name: string;
  photo: string | null;
  bestTide: string | null;
  bestMoon: string | null;
}

interface NearbySpot {
  name: string;
  spotType: string | null;
  species: SpeciesRecord[];
}

const WEIGHTS = {
  tide: 0.25,
  pressure: 0.15,
  moon: 0.12,
  time: 0.12,
  weather: 0.08,
  wind: 0.08,
  temperature: 0.05,
} as const;

@Injectable()
export class FgScoreService {
  private readonly logger = new Logger(FgScoreService.name);
  private readonly ENGINE_VERSION = '1.0';

  constructor(
    private weather: WeatherService,
    private tides: TidesService,
    private astronomy: AstronomyService,
    private prisma: PrismaService,
  ) {}

  async getScore(
    lat: number,
    lon: number,
    state?: string,
  ): Promise<FgScoreData> {
    const [weatherData, tideData, nearbySpots] = await Promise.all([
      this.weather.getCurrentWeather(lat, lon).catch(() => null),
      this.tides.getTidesByLocation(lat, lon, state).catch(() => null),
      this.findNearbySpecies(lat, lon),
    ]);

    let astronomyData: AstronomyData | null = null;
    try {
      astronomyData = this.astronomy.getAstronomyByLocation(lat, lon);
    } catch {
      this.logger.warn('Astronomy computation failed, continuing without it');
    }

    const factors = this.computeFactors(weatherData, tideData, astronomyData);
    const score = this.computeWeightedScore(factors);
    const confidence = this.computeConfidence(
      weatherData,
      tideData,
      astronomyData,
    );
    const solunar = this.computeSolunar(lat, lon, astronomyData);
    const opportunities = this.computeOpportunities(
      score,
      solunar,
      nearbySpots,
    );
    const reasons = this.computeReasons(factors, tideData, astronomyData);
    const subtitle = this.getSubtitle(score);

    return {
      score,
      confidence,
      subtitle,
      summary: {
        text: this.getSummaryText(score, factors, tideData, astronomyData),
      },
      solunar,
      opportunities,
      reasons,
      factors,
      engineVersion: this.ENGINE_VERSION,
    };
  }

  private computeFactors(
    weather: WeatherData | null,
    tide: TideData | null,
    astronomy: AstronomyData | null,
  ): ScoreFactor[] {
    const factors: ScoreFactor[] = [];

    factors.push({
      name: 'Maré',
      value: this.scoreTide(tide),
      weight: WEIGHTS.tide,
      contribution: this.scoreTide(tide) * WEIGHTS.tide,
    });
    factors.push({
      name: 'Pressão',
      value: this.scorePressure(weather),
      weight: WEIGHTS.pressure,
      contribution: this.scorePressure(weather) * WEIGHTS.pressure,
    });
    factors.push({
      name: 'Lua',
      value: this.scoreMoon(astronomy),
      weight: WEIGHTS.moon,
      contribution: this.scoreMoon(astronomy) * WEIGHTS.moon,
    });
    factors.push({
      name: 'Horário',
      value: this.scoreTimeOfDay(),
      weight: WEIGHTS.time,
      contribution: this.scoreTimeOfDay() * WEIGHTS.time,
    });
    factors.push({
      name: 'Clima',
      value: this.scoreWeather(weather),
      weight: WEIGHTS.weather,
      contribution: this.scoreWeather(weather) * WEIGHTS.weather,
    });
    factors.push({
      name: 'Vento',
      value: this.scoreWind(weather),
      weight: WEIGHTS.wind,
      contribution: this.scoreWind(weather) * WEIGHTS.wind,
    });
    factors.push({
      name: 'Temperatura',
      value: this.scoreTemperature(weather),
      weight: WEIGHTS.temperature,
      contribution: this.scoreTemperature(weather) * WEIGHTS.temperature,
    });

    return factors;
  }

  private computeWeightedScore(factors: ScoreFactor[]): number {
    const totalWeight = factors.reduce((sum, f) => sum + f.weight, 0);
    const totalContribution = factors.reduce(
      (sum, f) => sum + f.contribution,
      0,
    );
    return Math.round(totalContribution / totalWeight);
  }

  private computeConfidence(
    weather: WeatherData | null,
    tide: TideData | null,
    astronomy: AstronomyData | null,
  ): number {
    let confidence = 50;
    if (weather) confidence += 15;
    if (tide) confidence += 15;
    if (astronomy) confidence += 15;
    const now = new Date();
    const hour = now.getHours();
    if (hour >= 6 && hour <= 18) confidence += 5;
    return Math.min(99, confidence);
  }

  // --- Scoring functions ---

  private scoreTide(tide: TideData | null): number {
    if (!tide) return 50;
    let base = 50;
    if (tide.agoraStatus === 'Enchendo') base = 85;
    else if (tide.agoraStatus === 'Vazando') base = 45;
    else base = 55;
    if (tide.amplitude > 2) base = Math.min(100, base + 10);
    else if (tide.amplitude > 1.5) base = Math.min(100, base + 5);
    return base;
  }

  private scorePressure(weather: WeatherData | null): number {
    if (!weather) return 65;
    const diff = Math.abs(weather.pressure - 1013);
    if (diff <= 3) return 98;
    if (diff <= 8) return 88;
    if (diff <= 15) return 72;
    if (diff <= 25) return 55;
    if (diff <= 35) return 38;
    return 25;
  }

  private scoreMoon(astronomy: AstronomyData | null): number {
    if (!astronomy) return 60;
    const phaseMap: Record<string, number> = {
      Nova: 90,
      Crescente: 82,
      'Quarto Crescente': 72,
      'Crescente Gibosa': 65,
      Cheia: 55,
      'Minguante Gibosa': 50,
      'Quarto Minguante': 58,
      Minguante: 65,
    };
    const base = phaseMap[astronomy.moonPhase] ?? 60;
    const illum = astronomy.moonIllumination;
    if (illum < 15 || illum > 85) return Math.min(100, base + 5);
    return base;
  }

  private scoreTimeOfDay(): number {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();
    const t = h + m / 60;

    if (t >= 4.5 && t < 7) return Math.round(90 + ((t - 4.5) / 2.5) * 10);
    if (t >= 7 && t < 10) return Math.round(95 - ((t - 7) / 3) * 15);
    if (t >= 10 && t < 14) return Math.round(80 - ((t - 10) / 4) * 25);
    if (t >= 14 && t < 17) return Math.round(55 + ((t - 14) / 3) * 15);
    if (t >= 17 && t < 19) return Math.round(80 + ((t - 17) / 2) * 15);
    if (t >= 19 && t < 21) return Math.round(90 - ((t - 19) / 2) * 20);
    return 55;
  }

  private scoreWeather(weather: WeatherData | null): number {
    if (!weather) return 65;
    const icon = weather.conditionIcon;
    if (icon.startsWith('01')) return 95;
    if (icon.startsWith('02')) return 85;
    if (icon.startsWith('03') || icon.startsWith('04')) return 70;
    if (icon.startsWith('09')) return 50;
    if (icon.startsWith('10')) return 40;
    if (icon.startsWith('11')) return 15;
    if (icon.startsWith('13')) return 35;
    if (icon.startsWith('50')) return 60;
    return 65;
  }

  private scoreWind(weather: WeatherData | null): number {
    if (!weather) return 70;
    const speed = weather.windSpeed;
    if (speed <= 10) return 95;
    if (speed <= 15) return 85;
    if (speed <= 20) return 72;
    if (speed <= 30) return 50;
    if (speed <= 40) return 28;
    return 12;
  }

  private scoreTemperature(weather: WeatherData | null): number {
    if (!weather) return 70;
    const t = weather.temperature;
    if (t >= 24 && t <= 30) return 95;
    if (t >= 20 && t < 24) return 80;
    if (t > 30 && t <= 33) return 75;
    if (t >= 15 && t < 20) return 60;
    if (t > 33 && t <= 36) return 50;
    return 35;
  }

  // --- Solunar ---

  private computeSolunar(
    lat: number,
    lon: number,
    astronomy: AstronomyData | null,
  ): SolunarData {
    const now = new Date();
    const moonTimes = SunCalc.getMoonTimes(now, lat, lon);
    const moonPos = SunCalc.getMoonPosition(now, lat, lon);
    const phases = this.getSolunarPhases(now, lat, lon);

    const major: SolunarPeriod[] = [];
    const minor: SolunarPeriod[] = [];

    for (const phase of phases) {
      const period: SolunarPeriod = {
        time: phase.timeRange,
        label: phase.label,
        activity: phase.activity,
      };
      if (phase.isMajor) {
        major.push(period);
      } else {
        minor.push(period);
      }
    }

    if (major.length === 0 && moonTimes.rise) {
      const riseStr = this.formatTime(moonTimes.rise);
      const end = new Date(moonTimes.rise.getTime() + 60 * 60 * 1000);
      major.push({
        time: `${riseStr} - ${this.formatTime(end)}`,
        label: 'Trânsito lunar',
        activity: 'ALTA',
      });
    }
    if (minor.length === 0 && moonTimes.set) {
      const setStr = this.formatTime(moonTimes.set);
      const end = new Date(moonTimes.set.getTime() + 60 * 60 * 1000);
      minor.push({
        time: `${setStr} - ${this.formatTime(end)}`,
        label: 'Pôr da lua',
        activity: 'MÉDIA',
      });
    }

    return { major, minor };
  }

  private getSolunarPhases(now: Date, lat: number, lon: number) {
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const phases: Array<{
      timeRange: string;
      label: string;
      activity: 'MUITO ALTA' | 'ALTA' | 'MÉDIA' | 'BAIXA';
      isMajor: boolean;
    }> = [];

    const upperTransit = SunCalc.getMoonIllumination(now);

    for (let h = 0; h < 24; h++) {
      const checkTime = new Date(today.getTime() + h * 60 * 60 * 1000);
      const pos = SunCalc.getMoonPosition(checkTime, lat, lon);
      const prevPos = SunCalc.getMoonPosition(
        new Date(checkTime.getTime() - 3600000),
        lat,
        lon,
      );

      const wasBelow = prevPos.altitude < 0;
      const isAbove = pos.altitude >= 0;

      if (wasBelow && isAbove) {
        const start = this.formatTime(checkTime);
        const end = this.formatTime(
          new Date(checkTime.getTime() + 2 * 3600000),
        );
        phases.push({
          timeRange: `${start} - ${end}`,
          label: 'Saída da lua',
          activity: 'MUITO ALTA',
          isMajor: false,
        });
      }

      if (!wasBelow && !isAbove) {
        const start = this.formatTime(checkTime);
        const end = this.formatTime(
          new Date(checkTime.getTime() + 2 * 3600000),
        );
        phases.push({
          timeRange: `${start} - ${end}`,
          label: 'Pôr da lua',
          activity: 'MUITO ALTA',
          isMajor: false,
        });
      }
    }

    const transitTime = new Date(today.getTime() + 12 * 3600000);
    const transit = SunCalc.getMoonPosition(transitTime, lat, lon);
    if (transit.altitude > 0) {
      const start = this.formatTime(transitTime);
      const end = this.formatTime(
        new Date(transitTime.getTime() + 2 * 3600000),
      );
      phases.push({
        timeRange: `${start} - ${end}`,
        label: 'Trânsito lunar (lua sobre as nossas cabeças)',
        activity: 'MUITO ALTA',
        isMajor: true,
      });
    }
    if (transit.altitude <= 0) {
      const start = this.formatTime(transitTime);
      const end = this.formatTime(
        new Date(transitTime.getTime() + 2 * 3600000),
      );
      phases.push({
        timeRange: `${start} - ${end}`,
        label: 'Trânsito lunar oposto (lua sob os nossos pés)',
        activity: 'MUITO ALTA',
        isMajor: true,
      });
    }

    return phases;
  }

  private formatTime(date: Date): string {
    const h = String(date.getHours()).padStart(2, '0');
    const m = String(date.getMinutes()).padStart(2, '0');
    return `${h}:${m}`;
  }

  // --- Opportunities ---

  private async findNearbySpecies(
    lat: number,
    lon: number,
  ): Promise<NearbySpot[]> {
    const delta = 1;
    const spots = await this.prisma.client.fishingSpot.findMany({
      where: {
        latitude: { gte: lat - delta, lte: lat + delta },
        longitude: { gte: lon - delta, lte: lon + delta },
        deletedAt: null,
      },
      include: {
        species: {
          include: {
            species: true,
          },
        },
      },
      take: 20,
    });

    return spots.map((spot) => ({
      name: spot.name,
      spotType: spot.spotType,
      species: spot.species.map((sos) => ({
        id: sos.species.id,
        name: sos.species.name,
        photo: sos.species.photo,
        bestTide: sos.species.bestTide,
        bestMoon: sos.species.bestMoon,
      })),
    }));
  }

  private computeOpportunities(
    score: number,
    solunar: SolunarData,
    spots: NearbySpot[],
  ): Opportunity[] {
    const speciesMap = new Map<
      string,
      { species: SpeciesRecord; spots: string[] }
    >();

    for (const spot of spots) {
      for (const sp of spot.species) {
        const existing = speciesMap.get(sp.id);
        if (existing) {
          if (!existing.spots.includes(spot.name))
            existing.spots.push(spot.name);
        } else {
          speciesMap.set(sp.id, { species: sp, spots: [spot.name] });
        }
      }
    }

    const now = new Date();
    const currentHour = now.getHours();
    const opportunities: Array<Opportunity & { matchScore: number }> = [];

    for (const [, { species, spots: spotNames }] of speciesMap) {
      let matchScore = score * 0.5;

      if (species.bestTide) {
        const tideKeywords = species.bestTide.toLowerCase();
        if (
          tideKeywords.includes('enchente') ||
          tideKeywords.includes('enchendo')
        ) {
          matchScore += 15;
        } else if (
          tideKeywords.includes('vazante') ||
          tideKeywords.includes('vazando')
        ) {
          matchScore += 5;
        }
      }

      if (species.bestMoon) {
        const moonKeywords = species.bestMoon.toLowerCase();
        if (
          moonKeywords.includes('crescente') ||
          moonKeywords.includes('nova')
        ) {
          matchScore += 10;
        } else if (moonKeywords.includes('cheia')) {
          matchScore += 5;
        }
      }

      matchScore = Math.min(100, Math.round(matchScore));

      const bestStart = Math.max(4, currentHour - 1);
      const bestEnd = Math.min(22, bestStart + 3);

      opportunities.push({
        speciesId: species.id,
        name: species.name,
        photo: species.photo,
        score: matchScore,
        location: spotNames[0],
        spotType: null,
        timeStart: `${String(bestStart).padStart(2, '0')}:00`,
        timeEnd: `${String(bestEnd).padStart(2, '0')}:00`,
        matchScore,
      });
    }

    return opportunities
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3)
      .map(({ matchScore: _, ...rest }) => rest);
  }

  // --- Reasons ---

  private computeReasons(
    factors: ScoreFactor[],
    tide: TideData | null,
    astronomy: AstronomyData | null,
  ): string[] {
    const reasons: string[] = [];

    const sorted = [...factors].sort((a, b) => b.contribution - a.contribution);

    for (const factor of sorted.slice(0, 4)) {
      if (factor.contribution >= 10) {
        reasons.push(this.getFactorReasonText(factor));
      }
    }

    if (tide) {
      if (tide.agoraStatus === 'Enchendo') {
        reasons.push('Maré enchendo — período de maior atividade');
      } else if (tide.amplitude > 2) {
        reasons.push('Grande amplitude de maré — correntes fortes');
      }
    }

    if (astronomy) {
      const moonReasons: Record<string, string> = {
        Nova: 'Lua nova — maior atividade aquática',
        Crescente: 'Lua crescente — condições favoráveis',
        Cheia: 'Lua cheia — iluminação noturna alta',
      };
      if (moonReasons[astronomy.moonPhase]) {
        reasons.push(moonReasons[astronomy.moonPhase]);
      }
    }

    if (reasons.length === 0) {
      reasons.push('Condições ambientais dentro da média');
    }

    return reasons.slice(0, 5);
  }

  private getFactorReasonText(factor: ScoreFactor): string {
    const texts: Record<string, (v: number) => string> = {
      Maré: (v) =>
        v >= 75
          ? 'Maré favorável — enchente com boa amplitude'
          : 'Maré em transição',
      Pressão: (v) =>
        v >= 80 ? 'Pressão atmosférica estável' : 'Pressão em variação',
      Lua: (v) =>
        v >= 75 ? `Fase lunar favorável` : 'Lua em fase intermediária',
      Horário: (v) =>
        v >= 80 ? 'Horário ideal para pesca' : 'Horário fora do pico',
      Clima: (v) =>
        v >= 75 ? 'Clima favorável — sem chuva' : 'Condições de clima variável',
      Vento: (v) =>
        v >= 80 ? 'Vento calmo — condições excelentes' : 'Vento moderado',
      Temperatura: (v) =>
        v >= 80
          ? 'Temperatura ideal para atividade aquática'
          : 'Temperatura fora da faixa ideal',
    };
    return (
      texts[factor.name]?.(factor.value) ??
      `${factor.name} dentro da normalidade`
    );
  }

  private getSubtitle(score: number): string {
    if (score >= 85) return 'Excelente Dia para Pesca';
    if (score >= 70) return 'Boas Condições de Pesca';
    if (score >= 55) return 'Condições Moderadas';
    if (score >= 40) return 'Condições Desfavoráveis';
    return 'Não é o melhor dia';
  }

  private getSummaryText(
    score: number,
    factors: ScoreFactor[],
    tide: TideData | null,
    astronomy: AstronomyData | null,
  ): string {
    const tideWord = tide
      ? tide.agoraStatus === 'Enchendo'
        ? 'maré de grande amplitude'
        : `maré ${tide.agoraStatus.toLowerCase()}`
      : 'condições de maré';

    const moonWord = astronomy?.moonPhase ?? 'condições lunares';

    if (score >= 80) {
      return `Hoje as condições estão excelentes para pesca. A combinação de ${tideWord} e ${moonWord} aumenta significativamente a atividade das espécies costeiras.`;
    }
    if (score >= 60) {
      return `Hoje oferece boas oportunidades de pesca. ${tideWord.charAt(0).toUpperCase() + tideWord.slice(1)} e ${moonWord} criam um cenário favorável.`;
    }
    return `As condições atuais são moderadas para pesca. Considere ajustar horário ou local para melhor aproveitamento.`;
  }
}
