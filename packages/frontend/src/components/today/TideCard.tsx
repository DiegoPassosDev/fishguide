"use client";

import { Waves } from "lucide-react";

interface TideCardProps {
  data: {
    alta: string;
    altaAltura: string;
    baixa: string;
    baixaAltura: string;
    amplitude: string;
    agoraStatus: string;
    agoraProgresso: number;
    proximaMudanca: string;
    proximaEm: string;
  };
}

function getTidePoint(progress: number) {
  const full = progress / 100;
  const isAscending = full <= 0.5;
  const t = isAscending ? full * 2 : (full - 0.5) * 2;

  const p0 = { x: 35, y: 105 };
  const c1 = { x: 72, y: 105 };
  const c2 = { x: 108, y: 30 };
  const p1 = { x: 145, y: 30 };
  const c3 = { x: 182, y: 30 };
  const c4 = { x: 218, y: 105 };
  const p2 = { x: 255, y: 105 };

  function bezier(px0: number, pc1: number, pc2: number, px1: number, t: number) {
    const u = 1 - t;
    return px0 * u * u * u + 3 * pc1 * u * u * t + 3 * pc2 * u * t * t + px1 * t * t * t;
  }

  if (isAscending) {
    return {
      x: bezier(p0.x, c1.x, c2.x, p1.x, t),
      y: bezier(p0.y, c1.y, c2.y, p1.y, t),
    };
  }
  return {
    x: bezier(p1.x, c3.x, c4.x, p2.x, t),
    y: bezier(p1.y, c3.y, c4.y, p2.y, t),
  };
}

export function TideCard({ data }: TideCardProps) {
  const pt = getTidePoint(data.agoraProgresso);

  return (
    <section className="mb-3 rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Waves size={16} className="text-blue-500" />
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Maré
        </h2>
      </div>

      <div className="mb-3 flex items-center justify-between rounded-xl bg-muted/40 px-3 py-2 text-xs">
        <div className="text-center">
          <div className="text-muted-foreground">Alta</div>
          <div className="font-bold text-blue-500">{data.alta}</div>
          <div className="text-card-foreground">{data.altaAltura}m</div>
        </div>
        <div className="h-10 w-px bg-border" />
        <div className="text-center">
          <div className="text-muted-foreground">Baixa</div>
          <div className="font-bold text-blue-500">{data.baixa}</div>
          <div className="text-card-foreground">{data.baixaAltura}m</div>
        </div>
      </div>

      <div className="relative">
        <svg viewBox="0 0 290 130" className="w-full">
          <defs>
            <linearGradient id="tideGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>

          <path
            d="M 35 105 C 72 105 108 30 145 30 C 182 30 218 105 255 105"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="opacity-20"
          />

          <path
            d="M 35 105 C 72 105 108 30 145 30 C 182 30 218 105 255 105"
            fill="none"
            stroke="url(#tideGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          <circle cx="145" cy="30" r="3" fill="#06b6d4" />
          <text x="145" y="18" textAnchor="middle" className="fill-blue-500 text-[9px] font-bold">
            ▲ {data.altaAltura}m
          </text>

          <circle cx="35" cy="105" r="2.5" fill="#64748b" />
          <text x="35" y="120" textAnchor="middle" className="fill-muted-foreground text-[9px]">
            ▼ {data.baixaAltura}m
          </text>

          <circle cx="255" cy="105" r="2.5" fill="#64748b" />
          <text x="255" y="120" textAnchor="middle" className="fill-muted-foreground text-[9px]">
            ▼ {data.baixaAltura}m
          </text>

          <circle cx={pt.x} cy={pt.y} r="4" fill="#3b82f6" stroke="#fff" strokeWidth="1.5" />
        </svg>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="rounded-xl bg-muted/40 px-3 py-2 text-center">
          <div className="text-[11px] text-muted-foreground">Amplitude</div>
          <div className="text-sm font-bold text-card-foreground">{data.amplitude}m</div>
        </div>
        <div className="rounded-xl bg-muted/40 px-3 py-2 text-center">
          <div className="text-[11px] text-muted-foreground">Agora</div>
          <div className="text-sm font-bold text-blue-500">
            🌊 {data.agoraStatus} {data.agoraProgresso}%
          </div>
        </div>
        <div className="rounded-xl bg-muted/40 px-3 py-2 text-center">
          <div className="text-[11px] text-muted-foreground">Próxima</div>
          <div className="text-sm font-bold text-card-foreground">
            {data.proximaMudanca} em {data.proximaEm}
          </div>
        </div>
      </div>
    </section>
  );
}
