'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { weSpace, weType } from '@/components/workshop-engine/responsive'
import { CheckCircle2, Clock3, ShieldAlert } from 'lucide-react'

export function SafetyGate({
  title = 'Safety gate',
  note,
  checklist,
  onComplete,
  storageKey,
}: {
  title?: string
  note: string
  checklist: string[]
  onComplete?: () => void
  storageKey?: string
}) {
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [unlocked, setUnlocked] = useState(false)

  useEffect(() => {
    if (!storageKey || typeof window === 'undefined') return
    if (window.localStorage.getItem(storageKey) === '1') {
      setUnlocked(true)
      onComplete?.()
    }
  }, [storageKey, onComplete])

  const allDone = checklist.every((item) => checked[item])

  function unlock() {
    if (!allDone) return
    setUnlocked(true)
    if (storageKey && typeof window !== 'undefined') {
      window.localStorage.setItem(storageKey, '1')
    }
    onComplete?.()
  }

  if (unlocked) {
    return (
      <div
        className={cn(
          'flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-950',
          weSpace.cardPad,
          weType.body
        )}
      >
        <CheckCircle2
          aria-hidden
          className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700 md:h-6 md:w-6"
        />
        <p>
          Safety check complete for this device. Equipment operation remains
          instructor-led.
        </p>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'space-y-4 rounded-xl border-2 border-amber-400 bg-amber-50 text-amber-950',
        weSpace.cardPad
      )}
    >
      <div className="flex gap-3">
        <ShieldAlert
          aria-hidden
          className="mt-0.5 h-5 w-5 shrink-0 text-amber-800 md:h-6 md:w-6 2xl:h-7 2xl:w-7"
        />
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide md:text-base 2xl:text-lg">
            {title}
          </p>
          <p className={cn('mt-2', weType.body)}>{note}</p>
        </div>
      </div>
      <ul className="space-y-2 md:space-y-2.5">
        {checklist.map((item) => (
          <li key={item}>
            <label
              className={cn(
                'flex cursor-pointer items-start gap-2',
                weType.body
              )}
            >
              <input
                type="checkbox"
                className="mt-1 h-4 w-4"
                checked={Boolean(checked[item])}
                onChange={(e) =>
                  setChecked((prev) => ({ ...prev, [item]: e.target.checked }))
                }
              />
              <span>{item}</span>
            </label>
          </li>
        ))}
      </ul>
      <button
        type="button"
        disabled={!allDone}
        onClick={unlock}
        className={cn(
          'rounded-lg px-4 py-2.5 text-sm font-medium md:px-5 md:py-3 md:text-base 2xl:text-lg',
          allDone
            ? 'bg-slate-950 text-white'
            : 'cursor-not-allowed bg-slate-300 text-slate-500'
        )}
      >
        Continue past safety gate
      </button>
    </div>
  )
}

export function RoomTimer({
  endsAt,
  label,
  large,
}: {
  endsAt: string | null
  label?: string | null
  large?: boolean
}) {
  const [remainingMs, setRemainingMs] = useState<number | null>(null)

  useEffect(() => {
    if (!endsAt) {
      setRemainingMs(null)
      return
    }
    const tick = () => {
      setRemainingMs(Math.max(0, new Date(endsAt).getTime() - Date.now()))
    }
    tick()
    const id = window.setInterval(tick, 250)
    return () => window.clearInterval(id)
  }, [endsAt])

  if (!endsAt || remainingMs === null) return null

  const totalSec = Math.ceil(remainingMs / 1000)
  const mm = String(Math.floor(totalSec / 60)).padStart(2, '0')
  const ss = String(totalSec % 60).padStart(2, '0')

  return (
    <div className={cn('text-center', large ? 'space-y-2 md:space-y-3' : '')}>
      {label ? (
        <p
          className={cn(
            'inline-flex items-center justify-center gap-2 uppercase tracking-wide',
            large
              ? 'text-lg text-neutral-300 sm:text-xl md:text-2xl 2xl:text-3xl'
              : 'text-xs text-neutral-500 md:text-sm'
          )}
        >
          <Clock3 aria-hidden className={large ? 'h-5 w-5' : 'h-3.5 w-3.5'} />
          {label}
        </p>
      ) : null}
      <p
        className={cn(
          'font-semibold tabular-nums',
          large
            ? 'text-5xl text-white sm:text-6xl md:text-7xl lg:text-8xl 2xl:text-9xl'
            : 'text-2xl text-neutral-950 md:text-3xl 2xl:text-4xl'
        )}
      >
        {mm}:{ss}
      </p>
    </div>
  )
}
