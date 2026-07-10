export type EdgeZonesIconName =
  | 'archive'
  | 'bookOpen'
  | 'building2'
  | 'calendar'
  | 'camera'
  | 'database'
  | 'eye'
  | 'fileText'
  | 'footprints'
  | 'globe'
  | 'hammer'
  | 'heart'
  | 'layers'
  | 'leaf'
  | 'link2'
  | 'mail'
  | 'mic'
  | 'monitor'
  | 'network'
  | 'palette'
  | 'sparkles'
  | 'sprout'
  | 'users'
  | 'video'
  | 'wrench'

export type EdgeZonesSupportIconKey =
  | 'globe'
  | 'users'
  | 'video'
  | 'archive'
  | 'mail'
  | 'calendar'
  | 'bookOpen'

export type EdgeZonesVisionIconKey =
  | 'sparkles'
  | 'building'
  | 'layers'
  | 'mic'
  | 'network'
  | 'database'

export type EdgeZonesProgramIconKey = 'calendar' | 'mic' | 'wrench' | 'video' | 'sparkles'

export type EdgeZonesSectionIconKey =
  | 'overview'
  | 'roles'
  | 'concept'
  | 'artists'
  | 'support'
  | 'programs'
  | 'archive'
  | 'pdf'
  | 'join'

export type EdgeZonesRoleAccent = 'coral' | 'indigo' | 'teal'

export const EDGE_ZONES_SECTION_ICONS: Record<EdgeZonesSectionIconKey, EdgeZonesIconName> = {
  overview: 'sparkles',
  roles: 'users',
  concept: 'sprout',
  artists: 'users',
  support: 'layers',
  programs: 'calendar',
  archive: 'archive',
  pdf: 'fileText',
  join: 'mail',
}

export const EDGE_ZONES_ROLE_ACCENT_ICONS: Record<EdgeZonesRoleAccent, EdgeZonesIconName> = {
  coral: 'building2',
  indigo: 'palette',
  teal: 'network',
}

export const EDGE_ZONES_HERO_CHIP_ICONS: EdgeZonesIconName[] = ['building2', 'palette', 'monitor']

export const EDGE_ZONES_CONCEPT_DIAGRAM_ICONS: EdgeZonesIconName[] = ['monitor', 'building2', 'footprints']

const CONCEPT_THEME_ICON_BY_LABEL: Record<string, EdgeZonesIconName> = {
  Attention: 'eye',
  Atención: 'eye',
  Extraction: 'hammer',
  Extracción: 'hammer',
  Ecology: 'leaf',
  Ecología: 'leaf',
  Care: 'heart',
  Cuidado: 'heart',
  Reconnection: 'link2',
  Reconexión: 'link2',
  'Embodied Reality': 'footprints',
  'Realidad encarnada': 'footprints',
}

export function edgeZonesConceptThemeIcon(label: string): EdgeZonesIconName {
  return CONCEPT_THEME_ICON_BY_LABEL[label] ?? 'sparkles'
}

const PROGRAM_FORMAT_ICONS: Record<string, EdgeZonesIconName> = {
  'Artist talk': 'mic',
  'Charla de artista': 'mic',
  'Digital culture conversation': 'sparkles',
  'Conversación sobre cultura digital': 'sparkles',
  Workshop: 'wrench',
  Taller: 'wrench',
  'Public activation': 'users',
  'Activación pública': 'users',
  'Studio visit screening': 'video',
  'Proyección de visita al estudio': 'video',
  'Exhibition walkthrough': 'footprints',
  'Recorrido por la exposición': 'footprints',
  'Documentation or publishing event': 'bookOpen',
  'Evento de documentación o publicación': 'bookOpen',
}

export function edgeZonesProgramFormatIcon(format: string): EdgeZonesIconName {
  return PROGRAM_FORMAT_ICONS[format] ?? 'calendar'
}

const ARCHIVE_DELIVERABLE_ICONS: Record<string, EdgeZonesIconName> = {
  'Installation photos': 'camera',
  'Fotos de instalación': 'camera',
  'Artist links': 'link2',
  'Enlaces de artistas': 'link2',
  'Artist bios and statements': 'fileText',
  'Biografías y declaraciones de artistas': 'fileText',
  'Checklist of works': 'layers',
  'Checklist de obras': 'layers',
  'Curatorial text': 'bookOpen',
  'Texto curatorial': 'bookOpen',
  'Program documentation': 'calendar',
  'Documentación de programas': 'calendar',
  'Video or audio documentation if available': 'video',
  'Documentación en video o audio, si está disponible': 'video',
  'Digital publishing materials': 'globe',
  'Materiales de publicación digital': 'globe',
  'Future exhibition updates': 'sparkles',
  'Actualizaciones futuras de la exposición': 'sparkles',
}

export function edgeZonesArchiveDeliverableIcon(item: string): EdgeZonesIconName {
  return ARCHIVE_DELIVERABLE_ICONS[item] ?? 'archive'
}

export const EDGE_ZONES_CTA_ICONS: Record<string, EdgeZonesIconName> = {
  'View Artist Index': 'users',
  'See What DCC Adds': 'layers',
  'Download Partnership PDF': 'fileText',
  'Join Updates': 'mail',
}

export const EDGE_ZONES_CTA_ICONS_BY_HREF: Record<string, EdgeZonesIconName> = {
  '#artists': 'users',
  '#support': 'layers',
  '#pdf': 'fileText',
  '#join': 'mail',
}

export const EDGE_ZONES_SUPPORT_ICONS: Record<EdgeZonesSupportIconKey, EdgeZonesIconName> = {
  globe: 'globe',
  users: 'users',
  video: 'video',
  archive: 'archive',
  mail: 'mail',
  calendar: 'calendar',
  bookOpen: 'bookOpen',
}

export const EDGE_ZONES_VISION_ICONS: Record<EdgeZonesVisionIconKey, EdgeZonesIconName> = {
  sparkles: 'sparkles',
  building: 'building2',
  layers: 'layers',
  mic: 'mic',
  network: 'network',
  database: 'database',
}

export const EDGE_ZONES_PROGRAM_ICONS: Record<EdgeZonesProgramIconKey, EdgeZonesIconName> = {
  calendar: 'calendar',
  mic: 'mic',
  wrench: 'wrench',
  video: 'video',
  sparkles: 'sparkles',
}

export type EdgeZonesIconAccent = 'teal' | 'coral' | 'magenta' | 'indigo'

export const EDGE_ZONES_ICON_RING: Record<EdgeZonesIconAccent, string> = {
  teal:
    'bg-teal-50 text-teal-800 ring-teal-200/80 dark:bg-teal-950/70 dark:text-teal-200 dark:ring-teal-500/30',
  coral:
    'bg-orange-50 text-orange-900 ring-orange-200/80 dark:bg-orange-950/60 dark:text-orange-200 dark:ring-orange-500/25',
  magenta:
    'bg-fuchsia-50 text-fuchsia-900 ring-fuchsia-200/70 dark:bg-fuchsia-950/55 dark:text-fuchsia-200 dark:ring-fuchsia-500/25',
  indigo:
    'bg-indigo-50 text-indigo-900 ring-indigo-200/80 dark:bg-indigo-950/60 dark:text-indigo-200 dark:ring-indigo-400/25',
}
