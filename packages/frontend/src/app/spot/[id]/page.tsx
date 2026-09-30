"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Fish,
  MapPin,
  Plus,
  Star,
  Waves,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ReviewCard } from "@/components/spot/ReviewCard";
import { ReviewModal } from "@/components/spot/ReviewModal";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { useToast } from "@/contexts/ToastContext";
import {
  createReview,
  deleteReview,
  getFishingSpot,
  getReviews,
  updateReview,
} from "@/lib/fishing-spots.api";
import type {
  FishingSpotDetail,
  ReviewListResponse,
  SpotReview,
} from "@/types/fishing-spots";

const EMPTY_REVIEWS: ReviewListResponse = {
  items: [],
  total: 0,
  page: 1,
  limit: 10,
  average: 0,
};

export default function SpotDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { showToast } = useToast();

  const [spot, setSpot] = useState<FishingSpotDetail | null>(null);
  const [reviews, setReviews] = useState<ReviewListResponse>(EMPTY_REVIEWS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<SpotReview | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [loadedSpot, loadedReviews] = await Promise.all([
          getFishingSpot(params.id),
          getReviews(params.id),
        ]);
        if (cancelled) return;
        setSpot(loadedSpot);
        setReviews(loadedReviews);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  async function refreshAll() {
    try {
      const [loadedSpot, loadedReviews] = await Promise.all([
        getFishingSpot(params.id),
        getReviews(params.id),
      ]);
      setSpot(loadedSpot);
      setReviews(loadedReviews);
    } catch {
      showToast("Não foi possível atualizar as avaliações.", "error");
    }
  }

  function openCreate() {
    setEditingReview(null);
    setModalOpen(true);
  }

  function openEdit(review: SpotReview) {
    setEditingReview(review);
    setModalOpen(true);
  }

  async function handleSubmit(rating: number, comment: string) {
    if (submitting) return;
    setSubmitting(true);
    try {
      if (editingReview) {
        await updateReview(params.id, editingReview.id, {
          rating,
          comment: comment || undefined,
        });
        showToast("Avaliação atualizada!", "success");
      } else {
        await createReview(params.id, { rating, comment: comment || undefined });
        showToast("Avaliação publicada!", "success");
      }
      setModalOpen(false);
      await refreshAll();
    } catch {
      showToast("Não foi possível salvar a avaliação. Tente novamente.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(review: SpotReview) {
    if (!confirm("Excluir esta avaliação?")) return;
    try {
      await deleteReview(params.id, review.id);
      showToast("Avaliação excluída.", "success");
      await refreshAll();
    } catch {
      showToast("Não foi possível excluir a avaliação.", "error");
    }
  }

  const ownReview =
    reviews.items.find((review) => review.isMine) ?? null;

  return (
    <ProtectedRoute>
      <div className="relative mx-auto flex h-dvh w-full max-w-105 flex-col overflow-hidden bg-background">
        <Header />

        <main className="flex-1 overflow-y-auto px-3 pt-2 pb-25">
          {loading ? (
            <div className="space-y-3">
              <div className="h-28 animate-pulse rounded-3xl bg-card" />
              <div className="h-60 animate-pulse rounded-3xl bg-card" />
            </div>
          ) : error || !spot ? (
            <div className="rounded-3xl border border-dashed border-border bg-card p-8 text-center">
              <Fish size={32} className="mx-auto text-muted-foreground" />
              <p className="mt-3 text-sm font-semibold text-foreground">
                Pesqueiro não encontrado
              </p>
              <button
                type="button"
                onClick={() => router.push("/map")}
                className="mt-3 rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground"
              >
                Voltar ao mapa
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="rounded-3xl border border-border bg-card p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h1 className="font-heading text-2xl font-bold text-foreground">
                      {spot.name}
                    </h1>
                    <p className="text-xs text-muted-foreground">
                      {spot.spotType
                        ? spot.spotType.replaceAll("_", " ")
                        : "Pesqueiro"}
                      {spot.accessType
                        ? ` · Acesso ${spot.accessType}`
                        : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <span className="flex shrink-0 items-center gap-1 rounded-full bg-amber-500/10 px-3 py-1.5 text-sm font-bold text-amber-500">
                      <Star size={14} className="fill-amber-500 text-amber-500" />
                      {reviews.average > 0 ? reviews.average.toFixed(1) : "—"}
                    </span>
                    <FavoriteButton
                      target="spot"
                      id={spot.id}
                      initialFavorited={spot.isFavorited}
                      showLabel
                    />
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin size={13} />
                    {spot.latitude.toFixed(4)}, {spot.longitude.toFixed(4)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star size={13} className="fill-amber-500 text-amber-500" />
                    {spot.reviewsCount}{" "}
                    {spot.reviewsCount === 1 ? "avaliação" : "avaliações"}
                  </span>
                </div>

                {spot.description && (
                  <p className="mt-3 text-sm leading-relaxed text-card-foreground">
                    {spot.description}
                  </p>
                )}
              </div>

              <div className="rounded-3xl border border-border bg-card p-5">
                <h2 className="mb-3 flex items-center gap-1.5 text-sm font-bold text-foreground">
                  <Waves size={15} className="text-primary" />
                  Espécies
                </h2>
                {spot.species.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    Nenhuma espécie cadastrada neste pesqueiro ainda.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {spot.species.map((species) => (
                      <button
                        key={species.id}
                        type="button"
                        onClick={() => router.push(`/species/${species.id}`)}
                        className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
                      >
                        <Fish size={12} />
                        {species.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between px-1 py-1">
                  <h2 className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                    Avaliações
                    {reviews.total > 0 && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                        {reviews.total}
                      </span>
                    )}
                  </h2>
                  <button
                    type="button"
                    onClick={ownReview ? () => openEdit(ownReview) : openCreate}
                    className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
                      ownReview
                        ? "border border-primary text-primary hover:bg-primary/10"
                        : "bg-primary text-primary-foreground hover:opacity-90"
                    }`}
                  >
                    <Plus size={13} />
                    {ownReview ? "Editar minha avaliação" : "Avaliar"}
                  </button>
                </div>

                {reviews.items.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-border bg-card p-6 text-center">
                    <Star size={22} className="mx-auto text-muted-foreground/50" />
                    <p className="mt-2 text-xs text-muted-foreground">
                      Nenhuma avaliação ainda. Seja o primeiro a avaliar este
                      pesqueiro!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {reviews.items.map((review) => (
                      <ReviewCard
                        key={review.id}
                        review={review}
                        onEdit={openEdit}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>

        {modalOpen && (
          <ReviewModal
            title={
              editingReview ? "Editar avaliação" : `Avaliar ${spot?.name ?? ""}`
            }
            initialRating={editingReview?.rating ?? 0}
            initialComment={editingReview?.comment ?? ""}
            submitting={submitting}
            onClose={() => setModalOpen(false)}
            onSubmit={handleSubmit}
          />
        )}

        <BottomNav />
      </div>
    </ProtectedRoute>
  );
}