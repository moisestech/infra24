export type FinishLevelId =
  | 'raw'
  | 'clean'
  | 'assembly-ready'
  | 'exhibition-prep'
  | 'finished-object'

export type FabricationFinishLevel = {
  id: FinishLevelId
  level: number
  label: string
  summary: string
  includes: string[]
  inHouse: boolean
  laborNote: string
  iconKey: 'box' | 'sparkles' | 'puzzle' | 'brush' | 'palette'
}

export const FABRICATION_FINISH_LEVELS: FabricationFinishLevel[] = [
  {
    id: 'raw',
    level: 0,
    label: 'Raw print',
    summary: 'As printed, basic support removal only.',
    includes: ['Basic support removal', 'Pickup coordination'],
    inHouse: true,
    laborNote:
      'Usually covered by job setup on Print My File. Extra cleanup billed as human labor at the active rate.',
    iconKey: 'box',
  },
  {
    id: 'clean',
    level: 1,
    label: 'Clean print',
    summary: 'Support cleanup, light deburring, minor sanding.',
    includes: ['Support cleanup', 'Light deburring', 'Minor sanding'],
    inHouse: true,
    laborNote: 'Billed as DCC human labor ($50/hr artist rates; $75/hr commercial starting point).',
    iconKey: 'sparkles',
  },
  {
    id: 'assembly-ready',
    level: 2,
    label: 'Assembly-ready',
    summary: 'Part cleanup, joining, pins/fasteners if needed, seam planning.',
    includes: [
      'Part cleanup',
      'Joining / pins / fasteners as needed',
      'Seam planning',
    ],
    inHouse: true,
    laborNote: 'Quoted as labor hours after intake. Start in-house for Levels 0–2.',
    iconKey: 'puzzle',
  },
  {
    id: 'exhibition-prep',
    level: 3,
    label: 'Exhibition prep',
    summary: 'Sanding, filling, seam repair, primer.',
    includes: ['Sanding', 'Filling', 'Seam repair', 'Primer'],
    inHouse: false,
    laborNote:
      'Custom quote or outsource until demand supports an in-house finishing bench.',
    iconKey: 'brush',
  },
  {
    id: 'finished-object',
    level: 4,
    label: 'Finished object',
    summary:
      'Paint, clear coat, faux finish, custom surface treatment, presentation-ready.',
    includes: [
      'Paint / clear coat',
      'Faux or custom surface treatment',
      'Presentation-ready delivery',
    ],
    inHouse: false,
    laborNote: 'Custom quote. Often pairs with Make It With Me or commercial production.',
    iconKey: 'palette',
  },
]

export function getFinishLevel(id: FinishLevelId): FabricationFinishLevel | undefined {
  return FABRICATION_FINISH_LEVELS.find((f) => f.id === id)
}
