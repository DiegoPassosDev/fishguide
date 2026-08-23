import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

interface OpenWeatherResponse {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  visibility: number;
  rain?: {
    '1h'?: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
  coord: {
    lat: number;
    lon: number;
  };
  name: string;
  sys: {
    country: string;
  };
}

export interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  clouds: number;
  visibility: number;
  uvIndex?: number;
  rain?: number;
  condition: string;
  conditionIcon: string;
  location: {
    lat: number;
    lon: number;
    name: string;
    country: string;
  };
  timestamp: number;
}

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.openweathermap.org/data/2.5';

  constructor(
    private config: ConfigService,
    private http: HttpService,
  ) {
    this.apiKey = this.config.get<string>('OPENWEATHER_API_KEY') || '';
    this.logger.log(`API Key loaded: ${this.apiKey ? 'yes (' + this.apiKey.substring(0, 4) + '...)' : 'NO'}`);
  }

  async getCurrentWeather(lat: number, lon: number): Promise<WeatherData> {
    if (!this.apiKey) {
      this.logger.error('OPENWEATHER_API_KEY not configured');
      throw new Error('OPENWEATHER_API_KEY not configured');
    }

    try {
      const url = `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric&lang=pt_br`;
      const response = await firstValueFrom(
        this.http.get<OpenWeatherResponse>(url),
      );
      this.logger.log(`OpenWeather responded: ${response.status}`);
      const data = response.data;

      return {
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        windSpeed: Math.round(data.wind.speed * 3.6),
        windDirection: data.wind.deg,
        clouds: data.clouds.all,
        visibility: data.visibility,
        rain: data.rain?.['1h'] || 0,
        condition: data.weather[0].description,
        conditionIcon: data.weather[0].icon,
        location: {
          lat: data.coord.lat,
          lon: data.coord.lon,
          name: data.name,
          country: data.sys.country,
        },
        timestamp: Date.now(),
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to fetch weather data: ${message}`);
      throw error;
    }
  }
}
