"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { StartFishingCard } from "@/components/fishing/StartFishingCard";
import { ActiveTripView } from "@/components/fishing/ActiveTripView";
import { CatchModal } from "@/components/fishing/CatchModal";
import { FinishTripModal } from "@/components/fishing/FinishTripModal";
import { formatElapsed } from "@/components/fishing/trip";
import { useToast } from "@/contexts/ToastContext";
import type { ActiveTrip, Catch } from "@/components/fishing/types";
import {
  startTrip as apiStartTrip,
  addCatch as apiAddCatch,
  updateCatch as apiUpdateCatch,
  deleteCatch as apiDeleteCatch,
  getTrips,
  updateTrip as apiUpdateTrip,
  finishTrip as apiFinishTrip,
  mapTrip,
} from "@/lib/fishing-trips.api";

export default function PescarPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [trip, setTrip] = useState<ActiveTrip | null>(null);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(0);
  const [catchModal, setCatchModal] = useState<{ editing?: Catch } | null>(null);
  const [finishOpen, setFinishOpen] = useState(false);

  useEffect(() => {
    async function loadActiveTrip() {
      try {
        const trips = await getTrips();
        const active = trips.find((t) => t.status === "active");
        if (active) {
          setTrip(mapTrip(active));
        }
      } catch {
        // offline or error — start without active trip
      } finally {
        setLoading(false);
      }
    }
    void loadActiveTrip();
  }, []);

  useEffect(() => {
    if (!trip) return;
    const tick = () => setNow(Date.now());
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [trip]);

  const elapsed = trip ? formatElapsed(trip.startedAt, now) : "00:00";

  const [starting, setStarting] = useState(false);

  const startTripHandler = useCallback(async () => {
    if (starting) return;
    setStarting(true);
    try {
      const apiTrip = await apiStartTrip();
      setTrip(mapTrip(apiTrip));
      showToast("Pescaria iniciada. Bom pesqueiro!", "success");
    } catch {
      showToast("Erro ao iniciar pescaria.", "error");
    } finally {
      setStarting(false);
    }
  }, [starting, showToast]);

  const addCatchHandler = useCallback(
    async (draft: {
      species: string;
      speciesId: string;
      weight: string;
      length: string;
      notes: string;
      photoUrl?: string;
    }) => {
      if (!trip) return;
      try {
        const weightNum = draft.weight
          ? parseFloat(draft.weight.replace(",", "."))
          : undefined;
        const lengthNum = draft.length
          ? parseFloat(draft.length.replace(" cm", "").replace(",", "."))
          : undefined;

        const apiCatch = await apiAddCatch(trip.id, {
          speciesId: draft.speciesId,
          weight: isNaN(weightNum as number) ? undefined : weightNum,
          length: isNaN(lengthNum as number) ? undefined : lengthNum,
          notes: draft.notes || undefined,
          photo: draft.photoUrl,
        });

        const newCatch: Catch = {
          id: apiCatch.id,
          species: draft.species,
          speciesId: draft.speciesId,
          weight: draft.weight,
          length: draft.length,
          notes: draft.notes || undefined,
          photoUrl: draft.photoUrl,
          time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        };

        setTrip({ ...trip, catches: [...trip.catches, newCatch] });
        showToast("Captura registrada!", "success");
      } catch {
        showToast("Erro ao registrar captura.", "error");
      }
    },
    [trip, showToast],
  );

  const editCatchHandler = useCallback(
    async (
      id: string,
      draft: {
        species: string;
        speciesId: string;
        weight: string;
        length: string;
        notes: string;
        photoUrl?: string;
      },
    ) => {
      if (!trip) return;
      try {
        const weightNum = draft.weight
          ? parseFloat(draft.weight.replace(",", "."))
          : undefined;
        const lengthNum = draft.length
          ? parseFloat(draft.length.replace(" cm", "").replace(",", "."))
          : undefined;

        await apiUpdateCatch(id, {
          speciesId: draft.speciesId,
          weight: isNaN(weightNum as number) ? undefined : weightNum,
          length: isNaN(lengthNum as number) ? undefined : lengthNum,
          notes: draft.notes || undefined,
          photo: draft.photoUrl,
        });

        setTrip({
          ...trip,
          catches: trip.catches.map((c) =>
            c.id === id
              ? {
                  ...c,
                  species: draft.species,
                  speciesId: draft.speciesId,
                  weight: draft.weight,
                  length: draft.length,
                  notes: draft.notes,
                  photoUrl: draft.photoUrl,
                }
              : c,
          ),
        });
        showToast("Captura atualizada.", "success");
      } catch {
        showToast("Erro ao atualizar captura.", "error");
      }
    },
    [trip, showToast],
  );

  const deleteCatchHandler = useCallback(
    async (id: string) => {
      if (!trip) return;
      try {
        await apiDeleteCatch(id);
        setTrip({ ...trip, catches: trip.catches.filter((c) => c.id !== id) });
        showToast("Captura excluída.", "info");
      } catch {
        showToast("Erro ao excluir captura.", "error");
      }
    },
    [trip, showToast],
  );

  const changeLocation = useCallback(
    async (location: string) => {
      if (!trip) return;
      try {
        await apiUpdateTrip(trip.id, { location });
        setTrip({ ...trip, location });
        showToast("Local atualizado.", "success");
      } catch {
        showToast("Erro ao atualizar o local.", "error");
      }
    },
    [trip, showToast],
  );

  const [finishing, setFinishing] = useState(false);

  const finishTripHandler = useCallback(async () => {
    if (!trip || finishing) return;
    setFinishing(true);
    try {
      await apiFinishTrip(trip.id);
      setTrip(null);
      setFinishOpen(false);
      showToast("Pescaria finalizada e salva no diário!", "success");
      router.push("/diary");
    } catch {
      showToast("Erro ao finalizar pescaria.", "error");
      setFinishOpen(false);
    } finally {
      setFinishing(false);
    }
  }, [trip, finishing, showToast, router]);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="relative mx-auto flex h-dvh w-full max-w-105 flex-col overflow-hidden bg-background">
          <Header />
          <main className="flex-1 overflow-y-auto px-3 pt-2 pb-25">
            <div className="flex items-center justify-center py-20">
              <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          </main>
          <BottomNav />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="relative mx-auto flex h-dvh w-full max-w-105 flex-col overflow-hidden bg-background">
        <Header />

        <main className="flex-1 overflow-y-auto px-3 pt-2 pb-25">
          <div className="mb-3 px-1">
            <h1 className="font-heading text-xl font-bold text-foreground">Pescar</h1>
            <p className="text-xs text-muted-foreground">
              Registre a pescaria e as capturas em tempo real
            </p>
          </div>

          {trip ? (
            <ActiveTripView
              trip={trip}
              elapsed={elapsed}
              onAddCatch={() => setCatchModal({})}
              onEditCatch={(id) => {
                const item = trip.catches.find((c) => c.id === id);
                if (item) setCatchModal({ editing: item });
              }}
              onDeleteCatch={deleteCatchHandler}
              onChangeLocation={changeLocation}
              onFinish={() => setFinishOpen(true)}
            />
          ) : (
            <StartFishingCard onStart={startTripHandler} starting={starting} />
          )}
        </main>

        <BottomNav />

        {catchModal && (
          <CatchModal
            editing={catchModal.editing}
            onClose={() => setCatchModal(null)}
            onSave={(draft) => {
              if (catchModal.editing) editCatchHandler(catchModal.editing.id, draft);
              else addCatchHandler(draft);
            }}
          />
        )}

        {finishOpen && trip && (
          <FinishTripModal
            trip={trip}
            elapsed={elapsed}
            finishing={finishing}
            onCancel={() => setFinishOpen(false)}
            onConfirm={finishTripHandler}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
