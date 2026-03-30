import { NextRequest, NextResponse } from 'next/server'
import { syncPurposeToAirtable } from '@/lib/airtable/budget-service'

export const dynamic = 'force-dynamic';

/**
 * POST /api/organizations/by-slug/oolite/budget/sync-purpose
 *
 * Syncs the Purpose field in Airtable based on each record's Category.
 * Only works for Oolite when Airtable is configured.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    if (slug !== 'oolite') {
      return NextResponse.json(
        { error: 'Sync Purpose is only available for Oolite' },
        { status: 400 }
      )
    }

    const result = await syncPurposeToAirtable()

    return NextResponse.json({
      success: result.errors.length === 0,
      updated: result.updated,
      errors: result.errors
    })
  } catch (error) {
    console.error('Sync Purpose error:', error)
    return NextResponse.json(
      { error: 'Failed to sync Purpose to Airtable' },
      { status: 500 }
    )
  }
}
