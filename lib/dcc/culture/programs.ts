import { programCategoryForType, programHref } from '@/lib/dcc/culture/taxonomy'
import type { DccProgram } from '@/lib/dcc/culture/types'

/**
 * Public cultural programs.
 *
 * DCC MIA is not participating in Clandestine Art Fair 2026. Do not republish that
 * program, roster, or dates. The public cultural record that is live is the journal.
 *
 * Known facts only. Do not invent dates, venue, artist names, artworks, or sales terms.
 */
export const DCC_PROGRAMS: DccProgram[] = []

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
