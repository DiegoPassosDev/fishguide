"use client";

import { useState } from "react";
import {
  Camera,
  Droplets,
  Fish,
  Gauge,
  MapPin,
  Pencil,
  Timer,
  Trash2,
  Waves,
  Wind,
  X,
} from "lucide-react";
import { formatElapsed, MOON_EMOJI } from "../fishing/trip";
import { formatWeight, parseWeightKg } from "./trips";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
import type { Catch } from "../fishing/types";
import type { TripRecord } from "./types";

interface TripDetailModalProps {
  trip: TripRecord;
  onClose: () => void;
  onDelete: (id: string) => void;
  onSave: (updated: TripRecord) => void;
}

const inputClass =
  "w-full rounded-xl border border-input bg-muted/50 px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary";

function toLocalInput(ms: number): string {
  const d = new Date(ms);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function TripDetailModal({ trip, onClose, onDelete, onSave }: TripDetailModalProps) {
  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [locationDraft, setLocationDraft] = useState(trip.location);
  const [dateDraft, setDateDraft] = useState(toLocalInput(trip.startedAt));

  const totalWeight = trip.catches.reduce((s, c) => s + parseWeightKg(c.weight), 0);
  const duration = formatElapsed(trip.startedAt, trip.finishedAt ?? trip.startedAt);
  const { snapshot } = trip;

  const weatherItems = [
    { icon: <Wind size={14} className="text-sky-400" />, label: "Vento", value: `${snapshot.wind} km/h` },
    { icon: <Gauge size={14} className="text-violet-400" />, label: "Pressão", value: `${snapshot.pressure} hPa` },
    { icon: <Droplets size={14} className="text-blue-400" />, label: "Umidade", value: `${snapshot.humidity}%` },
    { icon: <Waves size={14} className="text-cyan-400" />, label: "Maré", value: snapshot.tide },
  ];

  function handleSave() {
    const startedAt = new Date(dateDraft).getTime();
    onSave({
      ...trip,
      location: locationDraft.trim(),
      startedAt: Number.isNaN(startedAt) ? trip.startedAt : startedAt,
    });
    setEditing(false);
    setConfirmingDelete(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center">
      <div className="flex max-h-[92dvh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl border border-border bg-background shadow-2xl sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-heading text-base font-bold text-foreground">Detalhes da pescaria</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {editing && (
            <div className="mb-4 flex flex-col gap-3 border-b border-border pb-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Local
                </span>
                <input
                  className={inputClass}
                  value={locationDraft}
                  onChange={(e) => setLocationDraft(e.target.value)}
                  placeholder="Ex.: Praia do Saco"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Data e hora de início
                </span>
                <input
                  type="datetime-local"
                  className={inputClass}
                  value={dateDraft}
                  onChange={(e) => setDateDraft(e.target.value)}
                />
              </label>
            </div>
          )}

          {trip.location && !editing && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-muted/40 px-3 py-2.5 text-sm">
              <MapPin size={14} className="shrink-0 text-primary" />
              <span className="truncate font-semibold text-foreground">{trip.location}</span>
            </div>
          )}

          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2.5">
                <Timer size={16} className="text-primary" />
                <div>
                  <div className="text-[11px] text-muted-foreground">Duração</div>
                  <div className="text-sm font-bold text-foreground">{duration}</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Fish size={16} className="text-primary" />
                <div>
                  <div className="text-[11px] text-muted-foreground">Capturas</div>
                  <div className="text-sm font-bold text-foreground">{trip.catches.length}</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Waves size={16} className="text-primary" />
                <div>
                  <div className="text-[11px] text-muted-foreground">Peso total</div>
                  <div className="text-sm font-bold text-foreground">{formatWeight(totalWeight)}</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-base leading-none">{snapshot.moonPhase ? (MOON_EMOJI[snapshot.moonPhase] ?? "🌙") : "🌙"}</span>
                <div>
                  <div className="text-[11px] text-muted-foreground">Lua</div>
                  <div className="text-sm font-bold text-foreground">{snapshot.moonPhase}</div>
                </div>
              </div>
            </div>
          </div>

          <section className="mt-4 rounded-2xl border border-border bg-card p-4">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-lg leading-none">🌤</span>
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Condições na pescaria
              </h3>
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
          </section>

          <section className="mt-4">
            <div className="mb-2.5 flex items-center gap-2">
              <Fish size={15} className="text-primary" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Capturas
              </h3>
              {trip.catches.length > 0 && (
                <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-bold text-primary">
                  {trip.catches.length}
                </span>
              )}
            </div>

            {trip.catches.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-border bg-muted/20 p-5 text-center text-xs text-muted-foreground">
                Nenhuma captura registrada.
              </p>
            ) : (
              <div className="space-y-2.5">
                {trip.catches.map((catchItem: Catch) => (
                  <CatchRow key={catchItem.id} catchItem={catchItem} />
                ))}
              </div>
            )}
          </section>
        </div>

        {confirmingDelete ? null : editing ? (
          <div className="flex gap-3 border-t border-border px-5 py-4">
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setLocationDraft(trip.location);
                setDateDraft(toLocalInput(trip.startedAt));
              }}
              className="flex-1 rounded-full border border-border bg-background py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Pencil size={15} />
              Salvar
            </button>
          </div>
        ) : (
          <div className="flex gap-3 border-t border-border px-5 py-4">
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="flex flex-1 items-center justify-center gap-2 rounded-full border border-border bg-background py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              <Pencil size={15} />
              Editar
            </button>
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              className="flex flex-1 items-center justify-center gap-2 rounded-full border border-destructive/40 bg-background py-3 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10"
            >
              <Trash2 size={15} />
              Excluir
            </button>
          </div>
        )}
      </div>

      {confirmingDelete && (
        <ConfirmDeleteModal
          title="Excluir pescaria?"
          message="Esta ação não pode ser desfeita. A pescaria e suas capturas serão removidas permanentemente."
          onCancel={() => setConfirmingDelete(false)}
          onConfirm={() => onDelete(trip.id)}
        />
      )}
    </div>
  );
}

function CatchRow({ catchItem }: { catchItem: Catch }) {
  return (
    <div className="rounded-2xl border border-border bg-muted/30 p-3">
      <div className="flex items-center gap-3">
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
      </div>
      {catchItem.notes && (
        <p className="mt-2 border-t border-border pt-2 text-xs leading-relaxed text-muted-foreground">
          {catchItem.notes}
        </p>
      )}
    </div>
  );
}
