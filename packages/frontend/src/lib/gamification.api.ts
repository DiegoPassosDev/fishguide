import api from "./api";
import type { GamificationProfile, RankingResponse } from "@/types/gamification";

export async function fetchMyGamification(): Promise<GamificationProfile> {
  const response = await api.get<GamificationProfile>("/gamification/me");
  return response.data;
}

export async function fetchRanking(
  page = 1,
  limit = 20,
): Promise<RankingResponse> {
  const response = await api.get<RankingResponse>("/gamification/ranking", {
    params: { page, limit },
  });
  return response.data;
}