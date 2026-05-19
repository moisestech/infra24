'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { parseClientOutputsFromApi, parseClientSignageFromApi } from '@/lib/memory-agent/outputs'
import { parseContextInspectorFromApi } from '@/lib/memory-agent/context-inspector'
import { getMemoryAgentBranding } from '@/lib/memory-agent/org-branding'
import { pickMemoryAgentWelcomeMessage } from '@/lib/memory-agent/welcome-messages'
import { parseStructuredDataGapsFromApi } from '@/lib/memory-agent/parse-structured-data-gaps'
import type { MemoryAgentArtistCard, MemoryAgentMessage, MemoryAgentMode } from '@/types/memory-agent'
import { createAssistantMessage, createUserMessage } from '@/types/memory-agent'

export type UseMemoryAgentChatOptions = {
  /** Called after a successful assistant reply (e.g. to trigger TTS). */
  onAnswerComplete?: (answerText: string) => void
}

export function useMemoryAgentChat(
  orgSlug: string,
  options: UseMemoryAgentChatOptions = {}
) {
  const onAnswerCompleteRef = useRef(options.onAnswerComplete)
  useEffect(() => {
    onAnswerCompleteRef.current = options.onAnswerComplete
  }, [options.onAnswerComplete])

  const base = `/api/organizations/by-slug/${encodeURIComponent(orgSlug)}/memory-agent`

  const [mode, setMode] = useState<MemoryAgentMode>('public')
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<MemoryAgentMessage[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const branding = getMemoryAgentBranding(orgSlug)
    setMessages([createAssistantMessage({ content: pickMemoryAgentWelcomeMessage(branding) })])
  }, [orgSlug])

  const ASK_TIMEOUT_MS = 65_000

  const sendQuestion = useCallback(
    async (question: string): Promise<boolean> => {
      const q = question.trim()
      if (!q || loading) return false

      setMessages((m) => [...m, createUserMessage(q)])
      setInput('')
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
    [base, loading, mode]
  )

  return {
    mode,
    setMode,
    input,
    setInput,
    messages,
    setMessages,
    loading,
    sendQuestion,
  }
}
