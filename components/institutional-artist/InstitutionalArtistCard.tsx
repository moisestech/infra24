'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { ExternalLink, MapPin } from 'lucide-react'

import { InstitutionalArtistAvatar } from '@/components/institutional-artist/InstitutionalArtistAvatar'
import type { InstitutionalArtistCardData } from '@/lib/institutional-artist/card-model'
import { ma } from '@/lib/memory-agent/ui-tokens'
import { cn } from '@/lib/utils'

const BADGE_LABEL: Record<
  InstitutionalArtistCardData['badges'][number],
  string
> = {
  digital: 'Digital',
  collection: 'Collection',
  video: 'Video',
}

type InstitutionalArtistCardProps = {
  data: InstitutionalArtistCardData
  variant?: 'catalogue' | 'memory-agent'
  onActivate?: () => void
  className?: string
}

function metaLine(data: InstitutionalArtistCardData): string {
  const parts = [
    data.medium,
    data.program,
    data.studioNumber ? `Studio ${data.studioNumber}` : undefined,
    data.cohort,
    data.year ? `Residency ${data.year}` : undefined,
  ].filter(Boolean)
  return parts.join(' · ')
}

function identityLine(data: InstitutionalArtistCardData): string {
  return [data.pronoun, data.ethnicity, data.nationality].filter(Boolean).join(' · ')
}

