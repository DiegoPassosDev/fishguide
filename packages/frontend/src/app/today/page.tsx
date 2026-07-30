"use client";

import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { FgScoreRing } from "@/components/today/FgScoreRing";
import { ConfidenceGauge } from "@/components/today/ConfidenceGauge";
import { TodaySummary } from "@/components/today/TodaySummary";
import { BestOpportunityCard } from "@/components/today/BestOpportunityCard";
import { TideCard } from "@/components/today/TideCard";
import { WeatherCard } from "@/components/today/WeatherCard";
import { AstronomyCard } from "@/components/today/AstronomyCard";
import { RecommendationExplanation } from "@/components/today/RecommendationExplanation";
import { useAuth } from "@/contexts/useAuth";

const mock = {
  greeting: "Bom dia",
  lastUpdated: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
  dailyTip: "🌅 Maré enchendo — janela ideal!",
  score: 87,
  confidence: 92,
  summary: {
    text: "Hoje as condições estão excelentes para pesca de robalo. A maré de grande amplitude e a pressão estável aumentam a atividade das espécies costeiras.",
  },
  solunar: {
    major: [
      { time: "11:23 - 13:23", label: "Trânsito lunar oposto (lua sob os nossos pés)", activity: "MUITO ALTA" },
      { time: "23:43 - 01:43", label: "Trânsito lunar (lua sobre as nossas cabeças)", activity: "MUITO ALTA" },
    ],
    minor: [
      { time: "05:55 - 06:55", label: "Pôr da lua", activity: "MUITO ALTA" },
      { time: "17:52 - 18:52", label: "Saída da lua", activity: "MUITO ALTA" },
    ],
  },
  opportunities: [
    { fish: "Robalo", rating: 5, location: "Praia do Saco", timeStart: "06:00", timeEnd: "08:10", confidence: "Alta" },
    { fish: "Corvina", rating: 4, location: "Praia do Centro", timeStart: "06:30", timeEnd: "09:00", confidence: "Média" },
  ],
  tide: {
    alta: "05:42",
    altaAltura: "2.10",
    baixa: "11:18",
    baixaAltura: "0.45",
    amplitude: "1.65",
    agoraStatus: "Enchendo",
    agoraProgresso: 33,
    proximaMudanca: "Alta",
    proximaEm: "1h 12min",
  },
  weather: {
    temperatura: 27,
    sensacao: 29,
    condicao: "Ensolarado",
    vento: 8,
    pressao: 1016,
    umidade: 73,
    chuva: 12,
  },
  astronomy: {
    fase: "Crescente",
    iluminacao: 68,
    solNascer: "05:28",
    solPor: "17:41",
    luaNascer: "14:12",
    luaPor: "01:30",
  },
  reasons: [
    "Maré grande",
    "Pressão estável",
    "Histórico positivo",
    "Lua Crescente",
    "Vento favorável",
  ],
};

export default function TodayDashboard() {
  const { user } = useAuth();

  return (
    <div className="relative mx-auto flex h-dvh w-full max-w-105 flex-col overflow-hidden bg-background">
      <Header lastUpdated={mock.lastUpdated} />

      <main className="flex-1 overflow-y-auto px-3 pt-2 pb-25">
        <section className="mb-4 flex items-center justify-between px-1">
          <div>
            <h1 className="font-heading text-xl font-bold text-foreground">
              {mock.greeting}, {user?.name?.split(" ")[0] ?? "Pescador"} 👋
            </h1>
            <p className="text-xs text-muted-foreground">
              {mock.dailyTip}
            </p>
          </div>
          <div className="flex size-11 items-center justify-center rounded-full bg-linear-to-br from-sky-700 to-navy-mid ring-2 ring-border">
            <span className="text-sm font-bold text-white">
              {user?.name?.charAt(0).toUpperCase() ?? "P"}
            </span>
          </div>
        </section>

        <section className="mb-3 rounded-3xl border border-border bg-card p-6 shadow-sm">
          <FgScoreRing score={mock.score} label="FG SCORE" subtitle="Excelente Dia para Pesca" />
          <div className="mt-3">
            <ConfidenceGauge value={mock.confidence} />
          </div>
        </section>

        <TodaySummary data={mock.summary} solunar={mock.solunar} />
        <BestOpportunityCard opportunities={mock.opportunities} />
        <TideCard data={mock.tide} />
        <WeatherCard data={mock.weather} />
        <AstronomyCard data={mock.astronomy} />
        <RecommendationExplanation reasons={mock.reasons} confidence="Alta" />
      </main>

      <BottomNav />
    </div>
  );
}
