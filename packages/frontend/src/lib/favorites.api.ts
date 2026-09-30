import api from "./api";
import type { FavoriteToggleResponse, MyFavorites } from "@/types/favorites";

export async function getMyFavorites(): Promise<MyFavorites> {
  const response = await api.get<MyFavorites>("/favorites");
  return response.data;
}

export async function toggleFavoriteSpot(
  spotId: string
): Promise<FavoriteToggleResponse> {
  const response = await api.post<FavoriteToggleResponse>(`/favorites/spots/${spotId}`);
  return response.data;
}

export async function toggleFavoriteSpecies(
  speciesId: string
): Promise<FavoriteToggleResponse> {
  const response = await api.post<FavoriteToggleResponse>(`/favorites/species/${speciesId}`);
  return response.data;
}
