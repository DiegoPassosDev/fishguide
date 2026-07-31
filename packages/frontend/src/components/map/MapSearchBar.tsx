"use client";

import { Search, X } from "lucide-react";
import { CATEGORIES } from "./categories";
import type { MapSpot } from "./types";

interface MapSearchBarProps {
  query: string;
  results: MapSpot[];
  onQueryChange: (query: string) => void;
  onSelect: (spot: MapSpot) => void;
}

export function MapSearchBar({ query, results, onQueryChange, onSelect }: MapSearchBarProps) {
  const open = query.trim().length > 0;

  return (
    <div className="relative">
      <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 shadow-lg">
        <Search size={16} className="text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Buscar pesqueiros, marinas, lojas..."
          className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
        {open && (
          <button
            type="button"
            onClick={() => onQueryChange("")}
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Limpar busca"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => onQueryChange("")} />
          <div className="absolute inset-x-0 top-12 z-30 overflow-hidden rounded-2xl border border-border bg-popover shadow-xl">
            {results.length === 0 ? (
              <p className="px-4 py-3 text-xs text-muted-foreground">
                Nenhum local encontrado para &ldquo;{query}&rdquo;.
              </p>
            ) : (
              results.map((spot) => {
                const cat = CATEGORIES[spot.category];
                const Icon = cat.icon;
                return (
                  <button
                    key={spot.id}
                    type="button"
                    onClick={() => onSelect(spot)}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-accent"
                  >
                    <span
                      className="flex size-8 shrink-0 items-center justify-center rounded-full"
                      style={{ backgroundColor: cat.color }}
                    >
                      <Icon size={14} className="text-white" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-popover-foreground">{spot.name}</span>
                      <span className="block text-[11px] text-muted-foreground">
                        {cat.label} · {spot.distanceKm} km
                      </span>
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
}
