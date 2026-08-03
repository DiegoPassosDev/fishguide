import type { TripSnapshot } from "./types";

const CONDITIONS = [
  "Ensolarado",
  "Parcialmente Nublado",
  "Nublado",
  "Chuva Fraca",
  "Céu Limpo",
];

const MOON_PHASES = [
  { name: "Lua Nova", emoji: "🌑" },
  { name: "Lua Crescente", emoji: "🌒" },
  { name: "Lua Quarto Crescente", emoji: "🌓" },
  { name: "Lua Crescente Gibosa", emoji: "🌔" },
  { name: "Lua Cheia", emoji: "🌕" },
  { name: "Lua Minguante Gibosa", emoji: "🌖" },
  { name: "Lua Quarto Minguante", emoji: "🌗" },
  { name: "Lua Minguante", emoji: "🌘" },
];

export const MOON_EMOJI: Record<string, string> = Object.fromEntries(
  MOON_PHASES.map((p) => [p.name, p.emoji]),
);

export const SPECIES = [
  "Robalo",
  "Corvina",
  "Tainha",
  "Bagre",
  "Garoupa",
  "Anchova",
  "Pampo",
  "Pescada",
  "Sargo",
  "Tilápia",
  "Pacu",
  "Dourado",
];

function moonPhaseName(date: Date): string {
  const synodic = 29.53058867;
  const reference = Date.UTC(2000, 0, 6, 18, 14);
  const days = (date.getTime() - reference) / 86400000;
  const phase = ((days % synodic) + synodic) % synodic;
  const index = Math.floor((phase / synodic) * 8 + 0.5) % 8;
  return MOON_PHASES[index].name;
}

function tideByHour(hour: number): string {
  const cycle = hour % 6;
  if (cycle < 1.5) return "Enchendo";
  if (cycle < 3) return "Cheia";
  if (cycle < 4.5) return "Vazando";
  return "Baixa";
}

export function buildSnapshot(now = new Date()): TripSnapshot {
  const hour = now.getHours();
  const minute = now.getMinutes();
  const seed = (hour * 60 + minute) / 60;
  const temperature = Math.round(22 + 3.5 * Math.sin((seed / 24) * Math.PI * 2) + 1);
  const condition = CONDITIONS[Math.floor(seed) % CONDITIONS.length];
  const pressure = 1013 + Math.round(Math.sin(seed / 6) * 4);
  const humidity = Math.round(62 + 18 * Math.abs(Math.sin(seed / 9)));
  const wind = Math.round(8 + 12 * Math.abs(Math.sin(seed / 7)));
  return {
    temperature,
    condition,
    pressure,
    humidity,
    wind,
    tide: tideByHour(hour),
    moonPhase: moonPhaseName(now),
  };
}

export function formatElapsed(startedAt: number, now: number): string {
  const total = Math.max(0, Math.floor((now - startedAt) / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${pad(minutes)}:${pad(seconds)}`;
}
