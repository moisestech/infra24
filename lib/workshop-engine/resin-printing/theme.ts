import type {
  ModuleColorTokenClasses,
  ModuleColorTokenId,
  ModuleIconKey,
  ModuleVisualIdentity,
  VenueAccentClasses,
  VenueAccentId,
} from '@/lib/workshop-engine/types'

/** Semantic color bundles for workshop modules (meaning + icon/text, never color alone). */
export const MODULE_COLOR_TOKENS: Record<ModuleColorTokenId, ModuleColorTokenClasses> = {
  cyan: {
    chip: 'border-cyan-200 bg-cyan-50 text-cyan-900',
    icon: 'bg-cyan-700 text-white',
    surface: 'bg-cyan-50/70',
    border: 'border-cyan-200',
    gradient: 'from-cyan-100 via-sky-50 to-white',
    tvGlow: 'from-cyan-500/30 via-slate-950 to-slate-950',
  },
  sky: {
    chip: 'border-sky-200 bg-sky-50 text-sky-900',
    icon: 'bg-sky-700 text-white',
    surface: 'bg-sky-50/70',
    border: 'border-sky-200',
    gradient: 'from-sky-100 via-cyan-50 to-white',
    tvGlow: 'from-sky-500/30 via-slate-950 to-slate-950',
  },
  amber: {
    chip: 'border-amber-300 bg-amber-50 text-amber-950',
    icon: 'bg-amber-400 text-amber-950',
    surface: 'bg-amber-50/80',
    border: 'border-amber-300',
    gradient: 'from-amber-100 via-orange-50 to-white',
    tvGlow: 'from-amber-500/30 via-slate-950 to-slate-950',
  },
  blue: {
    chip: 'border-blue-200 bg-blue-50 text-blue-900',
    icon: 'bg-blue-700 text-white',
    surface: 'bg-blue-50/70',
    border: 'border-blue-200',
    gradient: 'from-blue-100 via-sky-50 to-white',
    tvGlow: 'from-blue-500/30 via-slate-950 to-slate-950',
  },
  teal: {
    chip: 'border-teal-200 bg-teal-50 text-teal-900',
    icon: 'bg-teal-700 text-white',
    surface: 'bg-teal-50/70',
    border: 'border-teal-200',
    gradient: 'from-teal-100 via-cyan-50 to-white',
    tvGlow: 'from-teal-500/30 via-slate-950 to-slate-950',
  },
  indigo: {
    chip: 'border-indigo-200 bg-indigo-50 text-indigo-900',
    icon: 'bg-indigo-700 text-white',
    surface: 'bg-indigo-50/70',
    border: 'border-indigo-200',
    gradient: 'from-indigo-100 via-blue-50 to-white',
    tvGlow: 'from-indigo-500/30 via-slate-950 to-slate-950',
  },
  orange: {
    chip: 'border-orange-200 bg-orange-50 text-orange-950',
    icon: 'bg-orange-600 text-white',
    surface: 'bg-orange-50/70',
    border: 'border-orange-200',
    gradient: 'from-orange-100 via-amber-50 to-white',
    tvGlow: 'from-orange-500/30 via-slate-950 to-slate-950',
  },
  rose: {
    chip: 'border-rose-200 bg-rose-50 text-rose-950',
    icon: 'bg-rose-700 text-white',
    surface: 'bg-rose-50/70',
    border: 'border-rose-200',
    gradient: 'from-rose-100 via-orange-50 to-white',
    tvGlow: 'from-rose-500/30 via-slate-950 to-slate-950',
  },
  emerald: {
    chip: 'border-emerald-200 bg-emerald-50 text-emerald-950',
    icon: 'bg-emerald-700 text-white',
    surface: 'bg-emerald-50/70',
    border: 'border-emerald-200',
    gradient: 'from-emerald-100 via-teal-50 to-white',
    tvGlow: 'from-emerald-500/30 via-slate-950 to-slate-950',
  },
  slate: {
    chip: 'border-slate-200 bg-slate-100 text-slate-800',
    icon: 'bg-slate-950 text-white',
    surface: 'bg-slate-50',
    border: 'border-slate-200',
    gradient: 'from-slate-200/80 via-white to-white',
    tvGlow: 'from-slate-500/25 via-slate-950 to-slate-950',
  },
}

export const DEFAULT_MODULE_VISUAL: ModuleVisualIdentity = {
  phase: 'Workshop',
  iconKey: 'circle-dot',
  colorTokenId: 'slate',
}

/** Resin curriculum module visual identities (phase + icon + color token). */
export const RESIN_MODULE_VISUALS: Record<string, ModuleVisualIdentity> = {
  welcome: { phase: 'Orientation', iconKey: 'circle-dot', colorTokenId: 'cyan' },
  'why-resin': { phase: 'Material fit', iconKey: 'sparkles', colorTokenId: 'sky' },
  'safety-zones': { phase: 'Safety gate', iconKey: 'shield-check', colorTokenId: 'amber' },
  'complete-workflow': { phase: 'Process map', iconKey: 'workflow', colorTokenId: 'blue' },
  'file-readiness': { phase: 'Digital prep', iconKey: 'scan-line', colorTokenId: 'teal' },
  'slicer-lab': { phase: 'Slicer lab', iconKey: 'sliders', colorTokenId: 'indigo' },
  'print-wash-cure': {
    phase: 'Controlled process',
    iconKey: 'droplets',
    colorTokenId: 'orange',
  },
  'failure-clinic': { phase: 'Diagnosis', iconKey: 'search', colorTokenId: 'rose' },
  'project-readiness': {
    phase: 'Next step',
    iconKey: 'clipboard-check',
    colorTokenId: 'emerald',
  },
}

export const VENUE_ACCENTS: Record<VenueAccentId, VenueAccentClasses> = {
  'oolite-teal': {
    label: 'Pilot venue · teal',
    chip: 'text-teal-800',
    border: 'border-teal-200',
    gradient: 'from-teal-50 to-white',
    heading: 'text-slate-950',
  },
  'bakehouse-copper': {
    label: 'DCC.MIAMI · copper',
    chip: 'text-orange-900',
    border: 'border-orange-200',
    gradient: 'from-orange-50 to-white',
    heading: 'text-slate-950',
  },
}

export function getColorTokenClasses(
  tokenId: ModuleColorTokenId | undefined
): ModuleColorTokenClasses {
  return MODULE_COLOR_TOKENS[tokenId ?? 'slate']
}

export function getVenueAccent(
  accentId: VenueAccentId | undefined
): VenueAccentClasses | null {
  if (!accentId) return null
  return VENUE_ACCENTS[accentId] ?? null
}

export type { ModuleIconKey }
