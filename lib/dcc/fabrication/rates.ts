/** Rate tier for DCC Fabrication transparent pricing v0.1. */
export type FabricationRateTierId =
  | 'full_service_artist'
  | 'artist_access'
  | 'commercial'

export type FabricationRateCard = {
  id: FabricationRateTierId
  label: string
  summary: string
  setup: number
  machineHour: number
  materialGram: number
  laborHour: number
  minimum: number
  /** Optional membership note (Artist Access). */
  membershipNote?: string
}

export const FABRICATION_RATE_CARDS: FabricationRateCard[] = [
  {
    id: 'full_service_artist',
    label: 'Full-Service Artist',
    summary: 'DCC runs the machine and handles the print for artists.',
    setup: 25,
    machineHour: 7,
    materialGram: 0.08,
    laborHour: 50,
    minimum: 50,
  },
  {
    id: 'artist_access',
    label: 'Artist Access',
    summary:
      'Certified users, workshop alumni, Bakehouse artists, founding operators, or partner-community artists.',
    setup: 15,
    machineHour: 5,
    materialGram: 0.06,
    laborHour: 50,
    minimum: 35,
    membershipNote:
      '$25 / month, or included for 60 days after a paid workshop. Access rates apply when you prepare and run within DCC-approved procedures; DCC labor is added when staff must run, repair, segment, or finish.',
  },
  {
    id: 'commercial',
    label: 'Commercial / Brand / Institutional',
    summary:
      'Agencies, brands, events, companies, commercial productions, or non-artist clients.',
    setup: 50,
    machineHour: 12,
    materialGram: 0.12,
    laborHour: 75,
    minimum: 250,
  },
]

export const FABRICATION_RUSH_DEFAULT = 0.25

export function getFabricationRateCard(
  id: FabricationRateTierId
): FabricationRateCard {
  const card = FABRICATION_RATE_CARDS.find((c) => c.id === id)
  if (!card) {
    throw new Error(`Unknown fabrication rate tier: ${id}`)
  }
  return card
}

/** Resin / large-format note until process-specific rates ship. */
export const RESIN_QUOTE_FORMULA_NOTE =
  'Resin and large-format jobs use setup + material + machine time + technician labor + post-processing. Tier cells stay Quoted until resin-specific rates are published — never display $0.'
