"use client";

import { useState } from "react";
import {
  Camera,
  Droplets,
  Fish,
  Gauge,
  LocateFixed,
  MapPin,
  Pencil,
  Timer,
  Trash2,
  Waves,
  Wind,
  X,
} from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { MOON_EMOJI } from "./trip";
import type { ActiveTrip, Catch } from "./types";

interface ActiveTripViewProps {
  trip: ActiveTrip;
  elapsed: string;
  onAddCatch: () => void;
  onEditCatch: (id: string) => void;
  onDeleteCatch: (id: string) => void;
  onChangeLocation: (location: string) => void;
  onFinish: () => void;
}

const inputClass =
  "w-full rounded-xl border border-input bg-muted/50 px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary";

export function ActiveTripView({
  trip,
  elapsed,
  onAddCatch,
  onEditCatch,
  onDeleteCatch,
  onChangeLocation,
  onFinish,
}: ActiveTripViewProps) {
  const { showToast } = useToast();
  const [locationOpen, setLocationOpen] = useState(false);
  const [locationDraft, setLocationDraft] = useState(trip.location);
  const [locating, setLocating] = useState(false);

  const { snapshot } = trip;
  const weatherItems = [
    { icon: <Wind size={14} className="text-sky-400" />, label: "Vento", value: `${snapshot.wind} km/h` },
    { icon: <Gauge size={14} className="text-violet-400" />, label: "Pressão", value: `${snapshot.pressure} hPa` },
    { icon: <Droplets size={14} className="text-blue-400" />, label: "Umidade", value: `${snapshot.humidity}%` },
    { icon: <Waves size={14} className="text-cyan-400" />, label: "Maré", value: snapshot.tide },
  ];

  function locate() {
    if (!("geolocation" in navigator)) {
      showToast("Seu navegador não suporta localização.", "error");
      return;
    }
    if (!window.isSecureContext) {
      showToast("Localização só funciona em HTTPS ou localhost.", "error");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const fallback = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=18&accept-language=pt`,
          );
          const data = await res.json();
          const addr = data.address as Record<string, string> | undefined;
          const road = addr?.road ?? addr?.pedestrian ?? addr?.footway ?? addr?.square ?? addr?.path;
          const suburb = addr?.suburb;
          const city = addr?.city_district ?? addr?.city ?? addr?.town;
          const state = addr?.state;
          const addressText = [road, suburb, city, state].filter(Boolean).join(", ");
          setLocationDraft(addressText ? `${addressText} (${fallback})` : fallback);
        } catch {
          setLocationDraft(fallback);
        } finally {
          setLocating(false);
        }
      },
      () => {
        setLocating(false);
        showToast("Não foi possível obter sua localização agora.", "error");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 },
    );
  }

  function saveLocation() {
    const value = locationDraft.trim();
    if (!value) {
      showToast("Informe o local da pescaria.", "error");
      return;
    }
    onChangeLocation(value);
    setLocationOpen(false);
  }

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-3xl border border-primary/40 bg-card shadow-sm">
        <div className="bg-linear-to-br from-navy-mid to-navy-deep px-5 py-6 text-center">
          <div className="flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-widest text-teal-bright">
            <Timer size={14} className="animate-pulse" />
            Estou pescando
          </div>
          <div className="mt-2 font-mono text-4xl font-bold tabular-nums text-foreground">{elapsed}</div>
          <p className="mt-1 text-xs text-muted-foreground">
            Iniciada em {new Date(trip.startedAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setLocationDraft(trip.location);
            setLocationOpen(true);
          }}
          className="flex w-full items-center gap-2 px-5 py-3 text-left text-sm text-muted-foreground transition-colors hover:bg-muted/40"
        >
          <MapPin size={16} className="shrink-0 text-primary" />
          <span className="min-w-0 flex-1 truncate font-semibold text-foreground">
            {trip.location || "Definir local"}
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-wide text-primary">Alterar</span>
        </button>
      </div>

      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <span className="text-lg leading-none">🌤</span>
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Condições no início
          </h2>
        </div>
        <div className="mb-3 flex items-center gap-4">
          <span className="text-3xl font-bold text-foreground">{snapshot.temperature}°C</span>
          <span className="text-sm font-semibold text-card-foreground">{snapshot.condition}</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {weatherItems.map((item) => (
            <div key={item.label} className="flex items-center gap-2.5 rounded-xl bg-muted/40 px-3 py-2.5">
              {item.icon}
              <div>
                <div className="text-[11px] text-muted-foreground">{item.label}</div>
                <div className="text-sm font-bold text-card-foreground">{item.value}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2.5 rounded-xl bg-muted/40 px-3 py-2.5">
          <span className="text-lg leading-none">{snapshot.moonPhase ? (MOON_EMOJI[snapshot.moonPhase] ?? "🌙") : "🌙"}</span>
          <div>
            <div className="text-[11px] text-muted-foreground">Lua</div>
            <div className="text-sm font-bold text-card-foreground">{snapshot.moonPhase}</div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Fish size={16} className="text-primary" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Capturas
            </h2>
            {trip.catches.length > 0 && (
              <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-bold text-primary">
                {trip.catches.length}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onAddCatch}
            className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Camera size={13} />
            Registrar captura
          </button>
        </div>

        {trip.catches.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border bg-muted/20 p-5 text-center text-xs leading-relaxed text-muted-foreground">
            Nenhuma captura ainda.
            <br />
            Peixe na linha? Toque em &ldquo;Registrar captura&rdquo;.
          </p>
        ) : (
          <div className="space-y-2.5">
            {trip.catches.map((catchItem: Catch) => (
              <CatchRow
                key={catchItem.id}
                catchItem={catchItem}
                onEdit={() => onEditCatch(catchItem.id)}
                onDelete={() => onDeleteCatch(catchItem.id)}
              />
            ))}
          </div>
        )}
      </section>

      <button
        type="button"
        onClick={onFinish}
        className="flex w-full items-center justify-center gap-2 rounded-full border border-border bg-card py-3.5 text-sm font-bold text-foreground shadow-sm transition-colors hover:bg-destructive/10"
      >
        Finalizar pescaria
      </button>

      {locationOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center">
          <div className="w-full max-w-md rounded-t-3xl border border-border bg-background shadow-2xl sm:rounded-3xl">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="font-heading text-base font-bold text-foreground">Local da pescaria</h2>
              <button
                type="button"
                onClick={() => setLocationOpen(false)}
                className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
                aria-label="Fechar"
              >
                <X size={18} />
              </button>
            </div>
            <div className="px-5 py-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Local
                </span>
                <div className="relative">
                  <input
                    className={`${inputClass} pr-11`}
                    value={locationDraft}
                    onChange={(e) => setLocationDraft(e.target.value)}
                    placeholder="Ex.: Praia do Saco"
                  />
                  <button
                    type="button"
                    onClick={locate}
                    disabled={locating}
                    className="absolute right-1.5 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-primary disabled:opacity-50"
                    aria-label="Usar minha localização atual"
                    title="Usar minha localização atual"
                  >
                    <LocateFixed size={16} className={locating ? "animate-pulse text-primary" : ""} />
                  </button>
                </div>
              </label>
            </div>
            <div className="flex gap-3 border-t border-border px-5 py-4">
              <button
                type="button"
                onClick={() => setLocationOpen(false)}
                className="flex-1 rounded-full border border-border bg-background py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={saveLocation}
                className="flex-1 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CatchRow({
  catchItem,
  onEdit,
  onDelete,
}: {
  catchItem: Catch;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-muted/30 p-3">
      {catchItem.photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={catchItem.photoUrl}
          alt={`Foto de ${catchItem.species}`}
          className="size-12 shrink-0 rounded-xl object-cover"
        />
      ) : (
        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
          <Camera size={18} />
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-foreground">
          {catchItem.species || "Captura"}
          <span className="ml-1.5 font-normal text-muted-foreground">{catchItem.time}</span>
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {[catchItem.weight, catchItem.length].filter(Boolean).join(" · ") || "Sem medidas"}
        </p>
      </div>
      <button
        type="button"
        onClick={onEdit}
        className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label="Editar captura"
      >
        <Pencil size={14} />
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
        aria-label="Excluir captura"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}
