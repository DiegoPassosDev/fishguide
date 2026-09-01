export interface Catch {
  id: string;
  species: string;
  speciesId: string;
  weight: string;
  length: string;
  notes?: string;
  photoUrl?: string;
  time: string;
}

export interface TripSnapshot {
  temperature: number | null;
  condition: string | null;
  pressure: number | null;
  humidity: number | null;
  wind: number | null;
  tide: string | null;
  moonPhase: string | null;
}

export interface ActiveTrip {
  id: string;
  status: string;
  startedAt: number;
  location: string;
  spotId?: string;
  catches: Catch[];
  snapshot: TripSnapshot;
}