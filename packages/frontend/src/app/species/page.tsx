"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Fish, Search, X } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { getSpecies } from "@/lib/species.api";
import type { Species } from "@/types/species";

export default function SpeciesPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [species, setSpecies] = useState<Species[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getSpecies({ limit: 100 })
      .then((data) => {
        if (!cancelled) setSpecies(data.items);
      })
      .catch(() => {
        if (!cancelled) setSpecies([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const results = useMemo(() => {
    if (!species) return [];
    const q = query.trim().toLowerCase();
    if (!q) return species;
    return species.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.scientificName ?? "").toLowerCase().includes(q)
    );
  }, [query, species]);

  return (
    <div className="relative mx-auto flex h-dvh w-full max-w-105 flex-col overflow-hidden bg-background">
      <Header />

      <main className="flex-1 overflow-y-auto px-3 pt-2 pb-25">
        <div className="mb-3 px-1">
          <h1 className="font-heading text-xl font-bold text-foreground">Espécies</h1>
          <p className="text-xs text-muted-foreground">
            Catálogo de peixes com tamanho, época e iscas ideais
          </p>
        </div>

        <div className="relative mb-3">
          <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 shadow-sm">
            <Search size={16} className="text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nome ou nome científico..."
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            {query.length > 0 && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Limpar busca"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-3xl bg-card" />
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-card p-8 text-center">
            <Fish size={32} className="mx-auto text-muted-foreground" />
            <p className="mt-3 text-sm font-semibold text-foreground">
              {species && species.length === 0
                ? "Nenhuma espécie cadastrada"
                : "Nenhuma espécie encontrada"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Tente buscar por outro nome.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {results.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => router.push(`/species/${s.id}`)}
                className="flex w-full items-center gap-3 rounded-3xl border border-border bg-card p-3 text-left transition-colors hover:border-primary/40"
              >
                {s.photo ? (
                  <img
                    src={s.photo}
                    alt={s.name}
                    className="size-12 shrink-0 rounded-2xl bg-primary/10 object-contain"
                    loading="lazy"
                  />
                ) : (
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                    <Fish size={22} className="text-primary" />
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-foreground">
                    {s.name}
                  </span>
                  {s.scientificName && (
                    <span className="block truncate text-xs italic text-muted-foreground">
                      {s.scientificName}
                    </span>
                  )}
                  <span className="mt-0.5 block text-[11px] text-muted-foreground">
                    {[s.averageLength && `${s.averageLength} cm`, s.averageWeight && `${s.averageWeight} kg`]
                      .filter(Boolean)
                      .join(" · ") || s.habitat || "Sem detalhes"}
                  </span>
                </span>
              </button>
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
