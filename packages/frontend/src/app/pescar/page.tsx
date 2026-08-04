"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { StartFishingCard } from "@/components/fishing/StartFishingCard";
import { ActiveTripView } from "@/components/fishing/ActiveTripView";
import { CatchModal } from "@/components/fishing/CatchModal";
import { FinishTripModal } from "@/components/fishing/FinishTripModal";
import { buildSnapshot, formatElapsed } from "@/components/fishing/trip";
import { useToast } from "@/contexts/ToastContext";
import type { ActiveTrip, Catch } from "@/components/fishing/types";

const ACTIVE_TRIP_KEY = "fishguide:active-trip";
const HISTORY_KEY = "fishguide:trips";

export default function PescarPage() {
  const { showToast } = useToast();
  const [trip, setTrip] = useState<ActiveTrip | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(ACTIVE_TRIP_KEY);
      return raw ? (JSON.parse(raw) as ActiveTrip) : null;
    } catch {
      return null;
    }
  });
  const [now, setNow] = useState(0);
  const [catchModal, setCatchModal] = useState<{ editing?: Catch } | null>(null);
  const [finishOpen, setFinishOpen] = useState(false);

  useEffect(() => {
    if (!trip) return;
    const tick = () => setNow(Date.now());
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [trip]);

  useEffect(() => {
    if (trip) {
      localStorage.setItem(ACTIVE_TRIP_KEY, JSON.stringify(trip));
    } else {
      localStorage.removeItem(ACTIVE_TRIP_KEY);
    }
  }, [trip]);

  const elapsed = trip ? formatElapsed(trip.startedAt, now) : "00:00";

  function startTrip() {
    setTrip({
      startedAt: Date.now(),
      location: "",
      catches: [],
      snapshot: buildSnapshot(),
    });
    showToast("Pescaria iniciada. Bom pesqueiro!", "success");
  }

  function addCatch(draft: {
    species: string;
    weight: string;
    length: string;
    notes: string;
    photoUrl?: string;
  }) {
    if (!trip) return;
    const item: Catch = {
      id: Date.now(),
      species: draft.species,
      weight: draft.weight,
      length: draft.length,
      notes: draft.notes,
      photoUrl: draft.photoUrl,
      time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    };
    setTrip({ ...trip, catches: [...trip.catches, item] });
    showToast("Captura registrada!", "success");
  }

  function editCatch(id: number, draft: {
    species: string;
    weight: string;
    length: string;
    notes: string;
    photoUrl?: string;
  }) {
    if (!trip) return;
    setTrip({
      ...trip,
      catches: trip.catches.map((c) => (c.id === id ? { ...c, ...draft } : c)),
    });
    showToast("Captura atualizada.", "success");
  }

  function deleteCatch(id: number) {
    if (!trip) return;
    setTrip({ ...trip, catches: trip.catches.filter((c) => c.id !== id) });
    showToast("Captura excluída.", "info");
  }

  function changeLocation(location: string) {
    if (!trip) return;
    setTrip({ ...trip, location });
    showToast("Local atualizado.", "success");
  }

  function finishTrip() {
    if (!trip) return;
    try {
      const history = JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]") as unknown[];
      history.push({ ...trip, finishedAt: Date.now() });
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch {
      // history storage is best-effort
    }
    setTrip(null);
    setFinishOpen(false);
    showToast("Pescaria finalizada e salva no diário!", "success");
  }

  return (
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
            onDeleteCatch={deleteCatch}
            onChangeLocation={changeLocation}
            onFinish={() => setFinishOpen(true)}
          />
        ) : (
          <StartFishingCard onStart={startTrip} />
        )}
      </main>

      <BottomNav />

      {catchModal && (
        <CatchModal
          editing={catchModal.editing}
          onClose={() => setCatchModal(null)}
          onSave={(draft) => {
            if (catchModal.editing) editCatch(catchModal.editing.id, draft);
            else addCatch(draft);
          }}
        />
      )}

      {finishOpen && trip && (
        <FinishTripModal
          trip={trip}
          elapsed={elapsed}
          onCancel={() => setFinishOpen(false)}
          onConfirm={finishTrip}
        />
      )}
    </div>
  );
}
