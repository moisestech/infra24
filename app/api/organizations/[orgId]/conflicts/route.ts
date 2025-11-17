import { NextRequest, NextResponse } from 'next/server'
import { conflictDetectionService } from '@/lib/conflict-detection'

export async function GET(
  request: NextRequest,
  { params }: { params: { orgId: string } }
) {
  try {
    console.log('🔍 Conflicts API: Starting GET request')
    console.log('🔍 Conflicts API: orgId =', params.orgId)

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const severity = searchParams.get('severity')
    const stats = searchParams.get('stats') === 'true'

    if (stats) {
      // Get conflict statistics
      const conflictStats = await conflictDetectionService.getConflictStats(params.orgId)
      console.log('✅ Conflicts API: Retrieved conflict statistics')
      return NextResponse.json(conflictStats)
    } else {
      // Get conflicts list
      const conflicts = await conflictDetectionService.getConflicts(
        params.orgId,
        status as any,
        severity as any
      )
      console.log('✅ Conflicts API: Retrieved', conflicts.length, 'conflicts')
      return NextResponse.json({ conflicts })
    }
  } catch (error) {
    console.error('❌ Conflicts API: Error retrieving conflicts:', error)
    return NextResponse.json(
      { 
        error: 'Failed to retrieve conflicts',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { orgId: string } }
) {
  try {
    console.log('🔍 Conflicts API: Starting POST request')
    console.log('🔍 Conflicts API: orgId =', params.orgId)
    
    const body = await request.json()
    const { resourceId, startTime, endTime, excludeBookingId } = body

    if (!resourceId || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Resource ID, start time, and end time are required' },
        { status: 400 }
      )
    }

    // Check for conflicts
    const conflicts = await conflictDetectionService.checkBookingConflicts(
      params.orgId,
      resourceId,
      new Date(startTime),
      new Date(endTime),
      excludeBookingId
    )

    // Log conflicts if any found
    for (const conflict of conflicts) {
      await conflictDetectionService.logConflict(
        params.orgId,
        resourceId,
        conflict.type,
        {
          startTime,
          endTime,
          conflict
        },
        conflict.severity
      )
    }
    
    console.log('✅ Conflicts API: Checked for conflicts, found', conflicts.length)
    return NextResponse.json({ conflicts })
  } catch (error) {
    console.error('❌ Conflicts API: Error checking conflicts:', error)
    return NextResponse.json(
      { 
        error: 'Failed to check conflicts',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
