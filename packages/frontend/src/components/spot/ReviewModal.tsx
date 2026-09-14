"use client";

import { useState } from "react";
import { Loader2, Star, X } from "lucide-react";

interface ReviewModalProps {
  title: string;
  initialRating?: number;
  initialComment?: string;
  submitting?: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
}

const RATING_LABELS = [
  "",
  "Péssimo",
  "Ruim",
  "Razoável",
  "Bom",
  "Excelente",
];

export function ReviewModal({
  title,
  initialRating = 0,
  initialComment = "",
  submitting = false,
  onClose,
  onSubmit,
}: ReviewModalProps) {
  const [rating, setRating] = useState(initialRating);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState(initialComment);

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 backdrop-blur-sm p-4 sm:items-center">
      <div className="w-full max-w-100 rounded-3xl border border-border bg-background p-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-base font-bold text-foreground">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Fechar"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-4 flex flex-col items-center gap-1">
          <div
            className="flex gap-1.5"
            onMouseLeave={() => setHovered(0)}
          >
            {[1, 2, 3, 4, 5].map((star) => {
              const active = (hovered || rating) >= star;
              return (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHovered(star)}
                  className="text-3xl transition-transform hover:scale-110 active:scale-95"
                  aria-label={`${star} estrela${star > 1 ? "s" : ""}`}
                >
                  <Star
                    size={32}
                    className={
                      active
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground/40"
                    }
                  />
                </button>
              );
            })}
          </div>
          <p className="mt-1 text-xs font-semibold text-muted-foreground">
            {RATING_LABELS[hovered || rating] ?? "Toque para avaliar"}
          </p>
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={500}
          placeholder="Conte como foi a pescaria nesse pesqueiro (opcional)..."
          rows={3}
          className="mt-4 w-full resize-none rounded-2xl border border-input bg-muted/50 px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary"
        />
        <p className="mt-1 text-right text-[10px] text-muted-foreground">
          {comment.length}/500
        </p>

        <button
          type="button"
          onClick={() => onSubmit(rating, comment.trim())}
          disabled={submitting || rating === 0}
          className="mt-1 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Star size={16} className="fill-current" />
          )}
          Salvar avaliação
        </button>
      </div>
    </div>
  );
}