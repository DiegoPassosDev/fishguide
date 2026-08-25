"use client";

import { useState, useEffect, useCallback } from "react";
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
import { getCurrentWeather, type WeatherData } from "@/lib/weather.api";
import { getTides, type TideData } from "@/lib/tide.api";
import { getAstronomy, type AstronomyData } from "@/lib/astronomy.api";
import { getFgScore, type FgScoreData } from "@/lib/fg-score.api";

const DEFAULT_LAT = -22.9068;
const DEFAULT_LON = -43.1729;

const GREETINGS = ["Bom dia", "Boa tarde", "Boa noite"];

function getGreeting(): string {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return GREETINGS[0];
  if (h >= 12 && h < 18) return GREETINGS[1];
  return GREETINGS[2];
}

function getDailyTip(fgScore: FgScoreData | null): string {
  if (!fgScore) return "Carregando condições...";
  if (fgScore.score >= 80) return "Condições excelentes — aproveite!";
  if (fgScore.score >= 60) return "Boas condições de pesca hoje.";
  return "Condições moderadas — ajuste horário/local.";
}

function mapOpportunities(fgScore: FgScoreData | null) {
  if (!fgScore) return [];
  return fgScore.opportunities.map((opp) => ({
    fish: opp.name,
    rating: Math.min(5, Math.round(opp.score / 20)),
    location: opp.location,
    timeStart: opp.timeStart,
    timeEnd: opp.timeEnd,
    confidence: opp.score >= 70 ? "Alta" : opp.score >= 50 ? "Média" : "Baixa",
  }));
}

