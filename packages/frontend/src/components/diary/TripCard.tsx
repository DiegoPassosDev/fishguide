"use client";

import {
  CalendarDays,
  ChevronRight,
  Clock,
  MapPin,
  Thermometer,
  Timer,
  Waves,
  Wind,
} from "lucide-react";
import { MOON_EMOJI } from "../fishing/trip";
import { formatWeight, parseWeightKg } from "./trips";
import type { TripRecord } from "./types";

interface TripCardProps {
  trip: TripRecord;
  onOpen: () => void;
}

export function TripCard({ trip, onOpen }: TripCardProps) {
  const date = new Date(trip.startedAt);
  const endDate = trip.finishedAt ? new Date(trip.finishedAt) : null;
  const duration = formatMinutes(trip.startedAt, trip.finishedAt ?? trip.startedAt);
  const totalWeight = trip.catches.reduce((s, c) => s + parseWeightKg(c.weight), 0);
  const species = Array.from(new Set(trip.catches.map((c) => c.species)));

  const dateText = date.toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const startTime = date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endTime = endDate
    ? endDate.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full rounded-3xl border border-border bg-card p-4 text-left shadow-sm transition-colors hover:border-primary/40"
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          <CalendarDays size={13} className="text-primary" />
          {dateText}
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 font-mono text-xs font-bold text-primary">
          <Timer size={12} />
          {duration}
        </span>
      </div>

      <div className="mb-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Clock size={12} className="text-primary" />
          Início: <span className="font-mono font-semibold text-foreground">{startTime}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <Clock size={12} className="text-primary" />
          Fim:{" "}
          <span className="font-mono font-semibold text-foreground">{endTime ?? "—"}</span>
        </span>
      </div>

      <div className="flex items-center gap-2 text-sm font-bold text-foreground">
        <MapPin size={15} className="shrink-0 text-primary" />
        <span className="truncate">{trip.location || "Local não informado"}</span>
      </div>

      <div className="mt-2.5 flex items-center gap-2">
        {species.length > 0 ? (
          <>
            <span className="shrink-0 rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-bold text-primary">
              {trip.catches.length} {trip.catches.length === 1 ? "captura" : "capturas"}
            </span>
            <span className="truncate text-xs font-semibold text-card-foreground">
              {species.slice(0, 3).join(" · ")}
              {species.length > 3 ? "…" : ""}
            </span>
          </>
        ) : (
          <span className="text-xs text-muted-foreground">Sem capturas</span>
        )}
        {totalWeight > 0 && (
          <span className="ml-auto shrink-0 text-xs font-bold text-foreground">
            {formatWeight(totalWeight)}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center gap-3 border-t border-border pt-3 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <Thermometer size={12} className="text-orange-400" />
          {trip.snapshot.temperature}°C
        </span>
        <span className="flex items-center gap-1">
          <Waves size={12} className="text-cyan-400" />
          {trip.snapshot.tide}
        </span>
        <span className="flex items-center gap-1">
          <Wind size={12} className="text-sky-400" />
          {trip.snapshot.wind} km/h
        </span>
        <span className="ml-auto flex items-center gap-1.5 text-muted-foreground">
          {trip.snapshot.moonPhase ? (MOON_EMOJI[trip.snapshot.moonPhase] ?? "🌙") : "🌙"}
          <ChevronRight size={14} />
        </span>
      </div>
    </button>
  );
}

function formatMinutes(startedAt: number, endAt: number): string {
  const startMin = Math.floor(startedAt / 60000);
  const endMin = Math.floor(endAt / 60000);
  const total = Math.max(0, endMin - startMin);
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}`;
}
