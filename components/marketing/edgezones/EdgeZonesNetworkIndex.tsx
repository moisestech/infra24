'use client'

import Link from 'next/link'
import type { EdgeZonesArtistProfile } from '@/lib/marketing/edgezones-artists'
import { edgeZonesPortal } from '@/lib/marketing/edgezones-content'
import { edgeZonesNetworkIndex } from '@/lib/marketing/edgezones-network-index'
import { EdgeZonesPortrait } from '@/components/marketing/edgezones/EdgeZonesSections'
import { cn } from '@/lib/utils'

type Props = {
  host: EdgeZonesArtistProfile | null
  curator: EdgeZonesArtistProfile | null
  artists: EdgeZonesArtistProfile[]
  filterNote?: string
}

function roleBadge(role: string) {
  const normalized = role.toLowerCase()
  if (normalized.includes('host')) return { label: 'Host Space', className: 'ez-chip-orange' }
  if (normalized.includes('curator')) return { label: 'Invited Curator', className: 'ez-chip-blue' }
  return { label: 'Participating Artist', className: 'ez-chip-green' }
}

function materialsPending(name: string): boolean {
  const entry = edgeZonesNetworkIndex.find((e) => e.name === name)
  return entry?.materialsStatus === 'pending'
}

function NetworkCard({
  profile,
  badgeOverride,
  showWorkPlaceholder = true,
}: {
  profile: EdgeZonesArtistProfile
  badgeOverride?: string
  showWorkPlaceholder?: boolean
}) {
  const badge = badgeOverride
    ? { label: badgeOverride, className: 'ez-chip-blue' }
    : roleBadge(profile.roleType ?? '')
  const pending = materialsPending(profile.name)

  return (
    <article className="ez-card overflow-hidden">
      <div className="flex gap-4 p-4">
        <EdgeZonesPortrait
          name={profile.name}
          imageUrl={profile.imageUrl}
          imageAlt={profile.name}
          imageFit="cover"
        />
        <div className="min-w-0 flex-1">
          <span className={cn('ez-chip inline-block rounded px-2 py-0.5', badge.className)}>{badge.label}</span>
          <h3 className="ez-heading mt-2 text-sm">{profile.name}</h3>
          {profile.roleType && !badgeOverride ? (
            <p className="mt-0.5 text-xs text-[var(--ez-muted)]">{profile.roleType}</p>
          ) : null}
        </div>
      </div>
      {profile.bio ? (
        <p className="border-t border-[var(--ez-border)] px-4 py-3 text-sm leading-relaxed text-[var(--ez-muted)]">
          {profile.bio}
        </p>
      ) : null}
      {showWorkPlaceholder ? (
        <div className="ez-work-placeholder mx-4 mb-4 flex h-24 items-center justify-center rounded">
          {pending ? 'Work image coming soon' : 'Artist materials pending'}
        </div>
      ) : null}
      <div className="flex flex-wrap gap-3 border-t border-[var(--ez-border)] px-4 py-3 text-xs font-mono">
        {profile.instagram ? (
          <a href={profile.instagram} target="_blank" rel="noopener noreferrer" className="text-[var(--ez-blue)] hover:underline">
            Instagram
          </a>
        ) : null}
        {profile.website ? (
          <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-[var(--ez-blue)] hover:underline">
            Website
          </a>
        ) : null}
      </div>
    </article>
  )
}

export function EdgeZonesNetworkIndex({ host, curator, artists, filterNote }: Props) {
  const { artists: artistsCopy } = edgeZonesPortal

  return (
    <section id="artists" className="ez-section border-b border-[var(--ez-border)]">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="ez-heading text-xl sm:text-2xl">{artistsCopy.title}</h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--ez-muted)]">
          {artistsCopy.intro}
          {filterNote ? ` (${filterNote})` : ''}
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {host ? <NetworkCard profile={host} badgeOverride="Host Space" showWorkPlaceholder={false} /> : null}
          {curator ? <NetworkCard profile={curator} badgeOverride="Invited Curator" showWorkPlaceholder={false} /> : null}
        </div>

        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {artists.map((artist) => (
            <li key={artist.id}>
              <NetworkCard profile={artist} />
            </li>
          ))}
        </ul>

        <p className="mt-8 text-center">
          <Link href="/network/research" className="text-xs font-mono uppercase tracking-wide text-[var(--ez-blue)] hover:underline">
            Open research map →
          </Link>
        </p>
      </div>
    </section>
  )
}
