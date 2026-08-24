import { editorialHref, editorialJournalCategory } from '@/lib/dcc/culture/taxonomy'
import type { DccEditorial } from '@/lib/dcc/culture/types'

/**
 * Journal records. Medium-agnostic: written, video, audio, or a combination.
 * Do not invent conversations, quotations, or guests.
 *
 * TODO — first DCC Conversations (do not invent guests):
 * - title, dek, type: 'conversation'
 * - artistIds + programIds (e.g. clandestine-2026)
 * - body or bodyPath under content/journal/<slug>.md
 * - optional videoUrl / audioUrl once a recording exists
 */
export const DCC_EDITORIAL: DccEditorial[] = []

export function isPublishedEditorial(entry: DccEditorial): boolean {
  return (entry.status ?? 'published') === 'published'
}

export function listEditorial(
  editorial: readonly DccEditorial[] = DCC_EDITORIAL
): DccEditorial[] {
  return editorial.filter(isPublishedEditorial)
}

export function listFeaturedEditorial(
  editorial: readonly DccEditorial[] = DCC_EDITORIAL
): DccEditorial[] {
  return listEditorial(editorial).filter((entry) => entry.featured)
}

export function listEditorialByType(
  type: DccEditorial['type'],
  editorial: readonly DccEditorial[] = DCC_EDITORIAL
): DccEditorial[] {
  return listEditorial(editorial).filter((entry) => entry.type === type)
}

export function getEditorialById(
  id: string,
  editorial: readonly DccEditorial[] = DCC_EDITORIAL
): DccEditorial | undefined {
  return editorial.find((entry) => entry.id === id)
}

export function getEditorialBySlug(
  slug: string,
  editorial: readonly DccEditorial[] = DCC_EDITORIAL
): DccEditorial | undefined {
  return editorial.find((entry) => entry.slug === slug)
}

export function getPublishedEditorialBySlug(
  slug: string,
  editorial: readonly DccEditorial[] = DCC_EDITORIAL
): DccEditorial | undefined {
  const entry = getEditorialBySlug(slug, editorial)
  if (!entry || !isPublishedEditorial(entry)) return undefined
  return entry
}

export function getEditorialPublicPath(entry: DccEditorial): string {
  return editorialHref(editorialJournalCategory(entry.type), entry.slug)
}

export function assertEditorialSlugsValid(
  editorial: readonly DccEditorial[] = DCC_EDITORIAL
): string[] {
  const errors: string[] = []
  const slugs = new Set<string>()
  const ids = new Set<string>()
  for (const entry of editorial) {
    if (!entry.id) errors.push('editorial missing id')
    if (!entry.slug) errors.push(`editorial ${entry.id} missing slug`)
    if (ids.has(entry.id)) errors.push(`duplicate editorial id ${entry.id}`)
    if (slugs.has(entry.slug)) errors.push(`duplicate editorial slug ${entry.slug}`)
    ids.add(entry.id)
    slugs.add(entry.slug)
  }
  return errors
}
