'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { RESIN_BANNER_CDN, RESIN_BANNER_SIZE } from '@/lib/workshop-engine/resin-printing'

/** Code-native resin workshop engine — not a Supabase workshops-table row. */
export function ResinPrintingWorkshopsLandingTeaser({
  isDark,
  className,
}: {
  isDark?: boolean
  className?: string
}) {
  const dark = isDark === true
  const cssDark = isDark === undefined
  return (
    <div
      className={cn(
        'mb-12 overflow-hidden rounded-2xl border',
        dark
          ? 'border-teal-900/60 bg-teal-950/30'
          : 'border-teal-200 bg-teal-50/80 shadow-sm',
        cssDark && 'dark:border-teal-900/60 dark:bg-teal-950/30 dark:shadow-none',
        className
      )}
    >
      <div
        className="relative w-full bg-slate-200/60 dark:bg-slate-900/40"
        style={{ aspectRatio: `${RESIN_BANNER_SIZE.width} / ${RESIN_BANNER_SIZE.height}` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={RESIN_BANNER_CDN.welcome}
          alt="Illustrative translucent resin sculpture and cured sample on a workshop table."
          width={RESIN_BANNER_SIZE.width}
          height={RESIN_BANNER_SIZE.height}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      </div>
      <div className="px-5 py-6 md:px-8 md:py-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Live class · Digital Lab
        </p>
        <p
          className={cn(
            'mt-3 text-base font-semibold leading-snug md:text-lg',
            dark ? 'text-neutral-100' : 'text-neutral-900',
            cssDark && 'dark:text-neutral-100'
          )}
        >
          Intro to 3D Resin Printing for Artists
        </p>
        <p
          className={cn(
            'mt-2 text-sm font-medium',
            dark ? 'text-teal-200/90' : 'text-teal-900/80',
            cssDark && 'dark:text-teal-200/90'
          )}
        >
          Facilitator · TV · participant session · booklet
        </p>
        <p
          className={cn(
            'mt-4 text-sm leading-relaxed md:text-base',
            dark ? 'text-neutral-300' : 'text-neutral-700',
            cssDark && 'dark:text-neutral-300'
          )}
        >
          Nine teaching modules from safety and file readiness through slicer lab and project
          readiness. Opens the live workshop engine — not listed in the Airtable/DB catalog.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild size="sm" className="rounded-full">
            <Link href="/workshop/resin-printing">Open resin workshop</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link href="/workshop/resin-printing/venue/oolite">Oolite venue notes</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link href="/fabricate">Fabrication pricing</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
