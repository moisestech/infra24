/**
 * Client-facing FDM prototype catalog. Both studies belong to one client record.
 * These are planning references, NOT approved commercial quotes or Airtable jobs.
 * NEVER place raw client mesh data, private operator economics or access credentials here.
 */
export const CAROL_CLIENT = {
  id: 'carol-haggiag',
  name: 'Carol Haggiag',
  dashboardPath: '/fabricate/proposals/carol-haggiag',
  projectKeys: ['octopus', 'chicken-foot'] as const,
} as const

export type CarolProjectKey = (typeof CAROL_CLIENT.projectKeys)[number]

export type CarolFdmProject = {
  slug: CarolProjectKey
  clientId: typeof CAROL_CLIENT.id
  reference: string
  title: string
  subtitle: string
  summary: string
  process: 'FDM'
  materialFamily: 'PLA filament'
  color: {
    label: string
    hex: string
    selectionStatus: 'preferred-pending-stock'
  }
  quantity: string
  scale: string
  modelState: 'awaiting-upload'
  /** Keys are *private* storage object names, never public URLs. */
  storageKey: string
  priceUsd: null
  quoteStatus: 'preparing'
  scope: readonly string[]
  dependencies: readonly string[]
  exclusions: readonly string[]
  note: string
}

export const CAROL_FDM_PROJECTS: Record<CarolProjectKey, CarolFdmProject> = {
  octopus: {
    slug: 'octopus',
    clientId: CAROL_CLIENT.id,
    reference: 'DCC-CAROL-FDM-01',
    title: 'Octopus earrings',
    subtitle: 'First sculptural FDM color and form test',
    summary: 'Translate the supplied ornate octopus reference into a manufacturable mesh, then test its silhouette and small-scale details.',
    process: 'FDM',
    materialFamily: 'PLA filament',
    color: { label: 'High-visibility lime green', hex: '#B4F000', selectionStatus: 'preferred-pending-stock' },
    quantity: 'One prototype study, not a finished pair',
    scale: 'About 55 mm tall in the reference; confirm print scale after reviewing the STL',
    modelState: 'awaiting-upload',
    storageKey: 'clients/carol-haggiag/octopus/v01.stl',
    priceUsd: null,
    quoteStatus: 'preparing',
    scope: [
      'Inspect and prepare one source mesh for FDM',
      'One operator-reviewed FDM print in an available high-visibility green PLA',
      'Basic support cleanup, scale and form inspection',
      'One documented preview and client review',
    ],
    dependencies: [
      'Actual octopus STL/OBJ export and client permission to share with an operator',
      'Approved geometry and physical size; minimum tentacle thickness and support plan',
      'Printer, operator, filament stock, turnaround and vendor price confirmation',
      'Check how this optional test differs from any Moonlighter workshop print entitlement',
    ],
    exclusions: ['Jewelry hardware or guaranteed skin-safe wearable earrings', 'Unlimited edits, a mirrored pair or multiple color tests', 'Any print included in a separate workshop registration'],
    note: 'Color is a preference, not guaranteed stock. This proposed private print is separate from the postponed Moonlighter workshop.',
  },
  'chicken-foot': {
    slug: 'chicken-foot',
    clientId: CAROL_CLIENT.id,
    reference: 'DCC-CAROL-FDM-02',
    title: 'Chicken-foot earrings',
    subtitle: 'Lightweight FDM scale and texture study',
    summary: 'Test the geometry inspired by Carol’s actual brass casts using one FDM form proof before considering later wearable refinements.',
    process: 'FDM',
    materialFamily: 'PLA filament',
    color: { label: 'High-visibility lime green', hex: '#B4F000', selectionStatus: 'preferred-pending-stock' },
    quantity: 'One foot/form test, not a mirrored wearable pair',
    scale: 'Original request about 2.5 in; subsequent study about 2 in — confirm before slicing',
    modelState: 'awaiting-upload',
    storageKey: 'clients/carol-haggiag/chicken-foot/v01.stl',
    priceUsd: null,
    quoteStatus: 'preparing',
    scope: [
      'Validate the actual chicken-foot STL against available brass references',
      'One small FDM proof in an available high-visibility green PLA',
      'Basic support cleanup, visual texture/scale check and photo documentation',
      'Weight comparison once the brass original and print are measured',
    ],
    dependencies: [
      'Locate and validate the existing model reported by the project lead',
      'Measure and weigh the original brass cast at Bakehouse',
      'Confirm target length and whether the first proof needs one foot or a mirrored pair',
      'Confirm operator, printer, nozzle, compatible filament, price and available slot',
    ],
    exclusions: ['The older $225 one-tint resin-shell allowance (a different production method)', 'Guaranteed texture parity with resin/metal or finished wearable jewelry', 'Second print, additional color, extensive sculpting or final pair'],
    note: 'FDM PLA is a form/weight test, not transparent resin. The previous resin-study estimate must not appear as this FDM quote.',
  },
}

export function isCarolProjectKey(value: string): value is CarolProjectKey {
  return Object.prototype.hasOwnProperty.call(CAROL_FDM_PROJECTS, value)
}

export function carolProjectPath(slug: CarolProjectKey): string {
  return `${CAROL_CLIENT.dashboardPath}/${slug}`
}