export default function TodayDashboard() {
  const { user } = useAuth();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [tide, setTide] = useState<TideData | null>(null);
  const [astronomy, setAstronomy] = useState<AstronomyData | null>(null);
  const [fgScore, setFgScore] = useState<FgScoreData | null>(null);
  const [weatherError, setWeatherError] = useState(false);
  const [tideError, setTideError] = useState(false);
  const [astronomyError, setAstronomyError] = useState(false);
  const [fgScoreError, setFgScoreError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(true);
  const [coords, setCoords] = useState({ lat: DEFAULT_LAT, lon: DEFAULT_LON });

  const loadWeather = useCallback(async (latitude: number, longitude: number): Promise<boolean> => {
    try {
      const data = await getCurrentWeather(latitude, longitude);
      setWeather(data);
      setWeatherError(false);
      return true;
    } catch {
      setWeatherError(true);
      return false;
    }
  }, []);

  const loadTide = useCallback(async (latitude: number, longitude: number): Promise<boolean> => {
    try {
      const data = await getTides(latitude, longitude);
      setTide(data);
      setTideError(false);
      return true;
    } catch {
      setTideError(true);
      return false;
    }
  }, []);

  const loadAstronomy = useCallback(async (latitude: number, longitude: number): Promise<boolean> => {
    try {
      const data = await getAstronomy(latitude, longitude);
      setAstronomy(data);
      setAstronomyError(false);
      return true;
    } catch {
      setAstronomyError(true);
      return false;
    }
  }, []);

  const loadFgScore = useCallback(async (latitude: number, longitude: number): Promise<boolean> => {
    try {
      const data = await getFgScore(latitude, longitude);
      setFgScore(data);
      setFgScoreError(false);
      return true;
    } catch {
      setFgScoreError(true);
      return false;
    }
  }, []);

  const fetchData = useCallback(
    async (latitude: number, longitude: number) => {
      setRefreshing(true);
      const [weatherOk, tideOk, astronomyOk, fgScoreOk] = await Promise.all([
        loadWeather(latitude, longitude),
        loadTide(latitude, longitude),
        loadAstronomy(latitude, longitude),
        loadFgScore(latitude, longitude),
      ]);
      if (weatherOk || tideOk || astronomyOk || fgScoreOk) {
        setLastUpdated(new Date().toISOString());
      }
      setRefreshing(false);
    },
    [loadWeather, loadTide, loadAstronomy, loadFgScore],
  );

  async function retry(kind: "weather" | "tide" | "astronomy" | "fg-score") {
    if (refreshing) return;
    setRefreshing(true);
    let ok = false;
    if (kind === "weather") {
      ok = await loadWeather(coords.lat, coords.lon);
    } else if (kind === "tide") {
      ok = await loadTide(coords.lat, coords.lon);
    } else if (kind === "astronomy") {
      ok = await loadAstronomy(coords.lat, coords.lon);
    } else {
      ok = await loadFgScore(coords.lat, coords.lon);
    }
    if (ok) {
      setLastUpdated(new Date().toISOString());
    }
    setRefreshing(false);
  }

  useEffect(() => {
    let lat = DEFAULT_LAT;
    let lon = DEFAULT_LON;
    let fetchedOnDate = new Date().toDateString();
    const REFRESH_INTERVAL_MS = 15 * 60_000;

    function onPosition(pos: GeolocationPosition) {
      lat = pos.coords.latitude;
      lon = pos.coords.longitude;
      setCoords({ lat, lon });
      void fetchData(lat, lon);
    }

    const dayRollCheck = setInterval(() => {
      const today = new Date().toDateString();
      if (today !== fetchedOnDate) {
        fetchedOnDate = today;
        void fetchData(lat, lon);
      }
    }, 60_000);

    const autoRefresh = setInterval(() => void fetchData(lat, lon), REFRESH_INTERVAL_MS);

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        void fetchData(lat, lon);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    let fallbackTimer: ReturnType<typeof setTimeout> | undefined;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(onPosition, () => void fetchData(lat, lon));
    } else {
      fallbackTimer = setTimeout(() => void fetchData(lat, lon), 0);
    }

    return () => {
      clearInterval(dayRollCheck);
      clearInterval(autoRefresh);
      document.removeEventListener("visibilitychange", onVisibility);
      if (fallbackTimer) clearTimeout(fallbackTimer);
    };
  }, [fetchData]);

  return (
    <div className="relative mx-auto flex h-dvh w-full max-w-105 flex-col overflow-hidden bg-background">
      <Header lastUpdated={lastUpdated} refreshing={refreshing} />

      <main className="flex-1 overflow-y-auto px-3 pt-2 pb-25">
        <section className="mb-4 flex items-center justify-between px-1">
          <div>
            <h1 className="font-heading text-xl font-bold text-foreground">
              {getGreeting()}, {user?.name?.split(" ")[0] ?? "Pescador"} 👋
            </h1>
            <p className="text-xs text-muted-foreground">
              {getDailyTip(fgScore)}
            </p>
          </div>
          <div className="flex size-11 items-center justify-center rounded-full bg-linear-to-br from-sky-700 to-navy-mid ring-2 ring-border">
            <span className="text-sm font-bold text-white">
              {user?.name?.charAt(0).toUpperCase() ?? "P"}
            </span>
          </div>
        </section>

        <section className="mb-3 rounded-3xl border border-border bg-card p-6 shadow-sm">
          {fgScoreError ? (
            <div className="flex flex-col items-center gap-2 py-4">
              <p className="text-sm text-muted-foreground">Não foi possível carregar o FG Score</p>
              <button
                onClick={() => void retry("fg-score")}
                className="rounded-xl bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20"
              >
                Tentar novamente
              </button>
            </div>
          ) : (
            <>
              <FgScoreRing
                score={fgScore?.score ?? 0}
                label="FG SCORE"
                subtitle={fgScore?.subtitle ?? "Carregando..."}
              />
              <div className="mt-3">
                <ConfidenceGauge value={fgScore?.confidence ?? 0} />
              </div>
            </>
          )}
        </section>

        <TodaySummary
          data={{ text: fgScore?.summary.text ?? "Carregando resumo..." }}
          solunar={fgScore?.solunar ?? { major: [], minor: [] }}
        />
        <BestOpportunityCard opportunities={mapOpportunities(fgScore)} />
        <TideCard data={tide} error={tideError} onRetry={() => void retry("tide")} />
        <WeatherCard data={weather} error={weatherError} onRetry={() => void retry("weather")} />
        <AstronomyCard data={astronomy} error={astronomyError} onRetry={() => void retry("astronomy")} />
        <RecommendationExplanation
          reasons={fgScore?.reasons ?? ["Carregando análise..."]}
          confidence={fgScore?.confidence ? `${fgScore.confidence}%` : "..."}
        />
      </main>

      <BottomNav />
    </div>
  );
}
