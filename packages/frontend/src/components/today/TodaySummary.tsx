"use client";

import { SolunarBar } from "./SolunarBar";

interface SolunarPeriod {
  time: string;
  label: string;
  activity: string;
}

interface TodaySummaryProps {
  data: {
    text: string;
  };
  solunar: {
    major: SolunarPeriod[];
    minor: SolunarPeriod[];
  };
}

export function TodaySummary({ data, solunar }: TodaySummaryProps) {
  return (
    <section className="mb-3 rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-1 flex items-center gap-2">
        <span className="text-lg leading-none">🎣</span>
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Resumo do Dia
        </h2>
      </div>

      <p className="mb-4 text-sm leading-relaxed text-card-foreground">
        {data.text}
      </p>

      {(solunar.major.length > 0 || solunar.minor.length > 0) && (
        <div className="space-y-3 rounded-xl bg-muted/40 px-4 py-3.5">
          <div className="flex items-center gap-1.5">
            <span className="text-sm leading-none">🌟</span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Períodos Ideais
            </h3>
          </div>

          {solunar.major.length > 0 && (
            <div className="space-y-2.5">
              {solunar.major.map((p) => (
                <SolunarBar key={p.time} {...p} variant="major" />
              ))}
            </div>
          )}

          {solunar.major.length > 0 && solunar.minor.length > 0 && (
            <div className="border-t border-border" />
          )}

          {solunar.minor.length > 0 && (
            <div className="space-y-2.5">
              {solunar.minor.map((p) => (
                <SolunarBar key={p.time} {...p} variant="minor" />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
