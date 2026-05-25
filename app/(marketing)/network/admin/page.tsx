import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/marketing/cdc/Breadcrumbs'
import { EraPill } from '@/components/era/EraPill'
import { cdcPageMetadata } from '@/lib/cdc/metadata'
import { getCdcBreadcrumbs } from '@/lib/cdc/routes'

const GraphExplorer = dynamic(
  () => import('@/components/marketing/dcc-network/GraphExplorer').then((m) => m.GraphExplorer),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[min(85dvh,720px)] w-full animate-pulse rounded-xl bg-neutral-900/60" aria-hidden />
    ),
  }
)

const path = '/network/admin'

export const metadata: Metadata = {
  ...cdcPageMetadata(path),
  robots: { index: false, follow: false },
}

export default function NetworkAdminPage() {
  if (process.env.DCC_NETWORK_ADMIN_ENABLED !== 'true') {
    notFound()
  }

  const crumbs = getCdcBreadcrumbs(path)

  return (
    <div className="bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-7xl px-4 pb-6 pt-10 sm:px-6 lg:px-8">
        <EraPill tone="onDark" className="mb-4" />
        {crumbs.length > 0 ? <Breadcrumbs items={crumbs} className="mb-6 text-neutral-400" /> : null}
        <header className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">Internal</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white md:text-4xl">Admin network graph</h1>
          <p className="mt-3 text-sm leading-relaxed text-neutral-400">
            Full CRM metadata for staff review — consent, scores, review status, and candidate context.
          </p>
          <p className="mt-4 text-sm text-neutral-500">
            <Link href="/network" className="font-medium text-[var(--cdc-teal)] underline-offset-4 hover:underline">
              Public network
            </Link>
          </p>
        </header>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4 sm:p-6">
          <GraphExplorer surface="explorer" mode="admin" visibility="internal" showModeToggle={false} admin className="text-neutral-100" />
        </div>
      </div>
    </div>
  )
}
