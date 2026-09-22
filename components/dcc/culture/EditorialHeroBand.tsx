'use client'

import { useReducedMotion } from 'motion/react'
import { EraChannelEffect } from '@/components/era/EraChannelEffect'
import { EffectFallback } from '@/components/era/effects/EffectFallback'
import type { EraAccentKey } from '@/lib/era/tokens'
import type { JournalHeroEffectName } from '@/lib/dcc/culture'

const FALLBACK_SHAPE: Record<
  JournalHeroEffectName,
  'mesh' | 'particles' | 'scan'
> = {
  'mesh-field': 'mesh',
  'particle-dispatch': 'particles',
  'city-scan': 'scan',
}

export function EditorialHeroBand({
  effect,
  accentKey,
  title,
  brief,
}: {
  effect: JournalHeroEffectName
  accentKey: EraAccentKey
  title: string
  brief?: string
}) {
  const reduceMotion = useReducedMotion()

  return (
    <div
      data-journal-hero-band=""
      data-journal-hero-effect={effect}
      className="relative isolate aspect-[16/9] w-full overflow-hidden bg-slate-950"
    >
      {reduceMotion ? (
        <EffectFallback
          accentKey={accentKey}
          shape={FALLBACK_SHAPE[effect]}
        />
      ) : (
        <div className="pointer-events-none absolute inset-0 [&_canvas]:bg-transparent" aria-hidden>
          <EraChannelEffect name={effect} />
        </div>
      )}
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-neutral-950 via-neutral-950/75 to-slate-950/55"
        aria-hidden
      />
      <div className="relative z-[2] flex h-full flex-col justify-end gap-2 p-5 sm:p-8">
        <p className="text-[0.65rem] font-medium uppercase tracking-[0.16em] text-neutral-400">
          Hero
        </p>
        <p className="max-w-xl text-sm font-semibold leading-snug text-neutral-50 sm:text-base">
          {title}
        </p>
        {brief ? (
          <p className="max-w-xl text-sm leading-relaxed text-neutral-300">{brief}</p>
        ) : null}
        <p className="text-[0.65rem] uppercase tracking-[0.14em] text-neutral-500">
          Imagery forthcoming
        </p>
      </div>
    </div>
  )
}
