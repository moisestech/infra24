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
          People from DCC CRM. Names and roles only — emails stay on the staff list. Cyan is a client,
          teal is a fabricator, indigo is the wider network. Open the{' '}
          <Link
            href="/network/living"
            className="font-medium text-[var(--cdc-teal)] underline-offset-4 hover:underline dark:text-teal-300"
          >
            Living network
          </Link>{' '}
          for the full-width view, or the{' '}
          <Link
            href="/network/immersive"
            className="font-medium text-[var(--cdc-teal)] underline-offset-4 hover:underline dark:text-teal-300"
          >
            Immersive view
          </Link>{' '}
          for a 3D field map.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Link
            href="/network/signup?pathway=index&source=era-network"
            className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 dark:bg-neutral-100 dark:text-neutral-900"
          >
            <UserPlus className="h-4 w-4" aria-hidden />
            Join Miami&apos;s Digital Culture Map
          </Link>
          <Link
            href="/network/research"
            className="inline-flex items-center gap-1 rounded-full border border-[var(--cdc-border)] px-4 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-300 hover:text-neutral-900 dark:border-neutral-600 dark:text-neutral-300 dark:hover:border-neutral-500 dark:hover:text-neutral-100"
          >
            Research View
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="/network/living"
            className="inline-flex items-center gap-1 rounded-full border border-[var(--cdc-border)] px-4 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-300 hover:text-neutral-900 dark:border-neutral-600 dark:text-neutral-300 dark:hover:border-neutral-500 dark:hover:text-neutral-100"
          >
            Open living network
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="/network/immersive"
            className="inline-flex items-center gap-1 rounded-full border border-[var(--cdc-border)] px-4 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-300 hover:text-neutral-900 dark:border-neutral-600 dark:text-neutral-300 dark:hover:border-neutral-500 dark:hover:text-neutral-100"
          >
            Immersive 3D view
            <span aria-hidden>→</span>
          </Link>
        </div>
      </header>
      <section className="mb-8 rounded-2xl border border-[#9bc0ab]/40 bg-[#112a24] p-6 text-[#edf4ee] sm:p-8" aria-label="Collective network artwork">
        <p className="text-xs font-semibold uppercase tracking-[.18em] text-[#a7d0b0]">Artist-led network experiment</p>
        <h2 className="mt-3 text-2xl font-light tracking-[-.05em] sm:text-3xl">The Network Makes Itself</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/70">The network is more than a directory. Explore a separate Three.js artwork built from broadly grouped DCC practices and activity. Try an unsaved node, examine the patterns, and export a vector study without exposing anyone's identity.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/network/artwork" className="rounded-full bg-[#d5e7d4] px-5 py-2.5 text-sm font-semibold text-[#123426] hover:bg-white">Open the artwork ↗</Link>
          <Link href="/network/artwork/proposal" className="rounded-full border border-white/40 px-5 py-2.5 text-sm font-medium hover:bg-white/10">Read the project proposal ↗</Link>
          <Link href="/network/community" className="rounded-full border border-white/40 px-5 py-2.5 text-sm font-medium hover:bg-white/10">Community Atlas ↗</Link>
        </div>
      </section>
      <NetworkGraph />
    </div>
  )
}
