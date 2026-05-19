'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

function pickRecorderMime(): string | undefined {
  if (typeof MediaRecorder === 'undefined') return undefined
  const candidates = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/ogg;codecs=opus',
  ]
  for (const c of candidates) {
    if (MediaRecorder.isTypeSupported(c)) return c
  }
  return undefined
}

export function useVoiceRecorder(orgSlug: string) {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [blob, setBlob] = useState<Blob | null>(null)
  const [transcript, setTranscript] = useState('')
  const [transcribing, setTranscribing] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<BlobPart[]>([])
  const streamRef = useRef<MediaStream | null>(null)

  /** Defer until mount — `navigator` is absent during SSR (was causing hydration mismatch). */
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    const supported =
      typeof navigator !== 'undefined' &&
      Boolean(navigator.mediaDevices?.getUserMedia) &&
      typeof MediaRecorder !== 'undefined'
    setIsSupported(supported)
  }, [])

  const base = `/api/organizations/by-slug/${encodeURIComponent(orgSlug)}/memory-agent`

  const stopTracks = useCallback(() => {
    const s = streamRef.current
    if (s) {
      s.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
    setStream(null)
  }, [])

  const clear = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop()
      } catch {
        /* ignore */
      }
    }
    mediaRecorderRef.current = null
    chunksRef.current = []
    stopTracks()
    setBlob(null)
    setTranscript('')
    setError(null)
    setIsRecording(false)
  }, [stopTracks])

  const startRecording = useCallback(async () => {
    if (!isSupported) {
      setError('Voice recording is not supported in this browser.')
      return
    }
    setError(null)
    setBlob(null)
    setTranscript('')
    chunksRef.current = []

    let s: MediaStream
    try {
      s = await navigator.mediaDevices.getUserMedia({ audio: true })
    } catch {
      setError(
        'Could not access the microphone. You can still type your question.'
      )
      return
    }

    streamRef.current = s
    setStream(s)

    const mime = pickRecorderMime()
    const mr = mime ? new MediaRecorder(s, { mimeType: mime }) : new MediaRecorder(s)
    mediaRecorderRef.current = mr
    chunksRef.current = []

    mr.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data)
    }

    mr.onstop = () => {
      const parts = chunksRef.current
      const type = mr.mimeType || mime || 'audio/webm'
      const b = new Blob(parts, { type })
      setBlob(b)
      stopTracks()
      setIsRecording(false)
      mediaRecorderRef.current = null
    }

    try {
      mr.start(120)
      setIsRecording(true)
    } catch {
      setError('Could not start recording.')
      stopTracks()
      setIsRecording(false)
    }
  }, [isSupported, stopTracks])

  const stopRecording = useCallback(() => {
    const mr = mediaRecorderRef.current
    if (!mr || mr.state === 'inactive') {
      setIsRecording(false)
      stopTracks()
      return
    }
    try {
      mr.stop()
    } catch {
      setIsRecording(false)
      stopTracks()
    }
  }, [stopTracks])

  const transcribeBlob = useCallback(
    async (source?: Blob | null): Promise<string | null> => {
      const b = source ?? blob
      if (!b || b.size === 0) {
        setError('No recording to transcribe.')
        return null
      }
      setError(null)
      setTranscribing(true)
      try {
        const fd = new FormData()
        const ext = b.type.includes('mp4') || b.type.includes('m4a') ? 'm4a' : 'webm'
        fd.append('audio', b, `recording.${ext}`)

        const res = await fetch(`${base}/transcribe`, {
          method: 'POST',
          body: fd,
        })

        const data = (await res.json().catch(() => ({}))) as {
          ok?: boolean
          transcript?: string
          error?: string
        }

        if (!res.ok || data.ok === false) {
          setError(typeof data.error === 'string' ? data.error : 'Transcription failed.')
          return null
        }

        const text = typeof data.transcript === 'string' ? data.transcript.trim() : ''
        setTranscript(text)
        return text || null
      } catch {
        setError('Transcription request failed.')
        return null
      } finally {
        setTranscribing(false)
      }
    },
    [base, blob]
  )

  const transcribe = useCallback(async () => {
    await transcribeBlob(blob)
  }, [blob, transcribeBlob])

  return {
    isSupported,
    stream,
    isRecording,
    error,
    blob,
    transcript,
    setTranscript,
    transcribing,
    startRecording,
    stopRecording,
    transcribe,
    transcribeBlob,
    clear,
  }
}
