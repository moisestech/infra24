'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import type { EdgeZonesArtistProfile } from '@/lib/marketing/edgezones-artists'
import { EdgeZonesPortrait } from '@/components/marketing/edgezones/EdgeZonesSections'
import { cn } from '@/lib/utils'

type Props = {
  artists: EdgeZonesArtistProfile[]
  exhibitionTitle: string
  filterNote?: string
  networkHref?: string
  emptyMessage?: string
}

const cardVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.98 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: index * 0.07,
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
}

function NetworkArtistCard({
  artist,
  index,
  reducedMotion,
}: {
  artist: EdgeZonesArtistProfile
  index: number
  reducedMotion: boolean
}) {
  const Card = reducedMotion ? 'li' : motion.li
  const cardMotion = reducedMotion
    ? {}
    : {
        custom: index,
        variants: cardVariants,
        initial: 'hidden' as const,
        whileInView: 'visible' as const,
        viewport: { once: true, margin: '-40px' },
        whileHover: { y: -6, transition: { duration: 0.2 } },
      }

  return (
    <Card
      {...cardMotion}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--cdc-border)] bg-white/80 p-5 shadow-sm backdrop-blur-sm transition-shadow duration-300 hover:border-teal-300/60 hover:shadow-[0_0_0_1px_rgba(45,212,191,0.35),0_12px_40px_-12px_rgba(13,148,136,0.45)] dark:border-neutral-800 dark:bg-neutral-900/75 dark:hover:border-teal-500/40 dark:hover:shadow-[0_0_0_1px_rgba(45,212,191,0.25),0_12px_40px_-12px_rgba(13,148,136,0.35)]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 ez-network-card-shine"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-teal-400/20 blur-2xl transition-all duration-500 group-hover:bg-teal-400/35 dark:bg-teal-500/15 dark:group-hover:bg-teal-400/25"
      />

      <div className="relative flex gap-4">
        <div className="relative shrink-0">
          <div
            aria-hidden
            className="absolute -inset-1 rounded-xl bg-gradient-to-br from-teal-400/50 via-cyan-300/30 to-violet-400/40 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100"
          />
          <EdgeZonesPortrait
            name={artist.name}
            imageUrl={artist.imageUrl}
            imageAlt={artist.name}
            imageFit="cover"
            className="relative ring-2 ring-white/80 transition group-hover:ring-teal-200/80 dark:ring-neutral-800 dark:group-hover:ring-teal-500/50"
          />
        </div>
        <div className="min-w-0">
          <h3 className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-teal-900 bg-clip-text text-base font-semibold tracking-tight text-transparent transition group-hover:from-teal-800 group-hover:via-teal-700 group-hover:to-cyan-700 dark:from-neutral-100 dark:via-neutral-200 dark:to-teal-200 dark:group-hover:from-teal-200 dark:group-hover:via-cyan-200 dark:group-hover:to-white">
            {artist.name}
          </h3>
          {artist.roleType ? (
            <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-teal-700/80 dark:text-teal-300/80">
              {artist.roleType}
            </p>
          ) : null}
        </div>
      </div>

      {artist.bio ? (
        <p className="relative mt-4 flex-1 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
          {artist.bio}
        </p>
      ) : null}

      {artist.practiceTags.length > 0 ? (
        <ul className="relative mt-4 flex flex-wrap gap-2">
          {artist.practiceTags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-teal-200/50 bg-gradient-to-r from-teal-50/90 to-cyan-50/70 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-teal-800 transition group-hover:border-teal-300/70 dark:border-teal-800/50 dark:from-teal-950/60 dark:to-cyan-950/40 dark:text-teal-200"
            >
              {tag}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="relative mt-4 flex flex-wrap gap-2">
        {artist.instagram ? (
          <a
            href={artist.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-9 items-center rounded-full border border-transparent bg-teal-50/80 px-3 text-xs font-semibold text-teal-800 transition hover:border-teal-300/60 hover:bg-teal-100 hover:shadow-[0_0_16px_rgba(45,212,191,0.35)] dark:bg-teal-950/50 dark:text-teal-200 dark:hover:border-teal-500/40 dark:hover:bg-teal-900/60"
          >
            Instagram
          </a>
        ) : null}
        {artist.website ? (
          <a
            href={artist.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-9 items-center rounded-full border border-transparent bg-cyan-50/80 px-3 text-xs font-semibold text-cyan-900 transition hover:border-cyan-300/60 hover:bg-cyan-100 hover:shadow-[0_0_16px_rgba(34,211,238,0.3)] dark:bg-cyan-950/40 dark:text-cyan-200 dark:hover:border-cyan-500/40 dark:hover:bg-cyan-900/50"
          >
            Website
          </a>
        ) : null}
        {artist.sourceUrl ? (
          <a
            href={artist.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-9 items-center rounded-full px-3 text-xs font-medium text-neutral-500 transition hover:text-neutral-800 dark:hover:text-neutral-200"
          >
            Context
          </a>
        ) : null}
      </div>
    </Card>
  )
}

function AnimatedBackdrop({ reducedMotion }: { reducedMotion: boolean }) {
  const Orb = reducedMotion ? 'div' : motion.div

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 ez-network-backdrop" />
      <div className="absolute inset-0 ez-network-grid opacity-60 dark:opacity-40" />
      <Orb
        className="absolute -left-[10%] top-[8%] h-[min(42vw,22rem)] w-[min(42vw,22rem)] rounded-full bg-gradient-to-br from-teal-300/35 via-cyan-200/20 to-transparent blur-3xl dark:from-teal-500/25 dark:via-cyan-500/15"
        {...(reducedMotion
          ? {}
          : {
              animate: { x: [0, 36, 0], y: [0, -24, 0] },
              transition: { duration: 14, repeat: Infinity, ease: 'easeInOut' },
            })}
      />
      <Orb
        className="absolute -right-[8%] top-[18%] h-[min(38vw,20rem)] w-[min(38vw,20rem)] rounded-full bg-gradient-to-bl from-violet-300/30 via-fuchsia-200/15 to-transparent blur-3xl dark:from-violet-600/20 dark:via-fuchsia-500/10"
        {...(reducedMotion
          ? {}
          : {
              animate: { x: [0, -28, 0], y: [0, 20, 0] },
              transition: { duration: 16, repeat: Infinity, ease: 'easeInOut' },
            })}
      />
      <Orb
        className="absolute bottom-[6%] left-[30%] h-[min(34vw,18rem)] w-[min(34vw,18rem)] rounded-full bg-gradient-to-t from-teal-400/25 via-emerald-200/15 to-transparent blur-3xl dark:from-teal-600/20 dark:via-emerald-500/10"
        {...(reducedMotion
          ? {}
          : {
              animate: { x: [0, 20, 0], y: [0, -16, 0] },
              transition: { duration: 18, repeat: Infinity, ease: 'easeInOut' },
            })}
      />
    </div>
  )
}

export function EdgeZonesNetworkIndexSection({
  artists,
  exhibitionTitle,
  filterNote,
  networkHref = '/network/research',
  emptyMessage = 'Network index profiles are being configured.',
}: Props) {
  const reducedMotion = useReducedMotion()

  return (
    <section
      id="artists"
      className="scroll-mt-36 relative overflow-hidden bg-[#fafafa] py-14 sm:py-20 lg:py-24 dark:bg-neutral-950"
    >
      <AnimatedBackdrop reducedMotion={!!reducedMotion} />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="bg-gradient-to-r from-neutral-900 via-teal-800 to-cyan-700 bg-clip-text text-2xl font-semibold tracking-tight text-transparent dark:from-white dark:via-teal-200 dark:to-cyan-300">
                Network index
              </h2>
              <span className="ez-network-live-pill inline-flex items-center gap-2 rounded-full border border-teal-300/50 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal-800 backdrop-blur-sm dark:border-teal-600/40 dark:bg-neutral-900/70 dark:text-teal-200">
                <span aria-hidden className="h-2 w-2 rounded-full bg-teal-500 shadow-[0_0_10px_rgba(45,212,191,0.9)]" />
                {artists.length} {artists.length === 1 ? 'artist' : 'artists'}
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
              Artists in <span className="font-medium text-neutral-800 dark:text-neutral-100">{exhibitionTitle}</span>
              {filterNote ? ` (${filterNote})` : ''}. Profiles are configured in the network index data file and
              enriched from Airtable when available.
            </p>
          </div>

          <Link
            href={networkHref}
            className={cn(
              'group inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-teal-300/60 bg-gradient-to-r from-teal-600 to-cyan-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(13,148,136,0.35)] transition hover:from-teal-500 hover:to-cyan-500 hover:shadow-[0_0_32px_rgba(13,148,136,0.5)] dark:border-teal-500/40 dark:from-teal-700 dark:to-cyan-700'
            )}
          >
            Open research map
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            >
              →
            </span>
          </Link>
        </div>

        <div className="mt-10">
          {artists.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-teal-300/40 bg-white/60 p-10 text-center backdrop-blur-sm dark:border-teal-800/40 dark:bg-neutral-900/60">
              <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">{emptyMessage}</p>
              <Link
                href={networkHref}
                className="mt-5 inline-flex min-h-11 items-center rounded-full bg-gradient-to-r from-teal-600 to-cyan-600 px-5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(13,148,136,0.3)] hover:from-teal-500 hover:to-cyan-500"
              >
                Browse the research map →
              </Link>
            </div>
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {artists.map((artist, index) => (
                <NetworkArtistCard
                  key={artist.id}
                  artist={artist}
                  index={index}
                  reducedMotion={!!reducedMotion}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
