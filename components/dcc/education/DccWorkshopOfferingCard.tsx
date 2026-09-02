'use client'

import { useCallback, useEffect, useState, type CSSProperties } from 'react'
import Link from 'next/link'
import { useReducedMotion } from 'framer-motion'
import {
  DCC_WORKSHOP_INTEREST_CTA,
  workshopInterestHref,
} from '@/lib/dcc/education/copy'
import type { DccWorkshopOffering } from '@/lib/dcc/education/types'
import { cn } from '@/lib/utils'

const SESSION_LABEL: Record<string, string> = {
  inquiry: 'View session',
  'open-lab': 'Open the lab',
  'self-serve-handbook': 'Open the handbook',
}

const CYCLE_MS = 1400

function formatMeta(offering: DccWorkshopOffering): string {
  const parts: string[] = []
  if (offering.capacity) parts.push(`${offering.capacity} people per class`)
  if (offering.durationMinutes) {
    const hours = offering.durationMinutes / 60
    parts.push(hours >= 1 && hours % 1 === 0 ? `${hours} hr` : `${offering.durationMinutes} min`)
  }
  if (offering.format === 'lab') parts.push('Open lab')
  if (offering.format === 'self-paced') parts.push('Self-paced')
  if (offering.format === 'in-person') parts.push('In person')
  if (offering.format === 'hybrid') parts.push('Hybrid')
  return parts.join(' · ')
}

type DccWorkshopOfferingCardProps = {
  offering: DccWorkshopOffering
  compact?: boolean
}

