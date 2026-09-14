"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Plus, RefreshCw } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { CommunityTopics } from "@/components/community/CommunityTopics";
import { ComposerModal } from "@/components/community/ComposerModal";
import { PostCard } from "@/components/community/PostCard";
import { TOPIC_ORDER } from "@/components/community/CommunityTopics";
import { useToast } from "@/contexts/ToastContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import {
  createPost,
  deletePost,
  fetchPosts,
  fetchTopics,
  sharePost,
  toggleFollow,
  togglePostLike,
} from "@/lib/community.api";
import type { CommunityPost, CreatePostInput, TopicCount } from "@/types/community";

export default function CommunityPage() {
  const { showToast } = useToast();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [topics, setTopics] = useState<TopicCount[]>([]);
  const [activeTopic, setActiveTopic] = useState("Para Você");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [composerOpen, setComposerOpen] = useState(false);

  const topicsWithAll = useMemo(
    () => [{ name: "Para Você", count: posts.length }, ...topics],
    [topics, posts.length],
  );

  async function loadTopics() {
    try {
      const data = await fetchTopics();
      setTopics(
        data.map((topic) => ({
          name: topic.name,
          count: topic.count,
        })),
      );
    } catch {
      // Topics são opcionais — feed continua funcionando
    }
  }

  async function loadPosts(topic?: string) {
    setLoading(posts.length === 0);
    setError(undefined);
    try {
      const data = await fetchPosts(topic);
      setPosts(data);
    } catch {
      setError("Não conseguimos carregar as publicações.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [loadedPosts, loadedTopics] = await Promise.all([
          fetchPosts(),
          fetchTopics().catch(() => [] as TopicCount[]),
        ]);
        if (cancelled) return;
        setPosts(loadedPosts);
        setTopics(loadedTopics);
      } catch {
        if (!cancelled) setError("Não conseguimos carregar as publicações.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function selectTopic(name: string) {
    setActiveTopic(name);
    void loadPosts(name === "Para Você" ? undefined : name);
  }

  async function toggleLike(id: string) {
    try {
      const result = await togglePostLike(id);
      setPosts((prev) =>
        prev.map((post) =>
          post.id === id
            ? { ...post, likedByMe: result.liked, likes: result.likes }
            : post,
        ),
      );
    } catch {
      showToast("Não foi possível curtir agora.", "error");
    }
  }

  async function handleShare(id: string) {
    try {
      const result = await sharePost(id);
      setPosts((prev) =>
        prev.map((post) => (post.id === id ? { ...post, shares: result.shares } : post)),
      );
      showToast("Publicação compartilhada!", "success");
    } catch {
      showToast("Não foi possível compartilhar agora.", "error");
    }
  }

  async function handleFollow(postId: string) {
    try {
      const result = await toggleFollow(postId);
      setPosts((prev) =>
        prev.map((post) =>
          post.author.id === result.authorId
            ? { ...post, followedByMe: result.followed }
            : post,
        ),
      );
      const authorName = posts.find((p) => p.author.id === result.authorId)?.author.name ?? "o autor";
      showToast(
        result.followed
          ? `Você começou a seguir ${authorName}`
          : `Você deixou de seguir ${authorName}`,
        "success",
      );
    } catch {
      showToast("Não foi possível seguir agora.", "error");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Excluir esta publicação?")) return;
    try {
      await deletePost(id);
      setPosts((prev) => prev.filter((post) => post.id !== id));
      showToast("Publicação excluída.", "success");
    } catch {
      showToast("Não foi possível excluir a publicação.", "error");
    }
  }

  function bumpComment(id: string, delta: 1 | -1) {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? { ...post, commentsCount: Math.max(0, post.commentsCount + delta) }
          : post,
      ),
    );
  }

  async function publish(draft: CreatePostInput): Promise<boolean> {
    try {
      const created = await createPost(draft);
      setPosts((prev) => [created, ...prev]);
      setActiveTopic("Para Você");
      void loadTopics();
      showToast("Publicação criada!", "success");
      return true;
    } catch {
      showToast("Não foi possível publicar. Tente novamente.", "error");
      return false;
    }
  }

  return (
    <ProtectedRoute>
      <div className="relative mx-auto flex h-dvh w-full max-w-105 flex-col overflow-hidden bg-background">
        <Header />

        <main className="flex-1 overflow-y-auto px-3 pt-2 pb-25">
          <div className="mb-3 px-1">
            <h1 className="font-heading text-xl font-bold text-foreground">Comunidade</h1>
            <p className="text-xs text-muted-foreground">Publicações de pescadores como você</p>
          </div>

          <button
            type="button"
            onClick={() => setComposerOpen(true)}
            className="mt-5 mb-4 flex w-full items-center justify-center gap-2 rounded-full border border-border bg-card py-3 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-accent"
          >
            <Plus size={16} className="text-primary" />
            Nova publicação
          </button>

          <div className="mb-4">
            <CommunityTopics
              topics={topicsWithAll}
              active={activeTopic}
              onSelect={selectTopic}
            />
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 size={24} className="animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
              <p className="text-sm font-semibold text-foreground">{error}</p>
              <button
                type="button"
                onClick={() => void loadPosts()}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                <RefreshCw size={14} />
                Tentar novamente
              </button>
            </div>
          ) : posts.length === 0 ? (
            <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
              <p className="text-sm font-semibold text-foreground">
                {activeTopic === "Para Você"
                  ? "Nenhuma publicação ainda"
                  : `Nenhuma publicação sobre ${activeTopic}`}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {activeTopic === "Para Você"
                  ? "Seja o primeiro a compartilhar sua pescaria."
                  : "Seja o primeiro a postar sobre esse assunto."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onToggleLike={(id) => void toggleLike(id)}
                  onShare={(id) => void handleShare(id)}
                  onFollow={(postId) => void handleFollow(postId)}
                  onDelete={(id) => void handleDelete(id)}
                  onCommentAdded={(id) => bumpComment(id, 1)}
                  onCommentRemoved={(id) => bumpComment(id, -1)}
                />
              ))}
            </div>
          )}
        </main>

        <BottomNav />

        {composerOpen && (
          <ComposerModal
            topics={TOPIC_ORDER}
            onClose={() => setComposerOpen(false)}
            onPublish={publish}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}