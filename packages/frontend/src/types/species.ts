export interface Species {
  id: string;
  name: string;
  scientificName?: string | null;
  photo?: string | null;
  averageWeight?: number | null;
  averageLength?: number | null;
  habitat?: string | null;
  feeding?: string | null;
  bestSeason?: string | null;
  bestTide?: string | null;
  bestMoon?: string | null;
  bestBait?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SpeciesSpot {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  spotType?: string | null;
  rating: number;
}

export interface SpeciesDetail extends Species {
  spots: SpeciesSpot[];
}

export interface PaginatedSpecies {
  items: Species[];
  total: number;
  limit: number;
  offset: number;
}

export interface QuerySpecies {
  search?: string;
  habitat?: string;
  limit?: number;
  offset?: number;
}

export interface CreateSpeciesDto {
  name: string;
  scientificName?: string;
  photo?: string;
  averageWeight?: number;
  averageLength?: number;
  habitat?: string;
  feeding?: string;
  bestSeason?: string;
  bestTide?: string;
  bestMoon?: string;
  bestBait?: string;
}

export type UpdateSpeciesDto = Partial<CreateSpeciesDto>;
