"use client";

import { Navigation } from "lucide-react";
import { MapMarker } from "./MapMarker";
import type { MapCategory, MapSpot } from "./types";

interface MapCanvasProps {
  spots: MapSpot[];
  selectedId: number | null;
  activeCategories: Set<MapCategory>;
  locating: boolean;
  showMe: boolean;
  onSelect: (id: number | null) => void;
}

export function MapCanvas({ spots, selectedId, activeCategories, locating, showMe, onSelect }: MapCanvasProps) {
  const visible = spots.filter((s) => activeCategories.has(s.category));

  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg viewBox="0 0 360 620" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
        <defs>
          <linearGradient id="waterGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0a2e4a" />
            <stop offset="55%" stopColor="#0d4152" />
            <stop offset="100%" stopColor="#0f5a58" />
          </linearGradient>
        </defs>

        <rect width="360" height="620" fill="url(#waterGrad)" />

        <g stroke="#eaf6f6" strokeWidth="1" opacity="0.04">
          <path d="M 60 0 L 60 620 M 120 0 L 120 620 M 180 0 L 180 620 M 240 0 L 240 620 M 300 0 L 300 620" />
          <path d="M 0 100 L 360 100 M 0 200 L 360 200 M 0 300 L 360 300 M 0 400 L 360 400 M 0 500 L 360 500" />
        </g>

        <g stroke="#17576b" strokeWidth="2" strokeDasharray="7 8" fill="none" opacity="0.55">
          <path d="M -10 80 C 90 110 125 185 112 265 C 100 345 130 430 205 485 C 265 530 330 570 380 610" />
          <path d="M -10 165 C 55 205 80 290 68 370 C 56 450 95 520 155 565 C 215 610 300 640 380 670" />
          <path d="M -10 250 C 20 300 40 395 30 475 C 20 555 60 620 115 650" />
        </g>

        <path d="M 90 210 C 130 200 152 238 138 268 C 122 302 78 292 70 258 C 64 232 72 216 90 210 Z" fill="#1f3a33" />
        <path d="M 152 460 C 187 452 207 482 196 512 C 183 544 148 540 140 510 C 134 486 140 468 152 460 Z" fill="#1f3a33" />
        <path d="M 80 228 C 100 224 112 240 108 256 C 102 272 84 268 80 254 C 78 244 78 234 80 228 Z" fill="#2f6658" opacity="0.6" />
        <path d="M 146 478 C 164 474 176 488 172 502 C 166 516 152 512 148 500 C 146 492 146 484 146 478 Z" fill="#2f6658" opacity="0.6" />

        <path
          d="M 360 0 C 300 20 280 80 290 140 C 300 200 280 260 265 320 C 250 380 260 440 285 500 C 305 550 330 590 360 620 L 360 0 Z"
          fill="#20413a"
        />
        <path
          d="M 360 0 C 300 20 280 80 290 140 C 300 200 280 260 265 320 C 250 380 260 440 285 500 C 305 550 330 590 360 620"
          stroke="#2f6658"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          opacity="0.75"
        />

        <path
          d="M 330 88 C 318 128 300 158 292 200 C 284 244 300 282 296 322 C 292 362 310 402 320 432"
          stroke="#14505c"
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
          opacity="0.8"
        />

        <g stroke="#7f9aa0" strokeWidth="2.5" strokeDasharray="2 6" strokeLinecap="round" fill="none" opacity="0.5">
          <path d="M 288 250 C 315 275 335 330 352 372" />
          <path d="M 300 150 L 318 205 L 308 252" />
          <path d="M 268 340 C 300 360 330 410 350 450" />
        </g>
      </svg>

      {visible.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-2xl border border-border bg-card px-4 py-3 text-center shadow-lg">
            <p className="text-sm font-semibold text-foreground">Nenhuma categoria selecionada</p>
            <p className="text-xs text-muted-foreground">Ative os filtros acima para ver os locais no mapa.</p>
          </div>
        </div>
      )}

      {locating && (
        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2">
          <span className="relative flex size-10">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex size-10 rounded-full bg-blue-500 ring-4 ring-background" />
          </span>
          <p className="rounded-full bg-background/80 px-2 py-0.5 text-[11px] font-semibold text-foreground backdrop-blur">
            Localizando...
          </p>
        </div>
      )}

      {showMe && !locating && (
        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2">
          <span className="relative flex size-9">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-60" />
            <span className="relative inline-flex size-9 items-center justify-center rounded-full bg-blue-500 ring-4 ring-background">
              <Navigation size={16} className="text-white" />
            </span>
          </span>
          <p className="rounded-full bg-background/80 px-2 py-0.5 text-[11px] font-semibold text-foreground backdrop-blur">
            Você
          </p>
        </div>
      )}

      {spots.map((spot) => (
        <MapMarker
          key={spot.id}
          spot={spot}
          active={selectedId === spot.id}
          hidden={!activeCategories.has(spot.category)}
          onClick={() => onSelect(selectedId === spot.id ? null : spot.id)}
        />
      ))}
    </div>
  );
}
