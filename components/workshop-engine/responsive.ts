/**
 * Shared responsive layout + type scale for workshop-engine surfaces.
 * Breakpoints (approx): mobile <640 → tablet 640–1023 → desktop 1024–1439 →
 * large desktop 1440–1919 → TV / XL 1920+.
 */
export const weShell = {
  /** Page container — expands on large screens without locking to max-w-3xl */
  width: 'mx-auto w-full max-w-3xl md:max-w-4xl lg:max-w-6xl xl:max-w-[1500px] 2xl:max-w-[1600px] min-[1920px]:max-w-[1760px]',
  pad: 'px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12',
  mainPy: 'py-6 md:py-8 lg:py-10 xl:py-12 2xl:py-14',
} as const

export const weType = {
  /** Page / hub H1 */
  display:
    'font-semibold tracking-tight text-slate-950 text-[clamp(1.875rem,4.5vw,3.75rem)] leading-[1.1]',
  /** Module / section H1 */
  title:
    'font-semibold tracking-tight text-slate-950 text-[clamp(1.75rem,4vw,5.5rem)] leading-[1.08]',
  /** Section H2 */
  section:
    'font-semibold tracking-tight text-slate-950 text-[clamp(1.25rem,2vw,1.875rem)]',
  /** Card / module card title */
  cardTitle:
    'font-semibold text-slate-950 text-[clamp(1rem,1.4vw,1.5rem)]',
  /** Body / promise — readable measure handled by weMeasure */
  body: 'leading-relaxed text-slate-700 text-[clamp(1rem,1.15vw,1.25rem)]',
  /** TV prompt — room-scale */
  tvPrompt:
    'font-medium leading-snug text-neutral-50 text-[clamp(1.5rem,4.2vw,4rem)] min-[1920px]:text-[clamp(2.5rem,3.5vw,5rem)]',
  /** TV title */
  tvTitle:
    'font-semibold leading-tight text-white text-[clamp(2rem,5vw,8rem)] min-[1920px]:text-[clamp(3.5rem,6vw,8rem)]',
  /** Supporting / meta */
  meta: 'text-xs font-medium uppercase tracking-[0.12em] text-slate-500 md:text-[0.7rem] 2xl:text-xs 2xl:tracking-[0.14em]',
  /** Small UI labels */
  label: 'text-xs text-slate-600 md:text-sm 2xl:text-base',
} as const

export const weSpace = {
  stack: 'space-y-6 md:space-y-8 2xl:space-y-10',
  stackTight: 'space-y-3 md:space-y-4 2xl:space-y-5',
  cardPad: 'p-4 md:p-5 lg:p-6 2xl:p-7',
  headerPad: 'p-4 sm:p-5 md:p-6 lg:p-7 2xl:p-8',
  gap: 'gap-6 md:gap-8 xl:gap-10 2xl:gap-12',
} as const

/** Keep prose readable on wide screens (~65–75ch). */
export const weMeasure = {
  prose: 'max-w-[70ch]',
  proseWide: 'max-w-[75ch]',
} as const

/** Icon box sizes that grow with viewport. */
export const weIconBox = {
  sm: 'h-8 w-8 md:h-9 md:w-9 2xl:h-10 2xl:w-10',
  md: 'h-10 w-10 md:h-12 md:w-12 2xl:h-14 2xl:w-14',
  lg: 'h-12 w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 2xl:h-20 2xl:w-20',
} as const

/** Minimum 44px touch targets for participant-facing controls. */
export const weTouch = {
  target: 'min-h-11 min-w-11',
  button:
    'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium md:text-base 2xl:px-5 2xl:py-3 2xl:text-lg',
  navPill:
    'inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition md:gap-2 md:px-4 2xl:px-5 2xl:text-base',
} as const

/** Desktop main + rail (~8/4 of 12). Tablet and below stay single column. */
export const weLayout = {
  moduleGrid:
    'grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8 xl:gap-10 2xl:gap-12',
  main: 'min-w-0 space-y-5 md:space-y-6 lg:col-span-8 2xl:space-y-8',
  rail: 'min-w-0 space-y-4 md:space-y-5 lg:col-span-4 lg:sticky lg:top-6 lg:self-start',
  facilitatorGrid:
    'grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8 xl:gap-10',
  facilitatorMain: 'min-w-0 space-y-5 lg:col-span-7 xl:col-span-8',
  facilitatorSide: 'min-w-0 space-y-5 lg:col-span-5 xl:col-span-4 lg:sticky lg:top-6 lg:self-start',
} as const
