import api from "./api";

export interface FgScoreData {
  score: number;
  confidence: number;
  subtitle: string;
  summary: { text: string };
  solunar: {
    major: SolunarPeriod[];
    minor: SolunarPeriod[];
  };
  opportunities: Opportunity[];
  reasons: string[];
  factors: ScoreFactor[];
  engineVersion: string;
}

interface SolunarPeriod {
  time: string;
  label: string;
  activity: string;
}

interface Opportunity {
  speciesId: string;
  name: string;
  photo: string | null;
  score: number;
  location: string;
  spotType: string | null;
  timeStart: string;
  timeEnd: string;
}

interface ScoreFactor {
  name: string;
  value: number;
  weight: number;
  contribution: number;
}

export async function getFgScore(lat: number, lon: number, state?: string): Promise<FgScoreData> {
  const params: Record<string, string | number> = { lat, lon };
  if (state) params.state = state;
  const response = await api.get<FgScoreData>("/fg-score", { params });
  return response.data;
}
