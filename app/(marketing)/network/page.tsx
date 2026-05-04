import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { UserPlus } from 'lucide-react'
import { dccSiteMeta } from '@/lib/marketing/content'
import { EraPill } from '@/components/era/EraPill'

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
        <EraPill className="mb-5" />
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--cdc-teal)]">DCC.miami</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Cultural network explorer
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          Search the map of artists, organizations, programs, and opportunities shaping Miami&rsquo;s
          digital culture field. Open the{' '}
          <Link
            href="/network/living"
            className="font-medium text-[var(--cdc-teal)] underline-offset-4 hover:underline dark:text-teal-300"
          >
            Living network
          </Link>{' '}
          for the full-width view.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Link
            href="/contact/artist-index?source=era-network"
            className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 dark:bg-neutral-100 dark:text-neutral-900"
          >
            <UserPlus className="h-4 w-4" aria-hidden />
            Add yourself to the artist index
          </Link>
          <Link
            href="/network/living"
            className="inline-flex items-center gap-1 rounded-full border border-[var(--cdc-border)] px-4 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-300 hover:text-neutral-900 dark:border-neutral-600 dark:text-neutral-300 dark:hover:border-neutral-500 dark:hover:text-neutral-100"
          >
            Open living network
            <span aria-hidden>→</span>
          </Link>
        </div>
      </header>
      <NetworkGraph />
    </div>
  )
}
