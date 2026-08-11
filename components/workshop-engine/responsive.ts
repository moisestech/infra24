/**
 * Shared responsive layout + type scale for workshop-engine surfaces.
 * Breakpoints: mobile (default) → md tablet → lg desktop → 2xl large desktop (biggest type).
 */
export const weShell = {
  width: 'mx-auto w-full max-w-3xl lg:max-w-5xl 2xl:max-w-7xl',
  pad: 'px-4 sm:px-5 md:px-6 lg:px-8 2xl:px-10',
  mainPy: 'py-6 md:py-8 lg:py-10 2xl:py-14',
} as const

export const weType = {
  /** Page / hub H1 */
  display:
    'text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl md:text-5xl lg:text-5xl 2xl:text-6xl 2xl:leading-[1.05]',
  /** Module / section H1 */
  title:
    'text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl md:text-4xl lg:text-[2.5rem] 2xl:text-5xl',
  /** Section H2 */
  section:
    'text-xl font-semibold tracking-tight text-slate-950 md:text-2xl 2xl:text-3xl',
  /** Card / module card title */
  cardTitle:
    'text-base font-semibold text-slate-950 sm:text-lg md:text-xl 2xl:text-2xl',
  /** Body / promise */
  body: 'text-sm leading-relaxed text-slate-700 sm:text-base md:text-[1.05rem] 2xl:text-lg 2xl:leading-relaxed',
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
} as const

/** Icon box sizes that grow with viewport. */
export const weIconBox = {
  sm: 'h-8 w-8 md:h-9 md:w-9 2xl:h-10 2xl:w-10',
  md: 'h-10 w-10 md:h-12 md:w-12 2xl:h-14 2xl:w-14',
  lg: 'h-12 w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 2xl:h-20 2xl:w-20',
} as const
