"use client";

import { Waves } from "lucide-react";
import type { TideData, TideEvent } from "@/lib/tide.api";
import { CardError } from "./CardError";

interface GraphPoint {
  x: number;
  y: number;
  time: string;
  height: string;
  type: "alta" | "baixa";
}

const VB_W = 290;
const VB_H = 130;
const HIGH_Y = 30;
const LOW_Y = 105;
const X_POSITIONS = [35, 145, 255];
const HALF_CYCLE_MINUTES = 372;

function toMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function shiftTime(time: string, deltaMinutes: number) {
  const total = (toMinutes(time) + deltaMinutes + 1440) % 1440;
  const h = String(Math.floor(total / 60)).padStart(2, "0");
  const m = String(total % 60).padStart(2, "0");
  return `${h}:${m}`;
}

function meanHeight(events: TideEvent[], type: "alta" | "baixa") {
  const values = events.filter((e) => e.type === type).map((e) => Number(e.height));
  if (values.length === 0) return "1.00";
  return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2);
}

function synthOpposite(base: TideEvent, events: TideEvent[], offset: number): TideEvent {
  return {
    time: shiftTime(base.time, offset),
    height: meanHeight(events, base.type === "alta" ? "baixa" : "alta"),
    type: base.type === "alta" ? "baixa" : "alta",
  };
}

function cubicAt(a: GraphPoint, b: GraphPoint, t: number) {
  const dx = (b.x - a.x) * 0.4;
  const c1x = a.x + dx;
  const c1y = a.y;
  const c2x = b.x - dx;
  const c2y = b.y;
  const u = 1 - t;
  const bez = (p0: number, p1: number, p2: number, p3: number) =>
    p0 * u * u * u + 3 * p1 * u * u * t + 3 * p2 * u * t * t + p3 * t * t * t;
  return {
    x: bez(a.x, c1x, c2x, b.x),
    y: bez(a.y, c1y, c2y, b.y),
  };
}

function TideSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-3 h-9 rounded-xl bg-muted/40" />
      <div className="mb-2 h-[130px] rounded-xl bg-muted/40" />
      <div className="mt-4 grid grid-cols-3 gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="aspect-square rounded-xl bg-muted/40" />
        ))}
      </div>
    </div>
  );
}

interface TideCardProps {
  data: TideData | null;
  error?: boolean;
  onRetry?: () => void;
}

export function TideCard({ data, error, onRetry }: TideCardProps) {
  return (
    <section className="mb-3 rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Waves size={16} className="text-blue-500" />
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Maré
        </h2>
      </div>

      {error && !data ? (
        <CardError onRetry={onRetry} />
      ) : !data ? (
        <TideSkeleton />
      ) : (
        <TideContent data={data} />
      )}
    </section>
  );
}

