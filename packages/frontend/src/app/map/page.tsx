"use client";

import { useMemo, useState } from "react";
import { LocateFixed } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { MapCanvas } from "@/components/map/MapCanvas";
import { MapSearchBar } from "@/components/map/MapSearchBar";
import { MapFilters } from "@/components/map/MapFilters";
import { NearbySpotsSheet } from "@/components/map/NearbySpotsSheet";
import { SpotDetailCard } from "@/components/map/SpotDetailCard";
import { CATEGORY_ORDER } from "@/components/map/categories";
import type { MapCategory, MapSpot } from "@/components/map/types";

const mockSpots: MapSpot[] = [
  { id: 1, name: "Praia do Saco", category: "pesqueiro", x: 38, y: 22, distanceKm: 1.2, rating: 4.8, detail: "Fundo de areia com bancos de camarão. Boa para robalo na maré enchendo." },
  { id: 2, name: "Costão da Ilha", category: "pesqueiro", x: 26, y: 42, distanceKm: 3.4, rating: 4.6, detail: "Pesqueiro de pedra ao largo da ilha. Corvina e garoupa em profundidade." },
  { id: 3, name: "Torneio de Corvina", category: "evento", x: 34, y: 60, distanceKm: 2.8, rating: 4.3, detail: "Competição com largada na marina. Sábado às 06h. Inscrições abertas." },
  { id: 4, name: "Carlos P.", category: "amigo", x: 46, y: 50, distanceKm: 0.9, detail: "Online agora. Pescou no Costão há 2 horas e pegou 3 corvinas." },
  { id: 5, name: "Rampa do Centro", category: "rampa", x: 76, y: 52, distanceKm: 1.8, rating: 4.0, detail: "Rampa pública com estacionamento. Ideal para embarcações até 22 pés." },
  { id: 6, name: "Marina Baía Azul", category: "marina", x: 84, y: 30, distanceKm: 4.6, rating: 4.4, detail: "Vagas para 120 embarcações, combustível e loja de conveniência." },
  { id: 7, name: "Pesca & Cia", category: "loja", x: 86, y: 62, distanceKm: 2.2, rating: 4.2, detail: "Varas, molinetes e iscas vivas. Abre domingo até 12h." },
  { id: 8, name: "Pontal Sul", category: "pesqueiro", x: 45, y: 82, distanceKm: 6.1, rating: 4.9, detail: "Pesqueiro clássico do sul. Tainha na primavera e robalo o ano todo." },
];

const ALL_CATEGORIES = new Set<MapCategory>(CATEGORY_ORDER);

export default function MapaPage() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Set<MapCategory>>(ALL_CATEGORIES);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [locating, setLocating] = useState(false);
  const [showMe, setShowMe] = useState(false);

  const counts = useMemo(() => {
    const c = {} as Record<MapCategory, number>;
    for (const spot of mockSpots) c[spot.category] = (c[spot.category] ?? 0) + 1;
    return c;
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return mockSpots.filter((s) => s.name.toLowerCase().includes(q)).slice(0, 6);
  }, [query]);

  const visible = useMemo(() => mockSpots.filter((s) => active.has(s.category)), [active]);
  const selected = mockSpots.find((s) => s.id === selectedId) ?? null;

  function toggleCategory(category: MapCategory) {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  }

  function handleSelect(id: number | null) {
    setSelectedId(id);
    setQuery("");
  }

  function handleSearchSelect(spot: MapSpot) {
    setSelectedId(spot.id);
    setQuery("");
  }

  function handleLocate() {
    setLocating(true);
    setShowMe(true);
    setSelectedId(null);
    window.setTimeout(() => setLocating(false), 1600);
  }

  return (
    <div className="relative mx-auto flex h-dvh w-full max-w-105 flex-col overflow-hidden bg-background">
      <Header />

      <main className="relative flex-1 overflow-hidden">
        <MapCanvas
          spots={mockSpots}
          selectedId={selectedId}
          activeCategories={active}
          locating={locating}
          showMe={showMe}
          onSelect={handleSelect}
        />

        <div className="absolute inset-x-0 top-0 z-20 space-y-2 p-3">
          <MapSearchBar query={query} results={results} onQueryChange={setQuery} onSelect={handleSearchSelect} />
          <MapFilters active={active} counts={counts} onToggle={toggleCategory} />
        </div>

        {selected && (
          <div className="absolute inset-x-3 bottom-21 z-20">
            <SpotDetailCard spot={selected} onClose={() => handleSelect(null)} />
          </div>
        )}

        {!selected && (
          <button
            type="button"
            onClick={handleLocate}
            className="absolute right-3 bottom-21 z-20 flex size-11 items-center justify-center rounded-full border border-border bg-card text-primary shadow-xl transition-transform hover:scale-105"
            aria-label="Minha localização"
          >
            <LocateFixed size={18} />
          </button>
        )}

        <div className="absolute inset-x-0 bottom-0 z-20">
          <NearbySpotsSheet spots={visible} selectedId={selectedId} onSelect={handleSelect} />
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
