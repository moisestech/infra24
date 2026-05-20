'use client'

import { useCallback, useState } from 'react'
import Link from 'next/link'
import { Calendar, Check, Copy, ExternalLink, MapPin, MessageCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatEventCardSummaryText } from '@/lib/memory-agent/event-card-urls'
import { isStaffOperatorMode } from '@/lib/memory-agent/mode'
import { memoryAgentEventPublicUrl } from '@/lib/memory-agent/result-links'
import { ma } from '@/lib/memory-agent/ui-tokens'
import type { MemoryAgentEventCard, MemoryAgentMode } from '@/types/memory-agent'
import { cn } from '@/lib/utils'

const KIND_LABEL: Record<MemoryAgentEventCard['recordKind'], string> = {
  event: 'Event',
  exhibition: 'Exhibition',
  workshop: 'Workshop',
  screening: 'Screening',
  opportunity: 'Opportunity',
  bookable_event: 'Bookable',
  editorial_story: 'Story',
  house_story: 'House story',
  member_route: 'Member route',
  space: 'Space',
}

const SOURCE_LABEL: Record<MemoryAgentEventCard['source'], string> = {
  announcement: 'Announcement',
  workshop: 'Workshop',
  cms_story: 'Editorial',
  soho_record: 'Soho demo',
}

function formatWhen(card: MemoryAgentEventCard): string | null {
  const start = card.startsAt?.trim()
  const end = card.endsAt?.trim()
  if (!start && !end) return null
  const fmt = (iso: string) => {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return iso
    return d.toLocaleString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }
  if (start && end && start !== end) return `${fmt(start)} – ${fmt(end)}`
  if (start) return fmt(start)
  return end ? fmt(end!) : null
}

function ActionLink({
  href,
  external,
  children,
  className,
}: {
  href: string
  external?: boolean
  children: React.ReactNode
  className?: string
}) {
  if (external) {
    return (
      <Button type="button" size="sm" variant="outline" className={className} asChild>
        <a href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      </Button>
    )
  }
  return (
    <Button type="button" size="sm" variant="outline" className={className} asChild>
      <Link href={href}>{children}</Link>
    </Button>
  )
}

type MemoryAgentEventCardsProps = {
  events: MemoryAgentEventCard[]
  orgSlug: string
  mode: MemoryAgentMode
  onAskFollowUp?: (question: string) => void
  onCreateSignageDraft?: (event: MemoryAgentEventCard) => void | Promise<void>
  onSaveAsAsset?: (event: MemoryAgentEventCard) => void | Promise<void>
  className?: string
}

