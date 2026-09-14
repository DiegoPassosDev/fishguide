"use client";

import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { AchievementsCard } from "@/components/profile/AchievementsCard";
import { GearCard } from "@/components/profile/GearCard";
import { FavoritesCard } from "@/components/profile/FavoritesCard";
import { PreferencesCard } from "@/components/profile/PreferencesCard";
import { UnitsCard } from "@/components/profile/UnitsCard";
import { NotificationsCard } from "@/components/profile/NotificationsCard";
import { SecurityCard } from "@/components/profile/SecurityCard";
import { LogoutCard } from "@/components/profile/LogoutCard";
import { AboutCard } from "@/components/profile/AboutCard";
import { ProfileEditModal } from "@/components/profile/ProfileEditModal";
import { useAuth } from "@/contexts/useAuth";
import { fetchMyGamification } from "@/lib/gamification.api";
import type { GamificationProfile } from "@/types/gamification";

const mock = {
  gear: [
    { name: "Vara 7'0\"", detail: "Ação média · linha 20lb" },
    { name: "Molinete 3000", detail: "Cubo de metal · 4 rolamentos" },
    { name: "Caixa de iscas", detail: "Camarão vivo + manzuá" },
  ],
  species: ["Robalo", "Corvina", "Tainha", "Bagre"],
  spots: ["Praia do Saco", "Praia do Centro", "Ilha do Guará"],
};

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [gamification, setGamification] = useState<GamificationProfile | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchMyGamification()
      .then((data) => {
        if (!cancelled) setGamification(data);
      })
      .catch(() => {
        // mantém cartões sem dados reais
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!user) {
    return <ProtectedRoute>{null}</ProtectedRoute>;
  }

  const biggest =
    gamification?.stats.biggestCatchKg != null
      ? `${gamification.stats.biggestCatchKg} kg`
      : "—";

  return (
    <ProtectedRoute>
      <div className="relative mx-auto flex h-dvh w-full max-w-105 flex-col overflow-hidden bg-background">
        <Header />

        <main className="flex-1 overflow-y-auto px-3 pt-2 pb-25">
          <ProfileHeader user={user} onEdit={() => setIsEditing(true)} />

          <button
            type="button"
            onClick={() => router.push("/rankings")}
            className="mb-3 flex w-full items-center gap-3 rounded-3xl border border-border bg-card p-4 shadow-sm transition-colors hover:bg-accent"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Trophy size={18} />
            </div>
            <div className="min-w-0 flex-1 text-left">
              <p className="text-sm font-bold text-foreground">Ranking & Conquistas</p>
              <p className="text-xs text-muted-foreground">
                {gamification
                  ? `Nível ${gamification.level.number} · ${gamification.xp} XP`
                  : "Veja seu XP, nível e posição"}
              </p>
            </div>
            <span className="text-muted-foreground">›</span>
          </button>

          {gamification ? (
            <>
              <ProfileStats
                stats={{
                  catches: gamification.stats.catches,
                  species: gamification.stats.species,
                  trips: gamification.stats.trips,
                  biggest,
                }}
              />
              <AchievementsCard achievements={gamification.achievements} />
            </>
          ) : (
            <div className="mb-3 rounded-3xl border border-border bg-card p-5 text-center shadow-sm">
              <p className="text-xs text-muted-foreground">
                Estatísticas e conquistas carregando…
              </p>
            </div>
          )}

          <GearCard gear={mock.gear} />
          <FavoritesCard species={mock.species} spots={mock.spots} />
          <PreferencesCard />
          <UnitsCard />
          <NotificationsCard />
          <SecurityCard />
          <LogoutCard />
          <AboutCard />
        </main>

        <BottomNav />

        {isEditing && <ProfileEditModal user={user} onClose={() => setIsEditing(false)} />}
      </div>
    </ProtectedRoute>
  );
}