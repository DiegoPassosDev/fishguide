"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Calendar,
  Clock3,
  Fish,
  MapPin,
  Moon,
  Ruler,
  Scale,
  Waves,
  Worm,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { getSpeciesById } from "@/lib/species.api";
import type { SpeciesDetail } from "@/types/species";

function InfoRow({ icon: Icon, label, value }: { icon: typeof Fish; label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
        <Icon size={15} className="text-primary" />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}

export default function SpeciesDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [species, setSpecies] = useState<SpeciesDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getSpeciesById(params.id)
      .then((data) => {
        if (!cancelled) setSpecies(data);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  return (
    <div className="relative mx-auto flex h-dvh w-full max-w-105 flex-col overflow-hidden bg-background">
      <Header />

      <main className="flex-1 overflow-y-auto px-3 pt-2 pb-25">
        {loading ? (
          <div className="space-y-3">
            <div className="h-28 animate-pulse rounded-3xl bg-card" />
            <div className="h-60 animate-pulse rounded-3xl bg-card" />
          </div>
        ) : error || !species ? (
          <div className="rounded-3xl border border-dashed border-border bg-card p-8 text-center">
            <Fish size={32} className="mx-auto text-muted-foreground" />
            <p className="mt-3 text-sm font-semibold text-foreground">Espécie não encontrada</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="rounded-3xl border border-border bg-card p-5">
              <span className="flex size-16 items-center justify-center rounded-2xl bg-primary/10">
                <Fish size={34} className="text-primary" />
              </span>
              <h1 className="mt-3 font-heading text-2xl font-bold text-foreground">{species.name}</h1>
              {species.scientificName && (
                <p className="text-sm italic text-muted-foreground">{species.scientificName}</p>
              )}
              <div className="mt-4 flex gap-2">
                <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">
                  <Ruler size={13} />
                  {species.averageLength ? `${species.averageLength} cm` : "—"}
                </span>
                <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">
                  <Scale size={13} />
                  {species.averageWeight ? `${species.averageWeight} kg` : "—"}
                </span>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-5">
              <h2 className="mb-3 text-sm font-bold text-foreground">Informações de pesca</h2>
              <div className="space-y-4">
                <InfoRow icon={Waves} label="Habitat" value={species.habitat} />
                <InfoRow icon={Fish} label="Alimentação" value={species.feeding} />
                <InfoRow icon={Calendar} label="Melhor época" value={species.bestSeason} />
                <InfoRow icon={Clock3} label="Melhor maré" value={species.bestTide} />
                <InfoRow icon={Moon} label="Melhor lua" value={species.bestMoon} />
                <InfoRow icon={Worm} label="Melhor isca" value={species.bestBait} />
                {!species.habitat &&
                  !species.feeding &&
                  !species.bestSeason &&
                  !species.bestTide &&
                  !species.bestMoon &&
                  !species.bestBait && (
                    <p className="text-xs text-muted-foreground">
                      Sem informações detalhadas cadastradas para esta espécie.
                    </p>
                  )}
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-5">
              <h2 className="mb-3 text-sm font-bold text-foreground">
                Pesqueiros onde ocorre
                {species.spots.length > 0 && (
                  <span className="ml-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                    {species.spots.length}
                  </span>
                )}
              </h2>
              {species.spots.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  Nenhum pesqueiro vinculado a esta espécie ainda.
                </p>
              ) : (
                <div className="space-y-2">
                  {species.spots.map((spot) => (
                    <button
                      key={spot.id}
                      type="button"
                      onClick={() => router.push(`/map`)}
                      className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-3 text-left transition-colors hover:border-primary/40"
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <MapPin size={16} className="text-primary" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-foreground">{spot.name}</span>
                        <span className="block text-[11px] text-muted-foreground">
                          {spot.spotType ? spot.spotType.replaceAll("_", " ") : "Pesqueiro"}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