function TideContent({ data }: { data: TideData }) {
  const nowInMinutes = new Date().getHours() * 60 + new Date().getMinutes();
  const events = data.events;
  const canGraph = events.length >= 2;
  const nextIdx = canGraph
    ? events.findIndex((e) => toMinutes(e.time) > nowInMinutes)
    : -2;

  let prev: TideEvent | undefined;
  let next: TideEvent | undefined;
  let after: TideEvent | undefined;

  if (canGraph) {
    if (nextIdx === -1) {
      prev = events[events.length - 1];
      next = synthOpposite(prev, events, HALF_CYCLE_MINUTES);
      after = synthOpposite(next, events, HALF_CYCLE_MINUTES);
    } else if (nextIdx === 0) {
      next = events[0];
      after = events[1];
      prev = synthOpposite(next, events, -HALF_CYCLE_MINUTES);
    } else {
      prev = events[nextIdx - 1];
      next = events[nextIdx];
      after = events[nextIdx + 1] ?? synthOpposite(next, events, HALF_CYCLE_MINUTES);
    }
  }

  const showingForecastWindow =
    canGraph && nextIdx === -1 && !!prev && !!next && !!after;
  const rowEvents: TideEvent[] = showingForecastWindow
    ? [prev as TideEvent, next as TideEvent, after as TideEvent]
    : events;

  let points: GraphPoint[] = [];
  let curve = "";
  if (prev && next && after) {
    const ys = [prev, next, after].map((e) => (e.type === "alta" ? HIGH_Y : LOW_Y));
    points = [prev, next, after].map((e, i) => ({
      x: X_POSITIONS[i],
      y: ys[i],
      time: e.time,
      height: Number(e.height).toFixed(2),
      type: e.type,
    }));
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const dx = (points[i].x - points[i - 1].x) * 0.4;
      d += ` C ${points[i - 1].x + dx} ${points[i - 1].y}, ${points[i].x - dx} ${points[i].y}, ${points[i].x} ${points[i].y}`;
    }
    curve = d;
  }

  let now: { x: number; y: number } | null = null;
  if (points.length === 3) {
    const t = Math.min(1, Math.max(0, data.agoraProgresso / 100));
    now = cubicAt(points[0], points[1], t);
  }

  return (
    <>
      <div className="mb-3 flex items-center justify-between rounded-xl bg-muted/40 px-3 py-2 text-xs">
        {rowEvents.map((event, i) => {
          const isHigh = event.type === "alta";
          const forecast = showingForecastWindow && i > 0;
          const isPast = !forecast && toMinutes(event.time) <= nowInMinutes;
          return (
            <div key={`${event.time}-${i}`} className={`text-center ${isPast ? "opacity-40" : ""}`}>
              <div className={isHigh ? "text-blue-500" : "text-muted-foreground"}>
                {isHigh ? "▲" : "▼"}{" "}
                <span className="font-bold">
                  {forecast ? "~" : ""}
                  {event.time}
                </span>
              </div>
              <div className="text-card-foreground">{event.height}m</div>
            </div>
          );
        })}
      </div>

      <div className="relative">
        {canGraph && (
          <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="w-full">
            <defs>
              <linearGradient id="tideGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>

            <path
              d={curve}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="opacity-20"
            />

            <path
              d={curve}
              fill="none"
              stroke="url(#tideGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {points.map((p, i) => {
              const isHigh = p.type === "alta";
              const isPast = i === 0;
              return (
                <g key={`${p.time}-${i}`} className={isPast ? "opacity-40" : ""}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={3}
                    fill={isHigh ? "#06b6d4" : "#64748b"}
                  />
                  <text
                    x={p.x}
                    y={isHigh ? p.y - 9 : p.y + 15}
                    textAnchor="middle"
                    className={
                      isHigh
                        ? "fill-blue-500 text-[9px] font-bold"
                        : "fill-muted-foreground text-[9px]"
                    }
                  >
                    {isHigh ? "▲" : "▼"} {p.height.replace(".", ",")}m
                  </text>
                </g>
              );
            })}

            {now && (
              <circle
                cx={now.x}
                cy={now.y}
                r={4}
                fill="#3b82f6"
                stroke="#fff"
                strokeWidth="1.5"
              />
            )}
          </svg>
        )}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="flex aspect-square flex-col items-center rounded-xl bg-muted/40 px-3 py-3">
          <div className="text-center text-[11px] text-muted-foreground">Amplitude</div>
          <div className="flex flex-1 items-center text-center text-sm font-bold text-card-foreground">
            {data.amplitude}m
          </div>
        </div>
        <div className="flex aspect-square flex-col items-center rounded-xl bg-muted/40 px-3 py-3">
          <div className="text-center text-[11px] text-muted-foreground">Agora</div>
          <div className="flex flex-1 items-center text-center text-sm font-bold text-blue-500">
            🌊 {data.agoraStatus} {data.agoraProgresso}%
          </div>
        </div>
        <div className="flex aspect-square flex-col items-center rounded-xl bg-muted/40 px-3 py-3">
          <div className="text-center text-[11px] text-muted-foreground">Próxima</div>
          <div className="flex flex-1 items-center text-center text-sm font-bold text-card-foreground">
            {data.proximaMudanca} em {data.proximaEm}
          </div>
        </div>
      </div>
    </>
  );
}
