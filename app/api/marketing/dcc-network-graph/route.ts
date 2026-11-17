import { NextRequest, NextResponse } from 'next/server'
import { fetchDccCrmGraphPayload } from '@/lib/airtable/crm-graph-service'
import { parseGraphMode, parseGraphVisibility } from '@/lib/airtable/crm-graph-transform'
import type { DccNetworkGraphSurface } from '@/lib/marketing/dcc-crm-graph-types'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const surfaceParam = request.nextUrl.searchParams.get('surface') ?? 'home'
    const surface: DccNetworkGraphSurface =
      surfaceParam === 'explorer' ? 'explorer' : 'home'

    const mode = parseGraphMode(request.nextUrl.searchParams.get('mode'))
    const visibility = parseGraphVisibility(request.nextUrl.searchParams.get('visibility'))

    // This marketing endpoint has no authenticated steward boundary.
    // Feature flags and query parameters must never grant private CRM access.
    const requestedMode = request.nextUrl.searchParams.get('mode')
    const requestedVisibility = request.nextUrl.searchParams.get('visibility')
    if (
      (requestedMode !== null && requestedMode !== 'active') ||
      (requestedVisibility !== null && requestedVisibility !== 'public')
    ) {
      return NextResponse.json({ error: 'Only the public active graph is available here' }, {
        status: 403, headers: { 'Cache-Control': 'no-store' },
      })
    }

    const payload = await fetchDccCrmGraphPayload({ surface, mode, visibility })
    return NextResponse.json(payload, {
      headers: {
        'Cache-Control': 'no-store',
      },
    })
  } catch (e) {
    console.error('dcc-network-graph:', e)
    return NextResponse.json({ error: 'Failed to build graph' }, { status: 500 })
  }
}
