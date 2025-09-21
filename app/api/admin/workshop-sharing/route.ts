import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'
import { auth } from '@clerk/nextjs/server'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Check if user is super admin
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single()

    if (userError || user?.role !== 'super_admin') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Get all workshops that can be shared
    const { data: shareableWorkshops, error: workshopsError } = await supabase
      .from('workshop_details')
      .select('*')
      .eq('is_shared', true)
      .eq('is_active', true)

    if (workshopsError) {
      console.error('Error fetching shareable workshops:', workshopsError)
      return NextResponse.json({ error: 'Failed to fetch workshops' }, { status: 500 })
    }

    // Get all organizations
    const { data: organizations, error: orgsError } = await supabase
      .from('organizations')
      .select('id, name, slug')
      .order('name')

    if (orgsError) {
      console.error('Error fetching organizations:', orgsError)
      return NextResponse.json({ error: 'Failed to fetch organizations' }, { status: 500 })
    }

    // Get current sharing relationships
    const { data: sharingRelations, error: sharingError } = await supabase
      .from('shared_workshop_details')
      .select('*')

    if (sharingError) {
      console.error('Error fetching sharing relations:', sharingError)
      return NextResponse.json({ error: 'Failed to fetch sharing relations' }, { status: 500 })
    }

    return NextResponse.json({
      shareableWorkshops,
      organizations,
      sharingRelations
    })
  } catch (error) {
    console.error('Error in workshop sharing GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { workshop_id, target_organization_id, expires_at, notes } = body

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Check if user is super admin
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single()

    if (userError || user?.role !== 'super_admin') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Get the workshop to verify it exists and is shareable
    const { data: workshop, error: workshopError } = await supabase
      .from('workshops')
      .select('id, organization_id, is_shared')
      .eq('id', workshop_id)
      .single()

    if (workshopError || !workshop) {
      return NextResponse.json({ error: 'Workshop not found' }, { status: 404 })
    }

    if (!workshop.is_shared) {
      return NextResponse.json({ error: 'Workshop is not marked as shareable' }, { status: 400 })
    }

    // Check if workshop is already shared with this organization
    const { data: existingSharing, error: existingError } = await supabase
      .from('workshop_organization_sharing')
      .select('id')
      .eq('workshop_id', workshop_id)
      .eq('target_organization_id', target_organization_id)
      .single()

    if (existingSharing) {
      return NextResponse.json({ error: 'Workshop is already shared with this organization' }, { status: 400 })
    }

    // Create the sharing relationship
    const { data: sharing, error } = await supabase
      .from('workshop_organization_sharing')
      .insert({
        workshop_id,
        source_organization_id: workshop.organization_id,
        target_organization_id,
        expires_at,
        notes,
        shared_by: userId
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating workshop sharing:', error)
      return NextResponse.json({ error: 'Failed to share workshop' }, { status: 500 })
    }

    return NextResponse.json({ sharing }, { status: 201 })
  } catch (error) {
    console.error('Error in workshop sharing POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

