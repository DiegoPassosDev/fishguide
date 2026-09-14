import api from "./api";
import type {
  CreateFishingSpotDto,
  CreateReviewDto,
  FishingSpotDetail,
  PaginatedFishingSpots,
  QueryFishingSpots,
  ReviewListResponse,
  SpotReview,
  UpdateFishingSpotDto,
  UpdateReviewDto,
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

export async function getReviews(
  spotId: string,
  params: { page?: number; limit?: number } = {}
): Promise<ReviewListResponse> {
  const response = await api.get<ReviewListResponse>(
    `/fishing-spots/${spotId}/reviews`,
    { params }
  );
  return response.data;
}

export async function createReview(
  spotId: string,
  data: CreateReviewDto
): Promise<SpotReview> {
  const response = await api.post<SpotReview>(
    `/fishing-spots/${spotId}/reviews`,
    data
  );
  return response.data;
}

export async function updateReview(
  spotId: string,
  reviewId: string,
  data: UpdateReviewDto
): Promise<SpotReview> {
  const response = await api.patch<SpotReview>(
    `/fishing-spots/${spotId}/reviews/${reviewId}`,
    data
  );
  return response.data;
}

export async function deleteReview(
  spotId: string,
  reviewId: string
): Promise<void> {
  await api.delete(`/fishing-spots/${spotId}/reviews/${reviewId}`);
}
