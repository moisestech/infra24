/** Printed PDF pathways → on-page anchor ids on /edgezones */

export const EDGE_ZONES_SECTION_PATHS = ['artists', 'support', 'programs', 'archive'] as const

export type EdgeZonesSectionPath = (typeof EDGE_ZONES_SECTION_PATHS)[number]

export function isEdgeZonesSectionPath(value: string): value is EdgeZonesSectionPath {
  return (EDGE_ZONES_SECTION_PATHS as readonly string[]).includes(value)
}

export function edgeZonesSectionHref(section: EdgeZonesSectionPath): string {
  return `/edgezones#${section}`
}
