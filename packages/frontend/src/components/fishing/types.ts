export interface Catch {
  id: number;
  species: string;
  weight: string;
  length: string;
  notes?: string;
  photoUrl?: string;
  time: string;
}

export interface TripSnapshot {
  temperature: number;
  condition: string;
  pressure: number;
  humidity: number;
  wind: number;
  tide: string;
  moonPhase: string;
}

export interface ActiveTrip {
  startedAt: number;
  location: string;
  catches: Catch[];
  snapshot: TripSnapshot;
}
