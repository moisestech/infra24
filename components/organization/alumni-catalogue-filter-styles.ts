import { cn } from '@/lib/utils'

export type CatalogueFilterTone =
  | 'practice-violet'
  | 'practice-emerald'
  | 'practice-amber'
  | 'website'
  | 'location'
  | 'year'
  | 'topic'
  | 'sort'
  | 'neutral'

const toneStyles: Record<
  CatalogueFilterTone,
  { idle: string; active: string }
> = {
  'practice-violet': {
    idle:
      '!border-violet-300 !bg-violet-50 !text-violet-900 hover:!bg-violet-100 dark:!border-violet-700 dark:!bg-violet-950/80 dark:!text-violet-100',
    active:
      '!border-violet-600 !bg-violet-600 !text-white shadow-md ring-2 ring-violet-400/50 ring-offset-2 ring-offset-background dark:!border-violet-400 dark:!bg-violet-500',
  },
  'practice-emerald': {
    idle:
      '!border-emerald-300 !bg-emerald-50 !text-emerald-900 hover:!bg-emerald-100 dark:!border-emerald-700 dark:!bg-emerald-950/80 dark:!text-emerald-100',
    active:
      '!border-emerald-600 !bg-emerald-600 !text-white shadow-md ring-2 ring-emerald-400/50 ring-offset-2 ring-offset-background dark:!border-emerald-400 dark:!bg-emerald-500',
  },
  'practice-amber': {
    idle:
      '!border-amber-300 !bg-amber-50 !text-amber-950 hover:!bg-amber-100 dark:!border-amber-700 dark:!bg-amber-950/80 dark:!text-amber-100',
    active:
      '!border-amber-600 !bg-amber-600 !text-white shadow-md ring-2 ring-amber-400/50 ring-offset-2 ring-offset-background dark:!border-amber-400 dark:!bg-amber-500',
  },
  website: {
    idle:
      '!border-sky-300 !bg-sky-50 !text-sky-900 hover:!bg-sky-100 dark:!border-sky-700 dark:!bg-sky-950/80 dark:!text-sky-100',
    active:
      '!border-sky-600 !bg-sky-600 !text-white shadow-md ring-2 ring-sky-400/50 ring-offset-2 ring-offset-background dark:!border-sky-400 dark:!bg-sky-500',
  },
  location: {
    idle:
      '!border-teal-300 !bg-teal-50 !text-teal-900 hover:!bg-teal-100 dark:!border-teal-700 dark:!bg-teal-950/80 dark:!text-teal-100',
    active:
      '!border-teal-600 !bg-teal-600 !text-white shadow-md ring-2 ring-teal-400/50 ring-offset-2 ring-offset-background dark:!border-teal-400 dark:!bg-teal-500',
  },
  year: {
    idle:
      '!border-orange-300 !bg-orange-50 !text-orange-950 hover:!bg-orange-100 dark:!border-orange-700 dark:!bg-orange-950/80 dark:!text-orange-100',
    active:
      '!border-orange-600 !bg-orange-600 !text-white shadow-md ring-2 ring-orange-400/50 ring-offset-2 ring-offset-background dark:!border-orange-400 dark:!bg-orange-500',
  },
  topic: {
    idle:
      '!border-fuchsia-300 !bg-fuchsia-50 !text-fuchsia-900 hover:!bg-fuchsia-100 dark:!border-fuchsia-700 dark:!bg-fuchsia-950/80 dark:!text-fuchsia-100',
    active:
      '!border-fuchsia-600 !bg-fuchsia-600 !text-white shadow-md ring-2 ring-fuchsia-400/50 ring-offset-2 ring-offset-background dark:!border-fuchsia-400 dark:!bg-fuchsia-500',
  },
  sort: {
    idle:
      '!border-indigo-300 !bg-indigo-50 !text-indigo-900 hover:!bg-indigo-100 dark:!border-indigo-700 dark:!bg-indigo-950/80 dark:!text-indigo-100',
    active:
      '!border-indigo-600 !bg-indigo-600 !text-white shadow-md ring-2 ring-indigo-400/50 ring-offset-2 ring-offset-background dark:!border-indigo-400 dark:!bg-indigo-500',
  },
  neutral: {
    idle:
      '!border-border !bg-card !text-foreground/80 hover:!border-primary/35 hover:!bg-muted hover:!text-foreground',
    active:
      '!border-primary !bg-primary !text-primary-foreground shadow-md ring-2 ring-primary/45 ring-offset-2 ring-offset-background',
  },
}

/** Chip-style filter buttons — color indicates category; active state uses stronger fill + ring. */
export function catalogueFilterChip(
  active: boolean,
  tone: CatalogueFilterTone = 'neutral'
): string {
  const palette = toneStyles[tone]
  return cn(
    'h-9 rounded-full border-2 px-3.5 text-sm font-semibold shadow-sm transition-[box-shadow,background-color,border-color,color]',
    active ? palette.active : palette.idle
  )
}

export function catalogueFilterGroupDot(tone: CatalogueFilterTone): string {
  const map: Record<CatalogueFilterTone, string> = {
    'practice-violet': 'bg-violet-500',
    'practice-emerald': 'bg-emerald-500',
    'practice-amber': 'bg-amber-500',
    website: 'bg-sky-500',
    location: 'bg-teal-500',
    year: 'bg-orange-500',
    topic: 'bg-fuchsia-500',
    sort: 'bg-indigo-500',
    neutral: 'bg-muted-foreground',
  }
  return cn('h-2 w-2 shrink-0 rounded-full', map[tone])
}

export const catalogueSelectTrigger = cn(
  'h-10 w-full border-2 border-border bg-card text-foreground shadow-sm',
  'hover:bg-muted/60',
  'focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background',
  '[&>span]:line-clamp-1 [&>span]:text-foreground'
)

export const catalogueSelectContent = cn(
  'z-[100] border-2 border-border bg-card text-foreground shadow-xl',
  'dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-50'
)

export const catalogueSelectItem = cn(
  'text-foreground focus:bg-primary/15 focus:text-foreground',
  'data-[highlighted]:bg-primary/15 data-[highlighted]:text-foreground',
  'dark:text-zinc-50 dark:focus:bg-primary/25 dark:data-[highlighted]:bg-primary/25'
)
