import { NextResponse } from 'next/server'

import { isMemoryAgentDataConfigured } from '@/lib/memory-agent/config'
import { synthesizeSpeechElevenLabs } from '@/lib/memory-agent/voice'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

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

  let body: { text?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body.' }, { status: 400 })
  }

  const text = typeof body.text === 'string' ? body.text : ''
  const synth = await synthesizeSpeechElevenLabs({ text, orgSlug: slug })

  if (!synth.ok) {
    return NextResponse.json({ ok: false, error: synth.message }, { status: 503 })
  }

  return new NextResponse(synth.buffer, {
    status: 200,
    headers: {
      'Content-Type': 'audio/mpeg',
      'Cache-Control': 'no-store',
    },
  })
}
