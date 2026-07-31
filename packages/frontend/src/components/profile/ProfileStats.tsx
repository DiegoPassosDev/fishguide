"use client";

import { Fish, MapPin, CalendarDays, Trophy } from "lucide-react";

interface ProfileStatsProps {
  stats: {
    catches: number;
    species: number;
    trips: number;
    biggest: string;
  };
}

export function ProfileStats({ stats }: ProfileStatsProps) {
  const items = [
    { label: "Capturas", value: String(stats.catches), icon: Fish },
    { label: "Espécies", value: String(stats.species), icon: Trophy },
    { label: "Pescarias", value: String(stats.trips), icon: CalendarDays },
    { label: "Maior peixe", value: stats.biggest, icon: MapPin },
  ];

  return (
    <section className="mb-3 rounded-3xl border border-border bg-card p-5 shadow-sm">
      <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">
        Estatísticas
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="flex items-center gap-3 rounded-2xl bg-muted/60 p-3"
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon size={16} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-base font-bold text-foreground">{item.value}</p>
                <p className="truncate text-[11px] text-muted-foreground">{item.label}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
