import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { auth } from '@clerk/nextjs/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resolvedParams = await params
    const supabase = supabaseAdmin
    
    // Get workshop details
    const { data: workshop, error } = await supabase
      .from('workshop_details')
      .select('*')
      .eq('id', resolvedParams.id)
      .single()

    if (error) {
      console.error('Error fetching workshop:', error)
      return NextResponse.json({ error: 'Workshop not found' }, { status: 404 })
    }

    // Check if user has access to this workshop
    const { data: memberships, error: membershipError } = await supabase
      .from('organization_memberships')
      .select('organization_id')
      .eq('user_id', userId)

    if (membershipError) {
      return NextResponse.json({ error: 'Failed to verify access' }, { status: 500 })
    }

    const organizationIds = memberships?.map(m => m.organization_id) || []
    const hasAccess = organizationIds.includes(workshop.organization_id) ||
      organizationIds.some(orgId => 
        workshop.id in (supabase
          .from('workshop_organization_sharing')
          .select('workshop_id')
          .eq('target_organization_id', orgId)
          .eq('is_active', true)
        )
      )

    if (!hasAccess) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    return NextResponse.json({ workshop })
  } catch (error) {
    console.error('Error in workshop GET:', error)
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

    const body = await request.json()
    const resolvedParams = await params
    const supabase = supabaseAdmin

    // Get the workshop to check permissions
    const { data: workshop, error: fetchError } = await supabase
      .from('workshops')
      .select('organization_id')
      .eq('id', resolvedParams.id)
      .single()

    if (fetchError) {
      return NextResponse.json({ error: 'Workshop not found' }, { status: 404 })
    }

    // Verify user has admin/staff role in the organization
    const { data: membership, error: membershipError } = await supabase
      .from('organization_memberships')
      .select('role')
      .eq('user_id', userId)
      .eq('organization_id', workshop.organization_id)
      .single()

    if (membershipError || !membership || !['admin', 'staff'].includes(membership.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Update the workshop
    const { data: updatedWorkshop, error } = await supabase
      .from('workshops')
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
      .eq('id', resolvedParams.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating workshop:', error)
      return NextResponse.json({ error: 'Failed to update workshop' }, { status: 500 })
    }

    return NextResponse.json({ workshop: updatedWorkshop })
  } catch (error) {
    console.error('Error in workshop PUT:', error)
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

    const resolvedParams = await params
    const supabase = supabaseAdmin

    // Get the workshop to check permissions
    const { data: workshop, error: fetchError } = await supabase
      .from('workshops')
      .select('organization_id')
      .eq('id', resolvedParams.id)
      .single()

    if (fetchError) {
      return NextResponse.json({ error: 'Workshop not found' }, { status: 404 })
    }

    // Verify user has admin/staff role in the organization
    const { data: membership, error: membershipError } = await supabase
      .from('organization_memberships')
      .select('role')
      .eq('user_id', userId)
      .eq('organization_id', workshop.organization_id)
      .single()

    if (membershipError || !membership || !['admin', 'staff'].includes(membership.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Soft delete by setting is_active to false
    const { error } = await supabase
      .from('workshops')
      .update({ is_active: false })
      .eq('id', resolvedParams.id)

    if (error) {
      console.error('Error deleting workshop:', error)
      return NextResponse.json({ error: 'Failed to delete workshop' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Workshop deleted successfully' })
  } catch (error) {
    console.error('Error in workshop DELETE:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

