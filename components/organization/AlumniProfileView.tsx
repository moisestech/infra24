'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, Mail } from 'lucide-react'

import { InstitutionalArtistAvatar } from '@/components/institutional-artist/InstitutionalArtistAvatar'
import { alumniDisplayName } from '@/lib/airtable/alumni-service'
import {
  alumniImageAltText,
  alumniImageForContext,
} from '@/lib/airtable/alumni-images'
import { alumniResidencyYearLabel } from '@/lib/airtable/alumni-filters'
import type { EnrichedAlumniRow } from '@/lib/organization/artist-alumni-bridge'
import { galleryUrlsForEnrichedAlumni } from '@/lib/organization/artist-alumni-bridge'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

function isVideoRow(row: EnrichedAlumniRow): boolean {
  if (row.videoArt === true) return true
  const m = row.medium?.toLowerCase() ?? ''
  return m.includes('video') || m.includes('film') || m.includes('moving image')
}

export type AlumniProfileViewProps = {
  row: EnrichedAlumniRow
  orgName: string
  orgSlug: string
  variant?: 'sheet' | 'page'
}

export function AlumniProfileView({
  row,
  orgName,
  orgSlug,
  variant = 'sheet',
}: AlumniProfileViewProps) {
  const display = alumniDisplayName(row)
  const year = alumniResidencyYearLabel(row)
  const showLegalName =
    row.artistName?.trim() && row.artistName.trim() !== row.name.trim()
  const profilePhoto = alumniImageForContext(row, 'profile')
  const imageAlt = alumniImageAltText(row, display)
  const galleryUrls = galleryUrlsForEnrichedAlumni(row)
  const fullProfileHref = `/o/${orgSlug}/alumni/${row.id}`

  return (
    <article className={cn(variant === 'page' && 'rounded-xl border border-border bg-card p-6 shadow-sm')}>
      <div className="flex gap-4">
        <InstitutionalArtistAvatar
          name={display}
          photoUrl={profilePhoto}
          alt={imageAlt}
          size="lg"
        />
        <div className="min-w-0 flex-1 space-y-1">
          <h1 className={cn('font-semibold text-foreground', variant === 'page' ? 'text-2xl' : 'text-xl')}>
            {display}
          </h1>
          {row.imageCredit?.trim() ? (
            <p className="text-xs text-muted-foreground">Photo: {row.imageCredit.trim()}</p>
          ) : null}
          {showLegalName ? (
            <p className="text-sm text-muted-foreground">Also listed as: {row.name}</p>
          ) : (
            <p className="text-sm text-muted-foreground">{orgName} alumni</p>
          )}
          {variant === 'sheet' ? (
            <Link
              href={fullProfileHref}
              className="inline-block text-sm font-medium text-primary hover:underline"
            >
              Open full profile →
            </Link>
          ) : null}
        </div>
      </div>

      {galleryUrls.length > 0 ? (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {galleryUrls.map((url) => (
            <Image
              key={url}
              src={url}
              alt={imageAlt}
              width={variant === 'page' ? 96 : 72}
              height={variant === 'page' ? 96 : 72}
              className={cn(
                'shrink-0 rounded-md object-cover ring-1 ring-border',
                variant === 'page' ? 'h-24 w-24' : 'h-[72px] w-[72px]'
              )}
              unoptimized
            />
          ))}
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-1.5">
        {row.digitalArtist === true && (
          <Badge className="bg-violet-600 hover:bg-violet-600">Digital</Badge>
        )}
        {row.inCollection === true && <Badge variant="secondary">Collection</Badge>}
        {isVideoRow(row) && (
          <Badge variant="outline" className="border-amber-500/50 text-amber-800 dark:text-amber-200">
            Video
          </Badge>
        )}
        {row.cohort?.trim() && <Badge variant="secondary">{row.cohort.trim()}</Badge>}
        {row.program?.trim() && <Badge variant="outline">{row.program.trim()}</Badge>}
        {year ? <Badge variant="outline">{year}</Badge> : null}
        {row.medium?.trim() && (
          <Badge variant="outline" className="font-normal">
            {row.medium.trim()}
          </Badge>
        )}
        {row.studioNumber?.trim() ? (
          <Badge variant="outline">Studio {row.studioNumber.trim()}</Badge>
        ) : null}
      </div>

      <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Medium</dt>
          <dd className="text-foreground">{row.medium?.trim() || '—'}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Residency year
          </dt>
          <dd className="text-foreground">{year || '—'}</dd>
        </div>
        {row.pronoun?.trim() ? (
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Pronoun</dt>
            <dd className="text-foreground">{row.pronoun}</dd>
          </div>
        ) : null}
        {row.ethnicity?.trim() ? (
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Ethnicity
            </dt>
            <dd className="text-foreground">{row.ethnicity}</dd>
          </div>
        ) : null}
        {row.nationality?.trim() ? (
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Nationality
            </dt>
            <dd className="text-foreground">{row.nationality}</dd>
          </div>
        ) : null}
      </dl>

      {(row.topics.length > 0 || row.themes.length > 0) && (
        <div className="mt-6">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Topics & themes
          </p>
          <div className="flex flex-wrap gap-1.5">
            {[...row.topics, ...row.themes].map((t) => (
              <span
                key={t}
                className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {row.publicBio?.trim() ? (
        <div className="mt-6 border-t border-border pt-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            About
          </p>
          <p className="whitespace-pre-wrap text-sm text-foreground">{row.publicBio}</p>
        </div>
      ) : null}

      {row.location?.trim() ? (
        <p className="mt-4 text-sm text-muted-foreground">
          Location: <span className="text-foreground">{row.location}</span>
        </p>
      ) : null}

      <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {row.linkedArtist ? (
          <Button asChild variant="secondary" className="w-full sm:w-auto">
            <Link href={row.linkedArtist.artistProfileUrl}>
              Member directory profile
              <ExternalLink className="ml-2 h-4 w-4" aria-hidden />
            </Link>
          </Button>
        ) : null}
        {row.website ? (
          <Button asChild variant="default" className="w-full sm:w-auto">
            <Link href={row.website} target="_blank" rel="noopener noreferrer">
              Website
              <ExternalLink className="ml-2 h-4 w-4" aria-hidden />
            </Link>
          </Button>
        ) : null}
        {row.email ? (
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href={`mailto:${row.email}`}>
              <Mail className="mr-2 h-4 w-4" aria-hidden />
              Email
            </Link>
          </Button>
        ) : null}
      </div>

      {row.phone?.trim() && (
        <p className="mt-4 text-sm text-muted-foreground">
          Phone:{' '}
          <a href={`tel:${row.phone.replace(/\s/g, '')}`} className="text-primary hover:underline">
            {row.phone}
          </a>
        </p>
      )}

      {row.artifacts?.trim() && (
        <div className="mt-6 border-t border-border pt-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Work at Oolite
          </p>
          <p className="whitespace-pre-wrap text-sm text-foreground">{row.artifacts}</p>
        </div>
      )}
    </article>
  )
}
