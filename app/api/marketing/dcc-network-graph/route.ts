import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { mayReadDccCrmGraph } from '@/lib/airtable/crm-graph-access'
import { fetchDccCrmGraphPayload } from '@/lib/airtable/crm-graph-service'
import { parseGraphMode, parseGraphVisibility } from '@/lib/airtable/crm-graph-transform'
import type { DccNetworkGraphSurface } from '@/lib/marketing/dcc-crm-graph-types'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const surfaceParam = request.nextUrl.searchParams.get('surface') ?? 'home'
    const surface: DccNetworkGraphSurface =
      surfaceParam === 'explorer' ? 'explorer' : 'home'

    const requestedMode = request.nextUrl.searchParams.get('mode')
    const requestedVisibility = request.nextUrl.searchParams.get('visibility')
    // Reject unrecognized values before permissive legacy parsers normalize them.
    if (
      (requestedMode !== null && !['active', 'research', 'combined', 'admin'].includes(requestedMode)) ||
      (requestedVisibility !== null && !['public', 'internal'].includes(requestedVisibility))
    ) {
      return NextResponse.json({ error: 'Invalid graph visibility request' }, {
        status: 403, headers: { 'Cache-Control': 'no-store' },
      })
    }
    const mode = parseGraphMode(requestedMode)
    const visibility = parseGraphVisibility(requestedVisibility)

    // Query parameters can never authorize access to internal CRM data.
    // Research mode also contains unsanitized candidate names in JSON.
    const restricted = mode !== 'active' || visibility !== 'public'
    const staffId = restricted ? auth().userId : null
    if (!mayReadDccCrmGraph(mode, visibility, staffId, {
      DCC_NETWORK_ADMIN_ENABLED: process.env.DCC_NETWORK_ADMIN_ENABLED,
      DCC_NETWORK_ADMIN_CLERK_USER_IDS: process.env.DCC_NETWORK_ADMIN_CLERK_USER_IDS,
    })) {
      return NextResponse.json({ error: 'Private graph access is not authorized' }, {
        status: 403, headers: { 'Cache-Control': 'private, no-store' },
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
