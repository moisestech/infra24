import { programCategoryForType, programHref } from '@/lib/dcc/culture/taxonomy'
import type { DccProgram } from '@/lib/dcc/culture/types'

/**
 * Public cultural programs. Clandestine is Program 001.
 *
 * Known facts only. Do not invent dates, venue, artist names, artworks, or sales terms.
 */
export const DCC_PROGRAMS: DccProgram[] = [
  {
    id: 'clandestine-2026',
    slug: 'clandestine-art-fair-2026',
    title: 'DCC MIA at Clandestine Art Fair 2026',
    subtitle: 'Program 001',
    type: 'art-fair',
    node: 'DCC MIA',
    shortDescription:
      'DCC MIA will present three artists at Clandestine Art Fair. This page is the lasting program record — before, during and after Art Week.',
    description:
      'DCC MIA will have its own presentation at Clandestine Art Fair and plans to present three artists. The artists are already investing in their fair participation; this program is first about presentation, context, documentation and audience.\n\nArtist names, selected works, exact dates and location will be published here when confirmed. After the fair, this page will hold documentation, a recap and related DCC Conversations.\n\nDCC is not listing a gallery commission or sales structure on this page. Sales, if any, will be described only when the terms are real and disclosed in advance.',
    artistIds: [],
    projectIds: [],
    editorialIds: [],
    status: 'upcoming',
    featured: true,
    seoTitle: 'DCC MIA at Clandestine Art Fair 2026',
    seoDescription:
      'DCC MIA presents three artists at Clandestine Art Fair 2026. Artist names, dates and location will be published when confirmed.',
  },
]

export function isListedProgram(program: DccProgram): boolean {
  return program.status !== 'draft'
}

export function listPrograms(
  programs: readonly DccProgram[] = DCC_PROGRAMS
): DccProgram[] {
  return programs.filter(isListedProgram)
}

export function listCurrentOrUpcomingPrograms(
  programs: readonly DccProgram[] = DCC_PROGRAMS
): DccProgram[] {
  return listPrograms(programs).filter(
    (program) => program.status === 'upcoming' || program.status === 'current'
  )
}

export function listPastPrograms(
  programs: readonly DccProgram[] = DCC_PROGRAMS
): DccProgram[] {
  return listPrograms(programs).filter((program) => program.status === 'past')
}

export function listFeaturedPrograms(
  programs: readonly DccProgram[] = DCC_PROGRAMS
): DccProgram[] {
  return listPrograms(programs).filter((program) => program.featured)
}

export function getProgramById(
  id: string,
  programs: readonly DccProgram[] = DCC_PROGRAMS
): DccProgram | undefined {
  return programs.find((program) => program.id === id)
}

export function getProgramBySlug(
  slug: string,
  programs: readonly DccProgram[] = DCC_PROGRAMS
): DccProgram | undefined {
  return programs.find((program) => program.slug === slug)
}

export function getListedProgramBySlug(
  slug: string,
  programs: readonly DccProgram[] = DCC_PROGRAMS
): DccProgram | undefined {
  const program = getProgramBySlug(slug, programs)
  if (!program || !isListedProgram(program)) return undefined
  return program
}

export function getProgramPublicPath(program: DccProgram): string {
  return programHref(programCategoryForType(program.type), program.slug)
}

export function assertProgramSlugsValid(
  programs: readonly DccProgram[] = DCC_PROGRAMS
): string[] {
  const errors: string[] = []
  const slugs = new Set<string>()
  const ids = new Set<string>()
  for (const program of programs) {
    if (!program.id) errors.push('program missing id')
    if (!program.slug) errors.push(`program ${program.id} missing slug`)
    if (ids.has(program.id)) errors.push(`duplicate program id ${program.id}`)
    if (slugs.has(program.slug)) errors.push(`duplicate program slug ${program.slug}`)
    ids.add(program.id)
    slugs.add(program.slug)
  }
  return errors
}
