import type { DccProject } from '@/lib/dcc/culture/types'

/**
 * Cultural / artist-linked projects (works, commissions, installations, case studies).
 *
 * Not the same as:
 * - /projects — Infra24 civic/systems proof
 * - /fabricate/projects — fabrication field tests
 *
 * This phase stores records and renders them on artist, program and journal pages.
 * There is no public /projects takeover.
 *
 * TODO — Clandestine selected works (do not invent titles or images).
 */
export const DCC_PROJECTS: DccProject[] = []

export function isPublishedProject(project: DccProject): boolean {
  return (project.status ?? 'published') === 'published'
}

export function listProjects(
  projects: readonly DccProject[] = DCC_PROJECTS
): DccProject[] {
  return projects.filter(isPublishedProject)
}

export function getProjectById(
  id: string,
  projects: readonly DccProject[] = DCC_PROJECTS
): DccProject | undefined {
  return projects.find((project) => project.id === id)
}

export function getProjectBySlug(
  slug: string,
  projects: readonly DccProject[] = DCC_PROJECTS
): DccProject | undefined {
  return projects.find((project) => project.slug === slug)
}

export function assertProjectSlugsValid(
  projects: readonly DccProject[] = DCC_PROJECTS
): string[] {
  const errors: string[] = []
  const slugs = new Set<string>()
  const ids = new Set<string>()
  for (const project of projects) {
    if (!project.id) errors.push('project missing id')
    if (!project.slug) errors.push(`project ${project.id} missing slug`)
    if (ids.has(project.id)) errors.push(`duplicate project id ${project.id}`)
    if (slugs.has(project.slug)) errors.push(`duplicate project slug ${project.slug}`)
    ids.add(project.id)
    slugs.add(project.slug)
  }
  return errors
}
