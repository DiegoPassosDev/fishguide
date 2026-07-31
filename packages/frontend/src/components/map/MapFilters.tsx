"use client";

import { CATEGORIES, CATEGORY_ORDER } from "./categories";
import type { MapCategory } from "./types";

interface MapFiltersProps {
  active: Set<MapCategory>;
  counts: Record<MapCategory, number>;
  onToggle: (category: MapCategory) => void;
}

export function MapFilters({ active, counts, onToggle }: MapFiltersProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {CATEGORY_ORDER.map((c) => {
        const cat = CATEGORIES[c];
        const Icon = cat.icon;
        const isActive = active.has(c);
        const count = counts[c];
        if (count === 0) return null;
        return (
          <button
            key={c}
            type="button"
            onClick={() => onToggle(c)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold shadow-lg transition-colors ${
              isActive ? "border-transparent text-white" : "border-border bg-card text-muted-foreground"
            }`}
            style={isActive ? { backgroundColor: cat.color } : undefined}
          >
            <Icon size={13} />
            {cat.label}
            <span
              className={`rounded-full px-1.5 text-[10px] ${
                isActive ? "bg-white/25 text-white" : "bg-muted text-muted-foreground"
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
