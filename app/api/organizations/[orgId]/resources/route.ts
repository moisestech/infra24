import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const { orgId } = await params
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const category = searchParams.get('category')
    const available = searchParams.get('available') === 'true'

    const supabaseAdmin = getSupabaseAdmin()


    let query = supabaseAdmin
      .from('resources')
      .select('*')
      .eq('org_id', orgId)
      .eq('is_active', true)
      .order('title')

    if (type) {
      query = query.eq('type', type)
    }

    if (category) {
      query = query.eq('category', category)
    }

    const { data: resources, error } = await query

    if (error) {
      console.error('Error fetching resources:', error)
      return NextResponse.json(
        { error: 'Failed to fetch resources' },
        { status: 500 }
      )
    }

    // If checking availability, filter out resources with no available slots
    if (available) {
      const now = new Date()
      const futureDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days from now

      const resourcesWithAvailability = await Promise.all(
        resources.map(async (resource) => {
          const { data: bookings } = await supabaseAdmin
            .from('bookings')
            .select('start_time, end_time')
            .eq('resource_id', resource.id)
            .eq('status', 'confirmed')
            .gte('start_time', now.toISOString())
            .lte('start_time', futureDate.toISOString())

          // Simple availability check - if less than 80% booked, consider available
          const totalSlots = 30 * 8 // 30 days * 8 hours per day
          const bookedSlots = bookings?.length || 0
          const availabilityPercentage = ((totalSlots - bookedSlots) / totalSlots) * 100

          return {
            ...resource,
            availability: {
              percentage: Math.round(availabilityPercentage),
              has_slots: availabilityPercentage > 20
            }
          }
        })
      )

      return NextResponse.json({
        resources: resourcesWithAvailability.filter(r => r.availability.has_slots)
      })
    }

    return NextResponse.json({ resources })
  } catch (error) {
    console.error('Error in resources API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const { orgId } = await params
    const body = await request.json()

    const { data: resource, error } = await supabaseAdmin
      .from('resources')
      .insert({
        org_id: orgId,
        ...body,
        created_by: 'system', // TODO: Get from auth
        updated_by: 'system'
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating resource:', error)
      return NextResponse.json(
        { error: 'Failed to create resource' },
        { status: 500 }
      )
    }

    return NextResponse.json({ resource }, { status: 201 })
  } catch (error) {
    console.error('Error in create resource API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
