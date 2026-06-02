import { NextResponse } from 'next/server'

import {
  DEMO_QUESTION_GROUP_LABELS,
  DEMO_QUESTION_GROUP_ORDER,
  fetchOoliteDemoQuestions,
  type DemoQuestionsFilter,
} from '@/lib/oolite/airtable-question-catalog'

export const dynamic = 'force-dynamic'

function parsePublicSafe(raw: string | null): boolean | undefined {
  if (raw === 'true' || raw === '1') return true
  if (raw === 'false' || raw === '0') return false
  return undefined
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const filter: DemoQuestionsFilter = {
    capabilityPhase: url.searchParams.get('capabilityPhase') || undefined,
    demoPriority: url.searchParams.get('demoPriority') || undefined,
    supportStatus: url.searchParams.get('supportStatus') || undefined,
    questionCategory: url.searchParams.get('questionCategory') || undefined,
    audience: url.searchParams.get('audience') || undefined,
    publicSafe: parsePublicSafe(url.searchParams.get('publicSafe')),
  }

  const result = await fetchOoliteDemoQuestions(filter)

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.message }, { status: 502 })
  }

  return NextResponse.json({
    ok: true,
    count: result.questions.length,
    groupOrder: DEMO_QUESTION_GROUP_ORDER,
    groupLabels: DEMO_QUESTION_GROUP_LABELS,
    questions: result.questions,
    grouped: result.grouped,
  })
}
