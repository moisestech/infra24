import {
  isFabricationRecordPublic,
  type FabricationSourceType,
} from '@/lib/dcc/fabrication/privacy'

export type CapabilityStage =
  | 'observed'
  | 'tested'
  | 'repeatable'
  | 'sellable'
  | 'teachable'
  | 'scalable'

export type FabricationCapability = {
  id: string
  title: string
  category: string
  stage: CapabilityStage
  evidenceCount: number
  summary: string
  nextExperiment?: string
  publicSafe: boolean
  attributionApproved: boolean
  sourceType: FabricationSourceType
}

export const CAPABILITY_STAGE_META: {
  id: CapabilityStage
  level: number
  label: string
  meaning: string
}[] = [
  {
    id: 'observed',
    level: 0,
    label: 'Observed',
    meaning: 'We’ve seen a skilled workflow',
  },
  {
    id: 'tested',
    level: 1,
    label: 'Tested',
    meaning: 'DCC reproduced it once',
  },
  {
    id: 'repeatable',
    level: 2,
    label: 'Repeatable',
    meaning: 'DCC reproduced it 3+ times',
  },
  {
    id: 'sellable',
    level: 3,
    label: 'Sellable',
    meaning: 'We can confidently quote and deliver it',
  },
  {
    id: 'teachable',
    level: 4,
    label: 'Teachable',
    meaning: 'Another operator can learn it',
  },
  {
    id: 'scalable',
    level: 5,
    label: 'Scalable',
    meaning: 'Multiple people or nodes can execute it',
  },
]

export const FABRICATION_CAPABILITIES: FabricationCapability[] = [
  {
    id: 'fdm-part-joining',
    title: 'Large FDM part joining',
    category: 'FDM',
    stage: 'tested',
    evidenceCount: 1,
    summary:
      'DCC is testing mechanical and adhesive approaches to joining segmented FDM parts so large objects can be printed in sections.',
    nextExperiment: 'Compare alignment jigs and cure windows on a second join set.',
    publicSafe: true,
    attributionApproved: true,
    sourceType: 'dcc',
  },
  {
    id: 'support-interface',
    title: 'Support interface quality',
    category: 'FDM',
    stage: 'tested',
    evidenceCount: 1,
    summary:
      'DCC is comparing standard supports with dual-nozzle interface material and measuring cleanup time against supported-surface quality.',
    nextExperiment: 'Time a paired print of the same file with both support strategies.',
    publicSafe: true,
    attributionApproved: true,
    sourceType: 'dcc',
  },
  {
    id: 'exhibition-finish',
    title: 'Exhibition-ready finish',
    category: 'Finishing',
    stage: 'observed',
    evidenceCount: 0,
    summary:
      'DCC has observed a skilled finish ladder from raw print through filler, sanding, primer, and presentation surface — and is now designing its own timed tests.',
    nextExperiment: 'Run one object through L0–L3 and log labor hours per stage.',
    publicSafe: true,
    attributionApproved: true,
    sourceType: 'dcc',
  },
  {
    id: 'peer-shop-adhesive',
    title: 'Peer-shop joining observation',
    category: 'FDM',
    stage: 'observed',
    evidenceCount: 0,
    summary: 'Staff-only observation. Not cleared for public pages.',
    publicSafe: false,
    attributionApproved: false,
    sourceType: 'peer',
  },
  {
    id: 'vendor-material-note',
    title: 'Vendor material note',
    category: 'Materials',
    stage: 'observed',
    evidenceCount: 0,
    summary: 'Vendor process note held until attribution is approved.',
    publicSafe: true,
    attributionApproved: false,
    sourceType: 'vendor',
  },
]

export function getCapabilityStageMeta(stage: CapabilityStage) {
  return CAPABILITY_STAGE_META.find((s) => s.id === stage) ?? CAPABILITY_STAGE_META[0]
}

export function listPublicCapabilities(): FabricationCapability[] {
  return FABRICATION_CAPABILITIES.filter(isFabricationRecordPublic)
}

export function getPublicCapability(
  id: string
): FabricationCapability | undefined {
  const cap = FABRICATION_CAPABILITIES.find((c) => c.id === id)
  if (!cap || !isFabricationRecordPublic(cap)) return undefined
  return cap
}
