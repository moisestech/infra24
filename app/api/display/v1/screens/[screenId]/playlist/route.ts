import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { resolvePlaylistForScreen } from '@/lib/display-plane/resolver'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ screenId: string }> }
) {
  try {
    const { screenId } = await params
    const token = request.nextUrl.searchParams.get('token')
    const supabase = createClient()

    const resolved = await resolvePlaylistForScreen(supabase, screenId, {
      displayToken: token,
    })

    if (!resolved) {
      return NextResponse.json({ error: 'Screen not found or invalid token' }, { status: 404 })
    }

    return NextResponse.json(resolved)
  } catch (e) {
    console.error('display playlist error', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
