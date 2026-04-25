import {
  Binary,
  BookOpenText,
  Bot,
  Box,
  Building2,
  Code2,
  Columns,
  Compass,
  Film,
  Fingerprint,
  GitBranch,
  Globe,
  Image,
  LayoutGrid,
  Layers3,
  Link2,
  MessagesSquare,
  Monitor,
  MousePointer2,
  MousePointerSquareDashed,
  MousePointerClick,
  MoveVertical,
  Network,
  Palette,
  Scale,
  ScanLine,
  ScanSearch,
  Server,
  Sparkles,
  Sticker,
  Target,
  Terminal,
  UserRound,
  Workflow,
  Wrench,
  type LucideIcon,
} from 'lucide-react'

/** Lucide icons addressable by `lucide:IconName` suffix or bare PascalCase in chapter data. */
export const sectionIcons: Record<string, LucideIcon> = {
  Binary,
  BookOpenText,
  Bot,
  Box,
  Building2,
  Code2,
  Columns,
  Compass,
  Film,
  Fingerprint,
  GitBranch,
  Globe,
  Image,
  LayoutGrid,
  Layers3,
  Link2,
  MessagesSquare,
  Monitor,
  MousePointer2,
  MousePointerSquareDashed,
  MousePointerClick,
  MoveVertical,
  Network,
  Palette,
  Scale,
  ScanLine,
  ScanSearch,
  Server,
  Sparkles,
  Sticker,
  Target,
  Terminal,
  UserRound,
  Workflow,
  Wrench,
}

/** Legacy semantic keys from older overlays (formerly react-icons/md). */
const LEGACY_SECTION_ICON: Record<string, LucideIcon> = {
  concept: Sparkles,
  artist: Palette,
  palette: Palette,
  build: Code2,
  code: Code2,
  ethics: Scale,
  book: BookOpenText,
  attention: MousePointer2,
  trigger: MousePointerClick,
  motion: Film,
  rhythm: ScanLine,
  life: Sparkles,
  compare: LayoutGrid,
  lenses: MessagesSquare,
}

function normalizeIconKey(icon: string): string {
  if (icon.startsWith('lucide:')) return icon.slice('lucide:'.length)
  return icon
}

export function getSectionIcon(icon?: string): LucideIcon {
  if (!icon?.trim()) return BookOpenText
  const key = normalizeIconKey(icon.trim())
  if (sectionIcons[key]) return sectionIcons[key]
  if (LEGACY_SECTION_ICON[key]) return LEGACY_SECTION_ICON[key]
  return BookOpenText
}
