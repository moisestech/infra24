'use client'

import { Loader2, Volume2 } from 'lucide-react'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { ma } from '@/lib/memory-agent/ui-tokens'
import { cn } from '@/lib/utils'
import type { MemoryAgentStatusPayload } from '@/types/memory-agent'

type MemoryAgentVoiceOutputPanelProps = {
  status: MemoryAgentStatusPayload | null
  orgSlug: string
  autoSpeakAnswers: boolean
  onAutoSpeakChange: (on: boolean) => void
  voiceLoading: boolean
  canReplayLastAnswer: boolean
  onReplayLastAnswer: () => void
}

/**
 * Spoken-answer controls (ElevenLabs TTS). Shown in the main column so auto-speak
 * is not buried in the sticky footer.
 */
export function MemoryAgentVoiceOutputPanel({
  status,
  orgSlug,
  autoSpeakAnswers,
  onAutoSpeakChange,
  voiceLoading,
  canReplayLastAnswer,
  onReplayLastAnswer,
}: MemoryAgentVoiceOutputPanelProps) {
  const voiceEnvSuffix = orgSlug.replace(/-/g, '_').toUpperCase()

  if (!status) {
    return (
      <Card className={cn('mb-4', ma.card)}>
        <CardContent className="p-4">
          <div
            className="h-[7.5rem] animate-pulse rounded-lg bg-[var(--ma-surface-muted)]"
            aria-hidden
          />
        </CardContent>
      </Card>
    )
  }

  if (!status.elevenLabsApiKeyConfigured) {
    return (
      <Card className={cn('mb-4', ma.alertAmber)}>
        <CardContent className="space-y-2 p-4 text-sm">
          <p className={cn('font-medium', ma.body)}>Spoken answers (optional)</p>
          <p className={ma.caption}>
            Add <code className={ma.alertAmberCode}>ELEVENLABS_API_KEY</code> and{' '}
            <code className={ma.alertAmberCode}>ELEVENLABS_VOICE_ID</code> to enable
            text-to-speech replies, then restart the dev server.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (!status.elevenLabsConfigured) {
    return (
      <Alert className={cn('mb-4', ma.alertAmber)}>
        <AlertDescription className="text-sm">
          <span className="font-medium">Spoken answers almost ready.</span> API key is set; add{' '}
          <code className={ma.alertAmberCode}>ELEVENLABS_VOICE_ID</code> or{' '}
          <code className={ma.alertAmberCode}>ELEVENLABS_VOICE_ID_{voiceEnvSuffix}</code>{' '}
          from your ElevenLabs voice library, then restart the dev server.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Card className={cn('mb-4', ma.cardTinted)}>
      <CardContent className="space-y-3 p-4">
        <div>
          <p className={cn('text-sm font-medium', ma.body)}>Spoken answers</p>
          <p className={cn('mt-1', ma.caption)}>
            After you send a typed or transcribed question, the agent can read the reply aloud
            (ElevenLabs). This is separate from recording your question.
          </p>
        </div>
        <div
          suppressHydrationWarning
          className={cn(
            'flex flex-wrap items-center gap-3 rounded-lg border-2 px-3 py-2.5',
            autoSpeakAnswers
              ? 'border-[color:color-mix(in_srgb,var(--ma-primary)_55%,var(--ma-border))] bg-[color:color-mix(in_srgb,var(--ma-primary)_14%,var(--ma-surface))]'
              : 'border-[var(--ma-border-strong)] bg-[var(--ma-surface-muted)]'
          )}
        >
          <Switch
            id="memory-agent-auto-speak-main"
            checked={autoSpeakAnswers}
            onCheckedChange={onAutoSpeakChange}
            className={cn(
              'h-7 w-12 border-2 shadow-inner',
              'data-[state=unchecked]:border-[var(--ma-border-strong)] data-[state=unchecked]:bg-[var(--ma-surface-muted)]',
              'data-[state=checked]:border-[color:var(--ma-secondary)] data-[state=checked]:bg-[color:var(--ma-primary)]',
              '[&>span]:h-6 [&>span]:w-6 [&>span]:border [&>span]:border-[var(--ma-border)] [&>span]:bg-[var(--ma-surface)] [&>span]:shadow-md',
              'data-[state=checked]:[&>span]:translate-x-5 data-[state=unchecked]:[&>span]:translate-x-0'
            )}
          />
          <Label
            htmlFor="memory-agent-auto-speak-main"
            className={cn(
              'cursor-pointer text-sm font-semibold',
              autoSpeakAnswers ? 'text-[var(--ma-text)]' : 'text-[var(--ma-text-muted)]'
            )}
          >
            Speak answers automatically
          </Label>
          <span
            className={cn(
              'ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide',
              autoSpeakAnswers
                ? 'bg-[color:var(--ma-primary)] text-white'
                : 'bg-[var(--ma-border-strong)] text-[var(--ma-text)]'
            )}
          >
            {autoSpeakAnswers ? 'On' : 'Off'}
          </span>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className={cn('gap-1', ma.btnOutline)}
          disabled={voiceLoading || !canReplayLastAnswer}
          title={
            canReplayLastAnswer
              ? 'Play the last assistant answer as speech'
              : 'Ask a question first — replay is available after the first answer'
          }
          onClick={onReplayLastAnswer}
        >
          {voiceLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
          Listen to last answer
        </Button>
      </CardContent>
    </Card>
  )
}
