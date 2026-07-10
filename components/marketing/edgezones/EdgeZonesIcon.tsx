'use client'

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
  Hammer,
  Heart,
  Layers,
  Leaf,
  Link2,
  Mail,
  Mic,
  Monitor,
  Network,
  Palette,
  Sparkles,
  Sprout,
  Users,
  Video,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import type { EdgeZonesIconName } from '@/lib/marketing/edgezones-icons'
import { cn } from '@/lib/utils'

const ICON_MAP: Record<EdgeZonesIconName, LucideIcon> = {
  archive: Archive,
  bookOpen: BookOpen,
  building2: Building2,
  calendar: Calendar,
  camera: Camera,
  database: Database,
  eye: Eye,
  fileText: FileText,
  footprints: Footprints,
  globe: Globe,
  hammer: Hammer,
  heart: Heart,
  layers: Layers,
  leaf: Leaf,
  link2: Link2,
  mail: Mail,
  mic: Mic,
  monitor: Monitor,
  network: Network,
  palette: Palette,
  sparkles: Sparkles,
  sprout: Sprout,
  users: Users,
  video: Video,
  wrench: Wrench,
}

type Props = {
  name: EdgeZonesIconName
  className?: string
  strokeWidth?: number
}

/** Client-side Lucide resolver — avoids passing icon components through RSC boundaries. */
export function EdgeZonesIcon({ name, className, strokeWidth = 2.25 }: Props) {
  const Icon = ICON_MAP[name] ?? Sparkles
  return <Icon className={cn(className)} strokeWidth={strokeWidth} aria-hidden />
}
