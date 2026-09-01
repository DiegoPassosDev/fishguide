"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { NotebookPen } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { DiaryStats } from "@/components/diary/DiaryStats";
import { TripCard } from "@/components/diary/TripCard";
import { TripDetailModal } from "@/components/diary/TripDetailModal";
import { useToast } from "@/contexts/ToastContext";
import type { TripRecord } from "@/components/diary/types";
import { getTrips, deleteTrip as apiDeleteTrip, updateTrip as apiUpdateTrip, mapTripRecord } from "@/lib/fishing-trips.api";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function DiaryPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [trips, setTrips] = useState<TripRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const apiTrips = await getTrips();
        if (mountedRef.current) setTrips(apiTrips.filter((t) => t.status === "finished").map(mapTripRecord));
      } catch {
        if (mountedRef.current) showToast("Erro ao carregar pescarias.", "error");
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    }
    void load();
  }, [showToast]);

  useEffect(() => {
    async function onFocus() {
      try {
        const apiTrips = await getTrips();
        if (mountedRef.current) setTrips(apiTrips.filter((t) => t.status === "finished").map(mapTripRecord));
      } catch {
        // silent on refocus
      }
    }
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const sorted = [...trips].sort((a, b) => b.startedAt - a.startedAt);
  const selected = trips.find((t) => t.id === selectedId) ?? null;

  async function handleDelete(id: string) {
    try {
      await apiDeleteTrip(id);
      setTrips((prev) => prev.filter((t) => t.id !== id));
      setSelectedId(null);
      showToast("Pescaria excluída.", "info");
    } catch {
      showToast("Erro ao excluir pescaria.", "error");
    }
  }

  async function handleSave(updated: TripRecord) {
    try {
      await apiUpdateTrip(updated.id, {
        notes: undefined,
        date: new Date(updated.startedAt).toISOString(),
      });
      setTrips((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      showToast("Pescaria atualizada.", "success");
    } catch {
      showToast("Erro ao atualizar pescaria.", "error");
    }
  }

  return (
    <ProtectedRoute>
      <div className="relative mx-auto flex h-dvh w-full max-w-105 flex-col overflow-hidden bg-background">
      <Header />

      <main className="flex-1 overflow-y-auto px-3 pt-2 pb-25">
        <div className="mb-3 px-1">
          <h1 className="font-heading text-xl font-bold text-foreground">Diário</h1>
          <p className="text-xs text-muted-foreground">
            Histórico e estatísticas das suas pescarias
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : (
          <>
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
          </>
        )}
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
    </ProtectedRoute>
  );
}
