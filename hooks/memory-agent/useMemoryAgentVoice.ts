'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

export function useMemoryAgentVoice(orgSlug: string, elevenLabsConfigured: boolean) {
  const base = `/api/organizations/by-slug/${encodeURIComponent(orgSlug)}/memory-agent`
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const lastObjectUrl = useRef<string | null>(null)
  const [voiceLoading, setVoiceLoading] = useState(false)
  const [isPlayingVoice, setIsPlayingVoice] = useState(false)
  const [voiceError, setVoiceError] = useState<string | null>(null)

  useLayoutEffect(() => {
    const el = audioRef.current
    if (!el) return
    const onPlay = () => setIsPlayingVoice(true)
    const onStop = () => setIsPlayingVoice(false)
    el.addEventListener('play', onPlay)
    el.addEventListener('playing', onPlay)
    el.addEventListener('pause', onStop)
    el.addEventListener('ended', onStop)
    el.addEventListener('emptied', onStop)
    return () => {
      el.removeEventListener('play', onPlay)
      el.removeEventListener('playing', onPlay)
      el.removeEventListener('pause', onStop)
      el.removeEventListener('ended', onStop)
      el.removeEventListener('emptied', onStop)
    }
  }, [audioRef])

  const playVoice = useCallback(
    async (text: string) => {
      if (!elevenLabsConfigured) return
      setVoiceError(null)
      setVoiceLoading(true)
      try {
        const res = await fetch(`${base}/voice`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
        })
        if (!res.ok) {
          const err = (await res.json().catch(() => ({}))) as { error?: string }
          setVoiceError(err.error || `Voice synthesis failed (${res.status}).`)
          return
        }
        const blob = await res.blob()
        if (lastObjectUrl.current) {
          URL.revokeObjectURL(lastObjectUrl.current)
        }
        const url = URL.createObjectURL(blob)
        lastObjectUrl.current = url
        const el = audioRef.current
        if (el) {
          el.src = url
          await el.play().catch(() => {
            setVoiceError('Playback was blocked. Tap Listen again or check browser audio permissions.')
          })
        }
      } catch (e) {
        setVoiceError(e instanceof Error ? e.message : 'Voice request failed.')
      } finally {
        setVoiceLoading(false)
      }
    },
    [base, elevenLabsConfigured]
  )

  useEffect(() => {
    return () => {
      if (lastObjectUrl.current) URL.revokeObjectURL(lastObjectUrl.current)
    }
  }, [])

  return { playVoice, voiceLoading, voiceError, audioRef, isPlayingVoice }
}