export function DccWorkshopOfferingCard({
  offering,
  compact = false,
}: DccWorkshopOfferingCardProps) {
  const reduceMotion = useReducedMotion()
  const images = offering.images.filter((img) => img.src?.trim())
  const canCycle = !reduceMotion && images.length > 1
  const [index, setIndex] = useState(0)
  const [cycling, setCycling] = useState(false)

  const startCycle = useCallback(() => {
    if (canCycle) setCycling(true)
  }, [canCycle])

  const stopCycle = useCallback(() => {
    setCycling(false)
    setIndex(0)
  }, [])

  useEffect(() => {
    if (!cycling || !canCycle) return
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % images.length)
    }, CYCLE_MS)
    return () => window.clearInterval(id)
  }, [canCycle, cycling, images.length])

  const cover = images[index] ?? images[0]
  const interestHref = workshopInterestHref(offering.slug)
  const isLive = offering.status === 'live' && Boolean(offering.href)
  const hueStyle = {
    '--partners-hue': offering.hue,
    '--partners-hue-accent': offering.hueAccent,
    '--partners-density': 11,
    '--dcc-offering-hue': offering.hue,
    '--dcc-offering-hue-accent': offering.hueAccent,
  } as CSSProperties

  return (
    <article
      className={cn(
        'dcc-offering-card cdc-webcore-path-card partners-grid-card group relative flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200/90 bg-gradient-to-br from-white via-teal-50/35 to-violet-50/45 shadow-[0_1px_0_rgba(45,212,191,0.08),0_18px_48px_-28px_rgba(15,23,42,0.12)] dark:border-neutral-700/80 dark:from-neutral-950 dark:via-neutral-900 dark:to-slate-950',
        compact ? 'p-4' : 'p-5 sm:p-6'
      )}
      style={hueStyle}
      onMouseEnter={startCycle}
      onMouseLeave={stopCycle}
      onFocusCapture={startCycle}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          stopCycle()
        }
      }}
    >
      <span
        className="partners-card-pixel-overlay pointer-events-none absolute inset-0 z-[1] opacity-[0.42] transition-opacity duration-300 group-hover:opacity-[0.62] group-focus-within:opacity-[0.62] dark:opacity-[0.32] dark:group-hover:opacity-[0.5]"
        aria-hidden
      />
      <span
        className="dcc-offering-card__shine pointer-events-none absolute inset-0 z-[2] opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
        aria-hidden
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.28] dark:opacity-[0.18]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(15,23,42,0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(15,23,42,0.06) 1px, transparent 1px)
          `,
          backgroundSize: '22px 22px',
          maskImage: 'radial-gradient(ellipse 90% 80% at 50% 30%, black 8%, transparent 75%)',
        }}
      />

      <div className="relative z-[3] flex flex-1 flex-col">
        <div className="relative overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-900">
          {cover ? (
            <figure className="relative">
              <div className={cn('relative overflow-hidden', compact ? 'aspect-[16/9]' : 'aspect-[21/9]')}>
                {images.map((img, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={img.src}
                    src={img.src}
                    alt={i === index ? img.alt : ''}
                    className={cn(
                      'absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-500',
                      i === index ? 'opacity-100' : 'opacity-0',
                      canCycle &&
                        i === index &&
                        'motion-safe:group-hover:scale-[1.04] motion-safe:transition-transform motion-safe:duration-700'
                    )}
                  />
                ))}
                {offering.icon ? (
                  <span className="absolute left-3 top-3 z-[4] flex h-11 w-11 items-center justify-center overflow-hidden rounded-lg border border-white/70 bg-white/90 shadow-sm backdrop-blur-sm dark:border-neutral-600 dark:bg-neutral-900/90">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={offering.icon.src} alt={offering.icon.alt} className="h-8 w-8 object-contain" />
                  </span>
                ) : null}
                {images.length > 1 ? (
                  <div className="absolute bottom-3 right-3 z-[4] flex gap-1" aria-hidden>
                    {images.map((img, i) => (
                      <span
                        key={img.src}
                        className={cn(
                          'h-1.5 w-1.5 rounded-full bg-white/70 shadow-sm',
                          i === index && 'bg-white'
                        )}
                      />
                    ))}
                  </div>
                ) : null}
              </div>
              {cover.caption ? (
                <figcaption className="px-1 pt-2 text-[11px] uppercase tracking-[0.12em] text-neutral-500">
                  {cover.caption}
                </figcaption>
              ) : null}
            </figure>
          ) : (
            <div
              className={cn(
                'flex items-center justify-center bg-gradient-to-br from-teal-50/80 via-white to-violet-50/80 dark:from-teal-950/40 dark:via-neutral-900 dark:to-violet-950/40',
                compact ? 'aspect-[16/9]' : 'aspect-[21/9]'
              )}
            >
              {offering.icon ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={offering.icon.src}
                  alt=""
                  className="h-16 w-16 object-contain opacity-90 sm:h-20 sm:w-20"
                />
              ) : null}
            </div>
          )}
        </div>

        <p className="mt-4 text-xs uppercase tracking-[0.16em] text-neutral-500">
          {offering.status === 'in-development'
            ? ['In development', formatMeta(offering)].filter(Boolean).join(' · ')
            : formatMeta(offering) || 'Workshop'}
        </p>
        <h3 className="mt-2 text-lg font-semibold text-neutral-900 dark:text-neutral-50">
          {offering.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {offering.shortDescription}
        </p>

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium">
          {isLive && offering.href ? (
            <Link
              href={offering.href}
              className="text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-100"
            >
              {SESSION_LABEL[offering.enrollment] ?? 'View session'}
            </Link>
          ) : null}
          {isLive && offering.syllabusHref && offering.syllabusHref !== offering.href ? (
            <Link
              href={offering.syllabusHref}
              className="text-neutral-600 underline-offset-4 hover:underline dark:text-neutral-300"
            >
              Syllabus
            </Link>
          ) : null}
          <Link
            href={interestHref}
            className="text-neutral-600 underline-offset-4 hover:underline dark:text-neutral-300"
          >
            {DCC_WORKSHOP_INTEREST_CTA}
          </Link>
        </div>
      </div>
    </article>
  )
}
