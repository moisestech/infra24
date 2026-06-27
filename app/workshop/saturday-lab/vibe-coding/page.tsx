import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SaturdayLabBanner } from '@/components/workshop/SaturdayLabBanner'
import { SaturdayLabVibeLevelCards } from '@/components/workshop/SaturdayLabVibeLevelCards'
import { SaturdayLabMarkdown, SaturdayLabShell } from '@/components/workshop/SaturdayLabShell'
import { loadSaturdayLabDoc } from '@/lib/workshops/saturday-lab-content'
import { SATURDAY_LAB_BANNERS } from '@/lib/workshops/saturday-lab-media'

export const metadata: Metadata = {
  title: 'Vibe Coding for Artists — Saturday Lab',
  description:
    'Three levels: CodePen, Replit, Cursor. Prompts, glossary, Hello Browser, and debugging for artists.',
  alternates: { canonical: '/workshop/saturday-lab/vibe-coding' },
  openGraph: {
    images: [{ url: SATURDAY_LAB_BANNERS.vibeCoding, alt: 'Vibe coding workspace' }],
  },
}

export default async function SaturdayLabVibeCodingPage() {
  const doc = await loadSaturdayLabDoc('packet-vibe-coding-for-artists')
  if (!doc) notFound()

  return (
    <SaturdayLabShell currentPath="/workshop/saturday-lab/vibe-coding">
      <SaturdayLabBanner
        banner="vibeCoding"
        alt="Vibe coding workspace — code, files, debug, and publish"
        className="mb-8"
      />
      <div className="mb-10 space-y-8">
        <SaturdayLabVibeLevelCards />
      </div>
      <SaturdayLabMarkdown html={doc.html} />
    </SaturdayLabShell>
  )
}
