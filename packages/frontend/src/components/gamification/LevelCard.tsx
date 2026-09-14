"use client";

import { TrendingUp } from "lucide-react";
import type { GamificationLevel } from "@/types/gamification";

interface LevelCardProps {
  level: GamificationLevel;
  xp: number;
}

export function LevelCard({ level, xp }: LevelCardProps) {
  const percent = Math.round(level.progress * 100);
  const remaining =
    level.nextThreshold !== null ? level.nextThreshold - xp : null;

  return (
    <section className="mb-3 overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
      <div className="bg-linear-to-br from-teal to-navy-mid px-5 py-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-white/70">
              Nível {level.number}
            </p>
            <h2 className="font-heading text-lg font-bold leading-tight">
              {level.name}
            </h2>
          </div>
          <span className="flex flex-col items-end">
            <span className="text-xl font-bold">{xp}</span>
            <span className="text-[11px] text-white/70">XP</span>
          </span>
        </div>
      </div>

      <div className="px-5 py-4">
        <div className="mb-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <TrendingUp size={12} />
            {remaining !== null
              ? `${remaining} XP para o próximo nível`
              : "Nível máximo alcançado"}
          </span>
          <span className="font-semibold">{percent}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </section>
  );
}