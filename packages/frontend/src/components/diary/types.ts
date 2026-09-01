import type { ActiveTrip } from "../fishing/types";

export interface TripRecord extends ActiveTrip {
  finishedAt?: number;
}
