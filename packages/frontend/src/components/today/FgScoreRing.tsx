"use client";

interface FgScoreRingProps {
  score: number;
  label: string;
  subtitle: string;
}

export function FgScoreRing({ score, label, subtitle }: FgScoreRingProps) {
  const r = 92;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;

  return (
    <div className="flex flex-col items-center">
      <div className="relative size-52.5">
        <svg viewBox="0 0 210 210" className="size-full -rotate-90">
          <defs>
            <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#22d3b8" />
              <stop offset="100%" stopColor="#0f6b62" />
            </linearGradient>
          </defs>
          <circle
            cx="105"
            cy="105"
            r={r}
            stroke="currentColor"
            strokeWidth="14"
            fill="none"
            className="opacity-10"
          />
          <circle
            cx="105"
            cy="105"
            r={r}
            stroke="url(#ringGrad)"
            strokeWidth="14"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            className="drop-shadow-[0_0_8px_rgba(34,211,184,0.3)]"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center text-center pt-14 pb-6">
          <span className="text-[11px] font-semibold tracking-widest text-muted-foreground">
            {label}
          </span>
          <span className="font-heading text-[52px] font-extrabold leading-none text-foreground -mt-0.5">
            {score}
          </span>
          <div className="h-2" />
          <span className="max-w-27.5 text-sm font-bold leading-tight text-foreground whitespace-pre-line">
            {subtitle}
          </span>
        </div>
      </div>
    </div>
  );
}
