"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Fish } from "lucide-react";
import { Logo } from "./Logo";

interface HeaderProps {
  lastUpdated?: string | null;
  refreshing?: boolean;
}

export function Header({ lastUpdated, refreshing }: HeaderProps) {
  const router = useRouter();
  const [timeAgo, setTimeAgo] = useState("");

  useEffect(() => {
    if (!lastUpdated) return;
    const update = () => {
      const diff = Date.now() - new Date(lastUpdated).getTime();
      const min = Math.floor(diff / 60000);
      if (min < 1) setTimeAgo("agora");
      else if (min === 1) setTimeAgo("1 min");
      else setTimeAgo(`${min} min`);
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

  return (
    <header className="flex items-center justify-between px-2 py-3">
      <Logo />

      <div className="flex flex-col items-end gap-1.5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/species")}
            aria-label="Espécies"
            className="flex size-9 items-center justify-center rounded-full bg-muted transition-colors hover:bg-accent"
          >
            <Fish size={18} className="text-muted-foreground" />
          </button>
          <button
            type="button"
            className="relative flex size-9 items-center justify-center rounded-full bg-muted transition-colors hover:bg-accent"
          >
            <Bell size={18} className="text-muted-foreground" />
            <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
              3
            </span>
          </button>
        </div>
        {lastUpdated !== undefined && (
          <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
            {refreshing || lastUpdated === null
              ? "Atualizando…"
              : timeAgo === "agora"
                ? "Atualizado agora"
                : `Atualizado há ${timeAgo}`}
          </span>
        )}
      </div>
    </header>
  );
}
