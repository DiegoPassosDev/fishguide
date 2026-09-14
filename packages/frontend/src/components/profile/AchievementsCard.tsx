"use client";

import type { GamificationAchievement } from "@/types/gamification";

interface AchievementsCardProps {
  achievements: GamificationAchievement[];
}

export function AchievementsCard({ achievements }: AchievementsCardProps) {
  const unlocked = achievements.filter((achievement) => achievement.unlocked).length;

  return (
    <section className="mb-3 rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-lg leading-none">🏆</span>
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Conquistas
        </h2>
        <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
          {unlocked}/{achievements.length}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`flex flex-col gap-1.5 rounded-2xl p-3 ${
              achievement.unlocked
                ? "bg-muted/60"
                : "bg-muted/30 opacity-60"
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`flex size-8 shrink-0 items-center justify-center rounded-xl text-base ${
                  achievement.unlocked
                    ? "bg-primary/10"
                    : "bg-border/40 grayscale"
                }`}
              >
                {achievement.emoji}
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-foreground">
                  {achievement.name}
                </p>
                <p className="truncate text-[11px] text-muted-foreground">
                  {achievement.unlocked
                    ? "Desbloqueada"
                    : `${Math.min(achievement.current, achievement.target)}/${achievement.target}`}
                </p>
              </div>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-border">
              <div
                className={`h-full rounded-full ${
                  achievement.unlocked ? "bg-primary" : "bg-muted-foreground/40"
                }`}
                style={{ width: `${Math.round(achievement.progress * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}