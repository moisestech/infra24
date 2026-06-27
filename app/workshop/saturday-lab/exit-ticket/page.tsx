import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SaturdayLabBanner } from '@/components/workshop/SaturdayLabBanner'
import { SaturdayLabMarkdown, SaturdayLabShell } from '@/components/workshop/SaturdayLabShell'
import { loadSaturdayLabDoc } from '@/lib/workshops/saturday-lab-content'
import { SATURDAY_LAB_BANNERS } from '@/lib/workshops/saturday-lab-media'

export const metadata: Metadata = {
  title: 'Exit Ticket — Saturday Lab',
  description: 'What you made today, what you need next, and follow-up preferences.',
  alternates: { canonical: '/workshop/saturday-lab/exit-ticket' },
  openGraph: {
    images: [{ url: SATURDAY_LAB_BANNERS.exitTicket, alt: 'Saturday Lab exit ticket' }],
  },
}

export default async function SaturdayLabExitTicketPage() {
  const doc = await loadSaturdayLabDoc('print-exit-ticket')
  if (!doc) notFound()

  return (
    <SaturdayLabShell currentPath="/workshop/saturday-lab/exit-ticket">
      <SaturdayLabBanner
        banner="exitTicket"
        alt="Exit ticket — what you built and your next step"
        className="mb-8"
      />
      <SaturdayLabMarkdown html={doc.html} />
    </SaturdayLabShell>
  )
}
