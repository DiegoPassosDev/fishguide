import api from "./api";

interface AstronomyApiResponse {
  sunRise: string;
  sunSet: string;
  moonRise: string;
  moonSet: string;
  moonPhase: string;
  moonIllumination: number;
}

export interface AstronomyData {
  fase: string;
  iluminacao: number;
  solNascer: string;
  solPor: string;
  luaNascer: string;
  luaPor: string;
}

function mapResponse(data: AstronomyApiResponse): AstronomyData {
  return {
    fase: data.moonPhase,
    iluminacao: data.moonIllumination,
    solNascer: data.sunRise,
    solPor: data.sunSet,
    luaNascer: data.moonRise,
    luaPor: data.moonSet,
  };
}

export async function getAstronomy(lat: number, lon: number): Promise<AstronomyData> {
  const response = await api.get<AstronomyApiResponse>("/astronomy", { params: { lat, lon } });
  return mapResponse(response.data);
}
