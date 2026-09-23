import {
  FOUNDER_MARGIN_WARNING_USD,
  PAYMENT_FEE_FIXED_USD,
  PAYMENT_FEE_RATE,
} from '@/lib/dcc/fabrication/economics-defaults'
import type { CostLineItem, QuoteEconomics } from '@/lib/dcc/fabrication/schema'

export function estimatePaymentFee(quoteTotal: number): number {
  return quoteTotal * PAYMENT_FEE_RATE + PAYMENT_FEE_FIXED_USD
}

export function sumCostLineItems(costLineItems: CostLineItem[]): number {
  return costLineItems.reduce((sum, line) => sum + line.cost, 0)
}

export function calculateQuoteEconomics(input: {
  quoteTotal: number
  costLineItems: CostLineItem[]
  founderHours: number
}): QuoteEconomics {
  const { quoteTotal, costLineItems, founderHours } = input
  const paymentFeeLine = costLineItems.find((line) => line.category === 'payment_fee')
  const paymentFeeEstimate =
    paymentFeeLine?.cost ?? estimatePaymentFee(quoteTotal)
  const directCost = sumCostLineItems(costLineItems)
  const contribution = quoteTotal - directCost
  const founderMarginPerHour =
    founderHours > 0 ? contribution / founderHours : 0

  return {
    quoteTotal,
    directCost,
    paymentFeeEstimate,
    contribution,
    founderHours,
    founderMarginPerHour,
    belowFounderThreshold: founderMarginPerHour < FOUNDER_MARGIN_WARNING_USD,
  }
}

export function sumQuoteLineAmounts(
  lines: { amount?: number; amountStatus?: 'quoted' | 'pending'; clientVisible?: boolean }[],
  options?: { clientVisibleOnly?: boolean }
): number {
  const filtered = options?.clientVisibleOnly
    ? lines.filter((line) => line.clientVisible !== false)
    : lines
  return filtered.reduce((sum, line) => {
    if (line.amountStatus === 'pending' || line.amount == null) return sum
    return sum + line.amount
  }, 0)
}
