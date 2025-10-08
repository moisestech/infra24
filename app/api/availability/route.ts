import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

interface AvailabilityWindow {
  by: string
  host: string
  days: string[]
  start: string
  end: string
}

interface AvailabilityRules {
  timezone: string
  slot_minutes: number
  buffer_before: number
  buffer_after: number
  max_per_day_per_host: number
  windows: AvailabilityWindow[]
  blackouts: Array<{ date?: string; range?: string[] }>
  pooling: 'round_robin' | 'least_loaded'
}

interface TimeSlot {
  start: string
  end: string
  host: string
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const resourceId = searchParams.get('resource_id')
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')

    if (!resourceId || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required parameters: resource_id, start_date, end_date' },
        { status: 400 }
      )
    }

    const supabaseAdmin = getSupabaseAdmin()

    // Get resource with availability rules
    const { data: resource, error: resourceError } = await supabaseAdmin
      .from('resources')
      .select('*')
      .eq('id', resourceId)
      .eq('is_active', true)
      .eq('is_bookable', true)
      .single()

    if (resourceError || !resource) {
      return NextResponse.json(
        { error: 'Resource not found or not bookable' },
        { status: 404 }
      )
    }

    const rules: AvailabilityRules = resource.availability_rules || {}
    
    if (!rules.windows || rules.windows.length === 0) {
      return NextResponse.json(
        { error: 'No availability windows configured for this resource' },
        { status: 400 }
      )
    }

    // Parse date range
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format. Use YYYY-MM-DD' },
        { status: 400 }
      )
    }

    // Generate available slots
    const availableSlots = await generateAvailableSlots(
      supabaseAdmin,
      resourceId,
      rules,
      start,
      end
    )

    return NextResponse.json({
      resource_id: resourceId,
      timezone: rules.timezone || 'America/New_York',
      slot_minutes: rules.slot_minutes || 30,
      slots: availableSlots
    })

  } catch (error) {
    console.error('Error in availability API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function generateAvailableSlots(
  supabaseAdmin: any,
  resourceId: string,
  rules: AvailabilityRules,
  startDate: Date,
  endDate: Date
): Promise<TimeSlot[]> {
  const slots: TimeSlot[] = []
  const slotMinutes = rules.slot_minutes || 30
  const bufferBefore = rules.buffer_before || 0
  const bufferAfter = rules.buffer_after || 0
  const maxPerDay = rules.max_per_day_per_host || 10

  // Get existing bookings for the date range
  const { data: existingBookings } = await supabaseAdmin
    .from('bookings')
    .select('start_time, end_time, metadata')
    .eq('resource_id', resourceId)
    .eq('status', 'confirmed')
    .gte('start_time', startDate.toISOString())
    .lte('start_time', endDate.toISOString())

  // Group bookings by host and date
  const bookingsByHost: Record<string, Record<string, any[]>> = {}
  existingBookings?.forEach((booking: any) => {
    const host = booking.metadata?.host
    if (host) {
      const date = new Date(booking.start_time).toISOString().split('T')[0]
      if (!bookingsByHost[host]) bookingsByHost[host] = {}
      if (!bookingsByHost[host][date]) bookingsByHost[host][date] = []
      bookingsByHost[host][date].push(booking)
    }
  })

  // Generate slots for each day in the range
  const currentDate = new Date(startDate)
  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split('T')[0]
    const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' })

    // Check if date is blacked out
    const isBlackedOut = rules.blackouts?.some(blackout => {
      if (blackout.date) return blackout.date === dateStr
      if (blackout.range) {
        const [rangeStart, rangeEnd] = blackout.range
        return dateStr >= rangeStart && dateStr <= rangeEnd
      }
      return false
    })

    if (!isBlackedOut) {
      // Generate slots for each host window on this day
      for (const window of rules.windows) {
        if (window.days.includes(dayName)) {
          const hostSlots = generateHostSlots(
            window,
            currentDate,
            slotMinutes,
            bufferBefore,
            bufferAfter,
            bookingsByHost[window.host]?.[dateStr] || [],
            maxPerDay
          )
          slots.push(...hostSlots)
        }
      }
    }

    currentDate.setDate(currentDate.getDate() + 1)
  }

  // Apply pooling strategy
  return applyPoolingStrategy(slots, rules.pooling || 'round_robin')
}

function generateHostSlots(
  window: AvailabilityWindow,
  date: Date,
  slotMinutes: number,
  bufferBefore: number,
  bufferAfter: number,
  existingBookings: any[],
  maxPerDay: number
): TimeSlot[] {
  const slots: TimeSlot[] = []
  const [startHour, startMinute] = window.start.split(':').map(Number)
  const [endHour, endMinute] = window.end.split(':').map(Number)

  const windowStart = new Date(date)
  windowStart.setHours(startHour, startMinute, 0, 0)

  const windowEnd = new Date(date)
  windowEnd.setHours(endHour, endMinute, 0, 0)

  // Create blocked time ranges with buffers
  const blockedRanges = existingBookings.map(booking => ({
    start: new Date(new Date(booking.start_time).getTime() - bufferBefore * 60000),
    end: new Date(new Date(booking.end_time).getTime() + bufferAfter * 60000)
  }))

  // Generate slots
  const currentSlot = new Date(windowStart)
  let dailyCount = 0

  while (currentSlot < windowEnd && dailyCount < maxPerDay) {
    const slotEnd = new Date(currentSlot.getTime() + slotMinutes * 60000)
    
    if (slotEnd <= windowEnd) {
      // Check if slot conflicts with blocked ranges
      const isBlocked = blockedRanges.some(blocked => 
        (currentSlot < blocked.end && slotEnd > blocked.start)
      )

      if (!isBlocked) {
        slots.push({
          start: currentSlot.toISOString(),
          end: slotEnd.toISOString(),
          host: window.host
        })
        dailyCount++
      }
    }

    currentSlot.setMinutes(currentSlot.getMinutes() + slotMinutes)
  }

  return slots
}

function applyPoolingStrategy(slots: TimeSlot[], strategy: string): TimeSlot[] {
  if (strategy === 'round_robin') {
    // Group slots by time, then interleave hosts
    const slotsByTime: Record<string, TimeSlot[]> = {}
    slots.forEach(slot => {
      const timeKey = slot.start
      if (!slotsByTime[timeKey]) slotsByTime[timeKey] = []
      slotsByTime[timeKey].push(slot)
    })

    const result: TimeSlot[] = []
    Object.values(slotsByTime).forEach(timeSlots => {
      // Sort by host for consistent ordering
      timeSlots.sort((a, b) => a.host.localeCompare(b.host))
      result.push(...timeSlots)
    })

    return result.sort((a, b) => a.start.localeCompare(b.start))
  }

  // For 'least_loaded', we'd need to count upcoming bookings per host
  // For now, just return sorted by time
  return slots.sort((a, b) => a.start.localeCompare(b.start))
}

