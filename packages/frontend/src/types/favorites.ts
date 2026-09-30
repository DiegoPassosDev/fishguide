import type { FishingSpotSummary } from "./fishing-spots";
import type { Species } from "./species";

export type FavoriteTarget = "spot" | "species";

export interface FavoriteToggleResponse {
  target: FavoriteTarget;
  id: string;
  favorited: boolean;
  favoritesCount: number;
}

export interface MyFavorites {
  spots: FishingSpotSummary[];
  species: Species[];
}
