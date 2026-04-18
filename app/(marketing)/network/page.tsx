import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { dccSiteMeta } from '@/lib/marketing/content'

const NetworkGraph = dynamic(
  () => import('@/components/marketing/dcc-network/NetworkGraphClient'),
  {
    ssr: false,
    loading: () => <div className="min-h-[480px] animate-pulse rounded-xl bg-neutral-100 dark:bg-neutral-800" />,
  }
)

export const metadata: Metadata = {
  title: 'Network',
  description:
    'Interactive cultural network — people, institutions, and opportunities connected through Digital Culture Center Miami.',
  openGraph: {
    title: `Network | ${dccSiteMeta.organizationName}`,
    description: 'Explore relationships across Miami’s cultural field.',
    url: '/network',
  },
}

export default function DccNetworkPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--cdc-teal)]">DCC.miami</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Cultural network explorer
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          Full explorer includes opportunities and campaigns when synced from Airtable. Use search and filters to focus
          the graph.
        </p>
      </header>
      <NetworkGraph />
    </div>
  )
}
