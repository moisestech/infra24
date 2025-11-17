import { NextRequest, NextResponse } from 'next/server'
import { appSheetService } from '@/lib/appsheet-integration'

export async function POST(
  request: NextRequest,
  { params }: { params: { orgId: string; requestId: string } }
) {
  try {
    console.log('🔍 AppSheet Approve API: Starting POST request')
    console.log('🔍 AppSheet Approve API: orgId =', params.orgId)
    console.log('🔍 AppSheet Approve API: requestId =', params.requestId)
    
    const body = await request.json()
    const { processedBy, processingNotes } = body

    if (!processedBy) {
      return NextResponse.json(
        { error: 'processedBy is required' },
        { status: 400 }
      )
    }

    // Approve the request
    const approvedRequest = await appSheetService.approveRequest(
      params.requestId,
      processedBy,
      processingNotes
    )
    
    console.log('✅ AppSheet Approve API: Request approved successfully')
    return NextResponse.json(approvedRequest)
  } catch (error) {
    console.error('❌ AppSheet Approve API: Error approving request:', error)
    return NextResponse.json(
      { 
        error: 'Failed to approve request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
