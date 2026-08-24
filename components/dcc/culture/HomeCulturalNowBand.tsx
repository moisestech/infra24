import Link from 'next/link'
import {
  DCC_CULTURAL_POSITION,
  getEditorialPublicPath,
  getProgramPublicPath,
  listCurrentOrUpcomingPrograms,
  listEditorial,
  listFeaturedArtists,
} from '@/lib/dcc/culture'

type HomeSlot = {
  eyebrow: string
  title: string
  description: string
  href: string
  label: string
}

export function HomeCulturalNowBand() {
  const now = listCurrentOrUpcomingPrograms()[0]
  const artist = listFeaturedArtists()[0]
  const journal = listEditorial()[0]

  const slots: HomeSlot[] = []

  if (now) {
    slots.push({
      eyebrow: 'Now',
      title: now.title,
      description: now.shortDescription ?? 'Current DCC MIA program.',
      href: getProgramPublicPath(now),
      label: 'View program',
    })
  }

  if (artist) {
    slots.push({
      eyebrow: 'Artist',
      title: artist.name,
      description: artist.shortBio ?? artist.location ?? 'Featured DCC artist.',
      href: `/artists/${artist.slug}`,
      label: 'Meet the artist',
    })
  } else {
    slots.push({
      eyebrow: 'Artists',
      title: 'Artists',
      description: 'A curated record of artists DCC presents and works with.',
      href: '/artists',
      label: 'View artists',
    })
  }

  slots.push({
    eyebrow: 'Learn',
    title: 'Workshops',
    description: 'Hands-on sessions for artists working with contemporary tools and processes.',
    href: '/workshops',
    label: 'Browse workshops',
  })

  slots.push({
    eyebrow: 'Make',
    title: 'Fabricate',
    description: 'Production for artists and cultural projects — estimate, finishes, and quote.',
    href: '/fabricate',
    label: 'View fabrication',
  })

  if (journal) {
    slots.push({
      eyebrow: 'Journal',
      title: journal.title,
      description: journal.dek ?? journal.excerpt ?? 'Latest from DCC MIA.',
      href: getEditorialPublicPath(journal),
      label: 'Read',
    })
  } else {
    slots.push({
      eyebrow: 'Journal',
      title: 'Journal',
      description: 'Conversations and field notes, published as they are recorded.',
      href: '/journal',
      label: 'Open journal',
    })
  }

  slots.push({
    eyebrow: 'Join',
    title: 'Newsletter',
    description: 'Programs, conversations and workshop dates — owned audience, not only Instagram.',
    href: '/newsletter',
    label: 'Subscribe',
  })

  return (
    <section
      id="now"
      className="scroll-mt-14 border-b border-[var(--cdc-border)] bg-white py-14 dark:border-neutral-800 dark:bg-neutral-950 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
          DCC MIA
        </p>
        <p className="mt-3 max-w-3xl text-lg font-medium leading-snug text-neutral-900 dark:text-neutral-50 sm:text-xl">
          {DCC_CULTURAL_POSITION}
        </p>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {slots.map((slot) => (
            <li
              key={slot.eyebrow}
              className="flex flex-col border-t border-neutral-200 pt-5 dark:border-neutral-800"
            >
              <p className="text-xs uppercase tracking-[0.16em] text-neutral-500">{slot.eyebrow}</p>
              <h2 className="mt-2 text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                {slot.title}
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {slot.description}
              </p>
              <Link
                href={slot.href}
                className="mt-4 text-sm font-medium text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-100"
              >
                {slot.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
