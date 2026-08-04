import api from "./api";
import type {
  CreateFishingSpotDto,
  FishingSpotDetail,
  PaginatedFishingSpots,
  QueryFishingSpots,
  UpdateFishingSpotDto,
} from "@/types/fishing-spots";

export async function getFishingSpots(
  params: QueryFishingSpots = {}
): Promise<PaginatedFishingSpots> {
  const response = await api.get<PaginatedFishingSpots>("/fishing-spots", { params });
  return response.data;
}

export async function getFishingSpot(id: string): Promise<FishingSpotDetail> {
  const response = await api.get<FishingSpotDetail>(`/fishing-spots/${id}`);
  return response.data;
}

export async function createFishingSpot(data: CreateFishingSpotDto): Promise<FishingSpotDetail> {
  const response = await api.post<FishingSpotDetail>("/fishing-spots", data);
  return response.data;
}

export async function updateFishingSpot(
  id: string,
  data: UpdateFishingSpotDto
): Promise<FishingSpotDetail> {
  const response = await api.patch<FishingSpotDetail>(`/fishing-spots/${id}`, data);
  return response.data;
}

export async function deleteFishingSpot(id: string): Promise<void> {
  await api.delete(`/fishing-spots/${id}`);
}
