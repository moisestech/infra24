import { listPublicCapabilities } from '@/lib/dcc/fabrication/capabilities'
import { CAPABILITY_STAGE_META } from '@/lib/dcc/fabrication/capabilities'
import type { CapabilityStage } from '@/lib/dcc/fabrication/capabilities'
import { FABRICATION_FINISH_LEVELS } from '@/lib/dcc/fabrication/finishes'
import { listPublicFieldTests } from '@/lib/dcc/fabrication/field-tests'
import { listPublicProjects } from '@/lib/dcc/fabrication/projects'
import { FABRICATION_RATE_CARDS } from '@/lib/dcc/fabrication/rates'

/** Aggregates published fabrication records. No duplicate constants. */
export function getFabricationPublicMetrics() {
  const capabilities = listPublicCapabilities()
  const fieldTests = listPublicFieldTests()
  const projects = listPublicProjects()
  const stageCounts = CAPABILITY_STAGE_META.map((stage) => ({
    ...stage,
    count: capabilities.filter((c) => c.stage === stage.id).length,
  }))

  return {
    publicCapabilityCount: capabilities.length,
    publicFieldTestCount: fieldTests.length,
    publicProjectCount: projects.length,
    dccTestProjectCount: projects.filter((p) => p.kind === 'dcc-test').length,
    clientProjectCount: projects.filter((p) => p.kind === 'client').length,
    inHouseFinishLevels: FABRICATION_FINISH_LEVELS.filter((f) => f.inHouse).length,
    finishLevelCount: FABRICATION_FINISH_LEVELS.length,
    rateCardLabels: FABRICATION_RATE_CARDS.map((c) => c.label),
    stageCounts,
    highestPublicStage: highestStage(capabilities.map((c) => c.stage)),
  }
}

function highestStage(stages: CapabilityStage[]): CapabilityStage | null {
  if (stages.length === 0) return null
  return stages.reduce((best, stage) => {
    const a = CAPABILITY_STAGE_META.find((s) => s.id === best)?.level ?? 0
    const b = CAPABILITY_STAGE_META.find((s) => s.id === stage)?.level ?? 0
    return b > a ? stage : best
  })
}

/** 90-day targets — planning figures, not live telemetry. */
export const FABRICATION_NINETY_DAY_MBO = {
  customers: 5,
  institutionalWorkshops: 2,
  machineHours: 'Logged after first paid jobs',
  operators: 2,
  sops: 5,
  repeatClients: 2,
} as const

export const FABRICATION_CAPITAL_GATES = [
  {
    id: 'machine-2',
    title: 'What evidence triggers machine #2',
    body: 'A sellable FDM lane, finishing labor we can quote, and a queue that one operator cannot clear in a normal week. Capital follows that bottleneck — it does not lead it.',
  },
] as const

export const FABRICATION_SCALEUP_THESIS =
  'DCC Miami is artist infrastructure for the born-digital era.'

export const FABRICATION_WHAT_EXISTS = [
  'Workshop engine',
  'Fabricate',
  'Transparent pricing',
  'Finish levels',
  'Quote intake',
  'Incorporated operation',
] as const

export const FABRICATION_WHAT_WE_TEST = [
  'Artist demand',
  'Average ticket',
  'Finishing labor',
  'Operator leverage',
  'Institutional workshop demand',
] as const
