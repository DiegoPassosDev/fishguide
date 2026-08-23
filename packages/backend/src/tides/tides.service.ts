import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

interface TabuaMareHour {
  hour: string;
  level: number;
}

interface TabuaMareDay {
  weekday_name: string;
  day: number;
  hours: TabuaMareHour[];
}

interface TabuaMareMonth {
  month_name: string;
  month: number;
  days: TabuaMareDay[];
}

interface TabuaMareResponse {
  data: Array<{
    year: number;
    harbor_name: string;
    state: string;
    timezone: string;
    mean_level: number;
    months: TabuaMareMonth[];
  }>;
  total: number;
}

interface NearestHarborResponse {
  data: Array<{
    id: string;
    harbor_name: string;
    state: string;
    timezone: string;
    geo_location: Array<{
      lat: string;
      lng: string;
    }>;
    mean_level: number;
  }>;
  total: number;
}

export interface TideEvent {
  time: string;
  height: number;
  type: 'alta' | 'baixa';
}

export interface TideData {
  events: TideEvent[];
  amplitude: number;
  agoraStatus: string;
  agoraProgresso: number;
  proximaMudanca: string;
  proximaEm: string;
  harbor: string;
  state: string;
}

@Injectable()
export class TidesService {
  private readonly logger = new Logger(TidesService.name);
  private readonly baseUrl = 'https://tabuamare.api.br/api/v2';

  constructor(private http: HttpService) {}

  async getTidesByLocation(lat: number, lon: number, state?: string): Promise<TideData> {
    try {
      let stateCode = state;
      if (!stateCode) {
        stateCode = this.getStateFromCoords(lat, lon);
      }

      const now = new Date();
      const month = now.getMonth() + 1;
      const day = now.getDate();

      const harborUrl = `${this.baseUrl}/nearest-harbor-independent-state/[${lat},${lon}]`;
      this.logger.log(`Finding nearest harbor: ${harborUrl}`);
      const harborResponse = await firstValueFrom(this.http.get<NearestHarborResponse>(harborUrl));
      
      if (harborResponse.data.total === 0) {
        throw new Error(`No harbor found for coordinates [${lat}, ${lon}]`);
      }

      const harbor = harborResponse.data.data[0];
      const tideUrl = `${this.baseUrl}/tabua-mare/${harbor.id}/${month}/${day}`;
      this.logger.log(`Fetching tide data: ${tideUrl}`);
      const tideResponse = await firstValueFrom(this.http.get<TabuaMareResponse>(tideUrl));

      if (tideResponse.data.total === 0) {
        throw new Error(`No tide data found for harbor ${harbor.id}`);
      }

      const tideData = tideResponse.data.data[0];
      const todayData = tideData.months[0]?.days[0];

      if (!todayData || todayData.hours.length === 0) {
        throw new Error(`No tide hours available for harbor ${harbor.id}`);
      }

      return this.calculateTideData(todayData.hours, harbor.harbor_name, harbor.state);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to fetch tide data: ${message}`);
      throw error;
    }
  }

  private calculateTideData(hours: TabuaMareHour[], harborName: string, state: string): TideData {
    const now = new Date();
    const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();

    const parseTime = (timeStr: string) => {
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
    };

    const round = (v: number) => Math.round(v * 100) / 100;

    const sortedHours = [...hours].sort((a, b) => parseTime(a.hour) - parseTime(b.hour));

    const events: TideEvent[] = sortedHours.map((h, i) => {
      const prev = i > 0 ? sortedHours[i - 1].level : undefined;
      const next = i < sortedHours.length - 1 ? sortedHours[i + 1].level : undefined;
      let type: 'alta' | 'baixa';
      if (prev === undefined && next === undefined) {
        type = 'alta';
      } else if (prev === undefined) {
        type = h.level < (next as number) ? 'baixa' : 'alta';
      } else if (next === undefined) {
        type = h.level < prev ? 'baixa' : 'alta';
      } else {
        type = h.level >= prev && h.level >= next ? 'alta' : 'baixa';
      }
      return { time: h.hour.substring(0, 5), height: round(h.level), type };
    });

    const highest = Math.max(...sortedHours.map((h) => h.level));
    const lowest = Math.min(...sortedHours.map((h) => h.level));
    const amplitude = round(highest - lowest);

    const HALF_CYCLE_MINUTES = 372; // ~6h12min, typical semidiurnal interval

    let status = 'Estável';
    let progresso = 0;
    let proximaMudanca = '';
    let proximaEm = '';

    const nextIdx = events.findIndex((e) => parseTime(e.time) > currentTimeInMinutes);

    if (nextIdx === -1) {
      const last = events[events.length - 1];
      status = last.type === 'alta' ? 'Vazando' : 'Enchendo';
      progresso = 50;
      proximaMudanca = last.type === 'alta' ? 'Baixa' : 'Alta';
      proximaEm = 'Amanhã';
    } else {
      const nextEvent = events[nextIdx];
      const nextTime = parseTime(nextEvent.time);
      const prevTime = nextIdx > 0 ? parseTime(events[nextIdx - 1].time) : nextTime - HALF_CYCLE_MINUTES;

      status = nextEvent.type === 'alta' ? 'Enchendo' : 'Vazando';
      const range = nextTime - prevTime;
      const elapsed = currentTimeInMinutes - prevTime;
      progresso = range > 0 ? Math.min(100, Math.max(0, Math.round((elapsed / range) * 100))) : 0;
      proximaMudanca = nextEvent.type;
      proximaEm = this.formatTimeDifference(nextTime - currentTimeInMinutes);
    }

    return {
      events,
      amplitude,
      agoraStatus: status,
      agoraProgresso: progresso,
      proximaMudanca,
      proximaEm,
      harbor: harborName,
      state,
    };
  }

  private formatTimeDifference(minutes: number): string {
    if (minutes <= 0) return 'Em breve';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m}min`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}min`;
  }

  private getStateFromCoords(lat: number, lon: number): string {
    if (lat > -2 && lon > -50) return 'ap';
    if (lat > -5 && lon > -45) return 'ma';
    if (lat > -8 && lon > -35) return 'ce';
    if (lat > -8 && lon > -37) return 'rn';
    if (lat > -9 && lon > -35) return 'pb';
    if (lat > -9 && lon > -36) return 'pe';
    if (lat > -10 && lon > -36) return 'al';
    if (lat > -10 && lon > -37) return 'se';
    if (lat > -13 && lon > -39) return 'ba';
    if (lat > -15 && lon > -39) return 'es';
    if (lat > -20 && lon > -40) return 'rj';
    if (lat > -22 && lon > -41) return 'sp';
    if (lat > -24 && lon > -44) return 'pr';
    if (lat > -27 && lon > -49) return 'sc';
    if (lat > -29 && lon > -50) return 'rs';
    if (lat > -1 && lon > -50) return 'pa';
    if (lat > -3 && lon > -42) return 'pi';
    return 'se';
  }
}