export function InstitutionalArtistCard({
  data,
  variant = 'catalogue',
  onActivate,
  className,
}: InstitutionalArtistCardProps) {
  const reduceMotion = useReducedMotion()
  const isAgent = variant === 'memory-agent'
  const meta = metaLine(data)
  const interactive = Boolean(onActivate)

  const shell = cn(
    'flex h-full flex-col gap-3 rounded-xl border p-4 text-left shadow-sm transition-[border-color,box-shadow,transform] duration-300',
    isAgent
      ? cn(
          ma.cardInset,
          'border-[var(--ma-border)] bg-[var(--ma-surface-muted)]',
          ma.resultCard
        )
      : 'border-border bg-card hover:border-primary/40 hover:shadow-md',
    interactive && 'cursor-pointer',
    interactive &&
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    className
  )

  const body = (
    <>
      <div className="flex gap-3">
        <InstitutionalArtistAvatar
          name={data.name}
          photoUrl={data.photoUrl}
          alt={data.imageAltText}
          variant={variant}
        />
        <div className="min-w-0 flex-1 space-y-1">
          <p
            className={cn(
              'line-clamp-2 text-base font-semibold leading-snug',
              isAgent ? 'text-[var(--ma-text)]' : 'text-foreground'
            )}
          >
            {data.name}
          </p>
          {meta ? (
            <p
              className={cn(
                'line-clamp-2 text-sm',
                isAgent ? 'text-[var(--ma-text-muted)]' : 'text-muted-foreground'
              )}
            >
              {meta}
            </p>
          ) : null}
          {identityLine(data) ? (
            <p
              className={cn(
                'line-clamp-1 text-xs',
                isAgent ? 'text-[var(--ma-text-faint)]' : 'text-muted-foreground'
              )}
            >
              {identityLine(data)}
            </p>
          ) : null}
          {data.location ? (
            <p
              className={cn(
                'flex items-center gap-1 text-xs',
                isAgent ? 'text-[var(--ma-text-faint)]' : 'text-muted-foreground'
              )}
            >
              <MapPin className="h-3 w-3 shrink-0" aria-hidden />
              <span className="truncate">{data.location}</span>
            </p>
          ) : null}
        </div>
      </div>

      {data.badges.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {data.badges.map((b) => (
            <span
              key={b}
              className={cn(
                'rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide',
                isAgent
                  ? 'border border-[var(--ma-border)] bg-[var(--ma-surface)] text-[var(--ma-text-muted)]'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {BADGE_LABEL[b]}
            </span>
          ))}
          {data.confidence && isAgent ? (
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-[10px] font-medium capitalize',
                'border border-[color:color-mix(in_srgb,var(--ma-primary)_35%,var(--ma-border))]',
                'text-[color:var(--ma-primary)]'
              )}
            >
              {data.confidence} match
            </span>
          ) : null}
        </div>
      ) : null}

      {data.topics.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {data.topics.slice(0, 4).map((t) => (
            <span
              key={t}
              className={cn(
                'rounded-md px-1.5 py-0.5 text-[11px] leading-tight',
                isAgent
                  ? 'bg-[color:color-mix(in_srgb,var(--ma-primary)_10%,var(--ma-surface))] text-[var(--ma-text-muted)]'
                  : 'bg-primary/8 text-muted-foreground'
              )}
            >
              {t}
            </span>
          ))}
        </div>
      ) : null}

      {data.galleryImages && data.galleryImages.length > 0 ? (
        <div className="flex gap-2 overflow-x-auto pb-0.5">
          {data.galleryImages.map((item, i) => (
            <div key={`${item.url}-${i}`} className="w-[4.5rem] shrink-0">
              <Image
                src={item.url}
                alt={item.title ?? ''}
                width={72}
                height={72}
                unoptimized
                className={cn(
                  'h-[4.5rem] w-[4.5rem] rounded-md object-cover ring-1',
                  isAgent ? 'ring-[var(--ma-border)]' : 'ring-border'
                )}
              />
              {item.title ? (
                <p
                  className={cn(
                    'mt-1 line-clamp-2 text-[10px] font-medium leading-tight',
                    isAgent ? 'text-[var(--ma-text)]' : 'text-foreground'
                  )}
                >
                  {item.title}
                </p>
              ) : null}
              {item.subtitle ? (
                <p
                  className={cn(
                    'line-clamp-2 text-[9px] leading-tight',
                    isAgent ? ma.caption : 'text-muted-foreground'
                  )}
                >
                  {item.subtitle}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      ) : data.galleryImageUrls && data.galleryImageUrls.length > 1 ? (
        <div className="flex gap-1.5 overflow-x-auto pb-0.5">
          {data.galleryImageUrls.slice(0, 4).map((url, i) => (
            <Image
              key={`${url}-${i}`}
              src={url}
              alt=""
              width={56}
              height={56}
              unoptimized
              className={cn(
                'h-14 w-14 shrink-0 rounded-md object-cover ring-1',
                isAgent ? 'ring-[var(--ma-border)]' : 'ring-border',
                i > 0 && 'opacity-90'
              )}
            />
          ))}
        </div>
      ) : null}

      {data.matchReason && isAgent ? (
        <p className={cn('line-clamp-3 text-sm', ma.caption)}>{data.matchReason}</p>
      ) : data.bioSnippet ? (
        <p
          className={cn(
            'line-clamp-3 text-sm',
            isAgent ? ma.caption : 'text-muted-foreground'
          )}
        >
          {data.bioSnippet}
          {data.bioSnippet.length >= 200 ? '…' : ''}
        </p>
      ) : null}

      <div
        className={cn(
          'mt-auto flex items-center justify-between gap-2 border-t pt-3 text-sm',
          isAgent ? 'border-[var(--ma-border)]' : 'border-border'
        )}
      >
        {data.year ? (
          <span
            className={cn(
              'text-xs font-medium uppercase tracking-wide',
              isAgent ? 'text-[var(--ma-text-muted)]' : 'text-muted-foreground'
            )}
          >
            {data.year}
          </span>
        ) : (
          <span />
        )}
        <div className="flex flex-wrap items-center justify-end gap-3">
          {data.profileUrl ? (
            <Link
              href={data.profileUrl}
              className={cn(
                'inline-flex items-center gap-1 text-xs font-medium hover:underline',
                isAgent ? 'text-[color:var(--ma-primary)]' : 'text-primary'
              )}
              onClick={(e) => e.stopPropagation()}
            >
              View profile
            </Link>
          ) : null}
          {data.website ? (
            <Link
              href={data.website}
              target="_blank"
              rel="noreferrer"
              className={cn(
                'inline-flex items-center gap-1 text-xs font-medium hover:underline',
                isAgent ? 'text-[color:var(--ma-primary)]' : 'text-primary'
              )}
              onClick={(e) => e.stopPropagation()}
            >
              Website
              <ExternalLink className="h-3 w-3" aria-hidden />
            </Link>
          ) : null}
        </div>
      </div>
    </>
  )

  if (!interactive) {
    return <div className={shell}>{body}</div>
  }

  return (
    <motion.div
      className="h-full"
      whileHover={reduceMotion ? undefined : { y: -2 }}
      whileTap={reduceMotion ? undefined : { scale: 0.995 }}
      transition={{ type: 'spring', stiffness: 420, damping: 30 }}
    >
      <div
        role="button"
        tabIndex={0}
        aria-label={`View profile: ${data.name}`}
        className={shell}
        onClick={onActivate}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onActivate?.()
          }
        }}
      >
        {body}
      </div>
    </motion.div>
  )
}
