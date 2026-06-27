import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SaturdayLabMarkdown, SaturdayLabShell } from '@/components/workshop/SaturdayLabShell'
import { loadSaturdayLabDoc } from '@/lib/workshops/saturday-lab-content'

export const metadata: Metadata = {
  title: 'Start Here — Print',
  alternates: { canonical: '/workshop/saturday-lab/print/start-here' },
}

export default async function PrintStartHerePage() {
  const doc = await loadSaturdayLabDoc('print-start-here')
  if (!doc) notFound()
  return (
    <SaturdayLabShell currentPath="/workshop/saturday-lab/print">
      <SaturdayLabMarkdown html={doc.html} />
    </SaturdayLabShell>
  )
}
