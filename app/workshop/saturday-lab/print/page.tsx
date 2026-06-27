import type { Metadata } from 'next'
import Link from 'next/link'
import { SaturdayLabCheatSheetDownloads } from '@/components/workshop/SaturdayLabCheatSheetDownloads'
import { SaturdayLabQrBlock } from '@/components/workshop/SaturdayLabQrBlock'
import { SaturdayLabShell } from '@/components/workshop/SaturdayLabShell'
import { getSaturdayLabHandoutAvailability } from '@/lib/workshops/saturday-lab-public-assets'

export const metadata: Metadata = {
  title: 'Print Cheat Sheets — Saturday Lab',
  description: 'Graphic cheat sheets on Cloudinary — print 6 copies of each for the room.',
  alternates: { canonical: '/workshop/saturday-lab/print' },
}

const EXTRA_SHEETS = [
  {
    href: '/workshop/saturday-lab/print/start-here',
    title: 'Start Here (half-sheet)',
    description: 'Optional orientation card with QR.',
  },
  {
    href: '/workshop/saturday-lab/exit-ticket',
    title: 'Exit ticket',
    description: 'Fill out before leaving — 12:45–1:00 PM.',
  },
]

export default function SaturdayLabPrintIndexPage() {
  const handouts = getSaturdayLabHandoutAvailability()

  return (
    <SaturdayLabShell currentPath="/workshop/saturday-lab/print">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-950">Print for Saturday</h1>
          <p className="mt-2 text-neutral-600">
            Print <strong>6 copies each</strong> of the two graphic cheat sheets below. Give everyone{' '}
            <strong>both</strong> — they self-sort by 1 PM goal.
          </p>
        </div>

        <SaturdayLabQrBlock compact />

        <SaturdayLabCheatSheetDownloads availability={handouts} />

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Optional extras
          </h2>
          <ul className="space-y-3">
            {EXTRA_SHEETS.map((sheet) => (
              <li key={sheet.href}>
                <Link
                  href={sheet.href}
                  className="block rounded-lg border border-neutral-200 bg-white p-4 hover:border-neutral-400"
                >
                  <span className="font-semibold text-neutral-950">{sheet.title}</span>
                  <p className="mt-1 text-sm text-neutral-600">{sheet.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </SaturdayLabShell>
  )
}
