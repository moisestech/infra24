import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SaturdayLabBanner } from '@/components/workshop/SaturdayLabBanner'
import { SaturdayLabMarkdown, SaturdayLabShell } from '@/components/workshop/SaturdayLabShell'
import { loadSaturdayLabDoc } from '@/lib/workshops/saturday-lab-content'
import { SATURDAY_LAB_BANNERS } from '@/lib/workshops/saturday-lab-media'

export const metadata: Metadata = {
  title: 'Artist Website for Beginners — Saturday Lab',
  description: 'Self-serve packet: site map, platform choice, AI prompts, and checklist for artist websites.',
  alternates: { canonical: '/workshop/saturday-lab/beginner' },
  openGraph: {
    images: [{ url: SATURDAY_LAB_BANNERS.beginner, alt: 'Beginner artist website workflow' }],
  },
}

export default async function SaturdayLabBeginnerPage() {
  const doc = await loadSaturdayLabDoc('packet-beginner-artist-website')
  if (!doc) notFound()

  return (
    <SaturdayLabShell currentPath="/workshop/saturday-lab/beginner">
      <SaturdayLabBanner
        banner="beginner"
        alt="Beginner artist website workflow — site map, pages, and platform choice"
        className="mb-8"
      />
      <SaturdayLabMarkdown html={doc.html} />
    </SaturdayLabShell>
  )
}
