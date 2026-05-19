import { NextResponse } from 'next/server'

import { isMemoryAgentDataConfigured, isOpenAIConfigured } from '@/lib/memory-agent/config'
import { logMemoryAgentQuestion } from '@/lib/memory-agent/log'
import { runMemoryAgentAsk } from '@/lib/memory-agent/ask'
import { parseMemoryAgentMode } from '@/lib/memory-agent/mode'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  if (!isMemoryAgentDataConfigured(slug)) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Memory Agent data is not configured for this organization (Airtable alumni env).',
      },
      { status: 404 }
    )
  }

  if (!isOpenAIConfigured()) {
    return NextResponse.json(
      { ok: false, error: 'OPENAI_API_KEY is not configured on the server.' },
      { status: 503 }
    )
  }

  let body: { question?: string; mode?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body.' }, { status: 400 })
  }

  const question = typeof body.question === 'string' ? body.question : ''
  const mode = parseMemoryAgentMode(body.mode)

  const result = await runMemoryAgentAsk({ orgSlug: slug, question, mode })

  if (!result.ok) {
    await logMemoryAgentQuestion({
      organizationSlug: slug,
      mode,
      questionLength: question.length,
      matchedArtistCount: 0,
      dataGaps: [],
      error: result.message,
    })
    const status =
      result.code === 'not_configured'
        ? 404
        : result.code === 'openai_missing'
          ? 503
          : result.code === 'airtable_error'
            ? 502
            : 500
    return NextResponse.json({ ok: false, code: result.code, error: result.message }, { status })
  }

  await logMemoryAgentQuestion({
    organizationSlug: slug,
    mode,
    questionLength: question.length,
    matchedArtistCount: result.data.artists.length,
    dataGaps: result.data.dataGaps,
    error: null,
  })

  return NextResponse.json({ ok: true, mode, ...result.data })
}
