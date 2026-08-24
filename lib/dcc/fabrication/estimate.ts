import {
  getFabricationRateCard,
  type FabricationRateTierId,
} from '@/lib/dcc/fabrication/rates'
import type { QueueTierId } from '@/lib/dcc/fabrication/queue'
import { getFabricationQueueTier } from '@/lib/dcc/fabrication/queue'

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

/** Default planner seed — medium sculpture Full-Service example ($151). */
export const PLANNING_ESTIMATE_SEED = {
  tier: 'full_service_artist' as FabricationRateTierId,
  printHours: 8,
  materialGrams: 250,
  laborHours: 1,
  queue: 'standard' as QueueTierId,
}

export function buildPlanningEstimateNote(input: {
  tier: FabricationRateTierId
  printHours: number
  materialGrams: number
  laborHours: number
  queue: QueueTierId
  total: number
}): string {
  const card = getFabricationRateCard(input.tier)
  const queue = getFabricationQueueTier(input.queue)
  return `[Planning estimate: ${card.label} · ${input.printHours}h print · ${input.materialGrams}g · ${input.laborHours}h labor · ${queue?.label ?? input.queue} · ${formatUsd(input.total)}]`
}

export function buildQuoteHandoffHref(input: {
  tier: FabricationRateTierId
  printHours: number
  materialGrams: number
  laborHours: number
  queue: QueueTierId
}): string {
  const params = new URLSearchParams({
    tier: input.tier,
    hours: String(input.printHours),
    grams: String(input.materialGrams),
    labor: String(input.laborHours),
    queue: input.queue,
  })
  return `/fabricate/quote?${params.toString()}`
}
