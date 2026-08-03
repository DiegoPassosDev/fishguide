"use client";

import { CheckCircle2, Fish, MapPin, Timer, Waves, X } from "lucide-react";
import { MOON_EMOJI } from "./trip";
import type { ActiveTrip } from "./types";

interface FinishTripModalProps {
  trip: ActiveTrip;
  elapsed: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function FinishTripModal({ trip, elapsed, onCancel, onConfirm }: FinishTripModalProps) {
  const totalWeight = trip.catches
    .map((c) => {
      const match = c.weight.match(/^([\d,]+)/);
      return match ? parseFloat(match[1].replace(",", ".")) : 0;
    })
    .reduce((sum, n) => sum + n, 0);

  const weightText = totalWeight > 0 ? `${String(totalWeight).replace(".", ",")} kg` : "—";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-md overflow-hidden rounded-t-3xl border border-border bg-background shadow-2xl sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-heading text-base font-bold text-foreground">Finalizar pescaria</h2>
          <button
            type="button"
            onClick={onCancel}
            className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-4">
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2.5">
                <Timer size={16} className="text-primary" />
                <div>
                  <div className="text-[11px] text-muted-foreground">Duração</div>
                  <div className="text-sm font-bold text-foreground">{elapsed}</div>
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
                  <div className="text-sm font-bold text-foreground">{weightText}</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-base leading-none">{MOON_EMOJI[trip.snapshot.moonPhase] ?? "🌙"}</span>
                <div>
                  <div className="text-[11px] text-muted-foreground">Lua</div>
                  <div className="text-sm font-bold text-foreground">{trip.snapshot.moonPhase}</div>
                </div>
              </div>
            </div>

            {trip.location && (
              <div className="mt-3 flex items-center gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
                <MapPin size={14} className="shrink-0 text-primary" />
                <span className="truncate font-semibold text-foreground">{trip.location}</span>
              </div>
            )}
          </div>

          <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
            <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-teal-bright" />
            Clima, maré, lua, pressão e horário foram salvos automaticamente com esta pescaria.
          </p>
        </div>

        <div className="flex gap-3 border-t border-border px-5 py-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-full border border-border bg-background py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            Continuar pescando
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <CheckCircle2 size={16} />
            Finalizar
          </button>
        </div>
      </div>
    </div>
  );
}
