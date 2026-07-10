import {
  Archive,
  BookOpen,
  Building2,
  Calendar,
  Database,
  Globe,
  Layers,
  Mail,
  Mic,
  Network,
  Sparkles,
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
