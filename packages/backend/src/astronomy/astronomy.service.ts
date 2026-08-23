import { Injectable, Logger } from '@nestjs/common';
import * as SunCalc from 'suncalc';

export interface AstronomyData {
  sunRise: string;
  sunSet: string;
  moonRise: string;
  moonSet: string;
  moonPhase: string;
  moonIllumination: number;
}

@Injectable()
export class AstronomyService {
  private readonly logger = new Logger(AstronomyService.name);

  getAstronomyByLocation(lat: number, lon: number): AstronomyData {
    try {
      const now = new Date();
      const times = SunCalc.getTimes(now, lat, lon);
      const moonTimes = SunCalc.getMoonTimes(now, lat, lon);
      const illumination = SunCalc.getMoonIllumination(now);

      const data: AstronomyData = {
        sunRise: this.formatTime(times.sunrise),
        sunSet: this.formatTime(times.sunset),
        moonRise: this.formatTime(moonTimes.rise),
        moonSet: this.formatTime(moonTimes.set),
        moonPhase: this.getMoonPhaseName(illumination.phase),
        moonIllumination: Math.round(illumination.fraction * 100),
      };

      this.logger.log(
        `Astronomy computed for [${lat}, ${lon}]: ${data.moonPhase}, sun ${data.sunRise}-${data.sunSet}`,
      );
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to compute astronomy data: ${message}`);
      throw error;
    }
  }

  private formatTime(date: Date | undefined | null): string {
    if (!date || Number.isNaN(date.getTime())) return '--';
    const h = String(date.getHours()).padStart(2, '0');
    const m = String(date.getMinutes()).padStart(2, '0');
    return `${h}:${m}`;
  }

  private getMoonPhaseName(phase: number): string {
    if (phase < 0.03 || phase >= 0.97) return 'Nova';
    if (phase < 0.22) return 'Crescente';
    if (phase < 0.28) return 'Quarto Crescente';
    if (phase < 0.47) return 'Crescente Gibosa';
    if (phase < 0.53) return 'Cheia';
    if (phase < 0.72) return 'Minguante Gibosa';
    if (phase < 0.78) return 'Quarto Minguante';
    return 'Minguante';
  }
}
