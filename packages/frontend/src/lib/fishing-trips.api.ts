import api from "./api";
import type { ActiveTrip, Catch, TripSnapshot } from "@/components/fishing/types";
import type { TripRecord } from "@/components/diary/types";

export interface ApiCatch {
  id: string;
  weight: number | null;
  length: number | null;
  photo: string | null;
  time: string;
  notes: string | null;
  createdAt: string;
  species: {
    id: string;
    name: string;
    photo: string | null;
  };
}

export interface ApiTrip {
  id: string;
  date: string;
  status: string;
  notes: string | null;
  location: string | null;
  privacy: string;
  weatherSnapshot: {
    temperature: number | null;
    condition: string | null;
    pressure: number | null;
    humidity: number | null;
    wind: number | null;
    tide: string | null;
    moonPhase: string | null;
  };
  createdAt: string;
  updatedAt: string;
  userId: string;
  spotId: string | null;
  spot: {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    spotType: string | null;
  } | null;
  catches: ApiCatch[];
}

export interface StartTripResponse {
  trip: ApiTrip;
}

export async function startTrip(data?: { spotId?: string; notes?: string; location?: string }): Promise<ApiTrip> {
  const response = await api.post<ApiTrip>("/trips", data ?? {});
  return response.data;
}

export async function getTrips(): Promise<ApiTrip[]> {
  const response = await api.get<ApiTrip[]>("/trips");
  return response.data;
}

export async function getTrip(id: string): Promise<ApiTrip> {
  const response = await api.get<ApiTrip>(`/trips/${id}`);
  return response.data;
}

export async function updateTrip(
  id: string,
  data: { spotId?: string; notes?: string; privacy?: string; date?: string; location?: string },
): Promise<ApiTrip> {
  const response = await api.patch<ApiTrip>(`/trips/${id}`, data);
  return response.data;
}

export async function deleteTrip(id: string): Promise<void> {
  await api.delete(`/trips/${id}`);
}

export async function finishTrip(id: string): Promise<ApiTrip> {
  const response = await api.post<ApiTrip>(`/trips/${id}/finish`);
  return response.data;
}

export async function addCatch(
  tripId: string,
  data: {
    speciesId: string;
    weight?: number;
    length?: number;
    notes?: string;
    photo?: string;
  },
): Promise<ApiCatch> {
  const response = await api.post<ApiCatch>(`/trips/${tripId}/catches`, data);
  return response.data;
}

export async function updateCatch(
  catchId: string,
  data: {
    speciesId?: string;
    weight?: number;
    length?: number;
    notes?: string;
    photo?: string;
  },
): Promise<ApiCatch> {
  const response = await api.patch<ApiCatch>(`/trips/catches/${catchId}`, data);
  return response.data;
}

export async function deleteCatch(catchId: string): Promise<void> {
  await api.delete(`/trips/catches/${catchId}`);
}

export async function getSpecies(): Promise<Array<{ id: string; name: string; photo: string | null }>> {
  const response = await api.get<{ items: Array<{ id: string; name: string; photo: string | null }> }>("/species", { params: { limit: 100 } });
  return response.data.items;
}

function formatWeight(kg: number | null): string {
  if (kg == null) return "";
  const text = String(Math.round(kg * 10) / 10).replace(".", ",");
  return `${text} kg`;
}

function formatLength(cm: number | null): string {
  if (cm == null) return "";
  return `${Math.round(cm)} cm`;
}

function formatTime(isoString: string): string {
  const d = new Date(isoString);
  return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function mapCatch(apiCatch: ApiCatch): Catch {
  return {
    id: apiCatch.id,
    species: apiCatch.species.name,
    speciesId: apiCatch.species.id,
    weight: formatWeight(apiCatch.weight),
    length: formatLength(apiCatch.length),
    notes: apiCatch.notes ?? undefined,
    photoUrl: apiCatch.photo ?? undefined,
    time: formatTime(apiCatch.time || apiCatch.createdAt),
  };
}

function mapSnapshot(raw: ApiTrip["weatherSnapshot"]): TripSnapshot {
  return {
    temperature: raw.temperature,
    condition: raw.condition,
    pressure: raw.pressure,
    humidity: raw.humidity,
    wind: raw.wind,
    tide: raw.tide,
    moonPhase: raw.moonPhase,
  };
}

export function mapTrip(apiTrip: ApiTrip): ActiveTrip {
  return {
    id: apiTrip.id,
    status: apiTrip.status,
    startedAt: new Date(apiTrip.date).getTime(),
    location: apiTrip.location ?? apiTrip.spot?.name ?? "",
    spotId: apiTrip.spotId ?? undefined,
    catches: apiTrip.catches.map(mapCatch),
    snapshot: mapSnapshot(apiTrip.weatherSnapshot),
  };
}

export function mapTripRecord(apiTrip: ApiTrip): TripRecord {
  const trip = mapTrip(apiTrip);
  return {
    ...trip,
    finishedAt: new Date(apiTrip.updatedAt).getTime(),
  };
}
