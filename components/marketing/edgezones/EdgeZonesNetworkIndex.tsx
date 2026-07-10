'use client'

import Link from 'next/link'
import { Building2, Globe, ImageIcon, Instagram, Palette, UserRound } from 'lucide-react'
import type { EdgeZonesArtistProfile } from '@/lib/marketing/edgezones-artists'
import { EdgeZonesSectionHeader } from '@/components/marketing/edgezones/EdgeZonesSectionHeader'
import type { EdgeZonesUiCopy } from '@/lib/marketing/edgezones/types'
import { useEdgeZonesLocale } from '@/components/marketing/edgezones/EdgeZonesLocaleProvider'
import { EDGE_ZONES_SECTION_ICONS } from '@/lib/marketing/edgezones-icons'
import { edgeZonesNetworkIndex } from '@/lib/marketing/edgezones-network-index'
import { EdgeZonesPortrait } from '@/components/marketing/edgezones/EdgeZonesSections'
import { cn } from '@/lib/utils'

type Props = {
  host: EdgeZonesArtistProfile | null
  curator: EdgeZonesArtistProfile | null
  artists: EdgeZonesArtistProfile[]
}

function roleBadge(role: string, ui: EdgeZonesUiCopy) {
  const normalized = role.toLowerCase()
  if (normalized.includes('host')) {
    return { label: ui.hostSpaceBadge, className: 'ez-chip-orange', icon: Building2 }
  }
  if (normalized.includes('curator')) {
    return { label: ui.invitedCuratorBadge, className: 'ez-chip-blue', icon: Palette }
  }
  return { label: ui.participatingArtistBadge, className: 'ez-chip-green', icon: UserRound }
}

function materialsPending(name: string): boolean {
  const entry = edgeZonesNetworkIndex.find((e) => e.name === name)
  return entry?.materialsStatus === 'pending'
}

function imageFitFor(name: string): 'cover' | 'contain' {
  const entry = edgeZonesNetworkIndex.find((e) => e.name === name)
  return entry?.imageFit ?? 'cover'
}

function NetworkCard({
  profile,
  showWorkPlaceholder = true,
  ui,
  badgeKey,
}: {
  profile: EdgeZonesArtistProfile
  showWorkPlaceholder?: boolean
  ui: EdgeZonesUiCopy
  badgeKey?: 'host' | 'curator'
}) {
  const badge = badgeKey === 'host'
    ? { label: ui.hostSpaceBadge, className: 'ez-chip-orange', icon: Building2 }
    : badgeKey === 'curator'
      ? { label: ui.invitedCuratorBadge, className: 'ez-chip-blue', icon: Palette }
      : roleBadge(profile.roleType ?? '', ui)
  const pending = materialsPending(profile.name)
  const fit = imageFitFor(profile.name)
  const isLogo = fit === 'contain'
  const BadgeIcon = badge.icon

  return (
    <article className="ez-card overflow-hidden transition-transform">
      <div className="flex gap-4 p-5">
        <EdgeZonesPortrait
          name={profile.name}
          imageUrl={profile.imageUrl}
          imageAlt={profile.name}
          imageFit={fit}
          size={isLogo ? 'logo' : 'lg'}
        />
        <div className="min-w-0 flex-1">
          <span className={cn('ez-chip inline-flex items-center gap-1.5 rounded px-2.5 py-1', badge.className)}>
            <BadgeIcon className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {badge.label}
          </span>
          <h3 className="ez-heading ez-subsection-title mt-2">{profile.name}</h3>
          {profile.roleType && !badgeKey ? (
            <p className="ez-caption mt-0.5 text-[var(--ez-muted)]">{profile.roleType}</p>
          ) : null}
        </div>
      </div>
      {profile.bio ? (
        <p className="ez-body border-t border-[var(--ez-border)] px-5 py-4 text-[var(--ez-muted)]">
          {profile.bio}
        </p>
      ) : null}
      {showWorkPlaceholder ? (
        <div className="ez-work-placeholder mx-5 mb-5 flex h-32 items-center justify-center gap-2 rounded sm:h-36">
          <ImageIcon className="h-5 w-5 shrink-0 opacity-60" aria-hidden />
          {pending ? ui.workImageComingSoon : ui.artistMaterialsPending}
        </div>
      ) : null}
      <div className="flex flex-wrap gap-4 border-t border-[var(--ez-border)] px-5 py-4">
        {profile.instagram ? (
          <a
            href={profile.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="ez-caption inline-flex items-center gap-1.5 font-mono text-[var(--ez-blue)] hover:underline"
          >
            <Instagram className="h-4 w-4 shrink-0" aria-hidden />
            {ui.instagram}
          </a>
        ) : null}
        {profile.website ? (
          <a
            href={profile.website}
            target="_blank"
            rel="noopener noreferrer"
            className="ez-caption inline-flex items-center gap-1.5 font-mono text-[var(--ez-blue)] hover:underline"
          >
            <Globe className="h-4 w-4 shrink-0" aria-hidden />
            {ui.website}
          </a>
        ) : null}
      </div>
    </article>
  )
}

export function EdgeZonesNetworkIndex({ host, curator, artists }: Props) {
  const { portal } = useEdgeZonesLocale()
  const { artists: artistsCopy, ui } = portal

  return (
    <section id="artists" className="ez-section border-b border-[var(--ez-border)]">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <EdgeZonesSectionHeader
          icon={EDGE_ZONES_SECTION_ICONS.artists}
          title={artistsCopy.title}
          intro={artistsCopy.intro}
          accent="indigo"
          introClassName="max-w-2xl"
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {host ? <NetworkCard profile={host} badgeKey="host" showWorkPlaceholder={false} ui={ui} /> : null}
          {curator ? (
            <NetworkCard profile={curator} badgeKey="curator" showWorkPlaceholder={false} ui={ui} />
          ) : null}
        </div>

        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {artists.map((artist) => (
            <li key={artist.id}>
              <NetworkCard profile={artist} ui={ui} />
            </li>
          ))}
        </ul>

        <p className="mt-8 text-center">
          <Link
            href="/network/research"
            className="ez-caption inline-flex items-center gap-1.5 font-mono uppercase tracking-wide text-[var(--ez-blue)] hover:underline"
          >
            <Globe className="h-4 w-4 shrink-0" aria-hidden />
            {ui.openResearchMap}
          </Link>
        </p>
      </div>
    </section>
  )
}
