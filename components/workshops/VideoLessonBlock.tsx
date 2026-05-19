'use client'

import { useState } from 'react'
import { FaYoutube } from 'react-icons/fa6'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { IpAgeOfAiModuleTopicBanner } from '@/components/workshops/IpAgeOfAiModuleTopicBanner'

type VideoLessonBlockProps = {
  /** Optional section id for in-page navigation */
  sectionId?: string
  /** Optional banner above the video block */
  topicBannerSrc?: string
  /** Element id for “View transcript” scroll (default `workshop-transcript`) */
  transcriptScrollTargetId?: string
  videoUrl: string
  posterImage: string
  transcriptStartTime: string
  transcriptEndTime: string
  caption: string
  suggestedTitle?: string
  /** Opens full recording on YouTube at segment start */
  youtubeWatchUrl?: string
}

export function VideoLessonBlock({
  sectionId,
  topicBannerSrc,
  transcriptScrollTargetId = 'workshop-transcript',
  videoUrl,
  posterImage,
  transcriptStartTime,
  transcriptEndTime,
  caption,
  suggestedTitle,
  youtubeWatchUrl,
}: VideoLessonBlockProps) {
  const [completed, setCompleted] = useState(false)

  return (
    <section id={sectionId} className="scroll-mt-24 space-y-4 rounded-xl border border-border bg-card p-5 md:p-6">
      {topicBannerSrc ? <IpAgeOfAiModuleTopicBanner src={topicBannerSrc} alt="" /> : null}
      <h2 className="text-xl font-semibold tracking-tight text-foreground">Video lesson</h2>
      <div className="mt-4 aspect-video w-full overflow-hidden rounded-lg border border-border bg-muted/40">
        {videoUrl ? (
          <iframe
            src={videoUrl}
            title="Workshop module video"
            className="h-full w-full rounded-lg"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-primary/10 to-muted p-6 text-center text-sm text-muted-foreground dark:from-primary/20">
            <p>Video embed coming soon.</p>
            {posterImage ? (
              <p className="text-xs opacity-80">
                Poster asset:{' '}
                <a className="font-medium text-primary underline-offset-4 hover:underline" href={posterImage}>
                  open image
                </a>
              </p>
            ) : null}
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
        {youtubeWatchUrl ? (
          <a
            href={youtubeWatchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'group inline-flex h-9 items-center justify-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground shadow-sm transition-colors',
              'hover:border-[#FF0000] hover:bg-[#FF0000] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
            )}
          >
            <FaYoutube
              className="h-5 w-5 shrink-0 text-[#FF0000] transition-colors group-hover:text-white"
              aria-hidden
            />
            <span>Open on YouTube</span>
          </a>
        ) : null}
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            document.getElementById(transcriptScrollTargetId)?.scrollIntoView({ behavior: 'smooth' })
          }
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
