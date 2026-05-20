'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AlertCircle, Loader2, Mic, Send, Square, Volume2 } from 'lucide-react'

import { useOrganizationTheme } from '@/components/carousel/OrganizationThemeContext'
import { useTheme } from '@/contexts/ThemeContext'
import { useMemoryAgentChat } from '@/hooks/memory-agent/useMemoryAgentChat'
import { useMemoryAgentDevMode } from '@/hooks/memory-agent/useMemoryAgentDevMode'
import { useMemoryAgentGeneratedAssets } from '@/hooks/memory-agent/useMemoryAgentGeneratedAssets'
import { useMemoryAgentStatus } from '@/hooks/memory-agent/useMemoryAgentStatus'
import { useMemoryAgentVoice } from '@/hooks/memory-agent/useMemoryAgentVoice'
import { usePlaybackWaveform, useStreamWaveform } from '@/hooks/memory-agent/usePlaybackWaveform'
import { useVoiceRecorder } from '@/hooks/memory-agent/useVoiceRecorder'
import {
  UnifiedNavigation,
  bakehouseConfig,
  madartsConfig,
  ooliteConfig,
  sohohouseConfig,
} from '@/components/navigation'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { MemoryAgentAvailabilityBanner } from '@/components/memory-agent/MemoryAgentAvailabilityBanner'
import { InstitutionalArtistCard } from '@/components/institutional-artist/InstitutionalArtistCard'
import { institutionalArtistFromMemoryAgent } from '@/lib/institutional-artist/card-model'
import { memoryAgentAlumniProfileUrl } from '@/lib/memory-agent/result-links'
import { AlumniCatalogueModeToggle } from '@/components/organization/AlumniCatalogueModeToggle'
import { MemoryAgentAudioOrb } from '@/components/memory-agent/MemoryAgentAudioOrb'
import { MemoryAgentDevPanel } from '@/components/memory-agent/MemoryAgentDevPanel'
import { MemoryAgentFrequencyCanvas } from '@/components/memory-agent/MemoryAgentFrequencyCanvas'
import { MemoryAgentContextInspectorPanel } from '@/components/memory-agent/MemoryAgentContextInspector'
import { MemoryAgentOutputTabs } from '@/components/memory-agent/MemoryAgentOutputTabs'
import { MemoryAgentSettingsSheet } from '@/components/memory-agent/MemoryAgentSettingsSheet'
import { MemoryAgentSignageDraft } from '@/components/memory-agent/MemoryAgentSignageDraft'
import { MemoryAgentWaveformStrip } from '@/components/memory-agent/MemoryAgentWaveformStrip'
import { MemoryAgentDataGapActions } from '@/components/memory-agent/MemoryAgentDataGapActions'
import { MemoryAgentEventCards } from '@/components/memory-agent/MemoryAgentEventCards'
import { MemoryAgentReadyPanel } from '@/components/memory-agent/MemoryAgentReadyPanel'
import { MemoryPulse } from '@/components/memory-agent/MemoryPulse'
import { MemoryAgentSuggestedQuestions } from '@/components/memory-agent/MemoryAgentSuggestedQuestions'
import {
  MemoryAgentVoicePipelineCard,
  type VoicePipelinePhase,
} from '@/components/memory-agent/MemoryAgentVoicePipelineCard'
import { MemoryWaveCanvas } from '@/components/memory-agent/MemoryWaveCanvas'
import { createMemoryAgentAudioVizPalette } from '@/lib/memory-agent/audio-viz-palette'
import { isStaffOperatorMode } from '@/lib/memory-agent/mode'
import { getMemoryAgentBranding } from '@/lib/memory-agent/org-branding'
import { buildMemoryAgentBrandVars, ma } from '@/lib/memory-agent/ui-tokens'
import { getTenantConfig } from '@/lib/tenant'
import { cn } from '@/lib/utils'
import {
  buildEventSummaryAsset,
  buildLeadershipInsightAsset,
  buildPublicOutputAsset,
  buildQrHandoffAsset,
  buildSignageDraftAsset,
  buildSignageDraftFromEventCard,
  buildStaffBriefAsset,
  getMemoryAgentHandoffAbsoluteUrl,
} from '@/lib/memory-agent/generated-assets'
import { buildSaveAssetTraceMetadata } from '@/lib/memory-agent/save-asset-trace'
import { getSourceQuestionForAssistantMessage } from '@/lib/memory-agent/message-source'
import type {
  AgentState,
  MemoryAgentAssistantMessage,
  MemoryAgentEventCard,
  MemoryAgentUserMessage,
} from '@/types/memory-agent'

