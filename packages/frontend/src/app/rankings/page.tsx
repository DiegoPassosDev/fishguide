"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, RefreshCw, Trophy } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { LevelCard } from "@/components/gamification/LevelCard";
import { RankingList } from "@/components/gamification/RankingList";
import { AchievementsCard } from "@/components/profile/AchievementsCard";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { fetchMyGamification, fetchRanking } from "@/lib/gamification.api";
import type {
  GamificationProfile,
  RankingItem,
} from "@/types/gamification";

type Tab = "ranking" | "achievements";

export default function RankingsPage() {
  const [tab, setTab] = useState<Tab>("ranking");
  const [me, setMe] = useState<GamificationProfile | null>(null);
  const [items, setItems] = useState<RankingItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [myPosition, setMyPosition] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string>();

  const loadInitial = useCallback(async () => {
    const [meData, ranking] = await Promise.all([
      fetchMyGamification(),
      fetchRanking(1, 20),
    ]);
    return { meData, ranking };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { meData, ranking } = await loadInitial();
        if (cancelled) return;
        setMe(meData);
        setItems(ranking.items);
        setTotal(ranking.total);
        setMyPosition(ranking.myPosition);
        setPage(1);
      } catch {
        if (!cancelled) setError("Não conseguimos carregar o ranking.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loadInitial]);

  async function retry() {
    setLoading(true);
    setError(undefined);
    try {
      const { meData, ranking } = await loadInitial();
      setMe(meData);
      setItems(ranking.items);
      setTotal(ranking.total);
      setMyPosition(ranking.myPosition);
      setPage(1);
    } catch {
      setError("Não conseguimos carregar o ranking.");
    } finally {
      setLoading(false);
    }
  }

  async function loadMore() {
    if (loadingMore || items.length >= total) return;
    setLoadingMore(true);
    try {
      const next = await fetchRanking(page + 1, 20);
      setItems((prev) => [...prev, ...next.items]);
      setPage(next.page);
      setMyPosition(next.myPosition);
    } catch {
      // mantém a lista atual
    } finally {
      setLoadingMore(false);
    }
  }

  return (
    <ProtectedRoute>
      <div className="relative mx-auto flex h-dvh w-full max-w-105 flex-col overflow-hidden bg-background">
        <Header />

        <main className="flex-1 overflow-y-auto px-3 pt-2 pb-25">
          <div className="mb-3 px-1">
            <h1 className="font-heading text-xl font-bold text-foreground">
              Ranking & Conquistas
            </h1>
            <p className="text-xs text-muted-foreground">
              Ganhe XP publicando, pescando e avaliando pesqueiros
            </p>
          </div>

          <div className="mb-4 flex rounded-full border border-border bg-card p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setTab("ranking")}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-sm font-semibold transition-colors ${
                tab === "ranking"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Trophy size={14} />
              Ranking
            </button>
            <button
              type="button"
              onClick={() => setTab("achievements")}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-sm font-semibold transition-colors ${
                tab === "achievements"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="text-sm leading-none">🏆</span>
              Conquistas
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 size={24} className="animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
              <p className="text-sm font-semibold text-foreground">{error}</p>
              <button
                type="button"
                onClick={() => void retry()}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                <RefreshCw size={14} />
                Tentar novamente
              </button>
            </div>
          ) : tab === "achievements" ? (
            <div>
              {me && <LevelCard level={me.level} xp={me.xp} />}
              {me && <AchievementsCard achievements={me.achievements} />}
            </div>
          ) : (
            <div>
              {myPosition != null && (
                <div className="mb-3 flex items-center justify-between rounded-2xl border border-primary/30 bg-primary/5 px-4 py-3">
                  <p className="text-sm font-semibold text-foreground">
                    Sua posição no ranking
                  </p>
                  <p className="text-base font-bold text-primary">
                    #{myPosition}
                    <span className="ml-1 text-[11px] font-semibold text-muted-foreground">
                      de {total}
                    </span>
                  </p>
                </div>
              )}

              <RankingList items={items} myPosition={myPosition} />

              {items.length < total && (
                <button
                  type="button"
                  onClick={() => void loadMore()}
                  disabled={loadingMore}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-border bg-card py-3 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-accent disabled:opacity-60"
                >
                  {loadingMore ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    "Carregar mais"
                  )}
                </button>
              )}
            </div>
          )}
        </main>

        <BottomNav />
      </div>
    </ProtectedRoute>
  );
}