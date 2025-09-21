import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'
import { auth } from '@clerk/nextjs/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { is_active, expires_at, notes } = body

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

    // Update the sharing relationship
    const { data: sharing, error } = await supabase
      .from('workshop_organization_sharing')
      .update({
        is_active,
        expires_at,
        notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating workshop sharing:', error)
      return NextResponse.json({ error: 'Failed to update workshop sharing' }, { status: 500 })
    }

    return NextResponse.json({ sharing })
  } catch (error) {
    console.error('Error in workshop sharing PUT:', error)
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

    const { id } = await params
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

    // Delete the sharing relationship
    const { error } = await supabase
      .from('workshop_organization_sharing')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting workshop sharing:', error)
      return NextResponse.json({ error: 'Failed to delete workshop sharing' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Workshop sharing deleted successfully' })
  } catch (error) {
    console.error('Error in workshop sharing DELETE:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

