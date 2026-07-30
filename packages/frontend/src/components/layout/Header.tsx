"use client";

import { useEffect, useState } from "react";
import { Bell, Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Logo } from "./Logo";

interface HeaderProps {
  lastUpdated?: string;
}

export function Header({ lastUpdated }: HeaderProps) {
  const { theme, toggle } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [timeAgo, setTimeAgo] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

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
      <div className="flex items-start gap-3">
        <Logo />
        {timeAgo && (
          <span className="mt-7 text-[11px] text-muted-foreground">
            Atualizado há {timeAgo}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggle}
          className="flex size-9 items-center justify-center rounded-full bg-muted transition-colors hover:bg-accent"
          title={theme === "dark" ? "Tema claro" : "Tema escuro"}
        >
          {mounted ? (
            theme === "dark" ? (
              <Sun size={16} className="text-muted-foreground" />
            ) : (
              <Moon size={16} className="text-muted-foreground" />
            )
          ) : (
            <div className="size-4" />
          )}
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
    </header>
  );
}
