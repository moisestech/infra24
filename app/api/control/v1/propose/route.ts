import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { controlPropose, type ProposeRequestBody } from '@/lib/control-plane/execute'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ProposeRequestBody
    if (!body?.organization_slug || !body?.action) {
      return NextResponse.json({ error: 'organization_slug and action required' }, { status: 400 })
    }

    const supabase = createClient()
    const out = await controlPropose(supabase, request, body)

    if (!out.ok) {
      const status = out.error === 'Unauthorized' ? 401 : out.error === 'Forbidden' ? 403 : 400
      return NextResponse.json({ error: out.error }, { status })
    }

    return NextResponse.json({
      preview: out.preview,
      proposal_id: out.proposal_id,
      commit_token: out.commit_token,
      expires_at: out.expires_at,
    })
  } catch (e) {
    console.error('control propose', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
