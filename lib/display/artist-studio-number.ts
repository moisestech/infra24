/** Studio number for display cards (matches artists listing: location column or metadata.studio). */
export function studioNumberFromArtistPayload(a: {
  studio_location?: string | null;
  metadata?: Record<string, unknown> | null;
}): string {
  const fromMeta =
    a.metadata && typeof a.metadata.studio === 'string' ? a.metadata.studio.trim() : '';
  return (String(a.studio_location || '').trim() || fromMeta).trim();
}
