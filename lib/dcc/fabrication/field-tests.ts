import { isFabricationRecordPublic } from '@/lib/dcc/fabrication/privacy'
import type { FabricationSourceType } from '@/lib/dcc/fabrication/privacy'

export type FieldTestStatus = 'observed' | 'testing' | 'complete'

export type FieldTest = {
  id: string
  slug: string
  title: string
  status: FieldTestStatus
  question: string
  publicLearning: string[]
  privateNotes?: string
  capabilityId: string
  publicSafe: boolean
  attributionApproved: boolean
  sourceType: FabricationSourceType
}

export type PublicFieldTest = Omit<FieldTest, 'privateNotes'>

function toPublicFieldTest(test: FieldTest): PublicFieldTest {
  const { privateNotes: _privateNotes, ...rest } = test
  return rest
}

export const FABRICATION_FIELD_TESTS: FieldTest[] = [
  {
    id: 'FIELD-001',
    slug: 'large-fdm-part-joining',
    title: 'Large FDM Part Joining',
    status: 'testing',
    question:
      'Can we reliably join segmented PLA parts without visible structural failure?',
    publicLearning: [
      'Adhesive and mechanical join methods are both in test — no named products on the public record.',
      'Alignment method: registration keys plus a simple jig.',
      'Cure time and clamp time are being logged per join.',
      'Human labor is tracked separately from machine time.',
      'Result so far: one DCC join set, not yet repeatable.',
      'Next test: a second join set with the same jig and a different seam orientation.',
    ],
    privateNotes:
      'Peer-shop adhesive brands, exact settings, and client examples stay in staff notes only.',
    capabilityId: 'fdm-part-joining',
    publicSafe: true,
    attributionApproved: true,
    sourceType: 'dcc',
  },
  {
    id: 'FIELD-002',
    slug: 'support-interface-quality',
    title: 'Support Interface Quality',
    status: 'testing',
    question:
      'Does a dedicated interface material reduce cleanup time and improve supported-surface quality versus standard supports?',
    publicLearning: [
      'Comparing standard supports with a dual-nozzle interface approach.',
      'Cleanup time is logged in minutes after the print cools.',
      'Supported-surface quality is scored from the same viewing distance.',
      'Result so far: first paired comparison is in progress.',
      'Next test: repeat the pair on a file with deeper overhangs.',
    ],
    capabilityId: 'support-interface',
    publicSafe: true,
    attributionApproved: true,
    sourceType: 'dcc',
  },
  {
    id: 'FIELD-003',
    slug: 'exhibition-ready-finish',
    title: 'Exhibition-Ready Finish',
    status: 'testing',
    question:
      'How many human-labor hours does each finish stage add, from raw print to presentation surface?',
    publicLearning: [
      'Observed a skilled finish ladder: raw print, filler, sanding, primer, finished result.',
      'DCC is now designing its own timed test of that ladder.',
      'Levels 0–2 stay in-house; levels 3–4 remain custom quote until labor is measured.',
      'Human labor required is the variable we need before we sell exhibition finish.',
      'Next test: one object through L0–L3 with a labor log.',
    ],
    capabilityId: 'exhibition-finish',
    publicSafe: true,
    attributionApproved: true,
    sourceType: 'dcc',
  },
  {
    id: 'FIELD-PRIV-PEER',
    slug: 'peer-shop-joining-observation',
    title: 'Peer-shop joining observation',
    status: 'observed',
    question: 'What joining method did a peer shop demonstrate?',
    publicLearning: ['Should never render on a public page.'],
    privateNotes:
      'ITS3D-adjacent and other peer-shop observations stay unpublished until independently tested by DCC.',
    capabilityId: 'peer-shop-adhesive',
    publicSafe: false,
    attributionApproved: false,
    sourceType: 'peer',
  },
]

export function listPublicFieldTests(): PublicFieldTest[] {
  return FABRICATION_FIELD_TESTS.filter(isFabricationRecordPublic).map(
    toPublicFieldTest
  )
}

export function getPublicFieldTest(slug: string): PublicFieldTest | undefined {
  const test = FABRICATION_FIELD_TESTS.find((t) => t.slug === slug)
  if (!test || !isFabricationRecordPublic(test)) return undefined
  return toPublicFieldTest(test)
}

export function listPublicFieldTestsForCapability(
  capabilityId: string
): PublicFieldTest[] {
  return listPublicFieldTests().filter((t) => t.capabilityId === capabilityId)
}
