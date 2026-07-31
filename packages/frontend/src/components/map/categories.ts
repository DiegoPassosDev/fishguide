import { Anchor, CalendarDays, Fish, Ship, Store, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { MapCategory } from "./types";

export const CATEGORIES: Record<MapCategory, { label: string; icon: LucideIcon; color: string }> = {
  pesqueiro: { label: "Pesqueiros", icon: Fish, color: "#16a893" },
  evento: { label: "Eventos", icon: CalendarDays, color: "#f6c453" },
  amigo: { label: "Amigos", icon: Users, color: "#f472b6" },
  rampa: { label: "Rampas", icon: Anchor, color: "#3b82f6" },
  marina: { label: "Marinas", icon: Ship, color: "#8b5cf6" },
  loja: { label: "Lojas", icon: Store, color: "#f4a261" },
};

export const CATEGORY_ORDER: MapCategory[] = ["pesqueiro", "evento", "amigo", "rampa", "marina", "loja"];
