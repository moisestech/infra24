import Link from 'next/link'
import { listWorkshopOfferings } from '@/lib/dcc/education'

const SESSION_LABEL: Record<string, string> = {
  inquiry: 'View session',
  'open-lab': 'Open the lab',
  'self-serve-handbook': 'Open the handbook',
}

function formatMeta(offering: {
  capacity?: number
  durationMinutes?: number
  format: string
}): string {
  const parts: string[] = []
  if (offering.capacity) parts.push(`${offering.capacity} people per class`)
  if (offering.durationMinutes) {
    const hours = offering.durationMinutes / 60
    parts.push(hours >= 1 && hours % 1 === 0 ? `${hours} hr` : `${offering.durationMinutes} min`)
  }
  if (offering.format === 'lab') parts.push('Open lab')
  if (offering.format === 'self-paced') parts.push('Self-paced')
  if (offering.format === 'in-person') parts.push('In person')
  if (offering.format === 'hybrid') parts.push('Hybrid')
  return parts.join(' · ')
}

export function DccWorkshopOfferingsBand() {
  const offerings = listWorkshopOfferings()

  return (
    <section
      id="offerings"
      className="scroll-mt-24 border-b border-[var(--cdc-border)] bg-white py-14 dark:border-neutral-800 dark:bg-neutral-950 sm:py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
          DCC MIA sessions
        </p>
        <h2 className="mt-3 max-w-3xl text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-3xl">
          Workshops with a syllabus, not a fake storefront
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          These are DCC sessions that already have public pages. Seat checkout is not live —
          request a seat or walk into open lab.
        </p>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {offerings.map((offering) => (
            <li
              key={offering.id}
              className="flex flex-col border-t border-neutral-200 pt-5 dark:border-neutral-800"
            >
              {offering.image ? (
                <figure className="mb-4">
                  <div className="relative aspect-[21/9] overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={offering.image.src}
                      alt={offering.image.alt}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  {offering.image.caption ? (
                    <figcaption className="mt-2 text-[11px] uppercase tracking-[0.12em] text-neutral-500">
                      {offering.image.caption}
                    </figcaption>
                  ) : null}
                </figure>
              ) : null}
              <p className="text-xs uppercase tracking-[0.16em] text-neutral-500">
                {formatMeta(offering) || 'Workshop'}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                {offering.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {offering.shortDescription}
              </p>
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium">
                <Link
                  href={offering.href}
                  className="text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-100"
                >
                  {SESSION_LABEL[offering.enrollment] ?? 'View session'}
                </Link>
                {offering.syllabusHref && offering.syllabusHref !== offering.href ? (
                  <Link
                    href={offering.syllabusHref}
                    className="text-neutral-600 underline-offset-4 hover:underline dark:text-neutral-300"
                  >
                    Syllabus
                  </Link>
                ) : null}
                {offering.enrollment === 'inquiry' ? (
                  <Link
                    href="/newsletter?source=workshops"
                    className="text-neutral-600 underline-offset-4 hover:underline dark:text-neutral-300"
                  >
                    Request a seat
                  </Link>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
