import Image from 'next/image'
import Link from 'next/link'
import { Download, ExternalLink, Printer } from 'lucide-react'
import type { SaturdayLabHandoutAvailability } from '@/lib/workshops/saturday-lab-public-assets'
import { SATURDAY_LAB_HANDOUT_ASSETS } from '@/lib/workshops/saturday-lab-public-assets'

type Props = {
  availability: SaturdayLabHandoutAvailability
}

export function SaturdayLabCheatSheetDownloads({ availability }: Props) {
  return (
    <section id="download-print" className="space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
        Download / print cheat sheets
      </h2>
      <p className="text-sm text-neutral-600">
        In the room: print these graphic sheets (6 copies each). On your phone: open the full packet
        from the links below.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <HandoutCard
          title="Artist Website for Beginners"
          imageHref={SATURDAY_LAB_HANDOUT_ASSETS.beginnerPng}
          pdfHref={SATURDAY_LAB_HANDOUT_ASSETS.beginnerPdf}
          hasPdf={availability.beginnerPdf}
          printFallbackHref="/workshop/saturday-lab/print/beginner"
          packetHref="/workshop/saturday-lab/beginner"
        />
        <HandoutCard
          title="Vibe Coding for Artists"
          imageHref={SATURDAY_LAB_HANDOUT_ASSETS.vibePng}
          pdfHref={SATURDAY_LAB_HANDOUT_ASSETS.vibePdf}
          hasPdf={availability.vibePdf}
          printFallbackHref="/workshop/saturday-lab/print/vibe-coding"
          packetHref="/workshop/saturday-lab/vibe-coding"
        />
      </div>
    </section>
  )
}

function HandoutCard({
  title,
  imageHref,
  pdfHref,
  hasPdf,
  printFallbackHref,
  packetHref,
}: {
  title: string
  imageHref: string
  pdfHref: string
  hasPdf: boolean
  printFallbackHref: string
  packetHref: string
}) {
  return (
    <article className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
      <a
        href={imageHref}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-neutral-50 p-2"
      >
        <Image
          src={imageHref}
          alt={`${title} — printable cheat sheet`}
          width={800}
          height={1100}
          className="mx-auto h-auto max-h-80 w-full object-contain object-top"
        />
      </a>
      <div className="space-y-2 p-4">
        <h3 className="font-semibold text-neutral-950">{title}</h3>
        <div className="flex flex-wrap gap-3 text-sm">
          <a
            href={imageHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium underline"
          >
            <ExternalLink className="h-4 w-4" aria-hidden />
            Open PNG
          </a>
          <a href={imageHref} download className="inline-flex items-center gap-1 font-medium underline">
            <Download className="h-4 w-4" aria-hidden />
            Download PNG
          </a>
          {hasPdf ? (
            <a
              href={pdfHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium underline"
            >
              <Download className="h-4 w-4" aria-hidden />
              Open PDF
            </a>
          ) : null}
          <Link
            href={printFallbackHref}
            className="inline-flex items-center gap-1 text-neutral-700 underline"
          >
            <Printer className="h-4 w-4" aria-hidden />
            Text-only print
          </Link>
          <Link href={packetHref} className="text-neutral-700 underline">
            Full packet
          </Link>
        </div>
      </div>
    </article>
  )
}