function getNavigationConfig(slug: string) {
  switch (slug) {
    case 'oolite':
      return ooliteConfig
    case 'bakehouse':
      return bakehouseConfig
    case 'madarts':
      return madartsConfig
    case 'sohohouse':
      return sohohouseConfig
    default:
      return ooliteConfig
  }
}

function deriveAgentAudioState(args: {
  statusError: string | null
  voiceError: string | null
  transcribing: boolean
  loading: boolean
  voiceLoading: boolean
  isPlayingVoice: boolean
  isRecording: boolean
}): AgentState {
  if (args.statusError || args.voiceError) return 'error'
  if (args.transcribing) return 'transcribing'
  if (args.loading) return 'searching'
  if (args.voiceLoading) return 'thinking'
  if (args.isPlayingVoice) return 'speaking'
  if (args.isRecording) return 'listening'
  return 'idle'
}

function levelsRms(levels: number[]): number {
  if (!levels.length) return 0
  let s = 0
  for (const v of levels) s += v
  return Math.min(1, (s / levels.length) * 1.8)
}

export function MemoryAgentClient({
  slug,
  orgName,
}: {
  slug: string
  orgName: string
}) {
  const { theme, organizationSlug } = useOrganizationTheme()
  const { resolvedTheme } = useTheme()

  const { status, statusError, isLoading: statusLoading } = useMemoryAgentStatus(slug)
  const { playVoice, voiceLoading, voiceError: playbackVoiceError, audioRef, isPlayingVoice } =
    useMemoryAgentVoice(slug, status?.elevenLabsConfigured ?? false)

  const autoSpeakStorageKey = `memory-agent-auto-speak-${slug}`
  const [autoSpeakAnswers, setAutoSpeakAnswers] = useState(true)

  useEffect(() => {
    const stored = window.localStorage.getItem(autoSpeakStorageKey)
    if (stored === '0') setAutoSpeakAnswers(false)
    else if (stored === '1') setAutoSpeakAnswers(true)
  }, [autoSpeakStorageKey])

  const persistAutoSpeak = useCallback(
    (on: boolean) => {
      setAutoSpeakAnswers(on)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(autoSpeakStorageKey, on ? '1' : '0')
      }
    },
    [autoSpeakStorageKey]
  )

  const dataReadinessStorageKey = `memory-agent-show-data-readiness-${slug}`
  const [showDataReadiness, setShowDataReadiness] = useState(false)

  useEffect(() => {
    const stored = window.localStorage.getItem(dataReadinessStorageKey)
    if (stored === '1') setShowDataReadiness(true)
    else if (stored === '0') setShowDataReadiness(false)
  }, [dataReadinessStorageKey])

  const persistShowDataReadiness = useCallback(
    (on: boolean) => {
      setShowDataReadiness(on)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(dataReadinessStorageKey, on ? '1' : '0')
      }
    },
    [dataReadinessStorageKey]
  )

  const voice = useVoiceRecorder(slug)
  const micStream = voice.stream
  const inputLevels = useStreamWaveform(micStream)

  const outputLevels = usePlaybackWaveform(audioRef)

  const orgSurfaceTheme = useMemo(() => {
    if (slug === 'sohohouse') {
      const primary = '#c8a878'
      const secondary = '#a89070'
      const accent = '#e8dcc8'
      return {
        primary,
        secondary,
        accent,
        vars: buildMemoryAgentBrandVars({
          primary,
          secondary,
          accent,
          surface: '#0c0a09',
        }),
      }
    }
    const tenant = getTenantConfig(slug)?.theme
    const matchOrgTheme = organizationSlug === slug && theme?.colors
    const primary = matchOrgTheme
      ? theme.colors.primary
      : tenant?.primaryColor ?? '#0891b2'
    const secondary = matchOrgTheme
      ? theme.colors.secondary
      : tenant?.secondaryColor ?? '#155e75'
    const accent = matchOrgTheme ? theme.colors.accent : tenant?.accentColor ?? '#22d3ee'
    const surface = matchOrgTheme ? theme.colors.surface : undefined
    return {
      primary,
      secondary,
      accent,
      vars: buildMemoryAgentBrandVars({ primary, secondary, accent, surface }),
    }
  }, [slug, organizationSlug, theme])

  const audioVizPalette = useMemo(
    () =>
      createMemoryAgentAudioVizPalette({
        primary: orgSurfaceTheme.primary,
        secondary: orgSurfaceTheme.secondary,
        accent: orgSurfaceTheme.accent,
      }),
    [orgSurfaceTheme.primary, orgSurfaceTheme.secondary, orgSurfaceTheme.accent]
  )

  const playVoiceRef = useRef(playVoice)
  useEffect(() => {
    playVoiceRef.current = playVoice
  }, [playVoice])

  const elevenLabsRef = useRef(false)
  const autoSpeakRef = useRef(true)
  useEffect(() => {
    elevenLabsRef.current = status?.elevenLabsConfigured ?? false
  }, [status])
  useEffect(() => {
    autoSpeakRef.current = autoSpeakAnswers
  }, [autoSpeakAnswers])

  const handleAnswerComplete = useCallback((answerText: string) => {
    if (elevenLabsRef.current && autoSpeakRef.current) {
      void playVoiceRef.current(answerText)
    }
  }, [])

  const { isDevMode, enableDevMode, disableDevMode } = useMemoryAgentDevMode()

  const { mode, setMode, input, setInput, messages, loading, sendQuestion } = useMemoryAgentChat(slug, {
    onAnswerComplete: handleAnswerComplete,
  })

  const modeStorageKey = `memory-agent-mode-${slug}`

  useEffect(() => {
    if (!isDevMode) {
      if (mode !== 'public') setMode('public')
      return
    }
    const stored = window.localStorage.getItem(modeStorageKey)
    if (stored === 'staff_operator' || stored === 'public') setMode(stored)
  }, [isDevMode, mode, modeStorageKey, setMode])

  useEffect(() => {
    if (!isDevMode) return
    window.localStorage.setItem(modeStorageKey, mode)
  }, [isDevMode, mode, modeStorageKey])

  const autoVoicePipelineRef = useRef(false)
  const askInputRef = useRef<HTMLInputElement>(null)
  /** Keeps transcribed question visible through search until the answer returns */
  const [voicePipelineText, setVoicePipelineText] = useState<string | null>(null)
  /** Covers transcribe → ask handoff so UI never shows a manual “review” step */
  const [voiceAutoSending, setVoiceAutoSending] = useState(false)

  const handleMicToggle = useCallback(() => {
    if (voice.isRecording) {
      autoVoicePipelineRef.current = true
      voice.stopRecording()
    } else {
      void voice.startRecording()
    }
  }, [voice])

  const staffMode = isStaffOperatorMode(mode)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const raw = new URLSearchParams(window.location.search).get('q')
    const q = raw?.trim()
    if (!q) return
    try {
      setInput(decodeURIComponent(q))
    } catch {
      setInput(q)
    }
  }, [slug, setInput])

  const { assets, addAsset, setAssetStatus, makePublicHandoff, hydrated, assetsSource } =
    useMemoryAgentGeneratedAssets(slug)

  const [signageHandoffPreviewByMessageId, setSignageHandoffPreviewByMessageId] = useState<
    Record<string, { signage?: string; qr?: string }>
  >({})

  const agentAudioState = useMemo(
    () =>
      deriveAgentAudioState({
        statusError,
        voiceError: voice.error || playbackVoiceError,
        transcribing: voice.transcribing,
        loading,
        voiceLoading,
        isPlayingVoice,
        isRecording: voice.isRecording,
      }),
    [
      statusError,
      voice.error,
      playbackVoiceError,
      voice.transcribing,
      loading,
      voiceLoading,
      isPlayingVoice,
      voice.isRecording,
    ]
  )

  const inputRms = useMemo(() => levelsRms(inputLevels), [inputLevels])
  const outputRms = useMemo(() => levelsRms(outputLevels), [outputLevels])
  const orbLevel =
    agentAudioState === 'speaking' || voiceLoading ? outputRms : inputRms

  const heroFrequency = useMemo(() => {
    if (micStream) {
      return {
        variant: 'input' as const,
        levels: inputLevels,
        active: true,
        synthesizing: false,
      }
    }
    if (isPlayingVoice) {
      return {
        variant: 'output' as const,
        levels: outputLevels,
        active: true,
        synthesizing: false,
      }
    }
    if (voiceLoading) {
      return {
        variant: 'output' as const,
        levels: outputLevels,
        active: false,
        synthesizing: true,
      }
    }
    return {
      variant: 'idle' as const,
      levels: inputLevels,
      active: false,
      synthesizing: false,
    }
  }, [micStream, isPlayingVoice, voiceLoading, inputLevels, outputLevels])

  const agentBranding = useMemo(() => getMemoryAgentBranding(slug), [slug])
  const tagline = status?.branding?.tagline ?? agentBranding.tagline
  const voicePlaybackReady = Boolean(status?.elevenLabsConfigured)
  const chips = status?.branding?.suggestedQuestions ?? agentBranding.suggestedQuestions
  const hasUserMessage = messages.some((m) => m.role === 'user')

  const ready =
    status?.dataConfigured &&
    status?.openaiConfigured

  useEffect(() => {
    if (!autoVoicePipelineRef.current) return
    if (voice.isRecording || !voice.blob) return

    // Consume immediately so transcribing state changes do not re-enter this effect.
    autoVoicePipelineRef.current = false
    const blob = voice.blob
    let cancelled = false

    void (async () => {
      if (!ready) {
        voice.clear()
        return
      }
      const text = await voice.transcribeBlob(blob)
      if (cancelled) return
      if (!text) {
        voice.clear()
        return
      }
      setVoicePipelineText(text)
      setVoiceAutoSending(true)
      setInput(text)
      const sent = await sendQuestion(text, { keepInput: true })
      if (!sent) {
        setVoiceAutoSending(false)
        setVoicePipelineText(null)
        voice.clear()
      }
    })()

    return () => {
      cancelled = true
    }
  }, [voice.blob, voice.isRecording, ready, sendQuestion, voice, setInput])

  useEffect(() => {
    if (loading) return
    if (!voicePipelineText && !voiceAutoSending) return
    setVoicePipelineText(null)
    setVoiceAutoSending(false)
    setInput('')
    voice.clear()
  }, [loading, voicePipelineText, voiceAutoSending, voice, setInput])

  const voicePipelineTranscript =
    voicePipelineText?.trim() ||
    ((voiceAutoSending || loading) && voice.transcript?.trim()) ||
    ''

  const voicePipelinePhase = useMemo((): VoicePipelinePhase | null => {
    if (voice.isRecording) return 'listening'
    if (voice.transcribing) return 'transcribing'
    if (voice.blob && !voice.transcript && !voice.transcribing && !voice.isRecording) {
      return 'processing'
    }
    if (voicePipelineTranscript && (loading || voiceAutoSending)) return 'searching'
    return null
  }, [
    voice.isRecording,
    voice.transcribing,
    voice.blob,
    voice.transcript,
    voice.isRecording,
    loading,
    voicePipelineTranscript,
    voiceAutoSending,
  ])

  const voicePipelineSending = voiceAutoSending && !loading

  const hasAssistantAnswer = messages.some((m) => m.role === 'assistant')

  const replayLastAnswer = useCallback(() => {
    const last = [...messages]
      .reverse()
      .find((m): m is MemoryAgentAssistantMessage => m.role === 'assistant')
    if (last?.content) void playVoice(last.content)
  }, [messages, playVoice])

  const replayWelcome = useCallback(() => {
    const first = messages[0]
    if (first?.role === 'assistant' && first.content) void playVoice(first.content)
  }, [messages, playVoice])

  const focusAskInput = useCallback(() => {
    askInputRef.current?.focus()
    askInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [])

  const voiceInputDisabled =
    !ready || !voice.isSupported || loading || voice.transcribing || voice.isRecording

  return (
    <div
      className={ma.themeRoot}
      style={orgSurfaceTheme.vars}
      data-ma-theme={slug === 'sohohouse' ? 'dark' : resolvedTheme}
      data-ma-variant={slug === 'sohohouse' ? 'soho' : undefined}
    >
        <UnifiedNavigation config={getNavigationConfig(slug)} />
        <main
          className={cn(
            'mx-auto max-w-3xl px-4 pt-8 md:pt-10',
            hasUserMessage ? 'pb-28' : 'pb-[min(22rem,42vh)] sm:pb-72'
          )}
        >
          <div className="mb-6 flex flex-col gap-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className={cn(ma.heading, 'text-2xl md:text-3xl')}>
                  {agentBranding.productTitle}
                </h1>
                <p className="mt-1 text-sm font-medium text-[var(--ma-text)]">
                  Guided by{' '}
                  <span className="text-[color:var(--ma-primary)]">{agentBranding.agentName}</span>
                </p>
                <p className={cn(ma.subheading, 'mt-1 max-w-xl')}>{tagline}</p>
                <p className="mt-2 text-sm">
                  <Link
                    href={`/o/${slug}/memory-agent/about`}
                    className="font-medium text-[color:var(--ma-primary)] hover:underline"
                  >
                    How it works
                  </Link>
                </p>
              </div>
              <AlumniCatalogueModeToggle slug={slug} mode="voice" />
            </div>
            <div className="flex justify-end">
              <MemoryAgentSettingsSheet
                orgSlug={slug}
                autoSpeakAnswers={autoSpeakAnswers}
                onAutoSpeakChange={persistAutoSpeak}
                showDataReadiness={showDataReadiness}
                onShowDataReadinessChange={persistShowDataReadiness}
                voiceAvailable={voicePlaybackReady}
                isDevMode={isDevMode}
                onEnableDevMode={enableDevMode}
                onDisableDevMode={disableDevMode}
              />
            </div>
          </div>

          {isDevMode && statusError ? (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{statusError}</AlertDescription>
            </Alert>
          ) : null}

          <MemoryAgentAvailabilityBanner
            ready={Boolean(ready)}
            status={status}
            statusLoading={statusLoading}
            devMode={isDevMode}
          />

          {isDevMode && playbackVoiceError ? (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{playbackVoiceError}</AlertDescription>
            </Alert>
          ) : null}

          {isDevMode ? (
            <MemoryAgentDevPanel
              slug={slug}
              mode={mode}
              onModeChange={setMode}
              status={status}
              ready={Boolean(ready)}
              voice={voice}
              onUseTranscript={setInput}
              autoSpeakAnswers={autoSpeakAnswers}
              onAutoSpeakChange={persistAutoSpeak}
              voiceLoading={voiceLoading}
              hasAssistantAnswer={hasAssistantAnswer}
              onReplayLastAnswer={replayLastAnswer}
              assets={assets}
              assetsSource={assetsSource}
              hydrated={hydrated}
              onSetStatus={setAssetStatus}
              onMakePublicHandoff={makePublicHandoff}
            />
          ) : null}

          {!isDevMode && voice.error ? (
            <Alert className={cn('mb-4', ma.alertAmber)} role="status">
              <AlertDescription>
                {ready
                  ? voice.error
                  : 'Voice and answers are not available yet. You can still type your question below.'}
              </AlertDescription>
            </Alert>
          ) : null}

          {isDevMode && voice.error ? (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{voice.error}</AlertDescription>
            </Alert>
          ) : null}

          <div className={ma.vizDock}>
            <MemoryAgentFrequencyCanvas
              className="mb-0"
              levels={heroFrequency.levels}
              active={heroFrequency.active}
              variant={heroFrequency.variant}
              synthesizing={heroFrequency.synthesizing}
              palette={audioVizPalette}
              height={148}
            />
            <MemoryAgentAudioOrb state={agentAudioState} levelRms={orbLevel} />
            {voicePipelinePhase ? (
              <MemoryAgentVoicePipelineCard
                phase={voicePipelinePhase}
                transcript={voicePipelineTranscript || undefined}
                sending={voicePipelineSending}
                onStopRecording={
                  voicePipelinePhase === 'listening' ? handleMicToggle : undefined
                }
              />
            ) : agentAudioState === 'idle' ? (
              <MemoryAgentReadyPanel
                agentName={agentBranding.agentName}
                ready={Boolean(ready)}
                voiceSupported={voice.isSupported}
                voiceDisabled={voiceInputDisabled}
                onAskByVoice={handleMicToggle}
                onTypeQuestion={focusAskInput}
              />
            ) : (
              <MemoryPulse state={agentAudioState} copyOverrides={agentBranding.pulseCopy} />
            )}
          </div>

          <div className="space-y-4">
            {messages.map((msg, msgIndex) => (
              <div
                key={msg.id}
                className={cn(
                  'flex w-full',
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <Card
                  className={cn(
                    msg.role === 'user' ? ma.userBubble : ma.assistantBubble
                  )}
                >
                  <CardContent className="p-4 text-sm">
                    {msg.role === 'user' ? (
                      <>
                        <p className={ma.messageRoleYou}>You</p>
                        <p className={cn('whitespace-pre-wrap', ma.body)}>
                          {(msg as MemoryAgentUserMessage).content}
                        </p>
                      </>
                    ) : (
                      (() => {
                        const a = msg as MemoryAgentAssistantMessage
                        const hasRightPanel = staffMode && !!(a.outputs || a.signageDraft)
                        const sourceQuestion = getSourceQuestionForAssistantMessage(messages, a.id)
                        const saveCtx = sourceQuestion
                          ? { sourceQuestion, sourceMessageId: a.id }
                          : undefined
                        const outputKindsForTrace = [
                          a.outputs?.public ? 'public' : null,
                          a.outputs?.staff ? 'staff' : null,
                          a.outputs?.leadership ? 'leadership' : null,
                          a.signageDraft ? 'signage' : null,
                        ].filter((x): x is string => x != null)
                        const handoffPreviewUrl =
                          signageHandoffPreviewByMessageId[a.id]?.qr ??
                          signageHandoffPreviewByMessageId[a.id]?.signage
                        const isWelcomeMessage = msgIndex === 0 && !hasUserMessage
                        return (
                          <>
                            <div
                              className={cn(
                                hasRightPanel && 'lg:grid lg:grid-cols-2 lg:items-start lg:gap-6'
                              )}
                            >
                            <div className="min-w-0 space-y-4">
                              <div className="flex flex-wrap items-start justify-between gap-3">
                                <div className="min-w-0 flex-1">
                                  <p className={ma.messageRoleAgent}>
                                    {agentBranding.agentDisplayName ?? agentBranding.agentName}
                                  </p>
                                  <p className={cn('whitespace-pre-wrap', ma.body)}>{a.content}</p>
                                </div>
                                {isWelcomeMessage ? (
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    className={cn('shrink-0 gap-1.5', ma.btnOutline)}
                                    disabled={
                                      !voicePlaybackReady || voiceLoading || isPlayingVoice
                                    }
                                    onClick={replayWelcome}
                                  >
                                    {voiceLoading ? (
                                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                                    ) : (
                                      <Volume2 className="h-4 w-4" aria-hidden />
                                    )}
                                    Listen
                                  </Button>
                                ) : null}
                              </div>
                              {a.artists && a.artists.length > 0 ? (
                                <ul className="grid gap-3 sm:grid-cols-2">
                                  {a.artists.map((artist) => (
                                    <li key={artist.id}>
                                      <InstitutionalArtistCard
                                        data={{
                                          ...institutionalArtistFromMemoryAgent(artist),
                                          profileUrl: memoryAgentAlumniProfileUrl(slug, {
                                            name: artist.name,
                                            id: artist.id,
                                          }),
                                        }}
                                        variant="memory-agent"
                                      />
                                    </li>
                                  ))}
                                </ul>
                              ) : null}
                              {a.events && a.events.length > 0 ? (
                                <div className="space-y-2">
                                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--ma-text-muted)]">
                                    Experiences &amp; programming
                                  </p>
                                  <MemoryAgentEventCards
                                    events={a.events}
                                    orgSlug={slug}
                                    mode={mode}
                                    onAskFollowUp={(q) => void sendQuestion(q)}
                                    onCreateSignageDraft={
                                      saveCtx && staffMode
                                        ? async (ev: MemoryAgentEventCard) => {
                                            await addAsset({
                                              ...buildSignageDraftFromEventCard(ev, slug, saveCtx),
                                              metadata: buildSaveAssetTraceMetadata({
                                                sourceMode: mode,
                                                assetType: 'signage_draft',
                                                sourceQuestion: saveCtx.sourceQuestion,
                                                sourceMessageId: saveCtx.sourceMessageId,
                                                contextInspector:
                                                  mode === 'staff_operator'
                                                    ? a.contextInspector
                                                    : undefined,
                                                outputKinds: ['signage', 'event_card'],
                                              }),
                                            })
                                          }
                                        : undefined
                                    }
                                    onSaveAsAsset={
                                      saveCtx && staffMode
                                        ? async (ev: MemoryAgentEventCard) => {
                                            await addAsset({
                                              ...buildEventSummaryAsset(ev, slug, saveCtx),
                                              metadata: buildSaveAssetTraceMetadata({
                                                sourceMode: mode,
                                                assetType: 'public_output',
                                                sourceQuestion: saveCtx.sourceQuestion,
                                                sourceMessageId: saveCtx.sourceMessageId,
                                                contextInspector:
                                                  mode === 'staff_operator'
                                                    ? a.contextInspector
                                                    : undefined,
                                                outputKinds: ['event_card'],
                                              }),
                                            })
                                          }
                                        : undefined
                                    }
                                  />
                                </div>
                              ) : null}
                              {showDataReadiness &&
                              (a.structuredDataGaps?.length || a.dataGaps?.length) ? (
                                <MemoryAgentDataGapActions
                                  gaps={a.structuredDataGaps ?? []}
                                  mode={mode}
                                  fallbackStrings={
                                    a.structuredDataGaps?.length ? [] : a.dataGaps
                                  }
                                />
                              ) : null}
                              {a.followUps && a.followUps.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                  {a.followUps.map((f) => (
                                    <button
                                      key={f}
                                      type="button"
                                      className={cn('rounded-full px-3 py-1', ma.chip)}
                                      onClick={() => void sendQuestion(f)}
                                    >
                                      {f}
                                    </button>
                                  ))}
                                </div>
                              ) : null}
                            </div>
                            {hasRightPanel ? (
                              <div className="mt-6 min-w-0 space-y-6 lg:mt-0 lg:sticky lg:top-24 lg:self-start">
                                {a.outputs ? (
                                  <MemoryAgentOutputTabs
                                    outputs={a.outputs}
                                    mode={mode}
                                    saveContext={saveCtx}
                                    onSavePublic={
                                      saveCtx
                                        ? () =>
                                            void addAsset({
                                              ...buildPublicOutputAsset(a.outputs!.public, slug, saveCtx),
                                              metadata: buildSaveAssetTraceMetadata({
                                                sourceMode: mode,
                                                assetType: 'public_output',
                                                sourceQuestion: saveCtx.sourceQuestion,
                                                sourceMessageId: saveCtx.sourceMessageId,
                                                contextInspector:
                                                  mode === 'staff_operator' ? a.contextInspector : undefined,
                                                outputKinds: outputKindsForTrace,
                                              }),
                                            })
                                        : undefined
                                    }
                                    onSaveStaff={
                                      saveCtx && mode === 'staff_operator' && a.outputs.staff
                                        ? () =>
                                            void addAsset({
                                              ...buildStaffBriefAsset(a.outputs.staff!, slug, saveCtx),
                                              metadata: buildSaveAssetTraceMetadata({
                                                sourceMode: mode,
                                                assetType: 'staff_brief',
                                                sourceQuestion: saveCtx.sourceQuestion,
                                                sourceMessageId: saveCtx.sourceMessageId,
                                                contextInspector: a.contextInspector,
                                                outputKinds: outputKindsForTrace,
                                              }),
                                            })
                                        : undefined
                                    }
                                    onSaveLeadership={
                                      saveCtx && mode === 'staff_operator' && a.outputs.leadership
                                        ? () =>
                                            void addAsset({
                                              ...buildLeadershipInsightAsset(
                                                a.outputs.leadership!,
                                                slug,
                                                saveCtx
                                              ),
                                              metadata: buildSaveAssetTraceMetadata({
                                                sourceMode: mode,
                                                assetType: 'leadership_insight',
                                                sourceQuestion: saveCtx.sourceQuestion,
                                                sourceMessageId: saveCtx.sourceMessageId,
                                                contextInspector: a.contextInspector,
                                                outputKinds: outputKindsForTrace,
                                              }),
                                            })
                                        : undefined
                                    }
                                  />
                                ) : null}
                                {staffMode && a.signageDraft ? (
                                  <MemoryAgentSignageDraft
                                    draft={a.signageDraft}
                                    handoffPreviewAbsoluteUrl={handoffPreviewUrl}
                                    onSaveSignage={
                                      saveCtx
                                        ? async () => {
                                            const built = buildSignageDraftAsset(
                                              a.signageDraft!,
                                              slug,
                                              saveCtx
                                            )
                                            const saved = await addAsset({
                                              ...built,
                                              metadata: buildSaveAssetTraceMetadata({
                                                sourceMode: mode,
                                                assetType: 'signage_draft',
                                                sourceQuestion: saveCtx.sourceQuestion,
                                                sourceMessageId: saveCtx.sourceMessageId,
                                                contextInspector:
                                                  mode === 'staff_operator' ? a.contextInspector : undefined,
                                                outputKinds: outputKindsForTrace,
                                              }),
                                            })
                                            if (typeof window !== 'undefined') {
                                              const url = getMemoryAgentHandoffAbsoluteUrl(
                                                window.location.origin,
                                                slug,
                                                saved.id
                                              )
                                              setSignageHandoffPreviewByMessageId((prev) => ({
                                                ...prev,
                                                [a.id]: { ...prev[a.id], signage: url },
                                              }))
                                            }
                                          }
                                        : undefined
                                    }
                                    onSaveQrHandoff={
                                      saveCtx
                                        ? async () => {
                                            const built = buildQrHandoffAsset(
                                              a.signageDraft!,
                                              slug,
                                              saveCtx
                                            )
                                            const saved = await addAsset({
                                              ...built,
                                              metadata: buildSaveAssetTraceMetadata({
                                                sourceMode: mode,
                                                assetType: 'qr_handoff',
                                                sourceQuestion: saveCtx.sourceQuestion,
                                                sourceMessageId: saveCtx.sourceMessageId,
                                                contextInspector:
                                                  mode === 'staff_operator' ? a.contextInspector : undefined,
                                                outputKinds: outputKindsForTrace,
                                              }),
                                            })
                                            if (typeof window !== 'undefined') {
                                              const url = getMemoryAgentHandoffAbsoluteUrl(
                                                window.location.origin,
                                                slug,
                                                saved.id
                                              )
                                              setSignageHandoffPreviewByMessageId((prev) => ({
                                                ...prev,
                                                [a.id]: { ...prev[a.id], qr: url },
                                              }))
                                            }
                                          }
                                        : undefined
                                    }
                                  />
                                ) : null}
                              </div>
                            ) : null}
                            </div>
                            {mode === 'staff_operator' && a.contextInspector ? (
                              <div className="mt-4 border-t border-[var(--ma-border)] pt-3">
                                <MemoryAgentContextInspectorPanel data={a.contextInspector} />
                              </div>
                            ) : null}
                          </>
                        )
                      })()
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>


          {!hasUserMessage ? (
            <div className="scroll-mt-24 pb-4">
              <MemoryAgentSuggestedQuestions
                questions={chips}
                onSelect={(q) => void sendQuestion(q)}
              />
            </div>
          ) : null}

        </main>

        <div className={ma.footer}>
          {voicePipelinePhase ? (
            <div
              className={cn(
                'mx-auto mb-3 flex max-w-3xl flex-col gap-2 rounded-xl border-2 px-3 py-2.5 lg:hidden',
                'border-[color:color-mix(in_srgb,var(--ma-primary)_50%,var(--ma-border))]',
                'bg-[color-mix(in_srgb,var(--ma-primary)_10%,var(--ma-footer-bg))]'
              )}
              aria-live="polite"
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--ma-text)]">
                <Loader2 className="h-4 w-4 shrink-0 animate-spin text-[color:var(--ma-primary)]" />
                <span>
                  {voicePipelineSending
                    ? 'Sending automatically…'
                    : voicePipelinePhase === 'searching'
                      ? 'Searching…'
                      : voicePipelinePhase === 'transcribing'
                        ? 'Transcribing…'
                        : voicePipelinePhase === 'listening'
                          ? 'Recording…'
                          : 'Processing…'}
                </span>
              </div>
              {voicePipelineTranscript ? (
                <p className="line-clamp-3 text-sm font-medium text-[var(--ma-text)]">
                  “{voicePipelineTranscript}”
                </p>
              ) : null}
            </div>
          ) : null}
          <div className="mx-auto mb-3 max-w-3xl space-y-2">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <MemoryWaveCanvas
                    levels={inputLevels}
                    active={!!micStream}
                    variant="input"
                    palette={audioVizPalette}
                  />
                  <MemoryWaveCanvas
                    levels={outputLevels}
                    active={isPlayingVoice}
                    variant="output"
                    palette={audioVizPalette}
                  />
                </div>
                <MemoryAgentWaveformStrip
                  inputLevels={inputLevels}
                  outputLevels={outputLevels}
                  inputActive={!!micStream}
                  outputStatus={
                    isPlayingVoice ? 'live' : voiceLoading ? 'loading' : 'idle'
                  }
                  palette={audioVizPalette}
                />
          </div>
          <div className="mx-auto flex max-w-3xl gap-2">
            <Button
              type="button"
              variant={voice.isRecording ? 'destructive' : 'outline'}
              size="icon"
              className={cn('h-11 w-11 shrink-0', ma.btnOutline)}
              disabled={!ready || !voice.isSupported || loading || voice.transcribing}
              title={
                !ready
                  ? 'Not available yet'
                  : voice.isRecording
                    ? 'Stop recording'
                    : 'Ask by voice'
              }
              onClick={handleMicToggle}
            >
              {voice.transcribing ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : voice.isRecording ? (
                <Square className="h-5 w-5" />
              ) : (
                <Mic className="h-5 w-5" />
              )}
            </Button>
            <Input
              ref={askInputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={agentBranding.inputPlaceholder}
              className={cn(ma.input, 'min-h-11')}
              disabled={!ready || loading || voice.isRecording || voice.transcribing}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  void sendQuestion(input)
                }
              }}
            />
            <Button
              type="button"
              disabled={!ready || loading || !input.trim() || voice.isRecording || voice.transcribing}
              title={!ready ? 'Not available yet' : !input.trim() ? 'Type or speak a question' : undefined}
              onClick={() => void sendQuestion(input)}
              className={cn('shrink-0 min-h-11', ma.btnPrimary)}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  <span className="font-semibold">Searching…</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" aria-hidden />
                  Ask
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={!hasAssistantAnswer || voiceLoading || !voicePlaybackReady}
              className={cn('h-11 w-11 shrink-0', ma.btnOutline)}
              title={
                !voicePlaybackReady
                  ? 'Spoken answers are not available yet'
                  : hasAssistantAnswer
                    ? 'Listen to last answer'
                    : 'Ask a question first'
              }
              onClick={replayLastAnswer}
            >
              {voiceLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </Button>
          </div>
          <audio ref={audioRef} className="hidden" controls={false} />
        </div>

    </div>
  )
}
