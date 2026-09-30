export interface AchievementDefinition {
  id: string;
  name: string;
  description: string;
  emoji: string;
  target: number;
}

export const XP_RULES = {
  postCreated: 10,
  likeReceived: 2,
  commentReceived: 5,
  follower: 5,
  tripFinished: 15,
  catch: 10,
  reviewGiven: 10,
  spotCreated: 25,
  favoriteGiven: 2,
} as const;

export const LEVELS = [
  { number: 1, name: 'Pescador Iniciante', minXp: 0 },
  { number: 2, name: 'Aprendiz de Maré', minXp: 50 },
  { number: 3, name: 'Pescador Recreativo', minXp: 150 },
  { number: 4, name: 'Pescador Experiente', minXp: 400 },
  { number: 5, name: 'Mestre da Linha', minXp: 800 },
  { number: 6, name: 'Lenda do FishGuide', minXp: 1500 },
];

export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: 'first-catch',
    name: 'Primeira Captura',
    description: 'Registrou a primeira captura',
    emoji: '🎣',
    target: 1,
  },
  {
    id: 'collector',
    name: 'Colecionador',
    description: 'Capturou 10 espécies diferentes',
    emoji: '🐟',
    target: 10,
  },
  {
    id: 'prolific',
    name: 'Pescador Prolífico',
    description: 'Registrou 20 capturas',
    emoji: '🏅',
    target: 20,
  },
  {
    id: 'first-post',
    name: 'Primeira Publicação',
    description: 'Publicou no feed da comunidade',
    emoji: '📣',
    target: 1,
  },
  {
    id: 'voice',
    name: 'Voz da Comunidade',
    description: 'Recebeu 50 curtidas nas publicações',
    emoji: '💬',
    target: 50,
  },
  {
    id: 'commenter',
    name: 'Comentarista',
    description: 'Recebeu 10 comentários',
    emoji: '🗣️',
    target: 10,
  },
  {
    id: 'networker',
    name: 'Redes de Pesca',
    description: 'Alcançou 5 seguidores',
    emoji: '🤝',
    target: 5,
  },
  {
    id: 'explorer',
    name: 'Explorador',
    description: 'Pesca finalizada em 5 pesqueiros diferentes',
    emoji: '🗺️',
    target: 5,
  },
  {
    id: 'weekend-warrior',
    name: 'Guerreiro de Fim de Semana',
    description: 'Finalizou 10 pescarias',
    emoji: '📅',
    target: 10,
  },
  {
    id: 'critic',
    name: 'Crítico',
    description: 'Enviou 5 avaliações de pesqueiros',
    emoji: '⭐',
    target: 5,
  },
  {
    id: 'cartographer',
    name: 'Cartógrafo',
    description: 'Cadastrou 3 pesqueiros no mapa',
    emoji: '🧭',
    target: 3,
  },
  {
    id: 'legend',
    name: 'Lenda',
    description: 'Alcançou o nível Mestre da Linha (5+)',
    emoji: '👑',
    target: 5,
  },
];

export interface LevelInfo {
  number: number;
  name: string;
  currentThreshold: number;
  nextThreshold: number | null;
  progress: number;
}

export function getLevel(xp: number): LevelInfo {
  const ordered = [...LEVELS].sort((a, b) => a.minXp - b.minXp);
  let current = ordered[0];
  for (const level of ordered) {
    if (xp >= level.minXp) current = level;
  }
  const next = ordered.find((level) => level.minXp > current.minXp);
  if (!next) {
    return {
      number: current.number,
      name: current.name,
      currentThreshold: current.minXp,
      nextThreshold: null,
      progress: 1,
    };
  }
  const span = next.minXp - current.minXp;
  const progress = Math.min(1, Math.max(0, (xp - current.minXp) / span));
  return {
    number: current.number,
    name: current.name,
    currentThreshold: current.minXp,
    nextThreshold: next.minXp,
    progress,
  };
}
