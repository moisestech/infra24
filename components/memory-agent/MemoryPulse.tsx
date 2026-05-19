'use client'

import { ma } from '@/lib/memory-agent/ui-tokens'
import { cn } from '@/lib/utils'
import type { AgentState } from '@/types/memory-agent'

const COPY: Record<AgentState, { title: string; subtitle: string }> = {
  idle: {
    title: 'Ready',
    subtitle: 'Tap the microphone or type a question below.',
  },
  listening: {
    title: 'Listening…',
    subtitle: 'Tap stop when you are done speaking.',
  },
  transcribing: {
    title: 'Transcribing…',
    subtitle: 'Turning your voice into text.',
  },
  searching: {
    title: 'Searching alumni records…',
    subtitle: 'Matching themes, programs, and disciplines.',
  },
  thinking: {
    title: 'Preparing your answer…',
    subtitle: 'Grounding in approved artist data.',
  },
  speaking: {
    title: 'Speaking…',
    subtitle: 'Here is what I found.',
  },
  complete: {
    title: 'Ready',
    subtitle: 'Ask another question or use a follow-up.',
  },
  error: {
    title: 'Something went wrong',
    subtitle: 'You can still type your question.',
  },
}

type MemoryPulseProps = {
  state: AgentState
  copyOverrides?: Partial<Record<AgentState, { title: string; subtitle: string }>>
}

/**
 * Slow institutional “memory field” — CSS only, no extra deps.
 */
export function MemoryPulse({ state, copyOverrides }: MemoryPulseProps) {
  const base = COPY[state] ?? COPY.idle
  const override = copyOverrides?.[state]
  const title = override?.title ?? base.title
  const subtitle = override?.subtitle ?? base.subtitle
  const pulse =
    state === 'listening' || state === 'speaking'
      ? 'animate-pulse'
      : state === 'transcribing' || state === 'searching' || state === 'thinking'
        ? 'animate-[pulse_2.4s_ease-in-out_infinite]'
        : 'animate-[pulse_3.2s_ease-in-out_infinite]'

  const ringSpeed =
    state === 'thinking' || state === 'searching'
      ? 'animate-[spin_14s_linear_infinite]'
      : state === 'transcribing'
        ? 'animate-[spin_10s_linear_infinite]'
        : 'animate-[spin_22s_linear_infinite]'

  return (
    <section
      className={cn(
        'relative mb-0 overflow-hidden rounded-2xl px-4 py-5 shadow-sm',
        ma.card
      )}
      aria-live="polite"
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--ma-primary)_14%,transparent)_0%,transparent_65%)] opacity-90 ${pulse}`}
      />
      <div
        className={`pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full border border-[color:color-mix(in_srgb,var(--ma-primary)_35%,transparent)] opacity-40 ${ringSpeed}`}
      />
      <div
        className={`pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full border border-[color:color-mix(in_srgb,var(--ma-accent)_28%,transparent)] opacity-30 ${ringSpeed}`}
        style={{ animationDirection: 'reverse' }}
      />
      <div className="relative">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--ma-text-muted)]">
          {title}
        </p>
        <p className={cn('mt-1', ma.bodyMuted)}>{subtitle}</p>
      </div>
    </section>
  )
}
