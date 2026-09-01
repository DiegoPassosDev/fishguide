"use client";

import { FishingRod, MapPin } from "lucide-react";

interface StartFishingCardProps {
  onStart: () => void;
  starting?: boolean;
}

export function StartFishingCard({ onStart, starting }: StartFishingCardProps) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 text-center shadow-sm">
      <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary/15">
        <FishingRod size={30} className="text-primary" />
      </div>
      <h2 className="font-heading text-lg font-bold text-foreground">Estou Pescando</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Ao iniciar, o FishGuide registra automaticamente clima, maré, lua, pressão e o
        horário. Você só precisa lançar a linha e registrar as capturas.
      </p>

      <button
        type="button"
        onClick={onStart}
        disabled={starting}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-lg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {starting ? (
          <span className="size-4 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground" />
        ) : (
          <FishingRod size={18} />
        )}
        {starting ? "Iniciando..." : "Iniciar pescaria"}
      </button>

      <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
        <MapPin size={12} />
        O local pode ser definido após o início
      </p>
    </div>
  );
}
