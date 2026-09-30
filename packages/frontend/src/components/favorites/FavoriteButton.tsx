"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { toggleFavoriteSpecies, toggleFavoriteSpot } from "@/lib/favorites.api";
import { useToast } from "@/contexts/ToastContext";
import type { FavoriteTarget, FavoriteToggleResponse } from "@/types/favorites";

interface FavoriteButtonProps {
  target: FavoriteTarget;
  id: string;
  initialFavorited: boolean;
  onChange?: (result: FavoriteToggleResponse) => void;
  showLabel?: boolean;
  className?: string;
}

export function FavoriteButton({
  target,
  id,
  initialFavorited,
  onChange,
  showLabel = false,
  className = "",
}: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [busy, setBusy] = useState(false);
  const { showToast } = useToast();

  async function handleClick() {
    if (busy) return;
    setBusy(true);
    try {
      const result =
        target === "spot"
          ? await toggleFavoriteSpot(id)
          : await toggleFavoriteSpecies(id);
      setFavorited(result.favorited);
      onChange?.(result);
    } catch {
      showToast("Não foi possível atualizar o favorito.", "error");
    } finally {
      setBusy(false);
    }
  }

  const label = favorited ? "Favorito" : "Favoritar";

  if (!showLabel) {
    return (
      <button
        type="button"
        onClick={() => void handleClick()}
        disabled={busy}
        aria-pressed={favorited}
        aria-label={label}
        className={`flex size-8 items-center justify-center rounded-full transition-colors disabled:opacity-60 ${
          favorited
            ? "bg-rose-500/10 text-rose-500"
            : "text-muted-foreground hover:bg-accent hover:text-rose-500"
        } ${className}`}
      >
        <Heart size={16} className={favorited ? "fill-rose-500 text-rose-500" : ""} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => void handleClick()}
      disabled={busy}
      aria-pressed={favorited}
      aria-label={label}
      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition-colors disabled:opacity-60 ${
        favorited
          ? "border-rose-500/40 bg-rose-500/10 text-rose-500"
          : "border-border text-muted-foreground hover:border-rose-500/40 hover:text-rose-500"
      } ${className}`}
    >
      <Heart size={14} className={favorited ? "fill-rose-500 text-rose-500" : ""} />
      <span>{label}</span>
    </button>
  );
}
