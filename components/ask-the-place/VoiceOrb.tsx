'use client'

import { cn } from '@/lib/utils'

type VoiceState = 'idle' | 'listening' | 'thinking'

type VoiceOrbProps = {
  state: VoiceState
}

export function VoiceOrb({ state }: VoiceOrbProps) {
  return (
    <div
      className="relative mx-auto flex h-24 w-24 items-center justify-center"
      aria-label={`Voice: ${state}`}
    >
      <div
        className={cn(
          'absolute inset-0 rounded-full bg-gradient-to-br from-teal-400/25 to-violet-500/20 blur-xl',
          state === 'listening' && 'animate-pulse',
          state === 'thinking' && 'animate-[pulse_2s_ease-in-out_infinite]'
        )}
      />
      <div
          className={cn(
          'relative h-14 w-14 rounded-full border border-white/20 bg-gradient-to-br from-teal-300/40 to-amber-200/30 shadow-inner',
          state === 'listening' && 'scale-105 ring-2 ring-teal-400/40',
          state === 'thinking' && 'animate-pulse opacity-95'
        )}
      />
    </div>
  )
}
