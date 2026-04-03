import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { controlExecuteImmediate } from '@/lib/control-plane/immediate'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (!body?.organization_slug || !body?.action) {
      return NextResponse.json({ error: 'organization_slug and action required' }, { status: 400 })
    }

    const supabase = createClient()
    const out = await controlExecuteImmediate(supabase, request, body)

    if (!out.ok) {
      const status =
        out.error === 'Session required (use propose/commit for service token)'
          ? 403
          : out.error === 'Forbidden'
            ? 403
            : out.error === 'Organization not found'
              ? 404
              : 400
      return NextResponse.json({ error: out.error }, { status })
    }

    return NextResponse.json({ result: out.result })
  } catch (e) {
    console.error('control execute-immediate', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
