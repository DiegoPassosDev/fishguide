"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { NotebookPen } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { DiaryStats } from "@/components/diary/DiaryStats";
import { TripCard } from "@/components/diary/TripCard";
import { TripDetailModal } from "@/components/diary/TripDetailModal";
import { loadTrips, saveTrips } from "@/components/diary/trips";
import { useToast } from "@/contexts/ToastContext";
import type { TripRecord } from "@/components/diary/types";

export default function DiaryPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [trips, setTrips] = useState<TripRecord[]>(() => loadTrips());
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    const onFocus = () => setTrips(loadTrips());
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const sorted = [...trips].sort((a, b) => b.startedAt - a.startedAt);
  const selected = trips.find((t) => t.id === selectedId) ?? null;

  function handleDelete(id: number) {
    const next = trips.filter((t) => t.id !== id);
    setTrips(next);
    saveTrips(next);
    setSelectedId(null);
    showToast("Pescaria excluída.", "info");
  }

  function handleSave(updated: TripRecord) {
    const next = trips.map((t) => (t.id === updated.id ? updated : t));
    setTrips(next);
    saveTrips(next);
    showToast("Pescaria atualizada.", "success");
  }

  return (
    <div className="relative mx-auto flex h-dvh w-full max-w-105 flex-col overflow-hidden bg-background">
      <Header />

      <main className="flex-1 overflow-y-auto px-3 pt-2 pb-25">
        <div className="mb-3 px-1">
          <h1 className="font-heading text-xl font-bold text-foreground">Diário</h1>
          <p className="text-xs text-muted-foreground">
            Histórico e estatísticas das suas pescarias
          </p>
        </div>

        {trips.length > 0 && <DiaryStats trips={trips} />}

        <div className="mt-3 space-y-3">
          {sorted.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border bg-card p-8 text-center">
              <NotebookPen size={32} className="mx-auto text-muted-foreground" />
              <p className="mt-3 text-sm font-semibold text-foreground">Nenhuma pescaria ainda</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Finalize uma pescaria em &ldquo;Pescar&rdquo; e ela aparecerá aqui.
              </p>
              <button
                type="button"
                onClick={() => router.push("/pescar")}
                className="mt-4 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Iniciar pescaria
              </button>
            </div>
          ) : (
            sorted.map((trip) => (
              <TripCard key={trip.id} trip={trip} onOpen={() => setSelectedId(trip.id)} />
            ))
          )}
        </div>
      </main>

      <BottomNav />

      {selected && (
        <TripDetailModal
          trip={selected}
          onClose={() => setSelectedId(null)}
          onDelete={handleDelete}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
