'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { logMemoryAgentAnswerDelivery } from '@/lib/memory-agent/log-answer-delivery'
import { parseClientOutputsFromApi, parseClientSignageFromApi } from '@/lib/memory-agent/outputs'
import { parseContextInspectorFromApi } from '@/lib/memory-agent/context-inspector'
import { getMemoryAgentBranding } from '@/lib/memory-agent/org-branding'
import {
  delayMs,
  resolveSuggestedQuestionHandoff,
  SUGGESTED_QUESTION_HANDOFF_PREFACE_DELAY_MS,
  SUGGESTED_QUESTION_HANDOFF_WELCOME_DELAY_MS,
} from '@/lib/memory-agent/suggested-question-handoff'
import { pickMemoryAgentWelcomeMessage } from '@/lib/memory-agent/welcome-messages'
import { parseStructuredDataGapsFromApi } from '@/lib/memory-agent/parse-structured-data-gaps'
import type { MemoryAgentArtistCard, MemoryAgentMessage, MemoryAgentMode } from '@/types/memory-agent'
import { createAssistantMessage, createUserMessage } from '@/types/memory-agent'

export type UseMemoryAgentChatOptions = {
  /** Called after a successful assistant reply (e.g. to trigger TTS). */
  onAnswerComplete?: (answerText: string) => void
  /** Called for each staged intro line during a suggested-question handoff (e.g. TTS). */
  onHandoffLine?: (line: string) => void
}

function hasPrefilledQuestionParam(): boolean {
  if (typeof window === 'undefined') return false
  return Boolean(new URLSearchParams(window.location.search).get('q')?.trim())
}

export function useMemoryAgentChat(
  orgSlug: string,
  options: UseMemoryAgentChatOptions = {}
) {
  const onAnswerCompleteRef = useRef(options.onAnswerComplete)
  const onHandoffLineRef = useRef(options.onHandoffLine)
  useEffect(() => {
    onAnswerCompleteRef.current = options.onAnswerComplete
    onHandoffLineRef.current = options.onHandoffLine
  }, [options.onAnswerComplete, options.onHandoffLine])

  const base = `/api/organizations/by-slug/${encodeURIComponent(orgSlug)}/memory-agent`

  const [mode, setMode] = useState<MemoryAgentMode>('public')
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<MemoryAgentMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [handoffInProgress, setHandoffInProgress] = useState(false)

  const loadingRef = useRef(false)
  const handoffRunningRef = useRef(false)
  useEffect(() => {
    loadingRef.current = loading
  }, [loading])

  useEffect(() => {
    const branding = getMemoryAgentBranding(orgSlug)
    if (hasPrefilledQuestionParam()) {
      setMessages([])
      return
    }
    setMessages([createAssistantMessage({ content: pickMemoryAgentWelcomeMessage(branding) })])
  }, [orgSlug])

  const ASK_TIMEOUT_MS = 65_000

  const sendQuestion = useCallback(
    async (question: string, options?: { keepInput?: boolean }): Promise<boolean> => {
      const q = question.trim()
      if (!q || loadingRef.current) return false

      setMessages((m) => [...m, createUserMessage(q)])
      if (options?.keepInput !== true) {
        setInput('')
      }
      setLoading(true)
      const controller = new AbortController()
      const timeoutId = window.setTimeout(() => controller.abort(), ASK_TIMEOUT_MS)
      try {
        const res = await fetch(`${base}/ask`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: q, mode }),
          signal: controller.signal,
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) {
          const errText =
            typeof data.error === 'string'
              ? data.error
              : 'Something went wrong. Check server logs and API keys.'
          setMessages((m) => [...m, createAssistantMessage({ content: errText })])
          return true
        }
        const answer = typeof data.answer === 'string' ? data.answer : ''
        const artists = (Array.isArray(data.artists) ? data.artists : []) as MemoryAgentArtistCard[]
        const followUps = Array.isArray(data.followUps)
          ? data.followUps.filter((x: unknown): x is string => typeof x === 'string')
          : []
        const dataGaps = Array.isArray(data.dataGaps)
          ? data.dataGaps.filter((x: unknown): x is string => typeof x === 'string')
          : []
        const structuredDataGaps = parseStructuredDataGapsFromApi(
          (data as Record<string, unknown>).structuredDataGaps
        )
        const outputs = parseClientOutputsFromApi(
          (data as Record<string, unknown>).outputs,
          mode
        )
        const signageDraft = parseClientSignageFromApi(
          (data as Record<string, unknown>).signageDraft,
          outputs
        )
        const contextInspector = parseContextInspectorFromApi(
          (data as Record<string, unknown>).contextInspector,
          mode
        )
        const events = Array.isArray(data.events) ? data.events : undefined
        setMessages((m) => [
          ...m,
          createAssistantMessage({
            content: answer,
            artists,
            events,
            followUps,
            dataGaps,
            structuredDataGaps,
            outputs,
            signageDraft,
            contextInspector,
          }),
        ])
        logMemoryAgentAnswerDelivery({
          question: q,
          answer,
          artists,
          dataGaps,
          followUps,
        })
        if (answer) {
          onAnswerCompleteRef.current?.(answer)
        }
        return true
      } catch (err) {
        const aborted = err instanceof DOMException && err.name === 'AbortError'
        const errText = aborted
          ? 'The request took too long. Please try again or type a shorter question.'
          : 'Could not reach the server. Check your connection and try again.'
        setMessages((m) => [...m, createAssistantMessage({ content: errText })])
        return true
      } finally {
        window.clearTimeout(timeoutId)
        setLoading(false)
      }
    },
    [base, mode]
  )

  const beginSuggestedQuestionFlow = useCallback(
    async (question: string): Promise<boolean> => {
      const q = question.trim()
      if (!q || loadingRef.current || handoffRunningRef.current) return false

      handoffRunningRef.current = true
      setHandoffInProgress(true)

      const { welcomeLine, prefaceLine } = resolveSuggestedQuestionHandoff(orgSlug, q)

      setMessages([createAssistantMessage({ content: welcomeLine })])
      onHandoffLineRef.current?.(welcomeLine)
      await delayMs(SUGGESTED_QUESTION_HANDOFF_WELCOME_DELAY_MS)

      if (!handoffRunningRef.current) return false

      setMessages((m) => [...m, createAssistantMessage({ content: prefaceLine })])
      onHandoffLineRef.current?.(prefaceLine)
      await delayMs(SUGGESTED_QUESTION_HANDOFF_PREFACE_DELAY_MS)

      handoffRunningRef.current = false
      setHandoffInProgress(false)

      return sendQuestion(q)
    },
    [orgSlug, sendQuestion]
  )

  return {
    mode,
    setMode,
    input,
    setInput,
    messages,
    setMessages,
    loading,
    handoffInProgress,
    sendQuestion,
    beginSuggestedQuestionFlow,
  }
}
