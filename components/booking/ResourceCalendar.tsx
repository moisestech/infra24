'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { createClient } from '@/lib/supabase'
import { format, startOfWeek, endOfWeek } from 'date-fns'
import { Resource, Booking, CreateBookingRequest } from '@/types/booking'

// Dynamically import FullCalendar to avoid SSR issues
const FullCalendar = dynamic(() => import('@fullcalendar/react'), { ssr: false })

// Import FullCalendar plugins directly
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid'
import resourceDayGridPlugin from '@fullcalendar/resource-daygrid'
import interactionPlugin from '@fullcalendar/interaction'

interface ResourceCalendarProps {
  orgId: string
  onBookingCreate?: (booking: CreateBookingRequest) => Promise<void>
  onBookingUpdate?: (booking: Booking) => Promise<void>
  onBookingDelete?: (bookingId: string) => Promise<void>
}

export function ResourceCalendar({ orgId, onBookingCreate, onBookingUpdate, onBookingDelete }: ResourceCalendarProps) {
  const [resources, setResources] = useState<Resource[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  useEffect(() => {
    fetchResourcesAndBookings()
  }, [orgId])

  const fetchResourcesAndBookings = async () => {
    try {
      setLoading(true)
      
      // Fetch resources
      const { data: resourcesData, error: resourcesError } = await supabase
        .from('resources')
        .select('*')
        .eq('organization_id', orgId)
        .eq('is_bookable', true)

      if (resourcesError) {
        console.error('Error fetching resources:', resourcesError)
        setError('Failed to fetch resources')
        return
      }

      setResources(resourcesData || [])

      // Fetch bookings for current week
      const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
      const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 })

      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          workshop_sessions (
            id,
            workshop_id,
            capacity,
            workshops (
              id,
              title,
              category,
              difficulty_level
            )
          )
        `)
        .eq('organization_id', orgId)
        .gte('starts_at', weekStart.toISOString())
        .lte('ends_at', weekEnd.toISOString())

      if (bookingsError) {
        console.error('Error fetching bookings:', bookingsError)
        setError('Failed to fetch bookings')
        return
      }

      setBookings(bookingsData?.map(b => ({
        ...b,
        start_time: new Date(b.starts_at),
        end_time: new Date(b.ends_at)
      })) || [])

    } catch (err) {
      console.error('Error:', err)
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleDateSelect = async (selectInfo: any) => {
    if (!onBookingCreate) return

    const { start, end, resource } = selectInfo
    
    try {
      await onBookingCreate({
        organizationId: orgId,
        resourceId: resource.id,
        title: 'New Booking',
        startTime: start.toISOString(),
        endTime: end.toISOString()
      })
      
      // Refresh bookings
      await fetchResourcesAndBookings()
    } catch (error) {
      console.error('Error creating booking:', error)
    }
  }

  const handleEventDrop = async (eventInfo: any) => {
    if (!onBookingUpdate) return

    const booking = bookings.find(b => b.id === eventInfo.event.id)
    if (!booking) return

    try {
      await onBookingUpdate({
        ...booking,
        start_time: eventInfo.event.start,
        end_time: eventInfo.event.end
      })
      
      // Refresh bookings
      await fetchResourcesAndBookings()
    } catch (error) {
      console.error('Error updating booking:', error)
      // Revert the event
      eventInfo.revert()
    }
  }

  const handleEventResize = async (eventInfo: any) => {
    if (!onBookingUpdate) return

    const booking = bookings.find(b => b.id === eventInfo.event.id)
    if (!booking) return

    try {
      await onBookingUpdate({
        ...booking,
        start_time: eventInfo.event.start,
        end_time: eventInfo.event.end
      })
      
      // Refresh bookings
      await fetchResourcesAndBookings()
    } catch (error) {
      console.error('Error updating booking:', error)
      // Revert the event
      eventInfo.revert()
    }
  }

  const handleEventClick = (eventInfo: any) => {
    const booking = bookings.find(b => b.id === eventInfo.event.id)
    if (booking) {
      // You can add a modal or navigation here
      console.log('Booking clicked:', booking)
    }
  }

  // Transform resources for FullCalendar
  const calendarResources = resources.map(resource => ({
    id: resource.id,
    title: resource.title,
    capacity: resource.capacity,
    type: resource.type
  }))

  // Transform bookings for FullCalendar
  const calendarEvents = bookings.map(booking => {
    return {
      id: booking.id,
      resourceId: booking.resource_id,
      title: booking.title,
      start: booking.start_time,
      end: booking.end_time,
      color: booking.status === 'confirmed' ? '#10b981' : 
             booking.status === 'pending' ? '#f59e0b' : '#ef4444',
      extendedProps: {
        status: booking.status,
        created_by: booking.created_by_clerk_id
      }
    }
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading calendar...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchResourcesAndBookings}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (resources.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No bookable resources found</p>
          <p className="text-sm text-gray-500">Add resources to start booking</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold">Resource Calendar</h3>
        <div className="flex space-x-2">
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-3 h-3 bg-purple-500 rounded"></div>
            <span>Workshop</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Confirmed</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span>Pending</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>Cancelled</span>
          </div>
        </div>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <FullCalendar
          plugins={[resourceTimeGridPlugin, resourceDayGridPlugin, interactionPlugin]}
          initialView="resourceTimeGridDay"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'resourceTimeGridDay,resourceTimeGridWeek,resourceDayGridMonth'
          }}
          resources={calendarResources}
          events={calendarEvents}
          selectable={true}
          selectMirror={true}
          editable={true}
          droppable={true}
          select={handleDateSelect}
          eventDrop={handleEventDrop}
          eventResize={handleEventResize}
          eventClick={handleEventClick}
          slotMinTime="08:00:00"
          slotMaxTime="22:00:00"
          height="auto"
          resourceAreaWidth="200px"
          resourceLabelContent="Resources"
          resourceOrder="title"
          nowIndicator={true}
          businessHours={{
            daysOfWeek: [1, 2, 3, 4, 5], // Monday to Friday
            startTime: '09:00',
            endTime: '18:00'
          }}
          eventOverlap={false}
          selectOverlap={false}
          eventConstraint={{
            start: '08:00',
            end: '22:00'
          }}
        />
      </div>
    </div>
  )
}