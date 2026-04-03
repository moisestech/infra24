import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { controlCommit, type CommitRequestBody } from '@/lib/control-plane/execute'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CommitRequestBody
    if (!body?.organization_slug || !body?.proposal_id || !body?.commit_token) {
      return NextResponse.json(
        { error: 'organization_slug, proposal_id, and commit_token required' },
        { status: 400 }
      )
    }

    const supabase = createClient()
    const out = await controlCommit(supabase, request, body)

    if (!out.ok) {
      const status =
        out.error === 'Unauthorized'
          ? 401
          : out.error === 'Forbidden' || out.error === 'Proposal belongs to another actor'
            ? 403
            : 400
      return NextResponse.json({ error: out.error }, { status })
    }

    return NextResponse.json({ result: out.result })
  } catch (e) {
    console.error('control commit', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
