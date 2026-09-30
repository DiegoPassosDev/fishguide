"use client";

import { useRouter } from "next/navigation";
import { Fish, MapPin } from "lucide-react";
import type { FishingSpotSummary } from "@/types/fishing-spots";
import type { Species } from "@/types/species";

interface FavoritesCardProps {
  species: Species[];
  spots: FishingSpotSummary[];
  loading?: boolean;
}

export function FavoritesCard({ species, spots, loading }: FavoritesCardProps) {
  const router = useRouter();

  return (
    <section className="mb-3 rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-lg leading-none">⭐</span>
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Favoritos
        </h2>
      </div>

      {loading ? (
        <p className="text-xs text-muted-foreground">Carregando favoritos…</p>
      ) : species.length === 0 && spots.length === 0 ? (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            Você ainda não favoritou nada. Toque no coração no mapa ou na ficha de uma espécie
            para guardar aqui.
          </p>
          <button
            type="button"
            onClick={() => router.push("/map")}
            className="rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Explorar o mapa
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {species.length > 0 && (
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                <Fish size={13} />
                Espécies favoritas
              </p>
              <div className="flex flex-wrap gap-2">
                {species.map((specie) => (
                  <button
                    key={specie.id}
                    type="button"
                    onClick={() => router.push(`/species/${specie.id}`)}
                    className="rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-medium text-foreground transition-colors hover:border-primary/40"
                  >
                    {specie.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {spots.length > 0 && (
            <div className="border-t border-border pt-3">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                <MapPin size={13} />
                Locais favoritos
              </p>
              <div className="flex flex-wrap gap-2">
                {spots.map((spot) => (
                  <button
                    key={spot.id}
                    type="button"
                    onClick={() => router.push(`/spot/${spot.id}`)}
                    className="rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-medium text-foreground transition-colors hover:border-primary/40"
                  >
                    {spot.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
