"use client";

import { useState } from "react";
import { BookOpen, FishingRod, Home, Map, User, UsersRound, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const items = [
  { label: "Hoje", icon: Home, href: "/today" },
  { label: "Mapa", icon: Map, href: "/map" },
  { label: null, icon: null, href: null },
  { label: "Comunidade", icon: UsersRound, href: "/community" },
  { label: "Perfil", icon: User, href: "/profile" },
];

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function navigate(href: string) {
    setOpen(false);
    router.push(href);
  }

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Fechar menu"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
        />
      )}

      <nav className="absolute bottom-0 left-0 right-0 z-50 flex h-21.5 items-start border-t border-border bg-card shadow-[0_-6px_18px_rgba(10,22,40,0.06)]">
        {items.map((item, i) => {
          if (!item.label) {
            return (
              <div key={i} className="relative flex flex-1 flex-col items-center pt-3">
                <div
                  className={`absolute bottom-full left-1/2 mb-8 flex -translate-x-1/2 flex-col items-center gap-2.5 transition-all duration-200 ease-out ${
                    open
                      ? "translate-y-0 opacity-100"
                      : "pointer-events-none translate-y-2 opacity-0"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => navigate("/diary")}
                    className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground shadow-lg transition-colors hover:border-primary/40"
                  >
                    <BookOpen size={16} className="text-primary" />
                    Diário
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/pescar")}
                    className="flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_8px_18px_rgba(13,57,96,0.4)] transition-opacity hover:opacity-90"
                  >
                    <FishingRod size={16} />
                    Iniciar
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setOpen((v) => !v)}
                  aria-label={open ? "Fechar menu" : "Abrir menu"}
                  aria-expanded={open}
                  className={`-mt-7.5 flex size-14 items-center justify-center rounded-full shadow-[0_8px_18px_rgba(13,57,96,0.4)] ring-4 ring-background transition-all hover:scale-105 ${
                    open ? "bg-muted text-primary" : "bg-primary text-primary-foreground"
                  }`}
                >
                  {open ? <X size={22} /> : <FishingRod size={22} />}
                </button>
                <span
                  className={`mt-1 text-[11px] font-bold transition-colors ${
                    open ? "text-muted-foreground" : "text-primary"
                  }`}
                >
                  Pescar
                </span>
              </div>
            );
          }

          const active = pathname === item.href;
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => router.push(item.href)}
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
    </>
  );
}
