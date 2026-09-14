export interface GamificationLevel {
  number: number;
  name: string;
  currentThreshold: number;
  nextThreshold: number | null;
  progress: number;
}

export interface GamificationStats {
  posts: number;
  likesReceived: number;
  commentsReceived: number;
  followers: number;
  following: number;
  trips: number;
  catches: number;
  species: number;
  reviews: number;
  spots: number;
  distinctSpots: number;
  biggestCatchKg: number | null;
}

export interface XpBreakdown {
  posts: number;
  likesReceived: number;
  commentsReceived: number;
  followers: number;
  trips: number;
  catches: number;
  reviews: number;
  spots: number;
}

export interface GamificationAchievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  current: number;
  target: number;
  unlocked: boolean;
  progress: number;
}

export interface GamificationProfile {
  userId: string;
  name: string;
  avatar: string | null;
  verified: boolean;
  xp: number;
  xpBreakdown: XpBreakdown;
  level: GamificationLevel;
  achievements: GamificationAchievement[];
  stats: GamificationStats;
}

export interface RankingItem {
  position: number;
  userId: string;
  name: string;
  avatar: string | null;
  verified: boolean;
  city: string | null;
  xp: number;
  levelNumber: number;
  levelName: string;
  unlockedCount: number;
}

export interface RankingResponse {
  items: RankingItem[];
  total: number;
  page: number;
  limit: number;
  myPosition: number | null;
}