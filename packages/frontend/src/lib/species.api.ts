import api from "./api";
import type {
  CreateSpeciesDto,
  PaginatedSpecies,
  QuerySpecies,
  Species,
  SpeciesDetail,
  UpdateSpeciesDto,
} from "@/types/species";

export async function getSpecies(params: QuerySpecies = {}): Promise<PaginatedSpecies> {
  const response = await api.get<PaginatedSpecies>("/species", { params });
  return response.data;
}

export async function getSpeciesById(id: string): Promise<SpeciesDetail> {
  const response = await api.get<SpeciesDetail>(`/species/${id}`);
  return response.data;
}

export async function createSpecies(data: CreateSpeciesDto): Promise<Species> {
  const response = await api.post<Species>("/species", data);
  return response.data;
}

export async function updateSpecies(id: string, data: UpdateSpeciesDto): Promise<Species> {
  const response = await api.patch<Species>(`/species/${id}`, data);
  return response.data;
}

export async function deleteSpecies(id: string): Promise<void> {
  await api.delete(`/species/${id}`);
}
