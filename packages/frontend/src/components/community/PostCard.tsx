"use client";

import { useState } from "react";
import { Camera, Check, Fish, Heart, MessageCircle, Send, Share2 } from "lucide-react";
import type { Post } from "./types";

interface PostCardProps {
  post: Post;
  onToggleLike: (id: number) => void;
  onAddComment: (id: number, text: string) => void;
  onShare: (id: number) => void;
  onFollow: (id: number) => void;
}

export function PostCard({ post, onToggleLike, onAddComment, onShare, onFollow }: PostCardProps) {
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentText, setCommentText] = useState("");

  function submitComment() {
    const text = commentText.trim();
    if (!text) return;
    onAddComment(post.id, text);
    setCommentText("");
  }

  return (
    <article className="rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span
          className={`flex size-10 shrink-0 items-center justify-center rounded-full ${post.avatarColor} font-heading text-sm font-bold text-white`}
        >
          {post.authorName.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-foreground">{post.authorName}</p>
          <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className="rounded-full bg-muted px-2 py-0.5 font-semibold text-muted-foreground">
              {post.topic}
            </span>
            {post.timeAgo}
          </p>
        </div>
        {post.followed ? (
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

      {post.catch && (
        <div className="mt-3 rounded-2xl border border-border bg-muted/40 p-3">
          <div className="flex items-center gap-1.5">
            <Fish size={13} className="text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Captura
            </span>
          </div>
          <p className="mt-1 text-sm font-bold text-foreground">
            {post.catch.species} · {post.catch.weight}
          </p>
          <p className="text-xs text-muted-foreground">
            {post.catch.location} · {post.catch.tide}
          </p>
        </div>
      )}

      {post.photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.photoUrl}
          alt={`Foto de ${post.authorName}`}
          className="mt-3 h-44 w-full rounded-2xl object-cover"
        />
      ) : post.photo ? (
        <div className="mt-3 flex h-44 items-center justify-center rounded-2xl bg-linear-to-br from-sky-800 to-navy-mid">
          <Camera size={28} className="text-white/40" />
        </div>
      ) : null}

      <div className="mt-3 flex items-center justify-around border-t border-border pt-2">
        <button
          type="button"
          onClick={() => onToggleLike(post.id)}
          className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
            post.liked ? "text-rose-500" : "text-muted-foreground hover:text-rose-400"
          }`}
        >
          <Heart size={16} className={post.liked ? "fill-rose-500 text-rose-500" : ""} />
          {post.likes}
        </button>
        <button
          type="button"
          onClick={() => setCommentsOpen((v) => !v)}
          className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <MessageCircle size={16} />
          {post.comments.length}
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
          {post.comments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-2">
              <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-muted-foreground">
                {comment.author.charAt(0).toUpperCase()}
              </span>
              <p className="rounded-2xl rounded-tl-sm bg-muted/50 px-3 py-1.5 text-xs leading-relaxed text-card-foreground">
                <span className="font-semibold">{comment.author}</span> {comment.text}
              </p>
            </div>
          ))}

          <div className="flex items-center gap-2 pt-1">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitComment();
              }}
              placeholder="Escreva um comentário..."
              className="w-full rounded-full border border-input bg-muted/50 px-3.5 py-2 text-xs text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary"
            />
            <button
              type="button"
              onClick={submitComment}
              className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90"
              aria-label="Enviar comentário"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
