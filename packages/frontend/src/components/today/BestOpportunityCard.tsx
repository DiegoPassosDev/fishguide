"use client";

import { Star, MapPin, Clock, TrendingUp } from "lucide-react";

interface Opportunity {
  fish: string;
  rating: number;
  location: string;
  timeStart: string;
  timeEnd: string;
  confidence: string;
}

interface BestOpportunityCardProps {
  opportunities: Opportunity[];
}

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={12}
          className={i <= count ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}
        />
      ))}
    </div>
  );
}

export function BestOpportunityCard({ opportunities }: BestOpportunityCardProps) {
  return (
    <section className="mb-3 rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-lg leading-none">🐟</span>
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Melhores Oportunidades
        </h2>
      </div>

      {opportunities.map((opp, i) => (
        <div key={opp.fish}>
          {i > 0 && <div className="my-3 border-t border-border" />}

          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-card-foreground">{opp.fish}</span>
                <Stars count={opp.rating} />
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin size={11} />
                  {opp.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={11} />
                  {opp.timeStart} → {opp.timeEnd}
                </span>
                <span className="flex items-center gap-1 font-medium text-emerald-500">
                  <TrendingUp size={11} />
                  {opp.confidence}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
