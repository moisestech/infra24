'use client'

import { useState } from 'react'
import type { PaceMode } from '@/lib/workshop-engine/types'
import { cn } from '@/lib/utils'

export function PaceSelector({
  value,
  onChange,
}: {
  value: PaceMode
  onChange: (mode: PaceMode) => void
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2" role="group" aria-label="Pace mode">
      {(
        [
          {
            id: 'follow' as const,
            title: 'Follow class',
            body: 'Stay on the facilitator’s current module. Safety screens can interrupt.',
          },
          {
            id: 'self-paced' as const,
            title: 'My pace',
            body: 'Navigate modules independently. Rejoin live anytime.',
          },
        ] as const
      ).map((option) => {
        const selected = value === option.id
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={cn(
              'rounded-md border px-4 py-3 text-left transition',
              selected
                ? 'border-neutral-950 bg-neutral-950 text-white'
                : 'border-neutral-300 bg-white text-neutral-800 hover:border-neutral-500'
            )}
          >
            <span className="block text-sm font-semibold">{option.title}</span>
            <span className={cn('mt-1 block text-xs', selected ? 'text-neutral-200' : 'text-neutral-600')}>
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
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-950">
      <p>
        Live class is on <span className="font-semibold">{moduleTitle}</span>
      </p>
      {onRejoin ? (
        <button
          type="button"
          onClick={onRejoin}
          className="rounded border border-emerald-800 px-3 py-1.5 text-xs font-medium hover:bg-emerald-100"
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
  options: { id: string; label: string; correct?: boolean; explanation: string }[]
}) {
  const [selected, setSelected] = useState<string | null>(null)
  const chosen = options.find((o) => o.id === selected)

  return (
    <div className="space-y-3 rounded-md border border-neutral-200 bg-white p-4">
      <p className="font-medium text-neutral-950">Checkpoint</p>
      <p className="text-sm text-neutral-700">{prompt}</p>
      <div className="flex flex-col gap-2">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setSelected(option.id)}
            className={cn(
              'rounded border px-3 py-2 text-left text-sm',
              selected === option.id
                ? 'border-neutral-950 bg-neutral-100'
                : 'border-neutral-200 hover:border-neutral-400'
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
      {chosen ? (
        <p
          className={cn(
            'text-sm',
            chosen.correct ? 'text-emerald-800' : 'text-amber-900'
          )}
        >
          {chosen.correct ? 'Yes. ' : 'Not quite. '}
          {chosen.explanation}
        </p>
      ) : null}
    </div>
  )
}
