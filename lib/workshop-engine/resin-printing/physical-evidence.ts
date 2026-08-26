/**
 * Physical evidence sequence (v07) — stage icons + metadata.
 * Full media wiring waits on Cloudinary 314 (washed/cured).
 * CDN primary; local copies may land under
 * `public/workshops/resin-printing/physical-evidence/v07/`.
 */
import type { LucideIcon } from 'lucide-react'
import {
  Box,
  Droplets,
  Layers3,
  Network,
  Sparkles,
  Workflow,
} from 'lucide-react'
import type { WorkshopMedia } from '@/lib/workshop-engine/types'

export type PhysicalEvidenceStageId =
  | 'raw-file'
  | 'sliced-file'
  | 'supported-print'
  | 'washed-cured'
  | 'finished-object'

export type PhysicalEvidenceStageMeta = {
  id: PhysicalEvidenceStageId
  /** Cloudinary / file stem without hash (311–315). */
  assetStem: string
  label: string
  alt: string
  iconKey: NonNullable<WorkshopMedia['iconKey']>
  Icon: LucideIcon
  /** False until 314 is uploaded. */
  ready: boolean
}

export const PHYSICAL_EVIDENCE_HERO = {
  id: 'physical-evidence-hero',
  assetStem: '310-physical-evidence-sequence-hero',
  label: 'Physical evidence sequence',
  alt: 'Conceptual sequence from raw file through finished resin object.',
  iconKey: 'workflow' as const,
  Icon: Workflow,
  ready: true,
} as const

export const PHYSICAL_EVIDENCE_STAGES: PhysicalEvidenceStageMeta[] = [
  {
    id: 'raw-file',
    assetStem: '311-evidence-raw-file',
    label: 'Raw file',
    alt: 'Conceptual raw mesh showing solid form and triangular topology.',
    iconKey: 'box',
    Icon: Box,
    ready: true,
  },
  {
    id: 'sliced-file',
    assetStem: '312-evidence-sliced-file',
    label: 'Sliced file',
    alt: 'Conceptual slicer preview showing horizontal layer contours and inspection points.',
    iconKey: 'layers-3',
    Icon: Layers3,
    ready: true,
  },
  {
    id: 'supported-print',
    assetStem: '313-evidence-supported-print',
    label: 'Supported print',
    alt: 'Conceptual dry resin print attached to a raft and support structure.',
    iconKey: 'network',
    Icon: Network,
    ready: true,
  },
  {
    id: 'washed-cured',
    assetStem: '314-evidence-washed-cured-print',
    label: 'Washed / cured',
    alt: 'Conceptual clean, dry, cured resin object with supports removed.',
    iconKey: 'droplets',
    Icon: Droplets,
    ready: false,
  },
  {
    id: 'finished-object',
    assetStem: '315-evidence-finished-object',
    label: 'Finished object',
    alt: 'Conceptual painted version of the same resin object.',
    iconKey: 'sparkles',
    Icon: Sparkles,
    ready: true,
  },
]

/** Booklet citations shown beside the evidence section (complete-workflow). */
export const PHYSICAL_EVIDENCE_BOOKLET_PAGES = [3, 9, 33, 39] as const

export function getPhysicalEvidenceStageIcon(
  id: PhysicalEvidenceStageId
): LucideIcon {
  const stage = PHYSICAL_EVIDENCE_STAGES.find((s) => s.id === id)
  return stage?.Icon ?? Box
}
