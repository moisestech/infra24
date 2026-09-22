import type { ClientProposal, QuoteLineItem } from '@/lib/dcc/fabrication/schema'

/** Client-safe quote lines for proposal pages. */
export function getClientVisibleQuoteLines(
  proposal: Pick<ClientProposal, 'quoteLineItems'>
): QuoteLineItem[] {
  return (proposal.quoteLineItems ?? []).filter((line) => line.clientVisible)
}

/**
 * JSON-safe payload for client pricing — omits staff-only economics fields.
 * Tests should assert this never includes internal rates or cost lines.
 */
export function serializeClientPricingView(proposal: ClientProposal): string {
  const payload = {
    slug: proposal.slug,
    pricing: proposal.pricing,
    quoteLineItems: getClientVisibleQuoteLines(proposal).map((line) => ({
      id: line.id,
      label: line.label,
      shortLabel: line.shortLabel,
      description: line.description,
      clientReceives: line.clientReceives,
      prevents: line.prevents,
      category: line.category,
      amount: line.amount,
    })),
    clientMaterialOutlayUsd: proposal.clientMaterialOutlayUsd,
    materialIds: proposal.materialIds,
  }
  return JSON.stringify(payload)
}

/** True when serialized client pricing leaks internal economics fields. */
export function clientPricingViewLeaksInternal(proposal: ClientProposal): boolean {
  const json = serializeClientPricingView(proposal)
  return /internalRate|costLineItem|hourlyRate|founderMargin|directCost|contribution/i.test(
    json
  )
}
