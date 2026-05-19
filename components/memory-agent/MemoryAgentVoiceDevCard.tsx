'use client'

import { Loader2, Mic, Square } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useVoiceRecorder } from '@/hooks/memory-agent/useVoiceRecorder'
import { ma } from '@/lib/memory-agent/ui-tokens'
import { cn } from '@/lib/utils'

type MemoryAgentVoiceDevCardProps = {
  voice: ReturnType<typeof useVoiceRecorder>
  ready: boolean
  onUseTranscript: (text: string) => void
}

/** Step-by-step voice capture for developer / operator mode. */
export function MemoryAgentVoiceDevCard({ voice, ready, onUseTranscript }: MemoryAgentVoiceDevCardProps) {
  return (
    <Card className={cn('mb-6', ma.card)}>
      <CardContent className="space-y-3 p-4 text-sm">
        <p className={cn('font-medium', ma.body)}>Ask by voice (step-by-step)</p>
        <p className={ma.caption}>
          Record → Stop → Transcribe → Use this question → send with <strong>Ask</strong> in the bar
          below. Public kiosk mode auto-transcribes and sends after stop.
        </p>
        {!voice.isSupported ? (
          <p className="text-xs text-amber-800 dark:text-amber-200">
            Recording is unavailable in this browser or without HTTPS.
          </p>
        ) : null}
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="gap-1"
            disabled={!ready || !voice.isSupported || voice.isRecording || voice.transcribing}
            onClick={() => void voice.startRecording()}
          >
            <Mic className="h-4 w-4" />
            Record
          </Button>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            className="gap-1"
            disabled={!voice.isRecording}
            onClick={() => voice.stopRecording()}
          >
            <Square className="h-4 w-4" />
            Stop
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={!voice.blob || voice.transcribing || voice.isRecording}
            onClick={() => void voice.transcribe()}
            className={ma.btnPrimary}
          >
            {voice.transcribing ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Transcribe
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            disabled={!voice.blob && !voice.transcript && !voice.isRecording && !voice.stream}
            onClick={() => voice.clear()}
          >
            Clear audio
          </Button>
        </div>
        {voice.transcript ? (
          <div className={cn('space-y-2 p-3', ma.cardInset)}>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--ma-text-muted)]">
              Transcript preview
            </p>
            <p className={cn('whitespace-pre-wrap', ma.body)}>{voice.transcript}</p>
            <Button
              type="button"
              size="sm"
              className={ma.btnPrimary}
              onClick={() => onUseTranscript(voice.transcript)}
            >
              Use this question
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
