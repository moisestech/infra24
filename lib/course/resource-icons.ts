import type { ResourceLink, ResourceType } from '@/lib/course/types'
import {
  BookOpenText,
  Bot,
  Box,
  Building2,
  Code2,
  GitBranch,
  Globe,
  Image as ImageIcon,
  Laptop,
  LayoutGrid,
  Layers3,
  Mic2,
  Newspaper,
  Palette,
  Presentation,
  Smartphone,
  Sparkles,
  Terminal,
  Wrench,
  type LucideIcon,
} from 'lucide-react'

export const resourceIcons: Record<ResourceType, LucideIcon> = {
  artist: Palette,
  work: ImageIcon,
  institution: Building2,
  curator: BookOpenText,
  book: BookOpenText,
  tool: Wrench,
  website: Globe,
  article: Newspaper,
  interview: Mic2,
  organization: Building2,
  exhibition: Presentation,
  publication: Newspaper,
}

/** Optional per-row Lucide overrides from `ResourceLink.icon` (PascalCase name). */
const ICON_BY_NAME: Record<string, LucideIcon> = {
  Box,
  Layers3,
  Palette,
  Image: ImageIcon,
  BookOpenText,
  Newspaper,
  Building2,
  Code2,
  Bot,
  GitBranch,
  Globe,
  Laptop,
  LayoutGrid,
  Mic2,
  Presentation,
  Smartphone,
  Sparkles,
  Terminal,
  Wrench,
}

export function resolveResourceIcon(item: ResourceLink): LucideIcon {
  if (item.icon && ICON_BY_NAME[item.icon]) return ICON_BY_NAME[item.icon]
  return resourceIcons[item.type] ?? Globe
}
