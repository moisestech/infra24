'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Box,
  Brush,
  Palette,
  Puzzle,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import {
  FABRICATION_FINISH_LEVELS,
  getFabricationColor,
  getFabricationSectionMedia,
  type FinishLevelId,
} from '@/lib/dcc/fabrication'
import { cn } from '@/lib/utils'

const ICONS: Record<
  'box' | 'sparkles' | 'puzzle' | 'brush' | 'palette',
  LucideIcon
> = {
  box: Box,
  sparkles: Sparkles,
  puzzle: Puzzle,
  brush: Brush,
  palette: Palette,
}

export function FinishLevelPicker() {
  const [selected, setSelected] = useState<FinishLevelId>('clean')
  const active =
    FABRICATION_FINISH_LEVELS.find((f) => f.id === selected) ??
    FABRICATION_FINISH_LEVELS[1]
  const color = getFabricationColor(active.colorTokenId)
  const media = getFabricationSectionMedia(active.mediaId)
  const Icon = ICONS[active.iconKey]

  return (
    <div className="space-y-5 md:space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {FABRICATION_FINISH_LEVELS.map((finish) => {
          const LevelIcon = ICONS[finish.iconKey]
          const levelColor = getFabricationColor(finish.colorTokenId)
          const isOn = finish.id === selected
          return (
            <button
              key={finish.id}
              type="button"
              onClick={() => setSelected(finish.id)}
              className={cn(
                'min-h-11 rounded-2xl border p-3 text-left transition sm:p-4',
                isOn
                  ? cn(levelColor.border, 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900')
                  : cn(levelColor.border, levelColor.surface, 'hover:border-neutral-400')
              )}
            >
              <span className="inline-flex items-center gap-2 text-sm font-semibold">
                <span
                  className={cn(
                    'inline-flex h-7 w-7 items-center justify-center rounded-full',
                    isOn ? 'bg-white/20 text-white dark:bg-neutral-900/15 dark:text-neutral-900' : levelColor.icon
                  )}
                >
                  <LevelIcon aria-hidden className="h-3.5 w-3.5" />
                </span>
                L{finish.level}
              </span>
              <span
                className={cn(
                  'mt-2 block text-sm font-medium',
                  isOn ? 'text-white dark:text-neutral-900' : levelColor.heading
                )}
              >
                {finish.label}
              </span>
              <span
                className={cn(
                  'mt-1 block text-xs leading-relaxed',
                  isOn
                    ? 'text-white/80 dark:text-neutral-700'
                    : 'text-neutral-600 dark:text-neutral-400'
                )}
              >
                {finish.summary}
              </span>
            </button>
          )
        })}
      </div>

      <div
        className={cn(
          'grid gap-5 rounded-2xl border p-4 sm:p-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-start',
          color.border,
          color.surface
        )}
      >
        <figure className="overflow-hidden rounded-xl border border-[var(--cdc-border)] bg-white dark:bg-neutral-950">
          {media.src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={media.src}
              alt={media.alt}
              width={media.width}
              height={media.height}
              className="aspect-[4/5] w-full object-cover"
            />
          ) : (
            <div
              className={cn(
                'flex aspect-[4/5] flex-col items-center justify-center bg-gradient-to-br p-4 text-center',
                color.gradient
              )}
            >
              <Icon aria-hidden className="h-8 w-8 opacity-70" />
              <p className="mt-3 text-sm font-semibold">{media.title}</p>
              <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-300">
                {media.shot}
              </p>
              <p className="mt-2 font-mono text-[10px] uppercase text-neutral-500">
                {media.fileName}
              </p>
            </div>
          )}
          <figcaption className="border-t border-[var(--cdc-border)] px-3 py-2 text-[10px] uppercase tracking-wide text-neutral-500">
            {media.src ? media.caption ?? media.title : 'Image needed'}
          </figcaption>
        </figure>

        <div>
          <h3 className={cn('inline-flex items-center gap-2 text-lg font-semibold', color.heading)}>
            <span className={cn('inline-flex h-8 w-8 items-center justify-center rounded-full', color.icon)}>
              <Icon aria-hidden className="h-4 w-4" />
            </span>
            L{active.level} — {active.label}
          </h3>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            {active.laborNote}
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-neutral-700 dark:text-neutral-300">
            {active.includes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-3 text-xs font-medium uppercase tracking-wide text-neutral-500">
            {active.inHouse ? 'In-house' : 'Custom quote'}
          </p>
          <Link
            href={`/fabricate/quote?finish=${active.id}`}
            className="mt-4 inline-flex min-h-11 items-center rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900"
          >
            Request quote with this finish
          </Link>
        </div>
      </div>
    </div>
  )
}
