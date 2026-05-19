'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { IpAgeOfAiParticipant } from '@/lib/workshops/ip-age-of-ai-program'

export function participantInitials(name: string) {
  const parts = name.replace(/,?\s*Esq\.?/gi, '').trim().split(/\s+/)
  const a = parts[0]?.[0] ?? ''
  const b = parts[parts.length - 1]?.[0] ?? ''
  return (a + b).toUpperCase() || '?'
}

const BIO_COLLAPSE_CHARS = 320

/** Circular crop so vertical portraits are not squished. */
export function IpAgeOfAiSpeakerHeadshot({
  person,
  className,
}: {
  person: IpAgeOfAiParticipant
  className?: string
}) {
  const sizeClass = className ?? 'h-32 w-32'

  return (
    <div
      className={cn(
        'relative shrink-0 overflow-hidden rounded-full border-[3px] border-background bg-muted shadow-md ring-1 ring-border/80 [clip-path:circle(50%_at_50%_50%)]',
        sizeClass
      )}
    >
      {person.headshotUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={person.headshotUrl}
          alt=""
          className="h-full min-h-full w-full min-w-full object-cover object-center"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center bg-primary/10 text-primary"
          aria-hidden
        >
          <span className="text-3xl font-semibold tracking-tight">{participantInitials(person.name)}</span>
        </div>
      )}
    </div>
  )
}

export function IpAgeOfAiSpeakerBio({ person }: { person: IpAgeOfAiParticipant }) {
  const [expanded, setExpanded] = useState(false)
  const fullPlain = useMemo(() => person.bioParagraphs.join('\n\n'), [person.bioParagraphs])
  const needsToggle = fullPlain.length > BIO_COLLAPSE_CHARS || person.bioParagraphs.length > 1

  return (
    <div className="space-y-2 text-center">
      <div
        className={cn(
          'leading-relaxed text-muted-foreground transition-[font-size]',
          expanded ? 'text-sm' : 'text-xs',
          !expanded && needsToggle && 'line-clamp-4'
        )}
      >
        {person.bioParagraphs.map((para, i) => (
          <p key={i} className={i > 0 ? 'mt-2' : undefined}>
            {para}
          </p>
        ))}
      </div>
      {needsToggle ? (
        <Button
          type="button"
          variant="link"
          size="sm"
          className="h-auto px-0 py-0 text-xs font-semibold text-primary"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? 'Show less' : 'Read more'}
        </Button>
      ) : null}
    </div>
  )
}
