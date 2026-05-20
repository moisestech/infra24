'use client'

import { useMemo } from 'react'

import type { AgentState } from '@/types/memory-agent'

type MemoryAgentAudioOrbProps = {
  state: AgentState
  /** 0–1 average level from analyser bars */
  levelRms: number
}

/**
 * Central reactive orb — amplitude from mic/playback levels, motion from agent state.
 */
export function MemoryAgentAudioOrb({ state, levelRms }: MemoryAgentAudioOrbProps) {
  const scale = useMemo(() => {
    if (state === 'listening') return 1 + Math.min(0.35, levelRms * 1.4)
    if (state === 'speaking') return 1 + Math.min(0.28, levelRms * 1.2)
    if (state === 'transcribing' || state === 'searching' || state === 'thinking')
      return 1.06
    if (state === 'error') return 0.95
    return 1 + Math.min(0.08, levelRms * 0.3)
  }, [state, levelRms])

  const label =
    state === 'listening'
      ? 'Agent is listening'
      : state === 'speaking'
        ? 'Agent is speaking'
        : state === 'transcribing'
          ? 'Transcribing audio'
          : state === 'searching' || state === 'thinking'
            ? 'Searching…'
            : 'Memory agent idle'

  return (
    <div
      className="mx-auto mb-0 flex h-36 w-full max-w-sm flex-col items-center justify-center"
      aria-label={label}
    >
      <div
        className="relative flex h-28 w-28 items-center justify-center transition-transform duration-100 ease-out"
        style={{ transform: `scale(${scale})` }}
      >
        <div
          className="absolute h-full w-full rounded-full bg-[color:color-mix(in_srgb,var(--ma-primary)_22%,transparent)] blur-2xl"
          style={{ opacity: 0.45 + levelRms * 0.35 }}
        />
        <div
          className={`relative h-24 w-24 rounded-full bg-gradient-to-br from-[color:var(--ma-accent)] to-[color:var(--ma-secondary)] shadow-lg ring-2 ring-white/60 ${
            state === 'thinking' || state === 'searching'
              ? 'animate-[pulse_2s_ease-in-out_infinite]'
              : state === 'transcribing'
                ? 'animate-[pulse_1.4s_ease-in-out_infinite]'
                : state === 'error'
                  ? 'opacity-80 ring-amber-300/80'
                  : ''
          }`}
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-10 w-10 rounded-full bg-white/25 backdrop-blur-[2px]" />
        </div>
      </div>
    </div>
  )
}
