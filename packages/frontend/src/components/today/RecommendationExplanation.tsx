"use client";

import { TrendingUp, Check } from "lucide-react";

interface RecommendationExplanationProps {
  reasons: string[];
  confidence: string;
}

export function RecommendationExplanation({ reasons, confidence }: RecommendationExplanationProps) {
  return (
    <section className="mb-3 rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-lg leading-none">✓</span>
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Por que hoje?
        </h2>
      </div>

      <div className="mb-4 space-y-2">
        {reasons.map((reason) => (
          <div key={reason} className="flex items-center gap-2">
            <div className="flex size-5 items-center justify-center rounded-full bg-emerald-500/15">
              <Check size={11} className="text-emerald-500" />
            </div>
            <span className="text-sm text-card-foreground">{reason}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 rounded-xl bg-linear-to-r from-emerald-900/15 to-teal-900/15 px-4 py-3">
        <TrendingUp size={18} className="text-emerald-500" />
        <span className="text-sm font-bold text-foreground">Confiança {confidence}</span>
      </div>
    </section>
  );
}
