export type MapCategory = "pesqueiro" | "evento" | "amigo" | "rampa" | "marina" | "loja";

export interface MapSpot {
  id: number;
  name: string;
  category: MapCategory;
  x: number;
  y: number;
  distanceKm: number;
  rating?: number;
  detail?: string;
}
