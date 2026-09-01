"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { CommunityTopics } from "@/components/community/CommunityTopics";
import { ComposerModal } from "@/components/community/ComposerModal";
import { PostCard } from "@/components/community/PostCard";
import { TOPIC_ORDER } from "@/components/community/CommunityTopics";
import { useAuth } from "@/contexts/useAuth";
import type { Post, PostCatch } from "@/components/community/types";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

const mockPosts: Post[] = [
  {
    id: 1,
    authorName: "Marina Costa",
    avatarColor: "bg-teal",
    followed: true,
    topic: "Robalo",
    timeAgo: "há 12 min",
    content: "Manhã mágica no Saco! Robalo de 4,2 kg na maré enchendo. Isca: camarão vivo.",
    photo: true,
    catch: { species: "Robalo", weight: "4,2 kg", location: "Praia do Saco", tide: "Enchendo" },
    likes: 24,
    comments: [
      { id: 1, author: "Carlos P.", text: "Que robalo! Parabéns!" },
      { id: 2, author: "João M.", text: "Maré enchendo é certeza. Belo registro." },
    ],
    shares: 3,
    liked: false,
  },
  {
    id: 2,
    authorName: "Carlos P.",
    avatarColor: "bg-blue-500",
    followed: false,
    topic: "Dicas",
    timeAgo: "há 1 h",
    content: "Dica de hoje: observe as aves. Garças concentradas indicam cardume ativo de sardinha, e o robalo vem logo atrás.",
    likes: 18,
    comments: [],
    shares: 5,
    liked: false,
  },
  {
    id: 3,
    authorName: "Ana Souza",
    avatarColor: "bg-pink-500",
    followed: false,
    topic: "Equipamentos",
    timeAgo: "há 2 h",
    content: "Vara nova de 7'6\" com ação rápida. Testando com molinete 4000. Alguém recomenda linha trançada de 20lb?",
    likes: 9,
    comments: [
      { id: 3, author: "Pedro R.", text: "Uso trançada 30lb e recomendo!" },
    ],
    shares: 1,
    liked: false,
  },
  {
    id: 4,
    authorName: "Marina Baía Azul",
    avatarColor: "bg-violet-500",
    followed: false,
    topic: "Eventos",
    timeAgo: "há 3 h",
    content: "Inscrições abertas para o Torneio de Corvina de sábado. Largada às 06h na Marina Baía Azul. Vagas limitadas!",
    likes: 15,
    comments: [],
    shares: 8,
    liked: false,
  },
  {
    id: 5,
    authorName: "João Mendes",
    avatarColor: "bg-amber-500",
    followed: true,
    topic: "Corvina",
    timeAgo: "há 5 h",
    content: "Corvinas grandes no Costão da Ilha essa noite. Foto só da maior, 3,1 kg.",
    photo: true,
    catch: { species: "Corvina", weight: "3,1 kg", location: "Costão da Ilha", tide: "Noite" },
    likes: 31,
    comments: [],
    shares: 4,
    liked: true,
  },
  {
    id: 6,
    authorName: "Dona Lúcia",
    avatarColor: "bg-rose-500",
    followed: false,
    topic: "Tainha",
    timeAgo: "há 8 h",
    content: "Receita de tainha assada com a pescaria de ontem. Compartilho o passo a passo se quiserem!",
    likes: 12,
    comments: [],
    shares: 2,
    liked: false,
  },
];

export default function CommunityPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [activeTopic, setActiveTopic] = useState("Para Você");
  const [composerOpen, setComposerOpen] = useState(false);

  const topics = useMemo(() => {
    const counts = new Map<string, number>();
    for (const post of posts) counts.set(post.topic, (counts.get(post.topic) ?? 0) + 1);
    const sorted = [...counts.entries()].sort(
      (a, b) => TOPIC_ORDER.indexOf(a[0]) - TOPIC_ORDER.indexOf(b[0]),
    );
    return [
      { name: "Para Você", count: posts.length },
      ...sorted.map(([name, count]) => ({ name, count })),
    ];
  }, [posts]);

  const filtered =
    activeTopic === "Para Você" ? posts : posts.filter((post) => post.topic === activeTopic);

  function toggleLike(id: number) {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? { ...post, liked: !post.liked, likes: post.likes + (post.liked ? -1 : 1) }
          : post,
      ),
    );
  }

  function addComment(id: number, text: string) {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? { ...post, comments: [...post.comments, { id: Date.now(), author: user?.name?.split(" ")[0] ?? "Você", text }] }
          : post,
      ),
    );
  }

  function share(id: number) {
    setPosts((prev) =>
      prev.map((post) => (post.id === id ? { ...post, shares: post.shares + 1 } : post)),
    );
  }

  function follow(id: number) {
    setPosts((prev) =>
      prev.map((post) => (post.id === id ? { ...post, followed: !post.followed } : post)),
    );
  }

  function publish(draft: { topic: string; content: string; catch?: PostCatch; photoUrl?: string }) {
    const name = user?.name ?? "Você";
    setPosts((prev) => [
      {
        id: Date.now(),
        authorName: name,
        avatarColor: "bg-teal",
        followed: true,
        topic: draft.topic,
        timeAgo: "agora",
        content: draft.content,
        photoUrl: draft.photoUrl,
        catch: draft.catch,
        likes: 0,
        comments: [],
        shares: 0,
        liked: false,
      },
      ...prev,
    ]);
    setActiveTopic("Para Você");
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
          <CommunityTopics topics={topics} active={activeTopic} onSelect={setActiveTopic} />
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
            <p className="text-sm font-semibold text-foreground">Nenhuma publicação</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Seja o primeiro a postar sobre {activeTopic}.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onToggleLike={toggleLike}
                onAddComment={addComment}
                onShare={share}
                onFollow={follow}
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
