"use client";

import { useState } from "react";
import {
  Check,
  Fish,
  Heart,
  Loader2,
  MessageCircle,
  Send,
  Share2,
  Trash2,
} from "lucide-react";
import { useAuth } from "@/contexts/useAuth";
import { useToast } from "@/contexts/ToastContext";
import {
  addComment,
  deleteComment,
  fetchComments,
} from "@/lib/community.api";
import type {
  CommunityComment,
  CommunityPost,
} from "@/types/community";

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
  return `há ${days} d`;
}

interface PostCardProps {
  post: CommunityPost;
  onToggleLike: (id: string) => void;
  onShare: (id: string) => void;
  onFollow: (id: string) => void;
  onDelete: (id: string) => void;
  onCommentAdded: (postId: string) => void;
  onCommentRemoved: (postId: string) => void;
}

export function PostCard({
  post,
  onToggleLike,
  onShare,
  onFollow,
  onDelete,
  onCommentAdded,
  onCommentRemoved,
}: PostCardProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [sending, setSending] = useState(false);

  const isOwn = user?.id === post.author.id;

  async function loadComments() {
    setCommentsLoading(true);
    try {
      const data = await fetchComments(post.id);
      setComments(data);
    } catch {
      showToast("Não foi possível carregar os comentários.", "error");
    } finally {
      setCommentsLoading(false);
    }
  }

  function toggleComments() {
    const next = !commentsOpen;
    setCommentsOpen(next);
    if (next && comments.length === 0 && !commentsLoading) void loadComments();
  }

  async function submitComment() {
    const text = commentText.trim();
    if (!text || sending) return;
    setSending(true);
    try {
      const created = await addComment(post.id, text);
      setComments((prev) => [...prev, created]);
      setCommentText("");
      onCommentAdded(post.id);
    } catch {
      showToast("Não foi possível comentar. Tente novamente.", "error");
    } finally {
      setSending(false);
    }
  }

  async function removeComment(commentId: string) {
    if (!confirm("Excluir este comentário?")) return;
    try {
      await deleteComment(post.id, commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      onCommentRemoved(post.id);
    } catch {
      showToast("Não foi possível excluir o comentário.", "error");
    }
  }

  return (
    <article className="rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-3">
        {post.author.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.author.avatar}
            alt={`Avatar de ${post.author.name}`}
            className="size-10 shrink-0 rounded-full object-cover"
          />
        ) : (
          <span
            className={`flex size-10 shrink-0 items-center justify-center rounded-full ${avatarColor(post.author.id)} font-heading text-sm font-bold text-white`}
          >
            {post.author.name.charAt(0).toUpperCase()}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-foreground">
            {post.author.name}
            {post.author.verified && (
              <span className="ml-1 text-primary" title="Verificado">
                ✓
              </span>
            )}
          </p>
          <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            {post.topic && (
              <span className="rounded-full bg-muted px-2 py-0.5 font-semibold text-muted-foreground">
                {post.topic}
              </span>
            )}
            {timeAgo(post.createdAt)}
          </p>
        </div>
        {isOwn ? (
          <button
            type="button"
            onClick={() => onDelete(post.id)}
            className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            aria-label="Excluir publicação"
            title="Excluir publicação"
          >
            <Trash2 size={15} />
          </button>
        ) : post.followedByMe ? (
          <button
            type="button"
            onClick={() => onFollow(post.id)}
            className="flex items-center gap-1 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-bold text-muted-foreground transition-colors hover:bg-muted"
          >
            <Check size={12} className="text-primary" />
            Seguindo
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onFollow(post.id)}
            className="rounded-full border border-primary px-3 py-1 text-xs font-bold text-primary transition-colors hover:bg-primary/10"
          >
            Seguir
          </button>
        )}
      </div>

      <p className="mt-3 text-sm leading-relaxed text-card-foreground">{post.content}</p>

      {post.catchInfo && (post.catchInfo.species || post.catchInfo.location) && (
        <div className="mt-3 rounded-2xl border border-border bg-muted/40 p-3">
          <div className="flex items-center gap-1.5">
            <Fish size={13} className="text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Captura
            </span>
          </div>
          <p className="mt-1 text-sm font-bold text-foreground">
            {[post.catchInfo.species, post.catchInfo.weight].filter(Boolean).join(" · ") ||
              "Sua captura"}
          </p>
          <p className="text-xs text-muted-foreground">
            {[post.catchInfo.location, post.catchInfo.tide].filter(Boolean).join(" · ")}
          </p>
        </div>
      )}

      {post.photo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.photo}
          alt={`Foto de ${post.author.name}`}
          className="mt-3 h-44 w-full rounded-2xl object-cover"
        />
      )}

      <div className="mt-3 flex items-center justify-around border-t border-border pt-2">
        <button
          type="button"
          onClick={() => onToggleLike(post.id)}
          className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
            post.likedByMe ? "text-rose-500" : "text-muted-foreground hover:text-rose-400"
          }`}
        >
          <Heart size={16} className={post.likedByMe ? "fill-rose-500 text-rose-500" : ""} />
          {post.likes}
        </button>
        <button
          type="button"
          onClick={toggleComments}
          className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <MessageCircle size={16} />
          {post.commentsCount}
        </button>
        <button
          type="button"
          onClick={() => onShare(post.id)}
          className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <Share2 size={16} />
          {post.shares}
        </button>
      </div>

      {commentsOpen && (
        <div className="mt-3 space-y-2 border-t border-border pt-3">
          {commentsLoading ? (
            <div className="flex justify-center py-2">
              <Loader2 size={16} className="animate-spin text-muted-foreground" />
            </div>
          ) : comments.length === 0 ? (
            <p className="py-1 text-center text-xs text-muted-foreground">
              Seja o primeiro a comentar.
            </p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="group flex items-start gap-2">
                {comment.author.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={comment.author.avatar}
                    alt=""
                    className="mt-0.5 size-6 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-muted-foreground">
                    {comment.author.name.charAt(0).toUpperCase()}
                  </span>
                )}
                <p className="rounded-2xl rounded-tl-sm bg-muted/50 px-3 py-1.5 text-xs leading-relaxed text-card-foreground">
                  <span className="font-semibold">{comment.author.name}</span>{" "}
                  {comment.content}
                </p>
                {user?.id === comment.author.id && (
                  <button
                    type="button"
                    onClick={() => removeComment(comment.id)}
                    className="mt-0.5 size-6 shrink-0 items-center justify-center rounded-full text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                    aria-label="Excluir comentário"
                    title="Excluir comentário"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            ))
          )}

          <div className="flex items-center gap-2 pt-1">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") void submitComment();
              }}
              placeholder="Escreva um comentário..."
              className="w-full rounded-full border border-input bg-muted/50 px-3.5 py-2 text-xs text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary"
            />
            <button
              type="button"
              onClick={() => void submitComment()}
              disabled={sending || !commentText.trim()}
              className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
              aria-label="Enviar comentário"
            >
              {sending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Send size={14} />
              )}
            </button>
          </div>
        </div>
      )}
    </article>
  );
}