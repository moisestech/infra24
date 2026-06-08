'use client'

import { Mic2 } from 'lucide-react'

import { MemoryAgentConnectionStatus } from '@/components/memory-agent/MemoryAgentConnectionStatus'
import { MemoryAgentGeneratedAssetsQueue } from '@/components/memory-agent/MemoryAgentGeneratedAssetsQueue'
import { MemoryAgentModeSelect } from '@/components/memory-agent/MemoryAgentModeSelect'
import { MemoryAgentVoiceDevCard } from '@/components/memory-agent/MemoryAgentVoiceDevCard'
import { MemoryAgentVoiceOutputPanel } from '@/components/memory-agent/MemoryAgentVoiceOutputPanel'
import { useVoiceRecorder } from '@/hooks/memory-agent/useVoiceRecorder'
import { ma } from '@/lib/memory-agent/ui-tokens'
import { cn } from '@/lib/utils'
import type {
  MemoryAgentAssetsSource,
  MemoryAgentGeneratedAsset,
  MemoryAgentGeneratedAssetStatus,
  MemoryAgentMode,
  MemoryAgentStatusPayload,
} from '@/types/memory-agent'

type MemoryAgentDevPanelProps = {
  slug: string
  mode: MemoryAgentMode
  onModeChange: (mode: MemoryAgentMode) => void
  status: MemoryAgentStatusPayload | null
  ready: boolean
  voice: ReturnType<typeof useVoiceRecorder>
  onUseTranscript: (text: string) => void
  autoSpeakAnswers: boolean
  onAutoSpeakChange: (on: boolean) => void
  voiceLoading: boolean
  hasAssistantAnswer: boolean
  onReplayLastAnswer: () => void
  assets: MemoryAgentGeneratedAsset[]
  assetsSource: MemoryAgentAssetsSource
  hydrated: boolean
  onSetAssetStatus: (id: string, status: MemoryAgentGeneratedAssetStatus) => void | Promise<void>
  onMakePublicHandoff?: (id: string) => void | Promise<void>
}

export function MemoryAgentDevPanel({
  slug,
  mode,
  onModeChange,
  status,
  ready,
  voice,
  onUseTranscript,
  autoSpeakAnswers,
  onAutoSpeakChange,
  voiceLoading,
  hasAssistantAnswer,
  onReplayLastAnswer,
  assets,
  assetsSource,
  hydrated,
  onSetAssetStatus,
  onMakePublicHandoff,
}: MemoryAgentDevPanelProps) {
  return (
    <details className={cn('mb-8', ma.details)} open>
      <summary className="cursor-pointer font-medium text-[var(--ma-text)] outline-none marker:text-[var(--ma-text-muted)]">
        Developer tools
        <span className="ml-2 text-xs font-normal text-[var(--ma-text-muted)]">(?dev=1)</span>
      </summary>
      <div className="mt-4 space-y-6 border-t border-[var(--ma-border)] pt-4">
        <MemoryAgentModeSelect value={mode} onChange={onModeChange} disabled={voice.isRecording} />

        {status &&
        ((status.dataConfigured && status.openaiConfigured) ||
          status.airtableProgrammingConfigured) ? (
          <MemoryAgentConnectionStatus status={status} />
        ) : null}

        <MemoryAgentVoiceOutputPanel
          status={status}
          orgSlug={slug}
          autoSpeakAnswers={autoSpeakAnswers}
          onAutoSpeakChange={onAutoSpeakChange}
          voiceLoading={voiceLoading}
          canReplayLastAnswer={hasAssistantAnswer}
          onReplayLastAnswer={onReplayLastAnswer}
        />

        <MemoryAgentVoiceDevCard voice={voice} ready={ready} onUseTranscript={onUseTranscript} />

        {hydrated ? (
          <MemoryAgentGeneratedAssetsQueue
            assets={assets}
            orgSlug={slug}
            mode={mode}
            assetsSource={assetsSource}
            onSetStatus={onSetAssetStatus}
            onMakePublicHandoff={onMakePublicHandoff}
          />
        ) : null}

        <p className={cn('text-center text-[10px]', ma.finePrint)}>
          <Mic2 className="mr-1 inline h-3 w-3" />
          Memory Wave levels use the Web Audio API. Voice replies use ElevenLabs when configured.
        </p>
      </div>
    </details>
  )
}
