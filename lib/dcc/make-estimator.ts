export type EstimateInput = {
  process: 'FDM' | 'Large FDM' | 'Resin' | 'Scan' | 'File prep' | 'Consult'
  volumeBracket: 'small' | 'medium' | 'large'
  tier: 'Associate' | 'Public' | 'Commercial'
}

export type EstimateRange = {
  low: number
  high: number
  label: string
}

const BASE: Record<EstimateInput['process'], [number, number]> = {
  FDM: [80, 160],
  'Large FDM': [220, 480],
  Resin: [120, 280],
  Scan: [60, 140],
  'File prep': [40, 100],
  Consult: [50, 120],
}

const VOLUME_MULT: Record<EstimateInput['volumeBracket'], number> = {
  small: 1,
  medium: 1.45,
  large: 2.1,
}

const TIER_MULT: Record<EstimateInput['tier'], number> = {
  Associate: 0.7,
  Public: 1,
  Commercial: 1.35,
}

/** Rules-based wide range — not slicing. Widen deliberately. */
export function estimateFabricationRange(input: EstimateInput): EstimateRange {
  const [lo, hi] = BASE[input.process]
  const m = VOLUME_MULT[input.volumeBracket] * TIER_MULT[input.tier]
  const low = Math.round((lo * m) / 10) * 10
  const high = Math.round((hi * m * 1.15) / 10) * 10
  return {
    low,
    high,
    label: `Estimated range: $${low}–$${high}. This is an estimate, not a quote. We'll confirm after technical review.`,
  }
}
