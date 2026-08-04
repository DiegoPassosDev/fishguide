import { buildSnapshot } from "../fishing/trip";
import type { Catch } from "../fishing/types";
import type { TripRecord } from "./types";

export const TRIPS_KEY = "fishguide:trips";

function c(
  id: number,
  species: string,
  weight: string,
  length: string,
  time: string,
  notes?: string,
): Catch {
  return { id, species, weight, length, time, ...(notes ? { notes } : {}) };
}

function trip(
  id: number,
  year: number,
  month: number,
  day: number,
  startHour: number,
  startMinute: number,
  endHour: number,
  endMinute: number,
  location: string,
  catches: Catch[],
): TripRecord {
  const startedAt = new Date(year, month, day, startHour, startMinute).getTime();
  const finishedAt = new Date(year, month, day, endHour, endMinute).getTime();
  return { id, startedAt, finishedAt, location, catches, snapshot: buildSnapshot(new Date(startedAt)) };
}

const MOCK_TRIPS: TripRecord[] = [
  trip(
    1001,
    2026, 6, 19, 5, 30, 9, 10,
    "Praia do Saco - Barra dos Coqueiros",
    [
      c(1, "Robalo", "3,2 kg", "58 cm", "06:40", "Camarão vivo na maré enchendo."),
      c(2, "Tainha", "1,4 kg", "45 cm", "07:55"),
    ],
  ),
  trip(
    1002,
    2026, 6, 12, 6, 0, 11, 20,
    "Rio Sergipe - Mosqueiro",
    [
      c(3, "Corvina", "2,6 kg", "52 cm", "07:10", "Fundo de pedra, jig verde."),
      c(4, "Bagre", "0,9 kg", "38 cm", "08:30"),
      c(5, "Corvina", "1,8 kg", "46 cm", "09:45"),
    ],
  ),
  trip(
    1003,
    2026, 6, 5, 16, 0, 19, 30,
    "Mangue do Poxim",
    [
      c(6, "Pampo", "1,7 kg", "41 cm", "17:20", "Isca natural de sururu."),
      c(7, "Anchova", "0,8 kg", "34 cm", "18:05"),
    ],
  ),
  trip(
    1004,
    2026, 5, 28, 4, 50, 8, 0,
    "Costão da Ilha do Mel",
    [
      c(8, "Dourado", "4,5 kg", "72 cm", "06:15", "Maior captura do ano!"),
      c(9, "Garoupa", "2,2 kg", "49 cm", "07:30"),
    ],
  ),
];

export function loadTrips(): TripRecord[] {
  if (typeof window === "undefined") return MOCK_TRIPS;
  try {
    const raw = localStorage.getItem(TRIPS_KEY);
    if (raw === null) {
      localStorage.setItem(TRIPS_KEY, JSON.stringify(MOCK_TRIPS));
      return MOCK_TRIPS;
    }
    const parsed = JSON.parse(raw) as TripRecord[];
    return parsed
      .filter((t): t is TripRecord => Boolean(t))
      .map((t, i) =>
        typeof t.id === "number" ? t : { ...t, id: t.finishedAt || Date.now() + i },
      );
  } catch {
    return MOCK_TRIPS;
  }
}

export function saveTrips(trips: TripRecord[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TRIPS_KEY, JSON.stringify(trips));
}

export function parseWeightKg(weight: string): number {
  const match = weight.trim().match(/^([\d,]+)/);
  return match ? parseFloat(match[1].replace(",", ".")) : 0;
}

export function formatWeight(kg: number): string {
  if (kg <= 0) return "—";
  const text = String(Math.round(kg * 10) / 10).replace(".", ",");
  return `${text} kg`;
}
