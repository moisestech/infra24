import {
  Archive,
  BookOpen,
  Building2,
  Calendar,
  Camera,
  Database,
  Eye,
  FileText,
  Footprints,
  Globe,
  Handshake,
  Heart,
  Layers,
  Leaf,
  Link2,
  Mail,
  Mic,
  Monitor,
  Network,
  Palette,
  Pickaxe,
  Sparkles,
  Sprout,
  Users,
  Video,
  Wrench,
  type LucideIcon,
} from 'lucide-react'

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

export const EDGE_ZONES_SECTION_ICONS: Record<EdgeZonesSectionIconKey, LucideIcon> = {
  overview: Sparkles,
  roles: Handshake,
  concept: Sprout,
  artists: Users,
  support: Layers,
  programs: Calendar,
  archive: Archive,
  pdf: FileText,
  join: Mail,
}

export const EDGE_ZONES_ROLE_ACCENT_ICONS: Record<EdgeZonesRoleAccent, LucideIcon> = {
  coral: Building2,
  indigo: Palette,
  teal: Network,
}

export const EDGE_ZONES_HERO_CHIP_ICONS: LucideIcon[] = [Building2, Palette, Monitor]

export const EDGE_ZONES_CONCEPT_DIAGRAM_ICONS: LucideIcon[] = [Monitor, Building2, Footprints]

const CONCEPT_THEME_ICON_BY_LABEL: Record<string, LucideIcon> = {
  Attention: Eye,
  Extraction: Pickaxe,
  Ecology: Leaf,
  Care: Heart,
  Reconnection: Link2,
  'Embodied Reality': Footprints,
}

export function edgeZonesConceptThemeIcon(label: string): LucideIcon {
  return CONCEPT_THEME_ICON_BY_LABEL[label] ?? Sparkles
}

const PROGRAM_FORMAT_ICONS: Record<string, LucideIcon> = {
  'Artist talk': Mic,
  'Digital culture conversation': Sparkles,
  Workshop: Wrench,
  'Public activation': Users,
  'Studio visit screening': Video,
  'Exhibition walkthrough': Footprints,
  'Documentation or publishing event': BookOpen,
}

export function edgeZonesProgramFormatIcon(format: string): LucideIcon {
  return PROGRAM_FORMAT_ICONS[format] ?? Calendar
}

const ARCHIVE_DELIVERABLE_ICONS: Record<string, LucideIcon> = {
  'Installation photos': Camera,
  'Artist links': Link2,
  'Artist bios and statements': FileText,
  'Checklist of works': Layers,
  'Curatorial text': BookOpen,
  'Program documentation': Calendar,
  'Video or audio documentation if available': Video,
  'Digital publishing materials': Globe,
  'Future exhibition updates': Sparkles,
}

export function edgeZonesArchiveDeliverableIcon(item: string): LucideIcon {
  return ARCHIVE_DELIVERABLE_ICONS[item] ?? Archive
}

export const EDGE_ZONES_CTA_ICONS: Record<string, LucideIcon> = {
  'View Artist Index': Users,
  'See What DCC Adds': Layers,
  'Download Partnership PDF': FileText,
  'Join Updates': Mail,
}

export const EDGE_ZONES_SUPPORT_ICONS: Record<EdgeZonesSupportIconKey, LucideIcon> = {
  globe: Globe,
  users: Users,
  video: Video,
  archive: Archive,
  mail: Mail,
  calendar: Calendar,
  bookOpen: BookOpen,
}

export const EDGE_ZONES_VISION_ICONS: Record<EdgeZonesVisionIconKey, LucideIcon> = {
  sparkles: Sparkles,
  building: Building2,
  layers: Layers,
  mic: Mic,
  network: Network,
  database: Database,
}

export const EDGE_ZONES_PROGRAM_ICONS: Record<EdgeZonesProgramIconKey, LucideIcon> = {
  calendar: Calendar,
  mic: Mic,
  wrench: Wrench,
  video: Video,
  sparkles: Sparkles,
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
