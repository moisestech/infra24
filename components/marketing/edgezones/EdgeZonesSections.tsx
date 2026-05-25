import Link from 'next/link'
import type { EdgeZonesArtistProfile } from '@/lib/marketing/edgezones-artists'
import { cn } from '@/lib/utils'

function ArtistAvatar({ artist }: { artist: EdgeZonesArtistProfile }) {
  const initials = artist.name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  if (artist.imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={artist.imageUrl}
        alt=""
        className="h-20 w-20 shrink-0 rounded-xl object-cover"
      />
    )
  }

  return (
    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-sm font-semibold text-teal-900 dark:bg-teal-900/40 dark:text-teal-100">
      {initials || '?'}
    </div>
  )
}

type Props = {
  artists: EdgeZonesArtistProfile[]
  emptyMessage: string
  networkHref?: string
}

export function EdgeZonesArtistGrid({ artists, emptyMessage, networkHref = '/network/research' }: Props) {
  if (artists.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--cdc-border)] bg-white/60 p-8 text-center dark:border-neutral-800 dark:bg-neutral-900/60">
        <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">{emptyMessage}</p>
        <Link
          href={networkHref}
          className="mt-4 inline-flex text-sm font-medium text-[var(--cdc-teal)] hover:underline"
        >
          Browse the research map →
        </Link>
      </div>
    )
  }

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {artists.map((artist) => (
        <li
          key={artist.id}
          className="flex flex-col rounded-2xl border border-[var(--cdc-border)] bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
        >
          <div className="flex gap-4">
            <ArtistAvatar artist={artist} />
            <div className="min-w-0">
              <h3 className="text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                {artist.name}
              </h3>
              {artist.roleType ? (
                <p className="mt-0.5 text-xs uppercase tracking-wide text-neutral-500">{artist.roleType}</p>
              ) : null}
            </div>
          </div>

          {artist.bio ? (
            <p className="mt-4 flex-1 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
              {artist.bio}
            </p>
          ) : null}

          {artist.practiceTags.length > 0 ? (
            <ul className="mt-4 flex flex-wrap gap-2">
              {artist.practiceTags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                >
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-3 text-xs font-medium">
            {artist.instagram ? (
              <a
                href={artist.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--cdc-teal)] hover:underline"
              >
                Instagram
              </a>
            ) : null}
            {artist.website ? (
              <a
                href={artist.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--cdc-teal)] hover:underline"
              >
                Website
              </a>
            ) : null}
            {artist.sourceUrl ? (
              <a
                href={artist.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
              >
                Context
              </a>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  )
}

type AnchorNavProps = {
  items: ReadonlyArray<{ id: string; label: string }>
  className?: string
}

export function EdgeZonesAnchorNav({ items, className }: AnchorNavProps) {
  return (
    <nav
      aria-label="Edge Zones sections"
      className={cn(
        'sticky top-[var(--site-header-offset,4rem)] z-20 -mx-4 border-b border-[var(--cdc-border)] bg-white/90 px-4 py-3 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/90 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8',
        className
      )}
    >
      <ul className="flex gap-2 overflow-x-auto pb-1 text-sm">
        {items.map((item) => (
          <li key={item.id} className="shrink-0">
            <a
              href={`#${item.id}`}
              className="inline-flex rounded-full border border-neutral-200 px-3 py-1.5 font-medium text-neutral-700 transition hover:border-[var(--cdc-teal)] hover:text-[var(--cdc-teal)] dark:border-neutral-700 dark:text-neutral-300"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
