import { NextResponse } from 'next/server'
import { toFile } from 'openai'

import { isMemoryAgentDataConfigured, isOpenAIConfigured } from '@/lib/memory-agent/config'
import { getOpenAIClient } from '@/lib/memory-agent/openai-client'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const MAX_BYTES = 15 * 1024 * 1024

const ALLOWED_MIME = new Set([
  'audio/webm',
  'audio/webm;codecs=opus',
  'audio/mp4',
  'audio/m4a',
  'audio/x-m4a',
  'audio/wav',
  'audio/wave',
  'audio/x-wav',
  'audio/mpeg',
  'audio/mp3',
  'audio/ogg',
  'audio/ogg;codecs=opus',
  'application/octet-stream',
])

function normalizeMime(type: string): string {
  const t = type.split(';')[0]?.trim().toLowerCase() ?? ''
  return t
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  if (!isMemoryAgentDataConfigured(slug)) {
    return NextResponse.json(
      { ok: false, error: 'Memory Agent is not available for this organization.' },
      { status: 404 }
    )
  }

  if (!isOpenAIConfigured()) {
    return NextResponse.json(
      { ok: false, error: 'OPENAI_API_KEY is not configured on the server.' },
      { status: 503 }
    )
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ ok: false, error: 'Expected multipart/form-data.' }, { status: 400 })
  }

  const audio = formData.get('audio')
  if (!(audio instanceof File)) {
    return NextResponse.json(
      { ok: false, error: 'Missing audio file: use form field "audio".' },
      { status: 400 }
    )
  }

  if (audio.size === 0) {
    return NextResponse.json({ ok: false, error: 'Empty audio file.' }, { status: 400 })
  }

  if (audio.size > MAX_BYTES) {
    return NextResponse.json(
      { ok: false, error: 'Audio file exceeds 15MB limit.' },
      { status: 400 }
    )
  }

  const mime = normalizeMime(audio.type)
  const mimeOk =
    !mime ||
    ALLOWED_MIME.has(mime) ||
    ALLOWED_MIME.has(audio.type.toLowerCase()) ||
    mime.startsWith('audio/')
  if (!mimeOk) {
    return NextResponse.json(
      { ok: false, error: `Unsupported audio type: ${audio.type || 'unknown'}` },
      { status: 400 }
    )
  }

  const client = getOpenAIClient()
  if (!client) {
    return NextResponse.json({ ok: false, error: 'OpenAI client unavailable.' }, { status: 503 })
  }

  try {
    const buf = Buffer.from(await audio.arrayBuffer())
    const filename =
      mime.includes('wav') || mime.includes('wave') ? 'recording.wav' : 'recording.webm'
    const upload = await toFile(buf, filename, {
      type: mime || audio.type || 'application/octet-stream',
    })

    const transcription = await client.audio.transcriptions.create({
      file: upload,
      model: 'whisper-1',
    })

    const text = transcription.text?.trim() ?? ''
    return NextResponse.json({ ok: true, transcript: text })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Transcription failed.'
    return NextResponse.json({ ok: false, error: message }, { status: 502 })
  }
}
