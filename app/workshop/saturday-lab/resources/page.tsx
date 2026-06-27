import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SaturdayLabBanner } from '@/components/workshop/SaturdayLabBanner'
import { SaturdayLabQrBlock } from '@/components/workshop/SaturdayLabQrBlock'
import { SaturdayLabMarkdown, SaturdayLabShell } from '@/components/workshop/SaturdayLabShell'
import { SaturdayLabStarterDownload } from '@/components/workshop/SaturdayLabStarterDownload'
import { getSaturdayLabHandoutAvailability, SATURDAY_LAB_HANDOUT_ASSETS } from '@/lib/workshops/saturday-lab-public-assets'
import { loadSaturdayLabDoc } from '@/lib/workshops/saturday-lab-content'
import { SATURDAY_LAB_BANNERS } from '@/lib/workshops/saturday-lab-media'

export const metadata: Metadata = {
  title: 'Shared Resources — Saturday Lab',
  description: 'Prompts library, YouTube tutorials, starter template download, and continue-after-class links.',
  alternates: { canonical: '/workshop/saturday-lab/resources' },
  openGraph: {
    images: [{ url: SATURDAY_LAB_BANNERS.resources, alt: 'Saturday Lab resources and tutorials' }],
  },
}

export default async function SaturdayLabResourcesPage() {
  const doc = await loadSaturdayLabDoc('shared-resources')
  if (!doc) notFound()
  const handouts = getSaturdayLabHandoutAvailability()

  return (
    <SaturdayLabShell currentPath="/workshop/saturday-lab/resources">
      <div className="mb-8 space-y-6">
        <SaturdayLabBanner banner="resources" alt="Resources and tutorial library for Saturday Lab" />
        <SaturdayLabQrBlock compact />
        <SaturdayLabStarterDownload />
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
