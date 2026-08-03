"use client";

export const TOPIC_ORDER = ["Robalo", "Corvina", "Tainha", "Dicas", "Equipamentos", "Eventos"];

interface CommunityTopicsProps {
  topics: { name: string; count: number }[];
  active: string;
  onSelect: (name: string) => void;
}

export function CommunityTopics({ topics, active, onSelect }: CommunityTopicsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {topics.map((topic) => {
        const isActive = topic.name === active;
        return (
          <button
            key={topic.name}
            type="button"
            onClick={() => onSelect(topic.name)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
              isActive
                ? "border-transparent bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:bg-accent"
            }`}
          >
            {topic.name}
            <span
              className={`rounded-full px-1.5 text-[10px] ${
                isActive ? "bg-white/25 text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {topic.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
