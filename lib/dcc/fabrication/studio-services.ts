import type { FabricationColorTokenId } from '@/lib/dcc/fabrication/theme'
import type { ServiceLaneId } from '@/lib/dcc/fabrication/lanes'

export type StudioServiceId = 'FABRICATE_MY_FILE' | 'PREPARE_PLUS_FABRICATE'

export type ProjectStageId =
  | 'finished_3d_file'
  | 'partial_3d_file'
  | 'sketch_reference'
  | 'physical_object'
  | 'unsure'

export type StudioService = {
  id: StudioServiceId
  slug: 'fabricate-my-file' | 'prepare-and-fabricate'
  href: string
  label: string
  shortLabel: string
  eyebrow: string
  summary: string
  youHave: string
  workflow: string[]
  suitableFor: string[]
  colorTokenId: FabricationColorTokenId
}

export const STUDIO_SERVICES: StudioService[] = [
  {
    id: 'FABRICATE_MY_FILE',
    slug: 'fabricate-my-file',
    href: '/fabricate/services/fabricate-my-file',
    label: 'Fabricate My File',
    shortLabel: 'File',
    eyebrow: 'You already have a usable 3D file',
    summary:
      'Technical validation, material choice, orientation, slicing, fabrication, post-processing, and QA — when the geometry is already in hand.',
    youHave: 'You already have a usable 3D file.',
    workflow: ['FILE', 'VALIDATE', 'MATERIAL', 'PREPARE', 'FABRICATE', 'QA'],
    suitableFor: [
      'artists',
      'industrial designers',
      'CAD-capable clients',
      'prototype testing',
      'enclosures',
      'lighting',
      'sculptural objects',
      'fabrication tests',
    ],
    colorTokenId: 'cyan',
  },
  {
    id: 'PREPARE_PLUS_FABRICATE',
    slug: 'prepare-and-fabricate',
    href: '/fabricate/services/prepare-and-fabricate',
    label: 'Prepare + Fabricate',
    shortLabel: 'Prepare',
    eyebrow: 'You have an idea, sketch, reference, or partial model',
    summary:
      'Modeling, CAD coordination, prototype development, revision, and fabrication — when production-ready geometry does not exist yet.',
    youHave: 'You have an idea, sketch, reference, or partial model.',
    workflow: ['REFERENCE', 'MODEL', 'REVIEW', 'PROTOTYPE', 'REVISE', 'FABRICATE'],
    suitableFor: [
      'jewelry',
      'wearables',
      'custom objects',
      'artist prototypes',
      'early-stage product experimentation',
    ],
    colorTokenId: 'indigo',
  },
]

export const PROJECT_STAGES: {
  id: ProjectStageId
  label: string
  suggestedServiceId: StudioServiceId | null
}[] = [
  {
    id: 'finished_3d_file',
    label: 'Finished 3D file',
    suggestedServiceId: 'FABRICATE_MY_FILE',
  },
  {
    id: 'partial_3d_file',
    label: 'Partial 3D file',
    suggestedServiceId: 'PREPARE_PLUS_FABRICATE',
  },
  {
    id: 'sketch_reference',
    label: 'Sketch / reference',
    suggestedServiceId: 'PREPARE_PLUS_FABRICATE',
  },
  {
    id: 'physical_object',
    label: 'Physical object',
    suggestedServiceId: 'PREPARE_PLUS_FABRICATE',
  },
  {
    id: 'unsure',
    label: 'Unsure',
    suggestedServiceId: null,
  },
]

const LANE_TO_STAGE: Record<ServiceLaneId, ProjectStageId> = {
  'print-my-file': 'finished_3d_file',
  'prepare-fabricate': 'partial_3d_file',
  'make-it-with-me': 'sketch_reference',
}

export function getStudioService(id: StudioServiceId): StudioService {
  const found = STUDIO_SERVICES.find((s) => s.id === id)
  if (!found) throw new Error(`Unknown studio service: ${id}`)
  return found
}

export function getStudioServiceBySlug(slug: string): StudioService | undefined {
  return STUDIO_SERVICES.find((s) => s.slug === slug)
}

export function suggestStudioService(
  stage: ProjectStageId
): StudioService | null {
  const row = PROJECT_STAGES.find((s) => s.id === stage)
  if (!row?.suggestedServiceId) return null
  return getStudioService(row.suggestedServiceId)
}

/** Map the existing public lane query param onto a start-form project stage. */
export function projectStageFromLaneParam(
  lane: string | null | undefined
): ProjectStageId | undefined {
  if (!lane) return undefined
  if (lane in LANE_TO_STAGE) return LANE_TO_STAGE[lane as ServiceLaneId]
  return undefined
}
