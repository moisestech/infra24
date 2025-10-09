/**
 * Waitlist API Endpoints
 * Handles waitlist operations for fully booked resources
 */

import { NextRequest, NextResponse } from 'next/server'
import { addToWaitlist, getWaitlist, removeFromWaitlist } from '@/lib/features/waitlist/waitlist-manager'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...data } = body

    switch (action) {
      case 'add':
        const addResult = await addToWaitlist(data)
        if (!addResult.success) {
          return NextResponse.json(
            { error: addResult.error },
            { status: 400 }
          )
        }
        return NextResponse.json({
          success: true,
          entry_id: addResult.entry_id,
          message: 'Successfully added to waitlist'
        })

      case 'remove':
        const removeResult = await removeFromWaitlist(data.entry_id, data.reason)
        if (!removeResult.success) {
          return NextResponse.json(
            { error: removeResult.error },
            { status: 400 }
          )
        }
        return NextResponse.json({
          success: true,
          message: 'Successfully removed from waitlist'
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action. Supported actions: add, remove' },
          { status: 400 }
        )
    }

  } catch (error: any) {
    console.error('Error in waitlist API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const resourceId = searchParams.get('resource_id')
    const orgId = searchParams.get('org_id')

    if (!resourceId || !orgId) {
      return NextResponse.json(
        { error: 'Missing required parameters: resource_id, org_id' },
        { status: 400 }
      )
    }

    const waitlist = await getWaitlist(resourceId, orgId)

    return NextResponse.json({
      success: true,
      waitlist,
      count: waitlist.length
    })

  } catch (error: any) {
    console.error('Error fetching waitlist:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}





