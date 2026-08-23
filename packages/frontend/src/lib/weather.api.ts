import api from "./api";

export interface WeatherData {
  temperatura: number;
  sensacao: number;
  condicao: string;
  vento: number;
  pressao: number;
  umidade: number;
  chuva: number;
  conditionIcon: string;
  location: {
    lat: number;
    lon: number;
    name: string;
    country: string;
  };
}

interface WeatherApiResponse {
  temperature: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  clouds: number;
  visibility: number;
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

function mapResponse(data: WeatherApiResponse): WeatherData {
  return {
    temperatura: data.temperature,
    sensacao: data.feelsLike,
    condicao: data.condition.charAt(0).toUpperCase() + data.condition.slice(1),
    vento: data.windSpeed,
    pressao: data.pressure,
    umidade: data.humidity,
    chuva: data.rain ?? 0,
    conditionIcon: data.conditionIcon,
    location: data.location,
  };
}

export async function getCurrentWeather(lat: number, lon: number): Promise<WeatherData> {
  const response = await api.get<WeatherApiResponse>("/weather", { params: { lat, lon } });
  return mapResponse(response.data);
}
