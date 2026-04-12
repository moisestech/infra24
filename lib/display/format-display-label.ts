/** Human-readable labels for smart-sign / display UI (avoid raw snake_case). */
export function formatDisplayLabel(raw: string | null | undefined): string {
  if (!raw?.trim()) return '';
  const spaced = raw.replace(/_/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
  return spaced.replace(/\b\w/g, (c) => c.toUpperCase());
}