export function MemoryAgentEventCards({
  events,
  orgSlug,
  mode,
  onAskFollowUp,
  onCreateSignageDraft,
  onSaveAsAsset,
  className,
}: MemoryAgentEventCardsProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [pendingId, setPendingId] = useState<string | null>(null)
  const isStaff = isStaffOperatorMode(mode)

  const handleCopy = useCallback(async (event: MemoryAgentEventCard) => {
    const text = formatEventCardSummaryText(event)
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(event.id)
      window.setTimeout(() => setCopiedId((id) => (id === event.id ? null : id)), 2000)
    } catch {
      // ignore clipboard failures
    }
  }, [])

  const runAction = useCallback(
    async (eventId: string, fn?: (event: MemoryAgentEventCard) => void | Promise<void>, ev?: MemoryAgentEventCard) => {
      if (!fn || !ev) return
      setPendingId(eventId)
      try {
        await fn(ev)
      } finally {
        setPendingId((id) => (id === eventId ? null : id))
      }
    },
    []
  )

  if (!events.length) return null

  return (
    <ul className={cn('grid min-w-0 gap-3 sm:grid-cols-2', className)}>
      {events.map((ev) => {
        const when = formatWhen(ev)
        const imageUrl = ev.imageUrl?.trim()
        const showPublicCta =
          !isStaff &&
          ev.allowPublicActions &&
          ev.bookable &&
          Boolean(ev.ctaUrl?.trim() && ev.publicSafe)
        const siteUrl = memoryAgentEventPublicUrl(orgSlug, ev)
        const showViewDetails =
          ev.allowPublicActions &&
          Boolean(siteUrl) &&
          (isStaff || ev.publicSafe)
        const editLabel =
          ev.source === 'workshop' ? 'Edit workshop' : 'Edit announcement'
        const isPending = pendingId === ev.id
        const isCopied = copiedId === ev.id

        return (
          <li key={ev.id}>
            <Card className={cn(ma.card, ma.resultCard, 'h-full overflow-hidden')}>
              {imageUrl ? (
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--ma-surface-muted)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ) : null}
              <CardContent className="flex h-full flex-col gap-2 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
                      'bg-[color:color-mix(in_srgb,var(--ma-primary)_14%,var(--ma-surface))]',
                      'text-[color:var(--ma-primary)]'
                    )}
                  >
                    {KIND_LABEL[ev.recordKind]}
                  </span>
                  <span className={cn('text-[10px] uppercase tracking-wide', ma.caption)}>
                    {SOURCE_LABEL[ev.source]}
                  </span>
                </div>
                <h3 className="break-words text-sm font-semibold leading-snug text-[var(--ma-text)]">
                  {ev.title}
                </h3>
                {when ? (
                  <p className="flex items-start gap-1.5 text-xs text-[var(--ma-text-muted)]">
                    <Calendar className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                    <span>{when}</span>
                  </p>
                ) : null}
                {ev.location ? (
                  <p className="flex items-start gap-1.5 text-xs text-[var(--ma-text-muted)]">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                    <span>{ev.location}</span>
                  </p>
                ) : null}
                {ev.summary ? (
                  <p className={cn('line-clamp-3 flex-1 text-xs leading-relaxed', ma.bodyMuted)}>
                    {ev.summary}
                  </p>
                ) : null}
                {ev.tags && ev.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {ev.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className={cn('rounded-full px-2 py-0.5 text-[10px]', ma.chip)}>
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className="mt-1 flex flex-wrap gap-1.5 border-t border-[var(--ma-border)] pt-2">
                  {isStaff ? (
                    <>
                      {showViewDetails && siteUrl ? (
                        <ActionLink
                          href={siteUrl}
                          className={cn('h-8 gap-1 px-2.5 text-xs', ma.btnOutline)}
                        >
                          {isStaff ? 'Open public page' : 'View on site'}
                          <ExternalLink className="h-3 w-3" aria-hidden />
                        </ActionLink>
                      ) : null}
                      {ev.editUrl ? (
                        <ActionLink
                          href={ev.editUrl}
                          className={cn('h-8 gap-1 px-2.5 text-xs', ma.btnOutline)}
                        >
                          {editLabel}
                        </ActionLink>
                      ) : null}
                      {onCreateSignageDraft ? (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={isPending}
                          className={cn('h-8 px-2.5 text-xs', ma.btnOutline)}
                          onClick={() => void runAction(ev.id, onCreateSignageDraft, ev)}
                        >
                          Create signage draft
                        </Button>
                      ) : null}
                      {onSaveAsAsset ? (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={isPending}
                          className={cn('h-8 px-2.5 text-xs', ma.btnOutline)}
                          onClick={() => void runAction(ev.id, onSaveAsAsset, ev)}
                        >
                          Save as asset
                        </Button>
                      ) : null}
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className={cn('h-8 gap-1 px-2.5 text-xs', ma.btnOutline)}
                        onClick={() => void handleCopy(ev)}
                      >
                        {isCopied ? (
                          <>
                            <Check className="h-3 w-3" aria-hidden />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" aria-hidden />
                            Copy summary
                          </>
                        )}
                      </Button>
                    </>
                  ) : (
                    <>
                      {showViewDetails && siteUrl ? (
                        <ActionLink
                          href={siteUrl}
                          className={cn('h-8 gap-1 px-2.5 text-xs', ma.btnOutline)}
                        >
                          View on site
                        </ActionLink>
                      ) : null}
                      {showPublicCta ? (
                        <ActionLink
                          href={ev.ctaUrl!}
                          external
                          className={cn('h-8 gap-1 px-2.5 text-xs', ma.btnOutline)}
                        >
                          {ev.ctaLabel || 'RSVP'}
                          <ExternalLink className="h-3 w-3" aria-hidden />
                        </ActionLink>
                      ) : null}
                      {onAskFollowUp ? (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className={cn('h-8 gap-1 px-2.5 text-xs', ma.btnOutline)}
                          onClick={() =>
                            onAskFollowUp(`Tell me more about "${ev.title}".`)
                          }
                        >
                          <MessageCircle className="h-3 w-3" aria-hidden />
                          Ask follow-up
                        </Button>
                      ) : null}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </li>
        )
      })}
    </ul>
  )
}
