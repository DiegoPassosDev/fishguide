export interface LatLng {
  latitude: number;
  longitude: number;
}

export interface Bounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export const MAP_BOUNDS: Bounds = {
  north: -11.0,
  south: -11.25,
  east: -37.0,
  west: -37.3,
};

export function projectToMap(point: LatLng, bounds: Bounds = MAP_BOUNDS): { x: number; y: number } {
  const x = ((point.longitude - bounds.west) / (bounds.east - bounds.west)) * 100;
  const y = ((bounds.north - point.latitude) / (bounds.north - bounds.south)) * 100;
  return {
    x: Math.min(100, Math.max(0, x)),
    y: Math.min(100, Math.max(0, y)),
  };
}

export function haversineKm(a: LatLng, b: LatLng): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
