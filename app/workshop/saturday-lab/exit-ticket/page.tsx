import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SaturdayLabMarkdown, SaturdayLabShell } from '@/components/workshop/SaturdayLabShell'
import { loadSaturdayLabDoc } from '@/lib/workshops/saturday-lab-content'

export const metadata: Metadata = {
  title: 'Exit Ticket — Saturday Lab',
  description: 'What you made today, what you need next, and follow-up preferences.',
  alternates: { canonical: '/workshop/saturday-lab/exit-ticket' },
}

export default async function SaturdayLabExitTicketPage() {
  const doc = await loadSaturdayLabDoc('print-exit-ticket')
  if (!doc) notFound()

  return (
    <SaturdayLabShell currentPath="/workshop/saturday-lab/exit-ticket">
      <SaturdayLabMarkdown html={doc.html} />
    </SaturdayLabShell>
  )
}
