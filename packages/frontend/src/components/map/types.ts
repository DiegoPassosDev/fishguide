export type MapCategory = "pesqueiro" | "evento" | "amigo" | "rampa" | "marina" | "loja";

export interface MapSpot {
  id: string | number;
  name: string;
  category: MapCategory;
  x: number;
  y: number;
  distanceKm: number;
  rating?: number;
  detail?: string;
}
