"use client";

import { Heart } from "lucide-react";
import { CATEGORIES, CATEGORY_ORDER } from "./categories";
import { FilterChip } from "./FilterChip";
import type { MapCategory } from "./types";

interface MapFiltersProps {
  active: Set<MapCategory>;
  counts: Record<MapCategory, number>;
  onToggle: (category: MapCategory) => void;
  favoritesOnly: boolean;
  favoritesCount: number;
  onToggleFavorites: () => void;
}

export function MapFilters({
  active,
  counts,
  onToggle,
  favoritesOnly,
  favoritesCount,
  onToggleFavorites,
}: MapFiltersProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <FilterChip
        label="Favoritos"
        count={favoritesCount}
        icon={<Heart size={13} />}
        isActive={favoritesOnly}
        activeColor="#e11d48"
        onClick={onToggleFavorites}
        className="min-h-9 px-3.5 py-2"
      />
      {CATEGORY_ORDER.map((c) => {
        const cat = CATEGORIES[c];
        const count = counts[c];
        if (count === 0) return null;
        return (
          <FilterChip
            key={c}
            label={cat.label}
            count={count}
            icon={<cat.icon size={13} />}
            isActive={active.has(c)}
            activeColor={cat.color}
            onClick={() => onToggle(c)}
          />
        );
      })}
    </div>
  );
}
