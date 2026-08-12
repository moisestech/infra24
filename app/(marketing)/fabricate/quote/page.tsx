import type { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import { FabricateChrome } from '@/components/dcc/fabrication/FabricateChrome'
import { FabricateQuoteForm } from '@/components/dcc/fabrication/FabricateQuoteForm'
import {
  FABRICATION_PROMISE,
  FABRICATION_WORKSHOP_BOUNDARY,
} from '@/lib/dcc/fabrication'
import { dccSiteMeta } from '@/lib/marketing/content'

export const metadata: Metadata = {
  title: 'Request a fabrication quote',
  description: FABRICATION_PROMISE,
  openGraph: {
    title: `Request a quote | ${dccSiteMeta.organizationName}`,
    url: '/fabricate/quote',
  },
}

export default function FabricateQuotePage() {
  return (
    <FabricateChrome current="quote">
      <header className="mb-8 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--cdc-teal)]">
          Quote intake
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Request a quote
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          Phase 1 intake writes to DCC Jobs &amp; Quotes for staff review. You will receive a
          transparent estimate — you cannot set your own price.
        </p>
        <p className="mt-3 text-sm text-amber-900 dark:text-amber-200">
          {FABRICATION_WORKSHOP_BOUNDARY}
        </p>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          Coming from the{' '}
          <Link href="/workshop/resin-printing" className="underline">
            resin workshop
          </Link>
          ? Bring your readiness status (ready / repair / consultation) in the notes.
        </p>
      </header>

      <div className="max-w-xl">
        <Suspense fallback={<p className="text-sm text-neutral-500">Loading form…</p>}>
          <FabricateQuoteForm />
        </Suspense>
      </div>
    </FabricateChrome>
  )
}
