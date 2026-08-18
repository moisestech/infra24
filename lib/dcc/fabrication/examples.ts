import { estimateQuote, formatUsd } from '@/lib/dcc/fabrication/estimate'
import type { FabricationRateTierId } from '@/lib/dcc/fabrication/rates'

export type QuoteExampleLine = {
  tier: FabricationRateTierId
  label: string
  note?: string
  total: number
  totalLabel: string
}

export type QuoteExample = {
  id: string
  title: string
  specs: string
  lines: QuoteExampleLine[]
}

function line(
  tier: FabricationRateTierId,
  label: string,
  input: {
    printHours: number
    materialGrams: number
    laborHours?: number
  },
  note?: string
): QuoteExampleLine {
  const b = estimateQuote({ tier, ...input })
  return {
    tier,
    label,
    note,
    total: b.total,
    totalLabel: formatUsd(b.total),
  }
}

/** Worked examples from pricing spec v0.1 (must match estimateQuote math). */
export const FABRICATION_QUOTE_EXAMPLES: QuoteExample[] = [
  {
    id: 'small-prototype',
    title: 'Small prototype',
    specs: '2.5 print hours, 70g material, no CAD labor.',
    lines: [
      line('full_service_artist', 'Full-Service', {
        printHours: 2.5,
        materialGrams: 70,
      }),
      line('artist_access', 'Artist Access', {
        printHours: 2.5,
        materialGrams: 70,
      }),
    ],
  },
  {
    id: 'medium-sculpture',
    title: 'Medium sculpture',
    specs: '8 print hours, 250g material, 1 hour file prep.',
    lines: [
      line('full_service_artist', 'Full-Service', {
        printHours: 8,
        materialGrams: 250,
        laborHours: 1,
      }),
      line(
        'artist_access',
        'Artist Access, self-run',
        { printHours: 8, materialGrams: 250 },
        'Print at access rates; no DCC prep labor.'
      ),
      line(
        'artist_access',
        'Artist Access + DCC prep',
        { printHours: 8, materialGrams: 250, laborHours: 1 },
        'Access print plus 1 hour DCC labor.'
      ),
    ],
  },
  {
    id: 'complex-support',
    title: 'Complex support-interface job',
    specs: '15 print hours, 600g total material/support, 1.5 hours prep.',
    lines: [
      line('full_service_artist', 'Full-Service', {
        printHours: 15,
        materialGrams: 600,
        laborHours: 1.5,
      }),
      line('artist_access', 'Artist Access, self-run', {
        printHours: 15,
        materialGrams: 600,
      }),
      line('artist_access', 'Artist Access + DCC prep', {
        printHours: 15,
        materialGrams: 600,
        laborHours: 1.5,
      }),
    ],
  },
  {
    id: 'large-segmented',
    title: 'Large segmented artist object',
    specs: '36 print hours, 1,500g material, 3 hours segmentation, 2 hours assembly.',
    lines: [
      line('full_service_artist', 'Full-Service', {
        printHours: 36,
        materialGrams: 1500,
        laborHours: 5,
      }),
      line('artist_access', 'Artist Access, self-run print only', {
        printHours: 36,
        materialGrams: 1500,
      }),
      line('artist_access', 'Access + DCC segmentation/assembly', {
        printHours: 36,
        materialGrams: 1500,
        laborHours: 5,
      }),
    ],
  },
]
