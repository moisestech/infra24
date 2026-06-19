'use client'

import Link from 'next/link'
import type { EdgeZonesArtistProfile } from '@/lib/marketing/edgezones-artists'
import { cn } from '@/lib/utils'

export type EdgeZonesPortraitProps = {
  name: string
  imageUrl?: string
  imageAlt?: string
  imageFit?: 'cover' | 'contain'
  size?: 'md' | 'lg'
  className?: string
}

export function EdgeZonesPortrait({
  name,
  imageUrl,
  imageAlt,
  imageFit = 'cover',
  size = 'md',
  className,
}: EdgeZonesPortraitProps) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  const sizeClass = size === 'lg' ? 'h-24 w-24 text-base' : 'h-20 w-20 text-sm'

  if (!imageUrl) {
    return (
      <div
        className={cn(
          'flex shrink-0 items-center justify-center rounded-xl bg-teal-100 font-semibold text-teal-900 dark:bg-teal-900/40 dark:text-teal-100',
          sizeClass,
          className
        )}
      >
        {initials || '?'}
      </div>
    )
  }

  return (
    <div className={cn('relative shrink-0', sizeClass, className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt={imageAlt ?? name}
        className={cn(
          'h-full w-full rounded-xl bg-white object-center dark:bg-neutral-900',
          imageFit === 'contain' ? 'object-contain p-2' : 'object-cover'
        )}
        onError={(event) => {
          event.currentTarget.style.display = 'none'
          const fallback = event.currentTarget.nextElementSibling
          if (fallback instanceof HTMLElement) fallback.style.display = 'flex'
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 hidden items-center justify-center rounded-xl bg-teal-100 font-semibold text-teal-900 dark:bg-teal-900/40 dark:text-teal-100"
      >
        {initials || '?'}
      </div>
    </div>
  )
}

function ArtistAvatar({ artist }: { artist: EdgeZonesArtistProfile }) {
  return (
    <EdgeZonesPortrait
      name={artist.name}
      imageUrl={artist.imageUrl}
      imageAlt={artist.name}
      imageFit="cover"
    />
  )
}

export type EdgeZonesRoleCardProps = {
  name: string
  role: string
  description: string
  imageUrl: string
  imageAlt: string
  imageFit: 'cover' | 'contain'
  className?: string
}

export function EdgeZonesRoleCard({
  name,
  role,
  description,
  imageUrl,
  imageAlt,
  imageFit,
  className,
}: EdgeZonesRoleCardProps) {
  return (
    <li
      className={cn(
        'rounded-xl border border-[var(--cdc-border)] bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900',
        className
      )}
    >
      <div className="flex gap-4">
        <EdgeZonesPortrait
          name={name}
          imageUrl={imageUrl}
          imageAlt={imageAlt}
          imageFit={imageFit}
          size="lg"
        />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{name}</p>
          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-[var(--cdc-teal)]">
            {role}
          </p>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{description}</p>
        </div>
      </div>
    </li>
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
