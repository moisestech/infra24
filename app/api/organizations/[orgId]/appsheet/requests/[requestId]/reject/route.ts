import { NextRequest, NextResponse } from 'next/server'
import { appSheetService } from '@/lib/appsheet-integration'

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { orgId: string; requestId: string } }
) {
  try {
    console.log('🔍 AppSheet Reject API: Starting POST request')
    console.log('🔍 AppSheet Reject API: orgId =', params.orgId)
    console.log('🔍 AppSheet Reject API: requestId =', params.requestId)
    
    const body = await request.json()
    const { processedBy, processingNotes } = body

    if (!processedBy) {
      return NextResponse.json(
        { error: 'processedBy is required' },
        { status: 400 }
      )
    }

    // Reject the request
    const rejectedRequest = await appSheetService.rejectRequest(
      params.requestId,
      processedBy,
      processingNotes
    )
    
    console.log('✅ AppSheet Reject API: Request rejected successfully')
    return NextResponse.json(rejectedRequest)
  } catch (error) {
    console.error('❌ AppSheet Reject API: Error rejecting request:', error)
    return NextResponse.json(
      { 
        error: 'Failed to reject request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
