import type { GlossaryPattern, GlossaryTerm, GlossaryTermType } from '@/lib/course/types'
import {
  BookOpenText,
  Bot,
  Boxes,
  Code2,
  Compass,
  Cpu,
  Fingerprint,
  GitBranch,
  Globe,
  Image,
  Server,
  Layers3,
  Link2,
  Monitor,
  MousePointer2,
  Network,
  Palette,
  ScanLine,
  Sparkles,
  Tags,
  Terminal,
  Workflow,
  Wrench,
  type LucideIcon,
} from 'lucide-react'

export const glossaryTypeIcons: Record<GlossaryTermType, LucideIcon> = {
  'art-term': Palette,
  'browser-term': Monitor,
  'coding-term': Code2,
  'platform-tool': Wrench,
  'course-term': BookOpenText,
}

/** Per-slug Lucide icons (falls back to `glossaryTypeIcons[type]`). */
export const glossaryTermIcons: Record<string, LucideIcon> = {
  'anti-interface': ScanLine,
  appropriation: Layers3,
  artifact: Boxes,
  avatar: Fingerprint,
  branch: GitBranch,
  browser: Monitor,
  'browser-as-medium': Monitor,
  canon: BookOpenText,
  claude: Bot,
  codex: Bot,
  codepen: Sparkles,
  commit: GitBranch,
  clone: GitBranch,
  'context-window': Layers3,
  'cursor-ide': Bot,
  deploy: Globe,
  'digital-trace': Fingerprint,
  documentation: Image,
  feed: Workflow,
  fragment: Compass,
  frontend: Monitor,
  github: GitBranch,
  'github-pages': Globe,
  glitch: ScanLine,
  hosting: Globe,
  hover: MousePointer2,
  hypertext: Link2,
  infrastructure: Server,
  legibility: BookOpenText,
  ide: Code2,
  interaction: MousePointer2,
  interface: Monitor,
  'internet-vernacular': Tags,
  'link-as-structure': Link2,
  liveness: Sparkles,
  motion: Sparkles,
  'net-art': Palette,
  'networked-self': Fingerprint,
  'nonlinear-narrative': Workflow,
  'page-as-space': Monitor,
  'platform-aesthetics': Tags,
  prompt: Bot,
  publishing: Globe,
  react: Cpu,
  remix: Layers3,
  repository: GitBranch,
  'responsive-behavior': MousePointer2,
  scroll: Monitor,
  system: Network,
  'systems-as-subject': Network,
  'software-default': Terminal,
  url: Link2,
  versioning: GitBranch,
  viewport: Monitor,
  vibecoding: Sparkles,
  vscode: Code2,
}

export function getGlossaryPattern(slug: string, type: GlossaryTermType): GlossaryPattern {
  const patternBySlug: Record<string, GlossaryPattern> = {
    'anti-interface': 'scanlines',
    glitch: 'scanlines',
    legibility: 'scanlines',
    hypertext: 'grid',
    infrastructure: 'grid',
    'link-as-structure': 'grid',
    'nonlinear-narrative': 'diagonal',
    remix: 'dots',
    appropriation: 'dots',
    'internet-vernacular': 'radial',
    'networked-self': 'radial',
    system: 'grid',
    'systems-as-subject': 'grid',
    publishing: 'diagonal',
    liveness: 'radial',
    viewport: 'grid',
    'github-pages': 'dots',
    browser: 'grid',
    'browser-as-medium': 'grid',
  }
  if (patternBySlug[slug]) return patternBySlug[slug]
  const patternByType: Record<GlossaryTermType, GlossaryPattern> = {
    'art-term': 'radial',
    'browser-term': 'grid',
    'coding-term': 'diagonal',
    'platform-tool': 'dots',
    'course-term': 'none',
  }
  return patternByType[type]
}

export function resolveGlossaryTermIcon(term: GlossaryTerm): LucideIcon {
  if (term.icon && glossaryTermIcons[term.icon]) return glossaryTermIcons[term.icon]
  return glossaryTermIcons[term.slug] ?? glossaryTypeIcons[term.type]
}

export function resolveGlossaryPattern(term: GlossaryTerm): GlossaryPattern {
  return term.pattern ?? getGlossaryPattern(term.slug, term.type)
}

function isGlossaryTermType(x: string): x is GlossaryTermType {
  return x in glossaryTypeIcons
}

/** Popover may receive a kebab-case `GlossaryTermType` or a formatted label; slug wins when known. */
export function glossaryIconForPopover(slug: string | undefined, typeLabel: string): LucideIcon {
  const fallback = glossaryTypeIcons['course-term']
  if (slug && glossaryTermIcons[slug]) return glossaryTermIcons[slug]
  const normalized = typeLabel.trim().replace(/\s+/g, '-').toLowerCase()
  if (isGlossaryTermType(normalized)) return glossaryTypeIcons[normalized]
  if (isGlossaryTermType(typeLabel)) return glossaryTypeIcons[typeLabel as GlossaryTermType]
  return fallback
}
