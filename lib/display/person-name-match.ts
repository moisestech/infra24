/** Normalize announcement / profile names for loose matching (accents, Wolff/Wolf). */
export function normalizePersonNameForMatch(name: string | null | undefined): string {
  if (!name || typeof name !== 'string') return '';
  return name
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[.']/g, '')
    .trim();
}
