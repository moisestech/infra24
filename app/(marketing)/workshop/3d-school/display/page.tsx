import type { Metadata } from 'next'
import { SmartSignDeck } from '@/components/dcc/education/3d-curriculum/SmartSignDeck'
import { ThreeDSchoolChrome } from '@/components/dcc/education/3d-curriculum/ThreeDSchoolChrome'

export const metadata: Metadata = {
  title: 'DCC 3D School — SmartSign preview',
  description: 'Vertical 9:16 preview of the DCC 3D School curriculum deck.',
  robots: { index: false, follow: false },
}

export default function ThreeDSchoolDisplayPage() {
  return (
    <ThreeDSchoolChrome>
      <header className="mb-8 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--cdc-teal)]">
          SmartSign preview
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
          One idea per screen
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          Same curriculum data as the school pages, laid out for a vertical studio display. Not a second content source. This preview is not indexed.
        </p>
      </header>
      <SmartSignDeck />
    </ThreeDSchoolChrome>
  )
}
