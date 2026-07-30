"use client";

import { Sparkles, Star } from "lucide-react";

interface SolunarBarProps {
  time: string;
  label: string;
  activity: string;
  variant: "major" | "minor";
}

const ACTIVITY_CONFIG: Record<string, { fill: string; bg: string; width: string }> = {
  "MUITO ALTA": { fill: "bg-emerald-500", bg: "bg-emerald-500/15", width: "w-[90%]" },
  "ALTA": { fill: "bg-blue-500", bg: "bg-blue-500/15", width: "w-[65%]" },
  "MÉDIA": { fill: "bg-amber-500", bg: "bg-amber-500/15", width: "w-[40%]" },
  "BAIXA": { fill: "bg-orange-500", bg: "bg-orange-500/15", width: "w-[20%]" },
};

export function SolunarBar({ time, label, activity, variant }: SolunarBarProps) {
  const config = ACTIVITY_CONFIG[activity] ?? ACTIVITY_CONFIG["MÉDIA"];

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5">
        {variant === "major" ? (
          <Sparkles size={12} className="text-emerald-500" />
        ) : (
          <Star size={10} className="text-blue-400" />
        )}
        <span className="text-xs font-bold text-card-foreground">{time}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className={`h-1.5 flex-1 rounded-full ${config.bg}`}>
          <div className={`h-full rounded-full ${config.fill} ${config.width}`} />
        </div>
        <span className="shrink-0 text-[10px] font-semibold text-muted-foreground">
          {activity}
        </span>
      </div>
      <div className={`text-[11px] ${variant === "major" ? "text-muted-foreground" : "text-muted-foreground/70"}`}>
        {label}
      </div>
    </div>
  );
}
