"use client";

import { Fish, MapPin } from "lucide-react";

interface FavoritesCardProps {
  species: string[];
  spots: string[];
}

export function FavoritesCard({ species, spots }: FavoritesCardProps) {
  return (
    <section className="mb-3 rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-lg leading-none">⭐</span>
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Favoritos
        </h2>
      </div>

      <div className="flex flex-col gap-3">
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <Fish size={13} />
            Espécies favoritas
          </p>
          <div className="flex flex-wrap gap-2">
            {species.map((specie) => (
              <span
                key={specie}
                className="rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-medium text-foreground"
              >
                {specie}
              </span>
            ))}
          </div>
        </div>

        <div className="border-t border-border pt-3">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <MapPin size={13} />
            Locais favoritos
          </p>
          <div className="flex flex-wrap gap-2">
            {spots.map((spot) => (
              <span
                key={spot}
                className="rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-medium text-foreground"
              >
                {spot}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
