"use client";

import { Home, Map, UsersRound, User, FishingRod } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

const items = [
  { label: "Hoje", icon: Home, href: "/today" },
  { label: "Mapa", icon: Map, href: "/mapa" },
  { label: null, icon: null, href: null },
  { label: "Comunidade", icon: UsersRound, href: "/comunidade" },
  { label: "Perfil", icon: User, href: "/perfil" },
];

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="absolute bottom-0 left-0 right-0 z-40 flex h-21.5 items-start border-t border-border bg-card shadow-[0_-6px_18px_rgba(10,22,40,0.06)]">
      {items.map((item, i) => {
        if (!item.label) {
          return (
            <div key={i} className="flex flex-1 flex-col items-center pt-3">
              <button
                type="button"
                onClick={() => router.push("/pescar")}
                className="-mt-7.5 flex size-14 items-center justify-center rounded-full bg-primary shadow-[0_8px_18px_rgba(13,57,96,0.4)] ring-4 ring-background transition-transform hover:scale-105"
              >
                <FishingRod size={22} className="text-primary-foreground" />
              </button>
              <span className="mt-1 text-[11px] font-bold text-primary">Pescar</span>
            </div>
          );
        }

        const active = pathname === item.href;
        const Icon = item.icon;

        return (
          <button
            key={item.label}
            type="button"
            onClick={() => router.push(item.href!)}
            className="flex flex-1 flex-col items-center gap-1 pt-3 transition-opacity hover:opacity-80"
          >
            <Icon
              size={22}
              className={active ? "text-primary" : "text-muted-foreground"}
            />
            <span
              className={`text-[11px] font-semibold ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
