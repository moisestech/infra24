import Link from 'next/link'
import { WebcoreIcon } from '@/components/marketing/webcore-lucide'
import {
  ARTIST_PRODUCTION_CHIP,
  ARTIST_PRODUCTION_CTA,
  ARTIST_PRODUCTION_SPOKEN,
  ARTIST_PRODUCTION_SUPPORT,
} from '@/lib/marketing/artist-production-narrative'

/** Compact sales layer under homepage identity CTAs. Does not replace Artists / Workshops / Fabricate. */
export function ArtistProductionPromiseBand() {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white/80 px-4 py-4 dark:border-neutral-700 dark:bg-neutral-900/70 sm:px-5 sm:py-5">
      <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
        <WebcoreIcon name="Lightbulb" className="h-3.5 w-3.5 text-[var(--cdc-coral)]" />
        Make
      </p>
      <p className="mt-2 text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-lg">
        {ARTIST_PRODUCTION_SPOKEN}
      </p>
      <p className="mt-1 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
        {ARTIST_PRODUCTION_SUPPORT}
      </p>
      <p className="cdc-font-mono-accent mt-2 text-[11px] uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400">
        {ARTIST_PRODUCTION_CHIP}
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <Link
          href={ARTIST_PRODUCTION_CTA.startProject.href}
          className="inline-flex justify-center rounded-md bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 dark:bg-neutral-100 dark:text-neutral-900"
        >
          {ARTIST_PRODUCTION_CTA.startProject.label}
        </Link>
        <Link
          href={ARTIST_PRODUCTION_CTA.printMyFile.href}
          className="inline-flex justify-center text-sm font-medium text-neutral-700 underline-offset-4 hover:underline dark:text-neutral-300"
        >
          {ARTIST_PRODUCTION_CTA.printMyFile.label}
        </Link>
      </div>
    </div>
  )
}
