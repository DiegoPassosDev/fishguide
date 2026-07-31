"use client";

import { CATEGORIES } from "./categories";
import type { MapSpot } from "./types";

interface MapMarkerProps {
  spot: MapSpot;
  active: boolean;
  hidden?: boolean;
  onClick: () => void;
}

export function MapMarker({ spot, active, hidden, onClick }: MapMarkerProps) {
  if (hidden) return null;

  const cat = CATEGORIES[spot.category];
  const Icon = cat.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
      className={`absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center transition-transform ${
        active ? "z-30 scale-110" : "z-10 hover:scale-110"
      }`}
      aria-label={spot.name}
    >
      <span
        className="flex size-8 items-center justify-center rounded-full shadow-lg ring-2 ring-background"
        style={{ backgroundColor: cat.color }}
      >
        <Icon size={15} className="text-white" />
      </span>
      {active && (
        <span className="mt-1 whitespace-nowrap rounded-full bg-background/85 px-2 py-0.5 text-[10px] font-semibold text-foreground backdrop-blur">
          {spot.name}
        </span>
      )}
    </button>
  );
}
