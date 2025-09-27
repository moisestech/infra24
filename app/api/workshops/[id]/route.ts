import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: workshopId } = await params

    // Get workshop details
    const { data: workshop, error: workshopError } = await supabase
      .from('workshops')
      .select('*')
      .eq('id', workshopId)
      .single()

    if (workshopError || !workshop) {
      return NextResponse.json({ error: 'Workshop not found' }, { status: 404 })
    }

    // Check if user has access to this workshop's organization
    const { data: membership, error: membershipError } = await supabase
      .from('org_memberships')
      .select('role')
      .eq('organization_id', workshop.organization_id)
      .eq('clerk_user_id', userId)
      .eq('is_active', true)
      .single()

    if (membershipError || !membership) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    return NextResponse.json({
      success: true,
      data: workshop
    })

  } catch (error) {
    console.error('Get workshop API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: workshopId } = await params
    const body = await request.json()

    // Get workshop details first to check organization
    const { data: existingWorkshop, error: workshopError } = await supabase
      .from('workshops')
      .select('organization_id')
      .eq('id', workshopId)
      .single()

    if (workshopError || !existingWorkshop) {
      return NextResponse.json({ error: 'Workshop not found' }, { status: 404 })
    }

    // Check if user is admin of organization
    const { data: membership, error: membershipError } = await supabase
      .from('org_memberships')
      .select('role')
      .eq('organization_id', existingWorkshop.organization_id)
      .eq('clerk_user_id', userId)
      .eq('is_active', true)
      .single()

    if (membershipError || !membership) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    if (!['org_admin', 'super_admin', 'moderator'].includes(membership.role)) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Update workshop
    const { data: updatedWorkshop, error: updateError } = await supabase
      .from('workshops')
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
      .eq('id', workshopId)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating workshop:', updateError)
      return NextResponse.json({ error: 'Failed to update workshop' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: updatedWorkshop
    })

  } catch (error) {
    console.error('Update workshop API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: workshopId } = await params

    // Get workshop details first to check organization
    const { data: existingWorkshop, error: workshopError } = await supabase
      .from('workshops')
      .select('organization_id')
      .eq('id', workshopId)
      .single()

    if (workshopError || !existingWorkshop) {
      return NextResponse.json({ error: 'Workshop not found' }, { status: 404 })
    }

    // Check if user is admin of organization
    const { data: membership, error: membershipError } = await supabase
      .from('org_memberships')
      .select('role')
      .eq('organization_id', existingWorkshop.organization_id)
      .eq('clerk_user_id', userId)
      .eq('is_active', true)
      .single()

    if (membershipError || !membership) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    if (!['org_admin', 'super_admin', 'moderator'].includes(membership.role)) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Delete workshop (this will cascade to sessions and bookings)
    const { error: deleteError } = await supabase
      .from('workshops')
      .delete()
      .eq('id', workshopId)

    if (deleteError) {
      console.error('Error deleting workshop:', deleteError)
      return NextResponse.json({ error: 'Failed to delete workshop' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Workshop deleted successfully'
    })

  } catch (error) {
    console.error('Delete workshop API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}