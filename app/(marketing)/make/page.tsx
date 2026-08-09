import type { Metadata } from 'next'
import { Suspense } from 'react'
import { dccSiteMeta } from '@/lib/marketing/content'
import { MakeRequestForm } from '@/components/dcc/make/MakeRequestForm'

export const metadata: Metadata = {
  title: 'Make',
  description: 'Request fabrication at Digital Culture Center Miami.',
  openGraph: {
    title: `Make | ${dccSiteMeta.organizationName}`,
    url: '/make',
  },
}

export default function MakePage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--cdc-teal)]">
          DCC.miami
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Fabrication request
        </h1>
        <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
          Revenue funnel entry. Creates a real Inquiry in DCC Jobs &amp; Quotes. You cannot set your
          own price — staff quotes after review.
        </p>
      </header>
      <Suspense fallback={<p className="text-sm text-neutral-500">Loading form…</p>}>
        <MakeRequestForm />
      </Suspense>
    </div>
  )
}
