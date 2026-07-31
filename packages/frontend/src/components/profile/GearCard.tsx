"use client";

import { FishingRod } from "lucide-react";

interface Gear {
  name: string;
  detail: string;
}

interface GearCardProps {
  gear: Gear[];
}

export function GearCard({ gear }: GearCardProps) {
  return (
    <section className="mb-3 rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-lg leading-none">🎣</span>
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Equipamentos
        </h2>
      </div>

      <div className="flex flex-col gap-2">
        {gear.map((item) => (
          <div key={item.name} className="flex items-center gap-3 rounded-2xl bg-muted/60 p-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FishingRod size={16} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{item.name}</p>
              <p className="truncate text-xs text-muted-foreground">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
