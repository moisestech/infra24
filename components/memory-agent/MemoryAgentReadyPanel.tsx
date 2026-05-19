'use client'

import { Keyboard, Mic } from 'lucide-react'

import { ma } from '@/lib/memory-agent/ui-tokens'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

type MemoryAgentReadyPanelProps = {
  agentName: string
  ready: boolean
  voiceSupported: boolean
  voiceDisabled: boolean
  onAskByVoice: () => void
  onTypeQuestion: () => void
}

export function MemoryAgentReadyPanel({
  agentName,
  ready,
  voiceSupported,
  voiceDisabled,
  onAskByVoice,
  onTypeQuestion,
}: MemoryAgentReadyPanelProps) {
  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-2xl px-4 py-4 shadow-sm',
        ma.card
      )}
      aria-live="polite"
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--ma-text-muted)]">
        Ready
      </p>
      <p className={cn('mt-1 text-sm font-medium text-[var(--ma-text)]')}>
        {agentName} is here — choose how to ask
      </p>
      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Button
          type="button"
          size="lg"
          disabled={!ready || !voiceSupported || voiceDisabled}
          className={cn(
            'h-12 justify-center gap-2 font-semibold',
            ma.btnPrimary,
            'shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98]'
          )}
          onClick={onAskByVoice}
        >
          <Mic className="h-5 w-5" aria-hidden />
          Ask by voice
        </Button>
        <Button
          type="button"
          size="lg"
          variant="outline"
          disabled={!ready}
          className={cn(
            'h-12 justify-center gap-2 border-2 font-semibold',
            ma.btnOutline,
            'transition-transform hover:scale-[1.02] active:scale-[0.98]'
          )}
          onClick={onTypeQuestion}
        >
          <Keyboard className="h-5 w-5" aria-hidden />
          Type a question
        </Button>
      </div>
      {!voiceSupported ? (
        <p className={cn('mt-3 text-xs', ma.bodyMuted)}>
          Voice is not supported in this browser — use Type a question.
        </p>
      ) : null}
    </section>
  )
}
