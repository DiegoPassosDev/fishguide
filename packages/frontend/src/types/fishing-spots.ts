export type SpotType =
  | "BEACH"
  | "RIVER"
  | "MANGROVE"
  | "ROCKY_SHORE"
  | "DAM"
  | "OPEN_SEA"
  | "ESTUARY"
  | "CANAL";

export type SpotVisibility = "public" | "friends" | "private" | "approximate";

export interface FishingSpotSummary {
  id: string;
  name: string;
  description?: string | null;
  latitude: number;
  longitude: number;
  spotType?: SpotType | null;
  accessType?: string | null;
  structure?: string | null;
  photos: string[];
  privacy: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
  };
}

export interface SpotSpecies {
  id: string;
  name: string;
  scientificName?: string | null;
  photo?: string | null;
  averageWeight?: number | null;
  averageLength?: number | null;
  bestBait?: string | null;
}

export interface SpotReview {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
  };
}

export interface FishingSpotDetail extends FishingSpotSummary {
  species: SpotSpecies[];
  reviews: SpotReview[];
}

export interface PaginatedFishingSpots {
  items: FishingSpotSummary[];
  total: number;
  limit: number;
  offset: number;
}

export interface QueryFishingSpots {
  search?: string;
  spotType?: SpotType;
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  limit?: number;
  offset?: number;
}

export interface CreateFishingSpotDto {
  name: string;
  latitude: number;
  longitude: number;
  description?: string;
  spotType?: SpotType;
  accessType?: string;
  structure?: string;
  photos?: string[];
  privacy?: SpotVisibility;
}

export interface UpdateFishingSpotDto extends Partial<CreateFishingSpotDto> {}
