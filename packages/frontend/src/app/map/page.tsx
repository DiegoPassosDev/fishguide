"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
import { getFishingSpot, getFishingSpots } from "@/lib/fishing-spots.api";
import { haversineKm, projectToMap } from "@/lib/map";
import type { FishingSpotDetail } from "@/types/fishing-spots";

const mockSpots: MapSpot[] = [
  { id: "evento-torneio-corvina", name: "Torneio de Corvina", category: "evento", x: 34, y: 60, distanceKm: 2.8, rating: 4.3, detail: "Competição com largada na marina. Sábado às 06h. Inscrições abertas." },
  { id: "amigo-carlos", name: "Carlos P.", category: "amigo", x: 46, y: 50, distanceKm: 0.9, detail: "Online agora. Pescou no Costão há 2 horas e pegou 3 corvinas." },
  { id: "rampa-centro", name: "Rampa do Centro", category: "rampa", x: 76, y: 52, distanceKm: 1.8, rating: 4.0, detail: "Rampa pública com estacionamento. Ideal para embarcações até 22 pés." },
  { id: "marina-baia-azul", name: "Marina Baía Azul", category: "marina", x: 84, y: 30, distanceKm: 4.6, rating: 4.4, detail: "Vagas para 120 embarcações, combustível e loja de conveniência." },
  { id: "loja-pesca-cia", name: "Pesca & Cia", category: "loja", x: 86, y: 62, distanceKm: 2.2, rating: 4.2, detail: "Varas, molinetes e iscas vivas. Abre domingo até 12h." },
];

const REFERENCE_POINT = { latitude: -11.12, longitude: -37.1 };

const ALL_CATEGORIES = new Set<MapCategory>(CATEGORY_ORDER);

export default function MapaPage() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Set<MapCategory>>(ALL_CATEGORIES);
  const [selectedId, setSelectedId] = useState<MapSpot["id"] | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<FishingSpotDetail | null>(null);
  const [apiSpots, setApiSpots] = useState<MapSpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [locating, setLocating] = useState(false);
  const [showMe, setShowMe] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getFishingSpots({ limit: 100 })
      .then((data) => {
        if (cancelled) return;
        const spots: MapSpot[] = data.items.map((spot) => {
          const { x, y } = projectToMap({ latitude: spot.latitude, longitude: spot.longitude });
          return {
            id: spot.id,
            name: spot.name,
            category: "pesqueiro" as const,
            x,
            y,
            distanceKm: Number(haversineKm({ latitude: spot.latitude, longitude: spot.longitude }, REFERENCE_POINT).toFixed(1)),
            rating: spot.rating,
            detail: spot.description ?? undefined,
          };
        });
        setApiSpots(spots);
      })
      .catch(() => {
        if (!cancelled) setApiSpots([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const spots = useMemo(() => [...mockSpots, ...apiSpots], [apiSpots]);

  const counts = useMemo(() => {
    const c = {} as Record<MapCategory, number>;
    for (const spot of spots) c[spot.category] = (c[spot.category] ?? 0) + 1;
    return c;
  }, [spots]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return spots.filter((s) => s.name.toLowerCase().includes(q)).slice(0, 6);
  }, [query, spots]);

  const visible = useMemo(() => spots.filter((s) => active.has(s.category)), [active, spots]);
  const selected = spots.find((s) => s.id === selectedId) ?? null;

  const apiSpotIds = useMemo(() => new Set(apiSpots.map((s) => s.id)), [apiSpots]);

  const loadDetail = useCallback(
    async (id: MapSpot["id"]) => {
      if (typeof id !== "string" || !apiSpotIds.has(id)) return;
      try {
        setSelectedDetail(await getFishingSpot(id));
      } catch {
        setSelectedDetail(null);
      }
    },
    [apiSpotIds]
  );

  function toggleCategory(category: MapCategory) {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  }

  function handleSelect(id: MapSpot["id"] | null) {
    setSelectedId(id);
    setSelectedDetail(null);
    setQuery("");
    if (id != null) loadDetail(id);
  }

  function handleSearchSelect(spot: MapSpot) {
    handleSelect(spot.id);
  }

  function handleLocate() {
    setLocating(true);
    setShowMe(true);
    setSelectedId(null);
    setSelectedDetail(null);
    window.setTimeout(() => setLocating(false), 1600);
  }

  return (
    <div className="relative mx-auto flex h-dvh w-full max-w-105 flex-col overflow-hidden bg-background">
      <Header />

      <main className="relative flex-1 overflow-hidden">
        <MapCanvas
          spots={spots}
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
            <SpotDetailCard spot={selected} detail={selectedDetail} loading={loading} onClose={() => handleSelect(null)} />
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
