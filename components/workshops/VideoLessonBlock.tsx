'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

type VideoLessonBlockProps = {
  videoUrl: string
  posterImage: string
  transcriptStartTime: string
  transcriptEndTime: string
  caption: string
  suggestedTitle?: string
}

export function VideoLessonBlock({
  videoUrl,
  posterImage,
  transcriptStartTime,
  transcriptEndTime,
  caption,
  suggestedTitle,
}: VideoLessonBlockProps) {
  const [completed, setCompleted] = useState(false)

  return (
    <section className="rounded-xl border border-border bg-card p-5 md:p-6">
      <h2 className="text-xl font-semibold tracking-tight text-foreground">Video lesson</h2>
      <div className="mt-4 aspect-video w-full rounded-lg border border-border bg-muted/40">
        {videoUrl ? (
          <iframe
            src={videoUrl}
            title="Workshop module video"
            className="h-full w-full rounded-lg"
            allowFullScreen
          />
        ) : (
          <div className="flex h-full items-center justify-center rounded-lg bg-gradient-to-br from-primary-50 to-muted p-6 text-center text-sm text-muted-foreground">
            <p>
              Video embed placeholder
              <br />
              {posterImage ? `Poster: ${posterImage}` : 'Poster image coming soon'}
            </p>
          </div>
        )}
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{caption}</p>
      {suggestedTitle ? (
        <p className="mt-2 text-sm text-foreground">
          <span className="font-semibold">Suggested title:</span> {suggestedTitle}
        </p>
      ) : null}
      <p className="mt-2 text-xs text-muted-foreground">
        Transcript segment timing: {transcriptStartTime} - {transcriptEndTime}
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById('workshop-transcript')?.scrollIntoView({ behavior: 'smooth' })}
        >
          View Transcript
        </Button>
        <Button
          onClick={() => setCompleted((state) => !state)}
          className={completed ? 'bg-emerald-700 hover:bg-emerald-800' : ''}
        >
          {completed ? 'Completed' : 'Mark Complete'}
        </Button>
      </div>
    </section>
  )
}
