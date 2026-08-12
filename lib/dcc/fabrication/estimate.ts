import {
  getFabricationRateCard,
  type FabricationRateTierId,
} from '@/lib/dcc/fabrication/rates'

export type EstimateQuoteInput = {
  tier: FabricationRateTierId
  printHours: number
  materialGrams: number
  laborHours?: number
  rushPercentage?: number
  accessDiscount?: number
}

export type EstimateBreakdown = {
  tier: FabricationRateTierId
  setup: number
  machine: number
  material: number
  labor: number
  subtotal: number
  rushFee: number
  discount: number
  rawTotal: number
  minimum: number
  total: number
  appliedMinimum: boolean
}

function roundMoney(n: number): number {
  return Math.round(n * 100) / 100
}

/**
 * Transparent estimate formula from fabrication pricing spec v0.1.
 * estimate = setup + machine + material + labor + rush − discount, then minimum floor.
 */
export function estimateQuote(input: EstimateQuoteInput): EstimateBreakdown {
  const card = getFabricationRateCard(input.tier)
  const laborHours = input.laborHours ?? 0
  const rushPercentage = input.rushPercentage ?? 0
  const accessDiscount = input.accessDiscount ?? 0

  const setup = card.setup
  const machine = roundMoney(input.printHours * card.machineHour)
  const material = roundMoney(input.materialGrams * card.materialGram)
  const labor = roundMoney(laborHours * card.laborHour)
  const subtotal = roundMoney(setup + machine + material + labor)
  const rushFee = roundMoney(subtotal * rushPercentage)
  const discount = roundMoney(accessDiscount)
  const rawTotal = roundMoney(subtotal + rushFee - discount)
  const appliedMinimum = rawTotal < card.minimum
  const total = appliedMinimum ? card.minimum : rawTotal

  return {
    tier: input.tier,
    setup,
    machine,
    material,
    labor,
    subtotal,
    rushFee,
    discount,
    rawTotal,
    minimum: card.minimum,
    total,
    appliedMinimum,
  }
}

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount)
}
