"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Compass, Star } from "lucide-react";
import { CATEGORIES } from "./categories";
import type { MapSpot } from "./types";

interface NearbySpotsSheetProps {
  spots: MapSpot[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
}

export function NearbySpotsSheet({ spots, selectedId, onSelect }: NearbySpotsSheetProps) {
  const [expanded, setExpanded] = useState(false);
  const sorted = [...spots].sort((a, b) => a.distanceKm - b.distanceKm);
  const selected = spots.find((s) => s.id === selectedId) ?? null;

  return (
    <div className="rounded-t-3xl border border-b-0 border-border bg-card shadow-[0_-8px_24px_rgba(10,22,40,0.12)]">
      <div className="flex justify-center pt-2">
        <span className="h-1 w-10 rounded-full bg-border" />
      </div>

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center gap-3 px-4 py-2.5"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <Compass size={16} className="text-primary" />
        </span>
        <span className="flex-1 text-left">
          <span className="block text-sm font-bold text-foreground">
            {spots.length} {spots.length === 1 ? "local próximo" : "locais próximos"}
          </span>
          {selected && (
            <span className="block text-xs font-semibold text-primary">
              {selected.name} · {selected.distanceKm} km
            </span>
          )}
        </span>
        {expanded ? (
          <ChevronDown size={18} className="text-muted-foreground" />
        ) : (
          <ChevronUp size={18} className="text-muted-foreground" />
        )}
      </button>

      {expanded && (
        <div className="max-h-64 overflow-y-auto border-t border-border pb-2">
          {sorted.map((spot) => {
            const cat = CATEGORIES[spot.category];
            const Icon = cat.icon;
            const active = spot.id === selectedId;
            return (
              <button
                key={spot.id}
                type="button"
                onClick={() => {
                  onSelect(active ? null : spot.id);
                  setExpanded(false);
                }}
                className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-accent ${
                  active ? "bg-accent" : ""
                }`}
              >
                <span
                  className="flex size-8 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: cat.color }}
                >
                  <Icon size={14} className="text-white" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-foreground">{spot.name}</span>
                  <span className="block text-[11px] text-muted-foreground">{cat.label}</span>
                </span>
                {spot.rating != null && (
                  <span className="flex shrink-0 items-center gap-1 text-[11px] font-bold text-amber-500">
                    <Star size={11} className="fill-amber-500 text-amber-500" />
                    {spot.rating.toFixed(1)}
                  </span>
                )}
                <span className="shrink-0 text-[11px] font-semibold text-muted-foreground">
                  {spot.distanceKm} km
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
