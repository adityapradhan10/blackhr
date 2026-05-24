/** Vibrant palette used across dashboard charts (Tailwind 500 shades). */
export const CHART_PALETTE = [
  '#6366f1', // indigo
  '#0ea5e9', // sky
  '#06b6d4', // cyan
  '#8b5cf6', // violet
  '#10b981', // emerald
  '#f59e0b', // amber
  '#f43f5e', // rose
  '#ec4899', // pink
  '#14b8a6', // teal
  '#84cc16', // lime
] as const;

export function getChartColor(index: number): string {
  return CHART_PALETTE[index % CHART_PALETTE.length];
}
