/**
 * Color tokens for fabrication UI — always paired with Lucide icons + labels.
 */
export type FabricationColorTokenId =
  | 'cyan'
  | 'indigo'
  | 'violet'
  | 'amber'
  | 'emerald'
  | 'rose'
  | 'slate'
  | 'teal'
  | 'orange'
  | 'sky'

export type FabricationColorClasses = {
  chip: string
  icon: string
  surface: string
  border: string
  heading: string
  gradient: string
}

export const FABRICATION_COLOR_TOKENS: Record<
  FabricationColorTokenId,
  FabricationColorClasses
> = {
  cyan: {
    chip: 'border-cyan-200 bg-cyan-50 text-cyan-900 dark:border-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-100',
    icon: 'bg-cyan-700 text-white',
    surface: 'bg-cyan-50/70 dark:bg-cyan-950/20',
    border: 'border-cyan-200 dark:border-cyan-800',
    heading: 'text-cyan-900 dark:text-cyan-100',
    gradient: 'from-cyan-100 via-sky-50 to-white dark:from-cyan-950/40 dark:via-neutral-950 dark:to-neutral-950',
  },
  indigo: {
    chip: 'border-indigo-200 bg-indigo-50 text-indigo-900 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-100',
    icon: 'bg-indigo-700 text-white',
    surface: 'bg-indigo-50/70 dark:bg-indigo-950/20',
    border: 'border-indigo-200 dark:border-indigo-800',
    heading: 'text-indigo-900 dark:text-indigo-100',
    gradient: 'from-indigo-100 via-blue-50 to-white dark:from-indigo-950/40 dark:via-neutral-950 dark:to-neutral-950',
  },
  violet: {
    chip: 'border-violet-200 bg-violet-50 text-violet-950 dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-100',
    icon: 'bg-violet-700 text-white',
    surface: 'bg-violet-50/70 dark:bg-violet-950/20',
    border: 'border-violet-200 dark:border-violet-800',
    heading: 'text-violet-950 dark:text-violet-100',
    gradient: 'from-violet-100 via-fuchsia-50 to-white dark:from-violet-950/40 dark:via-neutral-950 dark:to-neutral-950',
  },
  amber: {
    chip: 'border-amber-300 bg-amber-50 text-amber-950 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-100',
    icon: 'bg-amber-400 text-amber-950',
    surface: 'bg-amber-50/80 dark:bg-amber-950/20',
    border: 'border-amber-300 dark:border-amber-700',
    heading: 'text-amber-950 dark:text-amber-100',
    gradient: 'from-amber-100 via-orange-50 to-white dark:from-amber-950/40 dark:via-neutral-950 dark:to-neutral-950',
  },
  emerald: {
    chip: 'border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-100',
    icon: 'bg-emerald-700 text-white',
    surface: 'bg-emerald-50/70 dark:bg-emerald-950/20',
    border: 'border-emerald-200 dark:border-emerald-800',
    heading: 'text-emerald-950 dark:text-emerald-100',
    gradient: 'from-emerald-100 via-teal-50 to-white dark:from-emerald-950/40 dark:via-neutral-950 dark:to-neutral-950',
  },
  rose: {
    chip: 'border-rose-200 bg-rose-50 text-rose-950 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-100',
    icon: 'bg-rose-700 text-white',
    surface: 'bg-rose-50/70 dark:bg-rose-950/20',
    border: 'border-rose-200 dark:border-rose-800',
    heading: 'text-rose-950 dark:text-rose-100',
    gradient: 'from-rose-100 via-orange-50 to-white dark:from-rose-950/40 dark:via-neutral-950 dark:to-neutral-950',
  },
  slate: {
    chip: 'border-slate-200 bg-slate-100 text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100',
    icon: 'bg-slate-800 text-white',
    surface: 'bg-slate-50 dark:bg-slate-900/40',
    border: 'border-slate-200 dark:border-slate-700',
    heading: 'text-slate-900 dark:text-slate-100',
    gradient: 'from-slate-200/80 via-white to-white dark:from-slate-900 dark:via-neutral-950 dark:to-neutral-950',
  },
  teal: {
    chip: 'border-teal-200 bg-teal-50 text-teal-900 dark:border-teal-800 dark:bg-teal-950/40 dark:text-teal-100',
    icon: 'bg-teal-700 text-white',
    surface: 'bg-teal-50/70 dark:bg-teal-950/20',
    border: 'border-teal-200 dark:border-teal-800',
    heading: 'text-teal-900 dark:text-teal-100',
    gradient: 'from-teal-100 via-cyan-50 to-white dark:from-teal-950/40 dark:via-neutral-950 dark:to-neutral-950',
  },
  orange: {
    chip: 'border-orange-200 bg-orange-50 text-orange-950 dark:border-orange-800 dark:bg-orange-950/40 dark:text-orange-100',
    icon: 'bg-orange-600 text-white',
    surface: 'bg-orange-50/70 dark:bg-orange-950/20',
    border: 'border-orange-200 dark:border-orange-800',
    heading: 'text-orange-950 dark:text-orange-100',
    gradient: 'from-orange-100 via-amber-50 to-white dark:from-orange-950/40 dark:via-neutral-950 dark:to-neutral-950',
  },
  sky: {
    chip: 'border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-100',
    icon: 'bg-sky-700 text-white',
    surface: 'bg-sky-50/70 dark:bg-sky-950/20',
    border: 'border-sky-200 dark:border-sky-800',
    heading: 'text-sky-900 dark:text-sky-100',
    gradient: 'from-sky-100 via-cyan-50 to-white dark:from-sky-950/40 dark:via-neutral-950 dark:to-neutral-950',
  },
}

export function getFabricationColor(
  id: FabricationColorTokenId
): FabricationColorClasses {
  return FABRICATION_COLOR_TOKENS[id]
}
