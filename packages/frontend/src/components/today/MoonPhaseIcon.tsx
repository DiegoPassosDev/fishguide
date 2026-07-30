"use client";

import { useId } from "react";

const PHASE_MAP: Record<string, number> = {
  "Nova": 0,
  "Crescente": 0.125,
  "Quarto Crescente": 0.25,
  "Crescente Gibosa": 0.375,
  "Cheia": 0.5,
  "Minguante Gibosa": 0.625,
  "Quarto Minguante": 0.75,
  "Minguante": 0.875,
};

interface MoonPhaseIconProps {
  phase: string;
  className?: string;
}

export function MoonPhaseIcon({ phase, className }: MoonPhaseIconProps) {
  const id = useId();
  const t = PHASE_MAP[phase] ?? 0.5;

  const opposite = (t + 0.5) % 1;
  const darkCx = 12 - 20 + opposite * 40;

  const isFull = t === 0.5;

  return (
    <svg viewBox="0 0 24 24" className={className}>
      <defs>
        <clipPath id={`${id}-moon`}>
          <circle cx="12" cy="12" r="10" />
        </clipPath>
      </defs>

      <g clipPath={`url(#${id}-moon)`}>
        <image href="/moon.png" x="2" y="2" width="20" height="20" preserveAspectRatio="xMidYMid slice" />

        {!isFull && (
          <circle cx={darkCx} cy="12" r="10" fill="#0a1628" opacity="0.88" />
        )}
      </g>

      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
    </svg>
  );
}
