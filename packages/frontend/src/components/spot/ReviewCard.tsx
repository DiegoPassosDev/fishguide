"use client";

import { Pencil, Star, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/useAuth";
import type { SpotReview } from "@/types/fishing-spots";

const AVATAR_COLORS = [
  "bg-teal",
  "bg-blue-500",
  "bg-pink-500",
  "bg-violet-500",
  "bg-amber-500",
  "bg-rose-500",
];

function avatarColor(id: string) {
  let hash = 0;
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "agora";
  if (minutes < 60) return `há ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `há ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `há ${days} d`;
  const months = Math.floor(days / 30);
  return `há ${months} mes${months > 1 ? "es" : ""}`;
}

interface ReviewCardProps {
  review: SpotReview;
  onEdit: (review: SpotReview) => void;
  onDelete: (review: SpotReview) => void;
}

export function ReviewCard({ review, onEdit, onDelete }: ReviewCardProps) {
  const { user } = useAuth();
  const isMine = review.isMine ?? user?.id === review.user.id;

  return (
    <article className="rounded-3xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-3">
        {review.user.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={review.user.avatar}
            alt={`Avatar de ${review.user.name}`}
            className="size-9 shrink-0 rounded-full object-cover"
          />
        ) : (
          <span
            className={`flex size-9 shrink-0 items-center justify-center rounded-full ${avatarColor(review.user.id)} font-heading text-sm font-bold text-white`}
          >
            {review.user.name.charAt(0).toUpperCase()}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-foreground">
            {review.user.name}
            {review.user.verified && (
              <span className="ml-1 text-primary" title="Verificado">
                ✓
              </span>
            )}
          </p>
          <div className="flex items-center gap-1.5">
            <span className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={11}
                  className={
                    review.rating >= star
                      ? "fill-amber-400 text-amber-400"
                      : "text-muted-foreground/30"
                  }
                />
              ))}
            </span>
            <span className="text-[11px] text-muted-foreground">
              {timeAgo(review.createdAt)}
            </span>
          </div>
        </div>
        {isMine && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onEdit(review)}
              className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Editar avaliação"
              title="Editar avaliação"
            >
              <Pencil size={14} />
            </button>
            <button
              type="button"
              onClick={() => onDelete(review)}
              className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              aria-label="Excluir avaliação"
              title="Excluir avaliação"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>

      {review.comment && (
        <p className="mt-2.5 text-sm leading-relaxed text-card-foreground">
          {review.comment}
        </p>
      )}
    </article>
  );
}