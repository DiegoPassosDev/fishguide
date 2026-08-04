"use client";

import { BarChart3, Fish, MapPin, Trophy, Weight } from "lucide-react";
import { formatWeight, parseWeightKg } from "./trips";
import type { TripRecord } from "./types";

interface DiaryStatsProps {
  trips: TripRecord[];
}

export function DiaryStats({ trips }: DiaryStatsProps) {
  const totalCatches = trips.reduce((sum, t) => sum + t.catches.length, 0);
  const totalWeight = trips.reduce(
    (sum, t) => sum + t.catches.reduce((s, c) => s + parseWeightKg(c.weight), 0),
    0,
  );

  let biggest: { species: string } | null = null;
  let biggestWeight = 0;
  const speciesCount: Record<string, number> = {};

  for (const t of trips) {
    for (const c of t.catches) {
      const w = parseWeightKg(c.weight);
      if (w > biggestWeight) {
        biggestWeight = w;
        biggest = { species: c.species };
      }
      speciesCount[c.species] = (speciesCount[c.species] ?? 0) + 1;
    }
  }

  const topSpecies = Object.entries(speciesCount).sort((a, b) => b[1] - a[1])[0];

  const stats = [
    { icon: <MapPin size={16} className="text-teal-bright" />, label: "Pescarias", value: String(trips.length) },
    { icon: <Fish size={16} className="text-sky-400" />, label: "Capturas", value: String(totalCatches) },
    { icon: <Weight size={16} className="text-amber-400" />, label: "Peso total", value: formatWeight(totalWeight) },
    { icon: <Trophy size={16} className="text-yellow-400" />, label: "Maior peixe", value: biggest?.species ?? "—" },
  ];

  return (
    <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <BarChart3 size={16} className="text-primary" />
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Estatísticas
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {stats.map((item) => (
          <div key={item.label} className="flex items-center gap-2.5 rounded-xl bg-muted/40 px-3 py-2.5">
            {item.icon}
            <div className="min-w-0">
              <div className="text-[11px] text-muted-foreground">{item.label}</div>
              <div className="truncate text-sm font-bold text-card-foreground">{item.value}</div>
            </div>
          </div>
        ))}
      </div>

      {topSpecies && (
        <div className="mt-3 flex items-center gap-2.5 rounded-xl bg-muted/40 px-3 py-2.5">
          <span className="text-lg leading-none">🐟</span>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] text-muted-foreground">Espécie mais capturada</div>
            <div className="truncate text-sm font-bold text-card-foreground">{topSpecies[0]}</div>
          </div>
          <span className="shrink-0 rounded-full bg-primary/15 px-2 py-0.5 text-xs font-bold text-primary">
            {topSpecies[1]}×
          </span>
        </div>
      )}
    </section>
  );
}
