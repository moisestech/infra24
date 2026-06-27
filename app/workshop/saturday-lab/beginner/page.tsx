import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SaturdayLabMarkdown, SaturdayLabShell } from '@/components/workshop/SaturdayLabShell'
import { loadSaturdayLabDoc } from '@/lib/workshops/saturday-lab-content'

export const metadata: Metadata = {
  title: 'Artist Website for Beginners — Saturday Lab',
  description: 'Self-serve packet: site map, platform choice, AI prompts, and checklist for artist websites.',
  alternates: { canonical: '/workshop/saturday-lab/beginner' },
}

export default async function SaturdayLabBeginnerPage() {
  const doc = await loadSaturdayLabDoc('packet-beginner-artist-website')
  if (!doc) notFound()

  return (
    <SaturdayLabShell currentPath="/workshop/saturday-lab/beginner">
      <SaturdayLabMarkdown html={doc.html} />
    </SaturdayLabShell>
  )
}
