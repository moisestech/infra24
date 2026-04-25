import { mergeWorkshopMetadata } from '@/lib/workshops/marketing-metadata'

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function isWorkshopUuid(segment: string): boolean {
  return UUID_RE.test(segment)
}

/**
 * Preferred public path: slug from metadata when present, else UUID.
 */
export function getWorkshopPublicPath(
  orgSlug: string,
  workshop: { id: string; metadata?: Record<string, unknown> | null }
): string {
  const m = mergeWorkshopMetadata(workshop.metadata ?? undefined, {
    id: workshop.id,
    title: '',
  })
  const segment = m.slug || workshop.id
  return `/o/${orgSlug}/workshop/${segment}`
}

/** Public DCC marketing path (no org segment). */
export function getDccWorkshopPublicPath(workshop: {
  id: string
  metadata?: Record<string, unknown> | null
}): string {
  const m = mergeWorkshopMetadata(workshop.metadata ?? undefined, {
    id: workshop.id,
    title: '',
  })
  const segment = m.slug || workshop.id
  return `/workshops/${encodeURIComponent(segment)}`
}
