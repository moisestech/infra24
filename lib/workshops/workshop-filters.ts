/** Shared catalog filters for org + DCC public workshop surfaces. */

export function isAdultStudioWorkshop(w: {
  category: string
  metadata?: Record<string, unknown> | null
}): boolean {
  if (w.category === 'adult_studio_classes') return true
  const meta = w.metadata as Record<string, unknown> | null | undefined
  return meta?.program === 'adult_art_classes'
}
