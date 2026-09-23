import { CAROL_PROPOSAL } from '@/lib/dcc/fabrication/proposals/carol-haggiag'
import { HEATHER_PROPOSAL } from '@/lib/dcc/fabrication/proposals/heather-deitch'
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

export const CLIENT_PROPOSALS: ClientProposal[] = [HEATHER_PROPOSAL, CAROL_PROPOSAL]

export function getClientProposal(slug: string): ClientProposal | undefined {
  return CLIENT_PROPOSALS.find((p) => p.slug === slug)
}

export function listProposalSlugs(): string[] {
  return CLIENT_PROPOSALS.map((p) => p.slug)
}

/** First name for unlock greeting — from ?hello= or proposal record. */
export function proposalGreetingName(
  slug: string | undefined,
  helloParam?: string | null
): string | undefined {
  const fromQuery = helloParam?.trim()
  if (fromQuery) return fromQuery.split(/\s+/)[0]

  if (!slug) return undefined
  const clientName = getClientProposal(slug)?.job.clientName?.trim()
  if (!clientName) return undefined
  return clientName.split(/\s+/)[0]
}
