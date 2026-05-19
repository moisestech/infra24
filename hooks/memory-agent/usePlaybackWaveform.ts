'use client'

import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react'

import {
  emptyFrequencyLevels,
  MEMORY_AGENT_BAR_COUNT,
} from '@/lib/memory-agent/draw-frequency-bars'

export { MEMORY_AGENT_BAR_COUNT }

function emptyBars(): number[] {
  return emptyFrequencyLevels(MEMORY_AGENT_BAR_COUNT)
}

function downsampleFrequencies(data: Uint8Array, bars: number): number[] {
  const bufLen = data.length
  const out: number[] = []
  const step = Math.max(1, Math.floor(bufLen / bars))
  for (let i = 0; i < bars; i++) {
    const start = i * step
    let sum = 0
    for (let j = 0; j < step && start + j < bufLen; j++) sum += data[start + j] ?? 0
    out.push(sum / step / 255)
  }
  return out
}

/**
 * Live output levels from an HTMLAudioElement via Web Audio API (AnalyserNode).
 * Browser-native visualization (no extra npm dependency).
 */
export function usePlaybackWaveform(audioRef: RefObject<HTMLAudioElement | null>): number[] {
  const [levels, setLevels] = useState<number[]>(emptyBars)
  const ctxRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const wiredRef = useRef(false)
  const rafRef = useRef<number | null>(null)

  useLayoutEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const stopLoop = () => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      setLevels(emptyBars())
    }

    const sample = () => {
      const analyser = analyserRef.current
      const el = audioRef.current
      if (!analyser || !el || el.paused) {
        setLevels(emptyBars())
        rafRef.current = null
        return
      }
      const data = new Uint8Array(analyser.frequencyBinCount)
      analyser.getByteFrequencyData(data)
      setLevels(downsampleFrequencies(data, MEMORY_AGENT_BAR_COUNT))
      rafRef.current = requestAnimationFrame(sample)
    }

    const startLoop = async () => {
      try {
        if (!wiredRef.current) {
          const ctx = new AudioContext()
          ctxRef.current = ctx
          const source = ctx.createMediaElementSource(audio)
          const analyser = ctx.createAnalyser()
          analyser.fftSize = 256
          analyser.smoothingTimeConstant = 0.72
          source.connect(analyser)
          analyser.connect(ctx.destination)
          analyserRef.current = analyser
          wiredRef.current = true
        }
        await ctxRef.current?.resume()
      } catch {
        /* Strict remount or element already wired elsewhere */
      }
    }

    const onPlay = () => {
      void (async () => {
        await startLoop()
        if (!audio.paused && analyserRef.current && rafRef.current == null) {
          rafRef.current = requestAnimationFrame(sample)
        }
      })()
    }

    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', stopLoop)
    audio.addEventListener('ended', stopLoop)

    if (!audio.paused) void onPlay()

    return () => {
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', stopLoop)
      audio.removeEventListener('ended', stopLoop)
      stopLoop()
      void ctxRef.current?.close()
      ctxRef.current = null
      analyserRef.current = null
      wiredRef.current = false
    }
  }, [audioRef])

  return levels
}

/**
 * Input / microphone levels from a MediaStream (e.g. MediaRecorder pipeline).
 * Pass null when not recording — returns flat bars.
 */
export function useStreamWaveform(stream: MediaStream | null): number[] {
  const [levels, setLevels] = useState<number[]>(emptyBars)

  useEffect(() => {
    if (!stream) {
      setLevels(emptyBars())
      return
    }

    const ctx = new AudioContext()
    let analyser: AnalyserNode | undefined
    let raf: number | undefined

    const start = async () => {
      try {
        const source = ctx.createMediaStreamSource(stream)
        analyser = ctx.createAnalyser()
        analyser.fftSize = 256
        analyser.smoothingTimeConstant = 0.75
        source.connect(analyser)
        await ctx.resume()

        const data = new Uint8Array(analyser.frequencyBinCount)
        const tick = () => {
          if (!analyser) return
          analyser.getByteFrequencyData(data)
          setLevels(downsampleFrequencies(data, MEMORY_AGENT_BAR_COUNT))
          raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      } catch {
        setLevels(emptyBars())
      }
    }

    void start()

    return () => {
      if (raf !== undefined) cancelAnimationFrame(raf)
      void ctx.close()
    }
  }, [stream])

  return levels
}
