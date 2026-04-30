'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { VideoChapterMarker } from '@/data/ipAgeOfAiWorkshop'

type TranscriptSegmentProps = {
  moduleId: string
  cleanedTranscript: string
  rawTranscript?: string
  lessonText?: string
  lessonSummary?: string
  pullQuotes?: string[]
  keyTerms?: string[]
  chapterMarkers?: VideoChapterMarker[]
  startTime: string
  endTime: string
  speakers: string[]
}

export function TranscriptSegment({
  moduleId,
  cleanedTranscript,
  rawTranscript,
  lessonText,
  lessonSummary,
  pullQuotes,
  keyTerms,
  chapterMarkers,
  startTime,
  endTime,
  speakers,
}: TranscriptSegmentProps) {
  const [showRaw, setShowRaw] = useState(false)

  return (
    <section id="workshop-transcript" className="scroll-mt-24 rounded-xl border border-border bg-card p-5 md:p-6">
      <h2 className="text-xl font-semibold tracking-tight text-foreground">Lesson text & transcript</h2>
      <p className="mt-2 text-xs text-muted-foreground">
        Segment: {moduleId} ({startTime} - {endTime})
      </p>

      {lessonSummary ? (
        <div className="mt-4 rounded-lg border border-border bg-muted/30 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">At a glance</p>
          <p className="mt-2 text-sm leading-relaxed text-foreground/90">{lessonSummary}</p>
        </div>
      ) : null}

      {lessonText ? (
        <div className="mt-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-primary-900">Lesson narrative</h3>
          <div className="mt-2 whitespace-pre-line text-sm leading-relaxed text-foreground/90">{lessonText}</div>
        </div>
      ) : null}

      {chapterMarkers?.length ? (
        <div className="mt-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-primary-900">Chapter markers</h3>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
            {chapterMarkers.map((marker) => (
              <li key={`${marker.time}-${marker.label}`}>
                <span className="font-mono text-xs text-foreground">{marker.time}</span>
                {' — '}
                {marker.label}
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      {pullQuotes?.length ? (
        <div className="mt-6 space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-primary-900">Pull quotes</h3>
          {pullQuotes.map((quote) => (
            <blockquote
              key={quote}
              className="border-l-4 border-primary-300 pl-4 text-sm italic leading-relaxed text-foreground/90"
            >
              {quote}
            </blockquote>
          ))}
        </div>
      ) : null}

      {keyTerms?.length ? (
        <div className="mt-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-primary-900">Key terms</h3>
          <ul className="mt-2 flex flex-wrap gap-2">
            {keyTerms.map((term) => (
              <li
                key={term}
                className="rounded-full border border-primary-200 bg-primary-50/70 px-3 py-1 text-xs font-medium text-primary-950"
              >
                {term}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-8 border-t border-border pt-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-primary-900">Cleaned panel excerpt</h3>
        <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-foreground/90">{cleanedTranscript}</p>
        <p className="mt-3 text-xs text-muted-foreground">Speakers: {speakers.join(', ') || 'TBD'}</p>
      </div>

      {rawTranscript ? (
        <div className="mt-6 border-t border-border pt-4">
          <Button type="button" variant="outline" size="sm" onClick={() => setShowRaw((open) => !open)}>
            {showRaw ? 'Hide raw transcript' : 'Show editorial / raw transcript'}
          </Button>
          <div
            className={cn(
              'mt-3 rounded-lg border border-amber-200 bg-amber-50/70 p-4',
              !showRaw && 'hidden'
            )}
            aria-hidden={!showRaw}
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-900">
              Editorial review / raw transcript
            </p>
            <p className="mt-2 text-xs text-amber-900/80">
              For internal review or comparison with the cleaned lesson text. Not the default learner experience.
            </p>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-amber-950/90">{rawTranscript}</p>
          </div>
        </div>
      ) : null}
    </section>
  )
}
