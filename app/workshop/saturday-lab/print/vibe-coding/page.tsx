import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { SaturdayLabShell } from '@/components/workshop/SaturdayLabShell'
import { SATURDAY_LAB_CHEAT_SHEET_IMAGES } from '@/lib/workshops/saturday-lab-media'

export const metadata: Metadata = {
  title: 'Vibe Coding Cheat Sheet — Print',
  alternates: { canonical: '/workshop/saturday-lab/print/vibe-coding' },
}

export default function PrintVibeCodingGraphicPage() {
  const src = SATURDAY_LAB_CHEAT_SHEET_IMAGES.vibeCoding

  return (
    <SaturdayLabShell currentPath="/workshop/saturday-lab/print">
      <div className="space-y-4 print:space-y-0">
        <p className="text-sm text-neutral-600 print:hidden">
          <Link href="/workshop/saturday-lab/print" className="underline">
            ← All print sheets
          </Link>
          · Use browser Print (Cmd+P) on this graphic, or{' '}
          <a href={src} target="_blank" rel="noopener noreferrer" className="underline">
            open PNG
          </a>{' '}
          to print from Preview.
        </p>
        <Image
          src={src}
          alt="Vibe Coding for Artists cheat sheet"
          width={1200}
          height={1600}
          className="mx-auto h-auto w-full max-w-3xl print:max-w-none"
          priority
        />
      </div>
    </SaturdayLabShell>
  )
}
