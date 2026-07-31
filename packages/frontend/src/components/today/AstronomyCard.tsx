"use client";

import { Sunrise, Moon, MoonStar } from "lucide-react";
import { MoonPhaseIcon } from "./MoonPhaseIcon";

interface AstronomyCardProps {
  data: {
    fase: string;
    iluminacao: number;
    solNascer: string;
    solPor: string;
    luaNascer: string;
    luaPor: string;
  };
}

export function AstronomyCard({ data }: AstronomyCardProps) {
  return (
    <section className="mb-3 rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <MoonStar size={16} className="text-indigo-400" />
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Astronomia
        </h2>
      </div>

      <div className="mb-5 flex items-center gap-4">
        <div className="relative flex size-14 shrink-0 items-center justify-center">
          <MoonPhaseIcon phase={data.fase} className="size-14" />
        </div>
        <div>
          <div className="text-base font-bold text-card-foreground">
            Lua {data.fase}
          </div>
          <div className="text-xs text-muted-foreground">
            {data.iluminacao}% iluminada
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3 rounded-xl bg-amber-500/5 px-4 py-2.5">
          <div className="flex size-8 items-center justify-center rounded-full bg-amber-500/10">
            <Sunrise size={15} className="text-amber-500" />
          </div>
          <div className="flex flex-1 items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Nasce</span>
              <span className="font-bold text-card-foreground">{data.solNascer}</span>
            </div>
            <span className="text-muted-foreground/40">|</span>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Se põe</span>
              <span className="font-bold text-card-foreground">{data.solPor}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-blue-500/5 px-4 py-2.5">
          <div className="flex size-8 items-center justify-center rounded-full bg-blue-500/10">
            <Moon size={15} className="text-blue-400" />
          </div>
          <div className="flex flex-1 items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Nasce</span>
              <span className="font-bold text-card-foreground">{data.luaNascer}</span>
            </div>
            <span className="text-muted-foreground/40">|</span>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Se põe</span>
              <span className="font-bold text-card-foreground">{data.luaPor}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
