'use client'

import { Loader2, Mic, Search, Sparkles, Square } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ma } from '@/lib/memory-agent/ui-tokens'
import { cn } from '@/lib/utils'

export type VoicePipelinePhase =
  | 'listening'
  | 'processing'
  | 'transcribing'
  | 'searching'

const PHASE_COPY: Record<
  VoicePipelinePhase,
  { label: string; hint: string; icon: 'mic' | 'sparkles' | 'search' }
> = {
  listening: {
    label: 'Recording your question',
    hint: 'Tap stop when you finish speaking.',
    icon: 'mic',
  },
  processing: {
    label: 'Processing recording',
    hint: 'Preparing audio for transcription…',
    icon: 'mic',
  },
  transcribing: {
    label: 'Transcribing your question',
    hint: 'Your words will send automatically when ready.',
    icon: 'sparkles',
  },
  searching: {
    label: 'Finding an answer',
    hint: 'Searching alumni records and building a response…',
    icon: 'search',
  },
}

type MemoryAgentVoicePipelineCardProps = {
  phase: VoicePipelinePhase
  transcript?: string
  /** True during the brief window after transcription, before the ask request starts */
  sending?: boolean
  onStopRecording?: () => void
}

function PhaseIcon({ phase }: { phase: VoicePipelinePhase }) {
  const kind = PHASE_COPY[phase].icon
  const className = 'h-5 w-5 shrink-0 text-[color:var(--ma-primary)]'
  if (kind === 'search') return <Search className={className} aria-hidden />
  if (kind === 'mic') return <Mic className={className} aria-hidden />
  return <Sparkles className={className} aria-hidden />
}

export function MemoryAgentVoicePipelineCard({
  phase,
  transcript,
  sending = false,
  onStopRecording,
}: MemoryAgentVoicePipelineCardProps) {
  const copy =
    phase === 'searching' && sending
      ? {
          label: 'Sending your question',
          hint: 'This happens automatically — no need to tap Ask.',
          icon: 'search' as const,
        }
      : PHASE_COPY[phase]
  const showTranscript =
    Boolean(transcript?.trim()) &&
    (phase === 'searching' || phase === 'transcribing')
  const busy = phase === 'transcribing' || phase === 'searching' || phase === 'processing'

  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-2xl border-2 px-4 py-4 shadow-md',
        'border-[color:color-mix(in_srgb,var(--ma-primary)_55%,var(--ma-border-strong))]',
        'bg-[color-mix(in_srgb,var(--ma-primary)_8%,var(--ma-surface))]',
        busy && 'ring-2 ring-[color:color-mix(in_srgb,var(--ma-primary)_35%,transparent)]'
      )}
      aria-live="polite"
      aria-busy={busy}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1 overflow-hidden rounded-t-2xl bg-[var(--ma-border)]"
        aria-hidden
      >
        {busy ? (
          <div className="h-full w-1/3 animate-[ma-voice-progress_1.2s_ease-in-out_infinite] rounded-full bg-[color:var(--ma-primary)]" />
        ) : null}
      </div>

      <div className="flex items-start gap-3">
        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
            'bg-[color:color-mix(in_srgb,var(--ma-primary)_18%,var(--ma-surface))]',
            busy && 'animate-pulse'
          )}
        >
          {busy ? (
            <Loader2 className="h-5 w-5 animate-spin text-[color:var(--ma-primary)]" aria-hidden />
          ) : (
            <PhaseIcon phase={phase} />
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div>
            <p className="text-sm font-semibold text-[var(--ma-text)]">{copy.label}</p>
            <p className={cn('text-xs', ma.bodyMuted)}>{copy.hint}</p>
          </div>

          {showTranscript ? (
            <blockquote
              className={cn(
                'rounded-xl border-2 border-[var(--ma-border-strong)]',
                'bg-[var(--ma-surface)] px-4 py-3',
                'text-base font-medium leading-relaxed text-[var(--ma-text)]',
                phase === 'searching' && 'opacity-95'
              )}
            >
              <span className="sr-only">Transcribed question: </span>
              “{transcript.trim()}”
            </blockquote>
          ) : phase === 'transcribing' || phase === 'processing' ? (
            <div
              className={cn(
                'rounded-xl border border-dashed border-[var(--ma-border-strong)]',
                'bg-[var(--ma-surface-muted)] px-4 py-6',
                'flex items-center justify-center gap-2 text-sm text-[var(--ma-text-muted)]'
              )}
            >
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              <span>Waiting for transcription…</span>
            </div>
          ) : null}

          {phase === 'listening' && onStopRecording ? (
            <Button
              type="button"
              size="lg"
              className={cn(
                'mt-1 w-full gap-2 font-semibold',
                ma.btnPrimary,
                'shadow-md'
              )}
              onClick={onStopRecording}
            >
              <Square className="h-4 w-4 fill-current" aria-hidden />
              Stop recording
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  )
}
