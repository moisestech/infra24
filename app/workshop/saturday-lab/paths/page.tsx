import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SaturdayLabMarkdown, SaturdayLabShell } from '@/components/workshop/SaturdayLabShell'
import { loadSaturdayLabDoc } from '@/lib/workshops/saturday-lab-content'

export const metadata: Metadata = {
  title: 'Six Student Paths — Saturday Lab',
  description: 'Placement guide for six common student profiles in a mixed website + vibe coding workshop.',
  alternates: { canonical: '/workshop/saturday-lab/paths' },
}

export default async function SaturdayLabPathsPage() {
  const doc = await loadSaturdayLabDoc('student-paths')
  if (!doc) notFound()

  return (
    <SaturdayLabShell currentPath="/workshop/saturday-lab/paths">
      <SaturdayLabMarkdown html={doc.html} />
    </SaturdayLabShell>
  )
}
