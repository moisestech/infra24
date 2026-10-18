import { CAROL_PROPOSAL } from '@/lib/dcc/fabrication/proposals/carol-haggiag'
import { HEATHER_PROPOSAL } from '@/lib/dcc/fabrication/proposals/heather-deitch'
import { OSCAR_PROPOSAL } from '@/lib/dcc/fabrication/proposals/oscar-rieveling'
import { FRANKIE_PROPOSAL } from '@/lib/dcc/fabrication/proposals/frankie-hsu'
import { SANDRA_PROPOSAL } from '@/lib/dcc/fabrication/proposals/sandra-ramos'
import type { ClientProposal } from '@/lib/dcc/fabrication/schema'

export {
  CAROL_PROPOSAL,
  CAROL_QUOTE_LAYERS,
} from '@/lib/dcc/fabrication/proposals/carol-haggiag'
export { CAROL_PROPOSAL_MEDIA_SRC } from '@/lib/dcc/fabrication/proposals/carol-haggiag-media'
export {
  HEATHER_BASELINE_SLICE,
  HEATHER_LIGHTING_HARDWARE,
  HEATHER_PROPOSAL,
} from '@/lib/dcc/fabrication/proposals/heather-deitch'
export {
  HEATHER_CLIENT_MATERIAL_OUTLAY_USD,
  HEATHER_COST_LINE_ITEMS,
  HEATHER_DEFAULT_COST_INPUTS,
  HEATHER_DEFAULT_FOUNDER_HOURS,
  HEATHER_QUOTE_LINE_ITEMS,
  HEATHER_QUOTE_TOTAL_USD,
  buildHeatherCostLineItems,
} from '@/lib/dcc/fabrication/proposals/heather-quote'

export { OSCAR_PROPOSAL } from '@/lib/dcc/fabrication/proposals/oscar-rieveling'
export { SANDRA_PROPOSAL } from '@/lib/dcc/fabrication/proposals/sandra-ramos'
export { FRANKIE_PROPOSAL } from '@/lib/dcc/fabrication/proposals/frankie-hsu'

export const CLIENT_PROPOSALS: ClientProposal[] = [
  HEATHER_PROPOSAL,
  CAROL_PROPOSAL,
  OSCAR_PROPOSAL,
  SANDRA_PROPOSAL,
  FRANKIE_PROPOSAL,
]

export function getClientProposal(slug: string): ClientProposal | undefined {
  return CLIENT_PROPOSALS.find((p) => p.slug === slug)
}

export function listProposalSlugs(): string[] {
  return CLIENT_PROPOSALS.map((p) => p.slug)
}

export { proposalGreetingName } from '@/lib/dcc/fabrication/proposals/greeting'
