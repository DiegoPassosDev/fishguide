"use client";

import { useState } from "react";
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

const mock = {
  stats: {
    catches: 47,
    species: 12,
    trips: 23,
    biggest: "5.2 kg",
  },
  achievements: [
    { title: "Primeira Captura", description: "Registrou a primeira pescaria", unlocked: true },
    { title: "Colecionador", description: "Capturou 10 espécies diferentes", unlocked: true },
    { title: "Pescador Noturno", description: "Pescou de madrugada 5 vezes", unlocked: false },
    { title: "Mestre das Marés", description: "Pescou em 3 tipos de maré", unlocked: false },
  ],
  gear: [
    { name: "Vara 7'0\"", detail: "Ação média · linha 20lb" },
    { name: "Molinete 3000", detail: "Cubo de metal · 4 rolamentos" },
    { name: "Caixa de iscas", detail: "Camarão vivo + manzuá" },
  ],
  species: ["Robalo", "Corvina", "Tainha", "Bagre"],
  spots: ["Praia do Saco", "Praia do Centro", "Ilha do Guará"],
};

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  if (isLoading || !user) {
    return (
      <div className="relative mx-auto flex h-dvh w-full max-w-105 flex-col overflow-hidden bg-background">
        <Header />
        <main className="flex-1 overflow-y-auto px-3 pt-2 pb-25">
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-muted-foreground">Carregando perfil...</p>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="relative mx-auto flex h-dvh w-full max-w-105 flex-col overflow-hidden bg-background">
      <Header />

      <main className="flex-1 overflow-y-auto px-3 pt-2 pb-25">
        <ProfileHeader user={user} onEdit={() => setIsEditing(true)} />
        <ProfileStats stats={mock.stats} />
        <AchievementsCard achievements={mock.achievements} />
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
  );
}
