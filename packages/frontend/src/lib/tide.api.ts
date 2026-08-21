import api from "./api";

export interface TideEvent {
  time: string;
  height: string;
  type: "alta" | "baixa";
}

export interface TideData {
  events: TideEvent[];
  amplitude: string;
  agoraStatus: string;
  agoraProgresso: number;
  proximaMudanca: string;
  proximaEm: string;
  harbor: string;
  state: string;
}

interface TideApiResponse {
  events: { time: string; height: number; type: "alta" | "baixa" }[];
  amplitude: number;
  agoraStatus: string;
  agoraProgresso: number;
  proximaMudanca: string;
  proximaEm: string;
  harbor: string;
  state: string;
}

function mapResponse(data: TideApiResponse): TideData {
  return {
    ...data,
    events: data.events.map((e) => ({ ...e, height: e.height.toFixed(2) })),
    amplitude: data.amplitude.toFixed(2),
  };
}

export async function getTides(lat: number, lon: number, state?: string): Promise<TideData> {
  const params: Record<string, string | number> = { lat, lon };
  if (state) params.state = state;

  const response = await api.get<TideApiResponse>("/tides", { params });
  return mapResponse(response.data);
}
