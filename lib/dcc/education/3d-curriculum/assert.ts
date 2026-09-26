import { THREE_D_CURRICULUM_ASSETS } from '@/lib/dcc/education/3d-curriculum/assets'
import { THREE_D_CURRICULUM_WORKSHOPS } from '@/lib/dcc/education/3d-curriculum/workshops'
import type { ThreeDCurriculumAssetId } from '@/lib/dcc/education/3d-curriculum/types'

const RESERVED_SLUGS = new Set(['display'])

export function assertCurriculumValid(): string[] {
  const errors: string[] = []
  const ids = new Set<string>()
  const slugs = new Set<string>()

  for (const workshop of THREE_D_CURRICULUM_WORKSHOPS) {
    if (!workshop.id) errors.push('workshop missing id')
    if (!workshop.slug) errors.push(`workshop ${workshop.id} missing slug`)
    if (RESERVED_SLUGS.has(workshop.slug)) {
      errors.push(`workshop slug ${workshop.slug} collides with a reserved route`)
    }
    if (ids.has(workshop.id)) errors.push(`duplicate workshop id ${workshop.id}`)
    if (slugs.has(workshop.slug)) {
      errors.push(`duplicate workshop slug ${workshop.slug}`)
    }
    ids.add(workshop.id)
    slugs.add(workshop.slug)

    if (workshop.instructor?.name) {
      errors.push(`workshop ${workshop.id} must not invent an instructor name`)
    }

    const assetIds: ThreeDCurriculumAssetId[] = [
      workshop.heroAssetId,
      ...workshop.galleryAssetIds,
      ...workshop.diagramAssetIds,
    ]
    for (const assetId of assetIds) {
      if (!THREE_D_CURRICULUM_ASSETS[assetId]) {
        errors.push(`workshop ${workshop.id} references missing asset ${assetId}`)
      }
    }

    for (const relatedId of workshop.relatedWorkshopIds) {
      if (!THREE_D_CURRICULUM_WORKSHOPS.some((row) => row.id === relatedId)) {
        errors.push(`workshop ${workshop.id} relatedWorkshopId ${relatedId} does not exist`)
      }
    }

    const sessionSlugs = new Set<string>()
    for (const session of workshop.curriculumSessions ?? []) {
      if (!session.slug) errors.push(`workshop ${workshop.id} session missing slug`)
      if (sessionSlugs.has(session.slug)) {
        errors.push(`workshop ${workshop.id} duplicate session slug ${session.slug}`)
      }
      sessionSlugs.add(session.slug)
    }
    for (const step of workshop.pipeline) {
      if (!step.label) errors.push(`workshop ${workshop.id} pipeline step missing label`)
      if (step.sessionSlug && !sessionSlugs.has(step.sessionSlug)) {
        errors.push(
          `workshop ${workshop.id} pipeline step ${step.label} points at missing session ${step.sessionSlug}`
        )
      }
    }
  }

  return errors
}
