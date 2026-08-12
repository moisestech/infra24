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
  type FinishLevelId,
} from '@/lib/dcc/fabrication'
import { cn } from '@/lib/utils'

const ICONS: Record<FabricationFinishLevelIcon, LucideIcon> = {
  box: Box,
  sparkles: Sparkles,
  puzzle: Puzzle,
  brush: Brush,
  palette: Palette,
}

type FabricationFinishLevelIcon =
  | 'box'
  | 'sparkles'
  | 'puzzle'
  | 'brush'
  | 'palette'

export function FinishLevelPicker() {
  const [selected, setSelected] = useState<FinishLevelId>('clean')
  const active =
    FABRICATION_FINISH_LEVELS.find((f) => f.id === selected) ??
    FABRICATION_FINISH_LEVELS[1]

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {FABRICATION_FINISH_LEVELS.map((finish) => {
          const Icon = ICONS[finish.iconKey]
          const isOn = finish.id === selected
          return (
            <button
              key={finish.id}
              type="button"
              onClick={() => setSelected(finish.id)}
              className={cn(
                'rounded-2xl border p-4 text-left transition',
                isOn
                  ? 'border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900'
                  : 'border-[var(--cdc-border)] bg-white hover:border-neutral-400 dark:bg-neutral-950'
              )}
            >
              <span className="inline-flex items-center gap-2 text-sm font-semibold">
                <Icon aria-hidden className="h-4 w-4" />
                L{finish.level} — {finish.label}
              </span>
              <span
                className={cn(
                  'mt-2 block text-sm',
                  isOn ? 'text-white/85 dark:text-neutral-700' : 'text-neutral-600 dark:text-neutral-400'
                )}
              >
                {finish.summary}
              </span>
              <span
                className={cn(
                  'mt-3 inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide',
                  isOn
                    ? 'bg-white/15 dark:bg-neutral-900/10'
                    : finish.inHouse
                      ? 'bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200'
                      : 'bg-amber-50 text-amber-950 dark:bg-amber-950/40 dark:text-amber-100'
                )}
              >
                {finish.inHouse ? 'In-house' : 'Custom quote'}
              </span>
            </button>
          )
        })}
      </div>

      <div className="rounded-2xl border border-[var(--cdc-border)] bg-neutral-50 p-5 dark:bg-neutral-900/40">
        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
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
        <Link
          href={`/fabricate/quote?finish=${active.id}`}
          className="mt-4 inline-flex min-h-11 items-center rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900"
        >
          Request quote with this finish
        </Link>
      </div>
    </div>
  )
}
