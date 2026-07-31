"use client";

import { Medal } from "lucide-react";

interface Achievement {
  title: string;
  description: string;
  unlocked: boolean;
}

interface AchievementsCardProps {
  achievements: Achievement[];
}

export function AchievementsCard({ achievements }: AchievementsCardProps) {
  return (
    <section className="mb-3 rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-lg leading-none">🏆</span>
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Conquistas
        </h2>
      </div>

      <div className="flex flex-col gap-2">
        {achievements.map((achievement) => (
          <div
            key={achievement.title}
            className={`flex items-center gap-3 rounded-2xl p-3 ${
              achievement.unlocked ? "bg-muted/60" : "bg-muted/30 opacity-60"
            }`}
          >
            <div
              className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${
                achievement.unlocked ? "bg-primary/10 text-primary" : "bg-border/40 text-muted-foreground"
              }`}
            >
              <Medal size={16} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                {achievement.title}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {achievement.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
