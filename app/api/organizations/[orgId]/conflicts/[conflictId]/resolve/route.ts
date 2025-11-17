import { NextRequest, NextResponse } from 'next/server'
import { conflictDetectionService } from '@/lib/conflict-detection'

export async function POST(
  request: NextRequest,
  { params }: { params: { orgId: string; conflictId: string } }
) {
  try {
    console.log('🔍 Conflict Resolution API: Starting POST request')
    console.log('🔍 Conflict Resolution API: orgId =', params.orgId)
    console.log('🔍 Conflict Resolution API: conflictId =', params.conflictId)
    
    const body = await request.json()
    const { resolution, resolvedBy, resolutionNotes } = body

    if (!resolution || !resolvedBy) {
      return NextResponse.json(
        { error: 'Resolution and resolvedBy are required' },
        { status: 400 }
      )
    }

    // Resolve the conflict
    const resolvedConflict = await conflictDetectionService.resolveConflict(
      params.conflictId,
      resolution,
      resolvedBy,
      resolutionNotes
    )
    
    console.log('✅ Conflict Resolution API: Conflict resolved successfully')
    return NextResponse.json(resolvedConflict)
  } catch (error) {
    console.error('❌ Conflict Resolution API: Error resolving conflict:', error)
    return NextResponse.json(
      { 
        error: 'Failed to resolve conflict',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
