import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string; resourceId: string }> }
) {
  try {
    const { resourceId } = await params
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')
    const durationHours = searchParams.get('duration_hours')

    // Default to next 30 days if no dates provided
    const start = startDate ? new Date(startDate) : new Date()
    const end = endDate ? new Date(endDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    const duration = durationHours ? parseInt(durationHours) : 2

    // Get resource details
    const { data: resource, error: resourceError } = await supabaseAdmin
      .from('resources')
      .select('*')
      .eq('id', resourceId)
      .single()

    if (resourceError || !resource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      )
    }

    // Get existing bookings for the date range
    const { data: bookings, error: bookingsError } = await supabaseAdmin
      .from('bookings')
      .select('start_time, end_time, title, user_name')
      .eq('resource_id', resourceId)
      .eq('status', 'confirmed')
      .gte('start_time', start.toISOString())
      .lte('start_time', end.toISOString())
      .order('start_time')

    if (bookingsError) {
      console.error('Error fetching bookings:', bookingsError)
      return NextResponse.json(
        { error: 'Failed to fetch availability' },
        { status: 500 }
      )
    }

    // Generate available time slots
    const availableSlots = generateAvailableSlots(start, end, duration, bookings || [], resource)

    return NextResponse.json({
      resource_id: resourceId,
      resource_title: resource.title,
      available_slots: availableSlots,
      existing_bookings: bookings || [],
      date_range: {
        start: start.toISOString(),
        end: end.toISOString()
      }
    })
  } catch (error) {
    console.error('Error in availability API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function generateAvailableSlots(
  startDate: Date,
  endDate: Date,
  durationHours: number,
  existingBookings: any[],
  resource: any
) {
  const slots = []
  const current = new Date(startDate)
  
  // Get availability rules from resource
  const rules = resource.availability_rules || {}
  const minHours = rules.min_booking_hours || 1
  const maxHours = rules.max_booking_hours || 8
  const advanceDays = rules.advance_booking_days || 7
  
  // Ensure duration is within allowed range
  const actualDuration = Math.max(minHours, Math.min(durationHours, maxHours))
  
  while (current < endDate) {
    // Skip past dates
    if (current < new Date()) {
      current.setDate(current.getDate() + 1)
      continue
    }
    
    // Skip dates too far in advance
    const maxAdvanceDate = new Date()
    maxAdvanceDate.setDate(maxAdvanceDate.getDate() + advanceDays)
    if (current > maxAdvanceDate) {
      current.setDate(current.getDate() + 1)
      continue
    }
    
    // Skip weekends for most resources (except events)
    if (resource.type !== 'event' && (current.getDay() === 0 || current.getDay() === 6)) {
      current.setDate(current.getDate() + 1)
      continue
    }
    
    // Generate time slots for this day (9 AM to 6 PM)
    for (let hour = 9; hour <= 18 - actualDuration; hour++) {
      const slotStart = new Date(current)
      slotStart.setHours(hour, 0, 0, 0)
      
      const slotEnd = new Date(slotStart)
      slotEnd.setHours(hour + actualDuration, 0, 0, 0)
      
      // Check if this slot conflicts with existing bookings
      const hasConflict = existingBookings.some(booking => {
        const bookingStart = new Date(booking.start_time)
        const bookingEnd = new Date(booking.end_time)
        
        return (slotStart < bookingEnd && slotEnd > bookingStart)
      })
      
      if (!hasConflict) {
        slots.push({
          start_time: slotStart.toISOString(),
          end_time: slotEnd.toISOString(),
          duration_hours: actualDuration,
          date: current.toISOString().split('T')[0],
          time: `${hour.toString().padStart(2, '0')}:00 - ${(hour + actualDuration).toString().padStart(2, '0')}:00`
        })
      }
    }
    
    current.setDate(current.getDate() + 1)
  }
  
  return slots
}
