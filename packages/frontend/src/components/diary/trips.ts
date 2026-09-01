export function parseWeightKg(weight: string): number {
  const match = weight.trim().match(/^([\d,]+)/);
  return match ? parseFloat(match[1].replace(",", ".")) : 0;
}

export function formatWeight(kg: number): string {
  if (kg <= 0) return "—";
  const text = String(Math.round(kg * 10) / 10).replace(".", ",");
  return `${text} kg`;
}
