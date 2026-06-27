import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SaturdayLabQrBlock } from '@/components/workshop/SaturdayLabQrBlock'
import { SaturdayLabMarkdown, SaturdayLabShell } from '@/components/workshop/SaturdayLabShell'
import { getSaturdayLabHandoutAvailability } from '@/lib/workshops/saturday-lab-public-assets'
import { loadSaturdayLabDoc, SATURDAY_LAB_STARTER_ZIP } from '@/lib/workshops/saturday-lab-content'

export const metadata: Metadata = {
  title: 'Shared Resources — Saturday Lab',
  description: 'Prompts library, YouTube tutorials, starter template download, and continue-after-class links.',
  alternates: { canonical: '/workshop/saturday-lab/resources' },
}

export default async function SaturdayLabResourcesPage() {
  const doc = await loadSaturdayLabDoc('shared-resources')
  if (!doc) notFound()
  const handouts = getSaturdayLabHandoutAvailability()

  return (
    <SaturdayLabShell currentPath="/workshop/saturday-lab/resources">
      <div className="mb-8 space-y-4">
        <SaturdayLabQrBlock />
        <Link
          href={SATURDAY_LAB_STARTER_ZIP}
          className="inline-flex rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
          download
        >
          Download starter template (zip)
        </Link>
        {!handouts.beginnerPdf && !handouts.vibePdf ? null : (
          <p className="text-sm text-neutral-600">
            Cheat sheet PDFs:{' '}
            <a
              href={SATURDAY_LAB_HANDOUT_ASSETS.beginnerPdf}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Beginner PDF
            </a>
            {' · '}
            <a
              href={SATURDAY_LAB_HANDOUT_ASSETS.vibePdf}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Vibe Coding PDF
            </a>
          </p>
        )}
      </div>
      <SaturdayLabMarkdown html={doc.html} />
    </SaturdayLabShell>
  )
}
