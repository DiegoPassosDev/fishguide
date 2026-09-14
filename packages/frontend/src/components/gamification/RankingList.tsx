"use client";

import { BadgeCheck, MapPin } from "lucide-react";
import type { RankingItem } from "@/types/gamification";

interface RankingListProps {
  items: RankingItem[];
  myPosition?: number | null;
}

function positionClass(position: number): string {
  if (position === 1) return "text-amber-400";
  if (position === 2) return "text-zinc-400";
  if (position === 3) return "text-orange-600";
  return "text-muted-foreground";
}

function Avatar({ name, avatar }: { name: string; avatar: string | null }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return (
    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-sky-700 to-navy-mid text-sm font-bold text-white">
      {avatar ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatar}
          alt={name}
          className="size-full rounded-full object-cover"
        />
      ) : (
        initials
      )}
    </div>
  );
}

export function RankingList({ items, myPosition }: RankingListProps) {
  return (
    <div className="space-y-2">
      {items.map((item) => {
        const isMe = myPosition != null && item.position === myPosition;
        return (
          <div
            key={item.userId}
            className={`flex items-center gap-3 rounded-2xl border p-3 shadow-sm ${
              isMe
                ? "border-primary/50 bg-primary/5"
                : "border-border bg-card"
            }`}
          >
            <span
              className={`w-8 shrink-0 text-center text-base font-bold ${positionClass(
                item.position,
              )}`}
            >
              {item.position}
            </span>

            <Avatar name={item.name} avatar={item.avatar} />

            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1 truncate text-sm font-semibold text-foreground">
                {item.name}
                {item.verified && (
                  <BadgeCheck size={14} className="shrink-0 text-primary" />
                )}
                {isMe && (
                  <span className="ml-1 shrink-0 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                    Você
                  </span>
                )}
              </p>
              <p className="flex items-center gap-1 truncate text-[11px] text-muted-foreground">
                {item.city && (
                  <>
                    <MapPin size={10} />
                    {item.city}
                  </>
                )}
                <span>· Nv. {item.levelNumber}</span>
                <span>· 🏅 {item.unlockedCount}</span>
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm font-bold text-foreground">{item.xp}</p>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                XP
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}