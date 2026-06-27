import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SaturdayLabVibeLevelCards } from '@/components/workshop/SaturdayLabVibeLevelCards'
import { SaturdayLabMarkdown, SaturdayLabShell } from '@/components/workshop/SaturdayLabShell'
import { loadSaturdayLabDoc } from '@/lib/workshops/saturday-lab-content'

export const metadata: Metadata = {
  title: 'Vibe Coding for Artists — Saturday Lab',
  description:
    'Three levels: CodePen, Replit, Cursor. Prompts, glossary, Hello Browser, and debugging for artists.',
  alternates: { canonical: '/workshop/saturday-lab/vibe-coding' },
}

export default async function SaturdayLabVibeCodingPage() {
  const doc = await loadSaturdayLabDoc('packet-vibe-coding-for-artists')
  if (!doc) notFound()

  return (
    <SaturdayLabShell currentPath="/workshop/saturday-lab/vibe-coding">
      <div className="mb-10 space-y-8">
        <SaturdayLabVibeLevelCards />
      </div>
      <SaturdayLabMarkdown html={doc.html} />
    </SaturdayLabShell>
  )
}
