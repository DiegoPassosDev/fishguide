"use client";

import { Navigation, Star, X } from "lucide-react";
import { CATEGORIES } from "./categories";
import type { MapSpot } from "./types";

interface SpotDetailCardProps {
  spot: MapSpot;
  onClose: () => void;
}

export function SpotDetailCard({ spot, onClose }: SpotDetailCardProps) {
  const cat = CATEGORIES[spot.category];
  const Icon = cat.icon;

  return (
    <div className="rounded-3xl border border-border bg-card p-4 shadow-xl">
      <div className="flex items-start gap-3">
        <span
          className="flex size-10 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: cat.color }}
        >
          <Icon size={18} className="text-white" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate text-sm font-bold text-foreground">{spot.name}</h3>
            <button
              type="button"
              onClick={onClose}
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Fechar"
            >
              <X size={16} />
            </button>
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: cat.color }}>
            {cat.label}
          </p>
          {spot.detail && <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{spot.detail}</p>}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs">
          {spot.rating != null && (
            <span className="flex items-center gap-1 font-bold text-amber-500">
              <Star size={12} className="fill-amber-500 text-amber-500" />
              {spot.rating.toFixed(1)}
            </span>
          )}
          <span className="font-semibold text-muted-foreground">{spot.distanceKm} km</span>
        </div>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Navigation size={13} />
          Ver rota
        </button>
      </div>
    </div>
  );
}
