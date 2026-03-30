import { NextRequest, NextResponse } from 'next/server'
import { appSheetService } from '@/lib/appsheet-integration'

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { orgId: string } }
) {
  try {
    console.log('🔍 AppSheet Webhook API: Starting POST request')
    console.log('🔍 AppSheet Webhook API: orgId =', params.orgId)
    
    const body = await request.json()
    console.log('🔍 AppSheet Webhook API: Request body:', body)

    // Validate webhook signature (if configured)
    const signature = request.headers.get('x-appsheet-signature')
    if (process.env.APPSHEET_WEBHOOK_SECRET && signature) {
      // TODO: Implement signature validation
      console.log('🔍 AppSheet Webhook API: Signature validation not implemented yet')
    }

    // Process the webhook
    const externalRequest = await appSheetService.processWebhook(params.orgId, body)
    
    console.log('✅ AppSheet Webhook API: Request processed successfully:', externalRequest.id)
    return NextResponse.json(externalRequest, { status: 201 })
  } catch (error) {
    console.error('❌ AppSheet Webhook API: Error processing webhook:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process webhook',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
