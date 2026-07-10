import Link from 'next/link'
import { CalendarDays } from 'lucide-react'

/** Slim promo strip between exhibition and artists — dates TBD + join CTA. */
export function EdgeZonesPromoStrip() {
  return (
    <Link
      href="#join"
      className="group relative block overflow-hidden border-y border-teal-200/50 bg-gradient-to-r from-teal-50/60 via-white to-cyan-50/40 outline-none transition-[border-color,box-shadow] duration-300 dark:border-teal-800/40 dark:from-teal-950/25 dark:via-neutral-950 dark:to-cyan-950/20 hover:border-teal-300/60 hover:shadow-[0_0_0_1px_rgba(45,212,191,0.28),0_10px_40px_-12px_rgba(45,212,191,0.25)] dark:hover:border-teal-500/35"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden
      >
        <div className="absolute inset-0 bg-gradient-to-r from-teal-400/8 via-violet-400/6 to-cyan-400/8" />
      </div>
      <div className="relative mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3 sm:gap-4">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-teal-200/90 bg-gradient-to-br from-teal-50 to-white text-teal-700 shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:border-teal-400/80 group-hover:shadow-[0_0_22px_rgba(20,184,166,0.35)] dark:border-teal-800/70 dark:from-teal-950/60 dark:to-neutral-900 dark:text-teal-300"
            aria-hidden
          >
            <CalendarDays className="h-[1.15rem] w-[1.15rem]" strokeWidth={2.25} />
          </span>
          <p className="max-w-xl text-xs leading-snug text-neutral-600 dark:text-neutral-400 sm:text-[13px]">
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">Touching Grass</span>
            {' — '}
            exhibition dates TBD. Join below for program updates and Miami&apos;s digital culture map.
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-teal-600 bg-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-md transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-[0_0_28px_rgba(20,184,166,0.45)] dark:border-teal-500/45 dark:bg-teal-700">
          Join for updates
          <span aria-hidden className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">
            →
          </span>
        </span>
      </div>
    </Link>
  )
}
