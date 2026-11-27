'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import dynamic from 'next/dynamic'
import { format, startOfWeek, endOfWeek } from 'date-fns'
import { Resource, Booking, CreateBookingRequest } from '@/types/booking'
import { useTheme } from '@/contexts/ThemeContext'
import './ResourceCalendar.css'

// Dynamically import FullCalendar to avoid SSR issues
const FullCalendar = dynamic(() => import('@fullcalendar/react'), { ssr: false })

// Import FullCalendar plugins directly
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid'
import resourceDayGridPlugin from '@fullcalendar/resource-daygrid'
import interactionPlugin from '@fullcalendar/interaction'

interface ResourceCalendarProps {
  orgId: string
  publicAvailability?: boolean
  onBookingCreate?: (booking: CreateBookingRequest) => Promise<void>
  onBookingUpdate?: (booking: Booking) => Promise<void>
  onBookingDelete?: (bookingId: string) => Promise<void>
}

export function ResourceCalendar({ orgId, publicAvailability = false, onBookingCreate, onBookingUpdate, onBookingDelete }: ResourceCalendarProps) {
  const [resources, setResources] = useState<Resource[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const calendarRef = useRef<any>(null)
  const { theme, resolvedTheme } = useTheme()
  
  // Debug theme context
  useEffect(() => {
    console.log('🎨 ResourceCalendar: Theme context:', { theme, resolvedTheme })
    console.log('🎨 ResourceCalendar: Document classes:', document.documentElement.className)
  }, [theme, resolvedTheme])

  const fetchResourcesAndBookings = useCallback(async () => {
    setLoading(true)
    setError(null)
    setResources([])
    setBookings([])
    try {
      const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
      const extendedEnd = endOfWeek(new Date(), { weekStartsOn: 1 })
      extendedEnd.setDate(extendedEnd.getDate() + 14)
      const base = '/api/organizations/' + encodeURIComponent(orgId)
      const params = new URLSearchParams({ start_date: weekStart.toISOString(), end_date: extendedEnd.toISOString() })
      if (publicAvailability) {
        const response = await fetch(base + '/public-availability?' + params, { cache: 'no-store' })
        if (!response.ok) throw new Error('Calendar unavailable')
        const data = await response.json()
        setResources(data.resources || [])
        setBookings((data.bookings || []).map((b: Booking) => ({ ...b, start_time: new Date(b.start_time), end_time: new Date(b.end_time) })))
        return
      }
      const [resourceResponse, bookingResponse] = await Promise.all([
        fetch(base + '/resources', { cache: 'no-store' }),
        fetch(base + '/bookings?' + params, { cache: 'no-store' })
      ])
      if (!resourceResponse.ok || !bookingResponse.ok) throw new Error('Calendar access unavailable')
      const resourceData = await resourceResponse.json()
      const bookingData = await bookingResponse.json()
      setResources(resourceData.resources || [])
      setBookings((bookingData.bookings || []).map((b: Booking) => ({
        ...b, start_time: new Date(b.start_time), end_time: new Date(b.end_time)
      })))
    } catch {
      setError('Calendar unavailable.')
    } finally {
      setLoading(false)
    }
  }, [orgId, publicAvailability])

  useEffect(() => {
    fetchResourcesAndBookings()
  }, [fetchResourcesAndBookings])

  // Expose refresh function for external use
  const refreshCalendar = useCallback(() => {
    console.log('🔄 ResourceCalendar: Manual refresh triggered')
    fetchResourcesAndBookings()
  }, [fetchResourcesAndBookings])



  const handleDateSelect = useCallback(async (selectInfo: any) => {
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
  }, [onBookingCreate, orgId, fetchResourcesAndBookings])

  const handleEventDrop = useCallback(async (eventInfo: any) => {
    if (publicAvailability || !onBookingUpdate) { eventInfo.revert(); return }

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
  }, [publicAvailability, onBookingUpdate, bookings, fetchResourcesAndBookings])

  const handleEventResize = useCallback(async (eventInfo: any) => {
    if (publicAvailability || !onBookingUpdate) { eventInfo.revert(); return }

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
  }, [publicAvailability, onBookingUpdate, bookings, fetchResourcesAndBookings])

  const handleEventClick = useCallback((eventInfo: any) => {
    const booking = bookings.find(b => b.id === eventInfo.event.id)
    if (booking) {
      // You can add a modal or navigation here
      // Booking details remain in authorized component state.
    }
  }, [bookings])

  // Transform resources for FullCalendar - group by type
  const calendarResources = useMemo(() => {
    // Group resources by type
    const groupedResources = resources.reduce((acc, resource) => {
      if (!acc[resource.type]) {
        acc[resource.type] = []
      }
      acc[resource.type].push(resource)
      return acc
    }, {} as Record<string, Resource[]>)

    // Create a flat list with parent-child relationships
    const flatResources: any[] = []
    
    Object.entries(groupedResources).forEach(([type, typeResources]) => {
      // Add parent group
      flatResources.push({
        id: `group-${type}`,
        title: `${type.charAt(0).toUpperCase() + type.slice(1)}s (${typeResources.length})`,
        parentId: null,
        type: type
      })
      
      // Add children resources
      typeResources.forEach(resource => {
        flatResources.push({
          id: resource.id,
          title: resource.title,
          parentId: `group-${type}`,
          capacity: resource.capacity,
          type: resource.type
        })
      })
    })

    console.log('🔍 ResourceCalendar: Created calendar resources:', flatResources)
    return flatResources
  }, [resources])

  const calendarEvents = useMemo(() => bookings.filter(booking => booking.status === 'confirmed').map(booking => ({
    id: booking.id, resourceId: booking.resource_id, title: booking.title,
    start: booking.start_time, end: booking.end_time, color: '#10b981', allDay: false,
    extendedProps: { status: booking.status }
  })), [bookings])

  useEffect(() => {
    ;(window as any).refreshCalendar = refreshCalendar
    return () => { if ((window as any).refreshCalendar === refreshCalendar) delete (window as any).refreshCalendar }
  }, [refreshCalendar])

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
            className="px-4 py-2 text-white rounded transition-colors"
            style={{ 
              backgroundColor: '#47abc4'
            }}
            onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#3a9bb3'}
            onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = '#47abc4'}
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
      
      <div className={`border rounded-lg overflow-hidden ${resolvedTheme === 'dark' ? 'bg-gray-800 border-gray-700 dark-theme' : 'bg-white border-gray-200 light-theme'}`}>
        <FullCalendar
          key={`calendar-${calendarEvents.length}-${calendarResources.length}`} // Force re-render when data changes
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
          resourceAreaWidth="300px"
          resourceLabelContent="Resource Types"
          resourceOrder="title"
          resourceGroupField="parentId"
          nowIndicator={true}
          timeZone="local"
          displayEventTime={true}
          displayEventEnd={true}
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
          themeSystem="bootstrap5"
        />
      </div>
    </div>
  )
}