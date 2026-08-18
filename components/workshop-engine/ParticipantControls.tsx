'use client'

import { useState } from 'react'
import type { PaceMode } from '@/lib/workshop-engine/types'
import { cn } from '@/lib/utils'
import { weSpace, weType } from '@/components/workshop-engine/responsive'
import {
  CheckCircle2,
  HelpCircle,
  Footprints,
  Radio,
} from 'lucide-react'

export function PaceSelector({
  value,
  onChange,
}: {
  value: PaceMode
  onChange: (mode: PaceMode) => void
}) {
  return (
    <div
      className="grid gap-3 sm:grid-cols-2 md:gap-4 2xl:gap-5"
      role="group"
      aria-label="Pace mode"
    >
      {(
        [
          {
            id: 'follow' as const,
            title: 'Follow class',
            body: 'Stay on the facilitator\'s current module. Safety screens can interrupt.',
            Icon: Radio,
            accent: 'border-cyan-300 bg-cyan-50 text-cyan-950',
            selected: 'border-cyan-900 bg-cyan-900 text-white',
          },
          {
            id: 'self-paced' as const,
            title: 'My pace',
            body: 'Navigate modules independently. Rejoin live anytime.',
            Icon: Footprints,
            accent: 'border-indigo-300 bg-indigo-50 text-indigo-950',
            selected: 'border-indigo-900 bg-indigo-900 text-white',
          },
        ] as const
      ).map((option) => {
        const selected = value === option.id
        const Icon = option.Icon
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={cn(
              'rounded-xl border px-4 py-3 text-left transition md:px-5 md:py-4 2xl:px-6 2xl:py-5',
              'min-h-11',
              selected ? option.selected : option.accent
            )}
          >
            <span className="flex items-center gap-2">
              <Icon
                aria-hidden
                className="h-4 w-4 md:h-5 md:w-5 2xl:h-6 2xl:w-6"
              />
              <span className="text-sm font-semibold md:text-base 2xl:text-lg">
                {option.title}
              </span>
            </span>
            <span
              className={cn(
                'mt-1.5 block text-xs leading-relaxed md:text-sm 2xl:text-base',
                selected ? 'text-white/85' : 'opacity-80'
              )}
            >
              {option.body}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export function LivePositionBanner({
  moduleTitle,
  onRejoin,
}: {
  moduleTitle: string
  onRejoin?: () => void
}) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-950',
        weSpace.cardPad,
        weType.body
      )}
    >
      <p className="inline-flex items-start gap-2">
        <Radio
          aria-hidden
          className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700 md:h-5 md:w-5"
        />
        <span>
          Live class is on <span className="font-semibold">{moduleTitle}</span>
        </span>
      </p>
      {onRejoin ? (
        <button
          type="button"
          onClick={onRejoin}
          className="min-h-11 rounded-lg border border-emerald-800 px-3 py-2 text-xs font-medium hover:bg-emerald-100 md:text-sm 2xl:px-4 2xl:text-base"
        >
          Rejoin live
        </button>
      ) : null}
    </div>
  )
}

export function KnowledgeCheck({
  prompt,
  options,
}: {
  prompt: string
  options: {
    id: string
    label: string
    correct?: boolean
    explanation: string
  }[]
}) {
  const [selected, setSelected] = useState<string | null>(null)
  const chosen = options.find((o) => o.id === selected)

  return (
    <div
      className={cn(
        'space-y-3 rounded-xl border border-teal-200 bg-gradient-to-br from-teal-50 via-cyan-50/40 to-white',
        weSpace.cardPad
      )}
    >
      <p className="inline-flex items-center gap-2 font-semibold text-teal-950 md:text-lg 2xl:text-xl">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-teal-700 text-white md:h-7 md:w-7">
          <HelpCircle aria-hidden className="h-3.5 w-3.5 md:h-4 md:w-4" />
        </span>
        Checkpoint
      </p>
      <p className={cn(weType.body, 'text-slate-700')}>{prompt}</p>
      <div className="flex flex-col gap-2">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setSelected(option.id)}
            className={cn(
              'min-h-11 rounded-lg border px-3 py-2.5 text-left text-sm transition md:px-4 md:py-3 md:text-base 2xl:text-lg',
              selected === option.id
                ? 'border-teal-800 bg-teal-50'
                : 'border-slate-200 bg-white/80 hover:border-slate-400'
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
      {chosen ? (
        <p
          className={cn(
            'inline-flex items-start gap-2 text-sm md:text-base 2xl:text-lg',
            chosen.correct ? 'text-emerald-800' : 'text-amber-900'
          )}
        >
          {chosen.correct ? (
            <CheckCircle2 aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <HelpCircle aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          <span>
            {chosen.correct ? 'Yes. ' : 'Not quite. '}
            {chosen.explanation}
          </span>
        </p>
      ) : null}
    </div>
  )
}
