import { NextRequest, NextResponse } from 'next/server'
import { appSheetService } from '@/lib/appsheet-integration'

export async function GET(
  request: NextRequest,
  { params }: { params: { orgId: string } }
) {
  try {
    console.log('🔍 AppSheet Requests API: Starting GET request')
    console.log('🔍 AppSheet Requests API: orgId =', params.orgId)

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const requestType = searchParams.get('type')
    const stats = searchParams.get('stats') === 'true'

    if (stats) {
      // Get request statistics
      const requestStats = await appSheetService.getRequestStats(params.orgId)
      console.log('✅ AppSheet Requests API: Retrieved request statistics')
      return NextResponse.json(requestStats)
    } else {
      // Get requests list
      const requests = await appSheetService.getRequests(
        params.orgId,
        status as any,
        requestType as any
      )
      console.log('✅ AppSheet Requests API: Retrieved', requests.length, 'requests')
      return NextResponse.json({ requests })
    }
  } catch (error) {
    console.error('❌ AppSheet Requests API: Error retrieving requests:', error)
    return NextResponse.json(
      { 
        error: 'Failed to retrieve requests',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
