'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  STUDIO_TOUR_IFRAME_ALLOW,
  type DccStudioTour,
} from '@/lib/dcc/studios'
import { cn } from '@/lib/utils'

type StudioTourEmbedProps = {
  tour: DccStudioTour
  className?: string
  /** Hide the figcaption (band layouts that already label the slide). */
  showCaption?: boolean
  showLinks?: boolean
  /** Knight band is dark; artist pages are light. */
  tone?: 'dark' | 'light'
}

export function StudioTourEmbed({
  tour,
  className,
  showCaption = true,
  showLinks = true,
  tone = 'dark',
}: StudioTourEmbedProps) {
  const [entered, setEntered] = useState(false)

  return (
    <figure
      className={cn('dcc-studio', className)}
      data-artist={tour.artistSlug}
    >
      {showCaption ? (
        <figcaption
          className={cn(
            'px-4 pb-3 text-sm font-medium tracking-tight sm:px-6',
            tone === 'light' ? 'text-neutral-900 dark:text-neutral-100' : 'text-white'
          )}
        >
          {tour.caption}
        </figcaption>
      ) : null}

      <div className="relative aspect-[16/10] w-full max-h-[min(70dvh,640px)] bg-[#111]">
        {entered ? (
          <iframe
            src={tour.embedSrc}
            title={tour.title}
            allowFullScreen
            allow={STUDIO_TOUR_IFRAME_ALLOW}
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <button
            type="button"
            onClick={() => setEntered(true)}
            className="group absolute inset-0 flex items-center justify-center text-left"
            aria-label={tour.enterLabel}
          >
            {tour.posterSrc ? (
              <Image
                src={tour.posterSrc}
                alt={tour.posterAlt ?? tour.caption}
                fill
                sizes="100vw"
                className="object-cover transition duration-300 group-hover:scale-[1.02]"
              />
            ) : (
              <span className="absolute inset-0 bg-neutral-950" aria-hidden />
            )}
            <span
              className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/20"
              aria-hidden
            />
            <span className="relative z-10 mx-4 inline-flex min-h-11 items-center justify-center rounded-full border border-white/25 bg-black/55 px-5 py-2.5 text-sm font-semibold tracking-tight text-white shadow-lg backdrop-blur-sm transition group-hover:border-teal-300/60 group-hover:bg-black/70">
              {tour.enterLabel}
            </span>
          </button>
        )}
      </div>

      {showLinks ? (
        <p
          className={cn(
            'mt-3 px-4 text-sm sm:px-6',
            tone === 'light'
              ? 'text-neutral-600 dark:text-neutral-400'
              : 'text-neutral-400'
          )}
        >
          <a
            href={tour.shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'underline-offset-4 hover:underline',
              tone === 'light'
                ? 'hover:text-neutral-900 dark:hover:text-neutral-100'
                : 'hover:text-white'
            )}
          >
            Open tour
          </a>
          {tour.sourceHref ? (
            <>
              {' · '}
              <a
                href={tour.sourceHref}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'underline-offset-4 hover:underline',
                  tone === 'light'
                    ? 'hover:text-neutral-900 dark:hover:text-neutral-100'
                    : 'hover:text-white'
                )}
              >
                {tour.sourceLabel ?? 'Open source page'}
              </a>
            </>
          ) : null}
        </p>
      ) : null}
    </figure>
  )
}
