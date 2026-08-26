import { estimateQuote, formatUsd } from '@/lib/dcc/fabrication/estimate'
import { isFabricationRecordPublic } from '@/lib/dcc/fabrication/privacy'
import type { FabricationSourceType } from '@/lib/dcc/fabrication/privacy'
import type { EstimateQuoteInput } from '@/lib/dcc/fabrication/estimate'

export type FabricationProjectKind = 'dcc-test' | 'client'

export type FabricationProject = {
  id: string
  slug: string
  title: string
  kind: FabricationProjectKind
  challenge: string
  input: string
  process: string[]
  economics: EstimateQuoteInput
  result: string
  learning: string
  fieldTestId?: string
  publicSafe: boolean
  attributionApproved: boolean
  sourceType: FabricationSourceType
}

export const FABRICATION_PROJECTS: FabricationProject[] = [
  {
    id: 'proj-join-001',
    slug: 'large-part-joining-test-001',
    title: 'Large-part joining test 001',
    kind: 'dcc-test',
    challenge:
      'A sculpture larger than the build volume needs to exist as one object without an obvious structural failure at the seam.',
    input: 'Segmented PLA test pieces from a DCC file — not a client commission.',
    process: [
      'Model prep and segmentation with registration keys',
      'PLA on FDM',
      'Two-part print',
      'Dry-fit, join, clamp',
      'No exhibition finish on this test',
    ],
    economics: {
      tier: 'full_service_artist',
      printHours: 36,
      materialGrams: 1500,
      laborHours: 5,
    },
    result:
      'One DCC join set completed. Structural hold is promising; the seam is still visible. Not sellable yet.',
    learning:
      'The next quote should price join labor separately from print time, and the next SOP should specify jig setup before adhesive goes on.',
    fieldTestId: 'FIELD-001',
    publicSafe: true,
    attributionApproved: true,
    sourceType: 'dcc',
  },
  {
    id: 'proj-support-001',
    slug: 'support-interface-test-001',
    title: 'Support interface test 001',
    kind: 'dcc-test',
    challenge:
      'What needed to exist: a timed comparison of cleanup labor and supported-surface quality on the same geometry.',
    input: 'One DCC test file printed twice — standard supports vs interface material.',
    process: [
      'Same orientation on both prints',
      'Standard supports on print A',
      'Dual-nozzle interface on print B',
      'Cleanup timed after cool-down',
      'No paint',
    ],
    economics: {
      tier: 'full_service_artist',
      printHours: 15,
      materialGrams: 600,
      laborHours: 1.5,
    },
    result:
      'Paired comparison is in progress. This page records the test design, not a finished client object.',
    learning:
      'The next quote should treat support-interface material and cleanup minutes as first-class cost drivers.',
    fieldTestId: 'FIELD-002',
    publicSafe: true,
    attributionApproved: true,
    sourceType: 'dcc',
  },
  {
    id: 'proj-finish-001',
    slug: 'finish-level-test-001',
    title: 'Finish-level test 001',
    kind: 'dcc-test',
    challenge:
      'What needed to exist: a labor log for taking one object from raw print toward exhibition prep.',
    input: 'A small DCC test form — file, not a commissioned artwork.',
    process: [
      'Raw print (L0)',
      'Cleanup (L1)',
      'Filler and sanding toward L2/L3',
      'Primer if the labor budget allows',
      'No artist-finished surface on this pass',
    ],
    economics: {
      tier: 'full_service_artist',
      printHours: 8,
      materialGrams: 250,
      laborHours: 1,
    },
    result:
      'Test designed. Observed finish work elsewhere; DCC has not yet sold exhibition finish.',
    learning:
      'Until this labor log exists, L3–L4 stay custom quote. The next SOP is a timed finish card, not a price list for paint.',
    fieldTestId: 'FIELD-003',
    publicSafe: true,
    attributionApproved: true,
    sourceType: 'dcc',
  },
]

export function projectEconomics(project: FabricationProject) {
  const breakdown = estimateQuote(project.economics)
  return {
    breakdown,
    lines: [
      { label: 'Machine time', value: formatUsd(breakdown.machine) },
      { label: 'Material', value: formatUsd(breakdown.material) },
      { label: 'Human labor', value: formatUsd(breakdown.labor) },
      { label: 'Estimated total', value: formatUsd(breakdown.total) },
    ],
  }
}

export function listPublicProjects(): FabricationProject[] {
  return FABRICATION_PROJECTS.filter(isFabricationRecordPublic)
}

export function getPublicProject(slug: string): FabricationProject | undefined {
  const project = FABRICATION_PROJECTS.find((p) => p.slug === slug)
  if (!project || !isFabricationRecordPublic(project)) return undefined
  return project
}
