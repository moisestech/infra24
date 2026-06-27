import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SaturdayLabMarkdown, SaturdayLabShell } from '@/components/workshop/SaturdayLabShell'
import { loadSaturdayLabDoc } from '@/lib/workshops/saturday-lab-content'

export const metadata: Metadata = {
  title: 'Facilitator Run of Show — Saturday Lab',
  description: 'Minute-by-minute facilitator guide for the Saturday Lab mixed website + vibe coding session.',
  alternates: { canonical: '/workshop/saturday-lab/facilitator' },
  robots: { index: false, follow: false },
}

export default async function SaturdayLabFacilitatorPage() {
  const doc = await loadSaturdayLabDoc('facilitator-run-of-show')
  if (!doc) notFound()

  return (
    <SaturdayLabShell currentPath="/workshop/saturday-lab/facilitator">
      <p className="mb-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 print:hidden">
        Facilitator-only page. Students should use{' '}
        <a href="/workshop/saturday-lab" className="font-medium underline">
          Start Here
        </a>{' '}
        and printed cheat sheets.
      </p>
      <SaturdayLabMarkdown html={doc.html} />
    </SaturdayLabShell>
  )
}
