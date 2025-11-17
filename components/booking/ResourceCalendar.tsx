'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import dynamic from 'next/dynamic'
import { supabaseClient } from '@/lib/supabase'
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
  onBookingCreate?: (booking: CreateBookingRequest) => Promise<void>
  onBookingUpdate?: (booking: Booking) => Promise<void>
  onBookingDelete?: (bookingId: string) => Promise<void>
}

export function ResourceCalendar({ orgId, onBookingCreate, onBookingUpdate, onBookingDelete }: ResourceCalendarProps) {
  const [resources, setResources] = useState<Resource[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const calendarRef = useRef<any>(null)
  const supabase = supabaseClient
  const { theme, resolvedTheme } = useTheme()
  
  // Debug theme context
  useEffect(() => {
    console.log('🎨 ResourceCalendar: Theme context:', { theme, resolvedTheme })
    console.log('🎨 ResourceCalendar: Document classes:', document.documentElement.className)
  }, [theme, resolvedTheme])

  const fetchResourcesAndBookings = useCallback(async () => {
    try {
      setLoading(true)
      console.log('🔍 ResourceCalendar: Starting fetchResourcesAndBookings')
      console.log('🔍 ResourceCalendar: orgId =', orgId)
      console.log('🔍 ResourceCalendar: supabase client =', supabase)
      
      // Fetch resources
      console.log('🔍 ResourceCalendar: Fetching resources...')
      const { data: resourcesData, error: resourcesError } = await supabase
        .from('resources')
        .select('*')
        .eq('org_id', orgId)
        .eq('is_bookable', true)

      console.log('🔍 ResourceCalendar: Resources query result:', { resourcesData, resourcesError })
      
      if (resourcesError) {
        console.error('❌ ResourceCalendar: Error fetching resources:', resourcesError)
        console.error('❌ ResourceCalendar: Error details:', {
          code: resourcesError.code,
          message: resourcesError.message,
          details: resourcesError.details,
          hint: resourcesError.hint
        })
        setError('Failed to fetch resources')
        return
      }

      console.log('✅ ResourceCalendar: Successfully fetched resources:', resourcesData?.length || 0, 'resources')
      setResources(resourcesData || [])

      // Fetch bookings for current week and next 2 weeks to catch confirmed bookings
      const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
      const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 })
      const extendedEnd = new Date(weekEnd)
      extendedEnd.setDate(extendedEnd.getDate() + 14) // Add 2 more weeks
      
      console.log('🔍 ResourceCalendar: Fetching bookings for extended period:', { 
        weekStart, 
        weekEnd, 
        extendedEnd 
      })

      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          resources (
            id,
            title,
            type,
            capacity,
            location
          )
        `)
        .eq('org_id', orgId)
        .gte('start_time', weekStart.toISOString())
        .lte('end_time', extendedEnd.toISOString())

      console.log('🔍 ResourceCalendar: Bookings query result:', { bookingsData, bookingsError })
      
      // Log detailed booking information
      if (bookingsData) {
        console.log('📅 ResourceCalendar: All bookings found:', bookingsData.length)
        bookingsData.forEach((booking, index) => {
          console.log(`📅 Booking ${index + 1}:`, {
            id: booking.id,
            title: booking.title,
            status: booking.status,
            start_time: booking.start_time,
            end_time: booking.end_time,
            resource_title: booking.resources?.title,
            user_name: booking.user_name,
            user_email: booking.user_email
          })
        })
        
        // Log confirmed bookings specifically
        const confirmedBookings = bookingsData.filter(b => b.status === 'confirmed')
        console.log('✅ ResourceCalendar: Confirmed bookings:', confirmedBookings.length)
        confirmedBookings.forEach((booking, index) => {
          console.log(`✅ Confirmed Booking ${index + 1}:`, {
            id: booking.id,
            title: booking.title,
            start_time: booking.start_time,
            end_time: booking.end_time,
            resource_title: booking.resources?.title
          })
        })
      }

      if (bookingsError) {
        console.error('❌ ResourceCalendar: Error fetching bookings:', bookingsError)
        console.error('❌ ResourceCalendar: Bookings error details:', {
          code: bookingsError.code,
          message: bookingsError.message,
          details: bookingsError.details,
          hint: bookingsError.hint
        })
        setError('Failed to fetch bookings')
        return
      }

      console.log('✅ ResourceCalendar: Successfully fetched bookings:', bookingsData?.length || 0, 'bookings')
      setBookings(bookingsData?.map(b => ({
        ...b,
        start_time: new Date(b.start_time),
        end_time: new Date(b.end_time)
      })) || [])

    } catch (err) {
      console.error('❌ ResourceCalendar: Unexpected error:', err)
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
      console.log('🔍 ResourceCalendar: fetchResourcesAndBookings completed')
    }
  }, [orgId, supabase])

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
  }, [onBookingUpdate, bookings, fetchResourcesAndBookings])

  const handleEventResize = useCallback(async (eventInfo: any) => {
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
  }, [onBookingUpdate, bookings, fetchResourcesAndBookings])

  const handleEventClick = useCallback((eventInfo: any) => {
    const booking = bookings.find(b => b.id === eventInfo.event.id)
    if (booking) {
      // You can add a modal or navigation here
      console.log('Booking clicked:', booking)
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

  // Transform bookings for FullCalendar
  const calendarEvents = useMemo(() => {
    console.log('🎯 ResourceCalendar: Creating calendar events from bookings:', bookings.length)
    
    // Filter to only show confirmed bookings in the calendar
    const confirmedBookings = bookings.filter(booking => booking.status === 'confirmed')
    console.log('🎯 ResourceCalendar: Filtering to confirmed bookings only:', confirmedBookings.length)
    
    // Log available resource IDs for debugging
    const availableResourceIds = resources.map(r => r.id)
    console.log('🎯 ResourceCalendar: Available resource IDs:', availableResourceIds)
    
    const events = confirmedBookings.map(booking => {
      // Check if the booking's resource_id exists in our resources
      const resourceExists = resources.find(r => r.id === booking.resource_id)
      console.log(`🎯 ResourceCalendar: Checking resource mapping for booking ${booking.id}:`, {
        booking_resource_id: booking.resource_id,
        resource_exists: !!resourceExists,
        resource_title: resourceExists?.title || 'NOT FOUND'
      })
      
      const event = {
        id: booking.id,
        resourceId: booking.resource_id,
        title: booking.title,
        start: booking.start_time,
        end: booking.end_time,
        color: '#10b981', // Green for confirmed bookings
        allDay: false, // Ensure it's not treated as all-day
        extendedProps: {
          status: booking.status,
          created_by: booking.created_by_clerk_id,
          user_name: booking.user_name,
          user_email: booking.user_email
        }
      }
      
      console.log(`🎯 Confirmed Calendar Event ${booking.id}:`, {
        title: event.title,
        status: booking.status,
        start: event.start,
        end: event.end,
        resourceId: event.resourceId,
        user_name: booking.user_name,
        user_email: booking.user_email,
        resource_matches: !!resourceExists
      })
      
      return event
    })
    
    console.log('🎯 ResourceCalendar: Total confirmed calendar events created:', events.length)
    
    return events
  }, [bookings, resources])

    // Debug what FullCalendar is receiving
    useEffect(() => {
      console.log('🎯 ResourceCalendar: FullCalendar Props Debug:', {
        resources_count: calendarResources.length,
        events_count: calendarEvents.length,
        resources: calendarResources.map(r => ({ id: r.id, title: r.title })),
        events: calendarEvents.map(e => ({ id: e.id, title: e.title, resourceId: e.resourceId, start: e.start, end: e.end }))
      })
      
      // Additional debugging for the specific confirmed booking
      if (calendarEvents.length > 0) {
        console.log('🎯 ResourceCalendar: First Event Details:', {
          event: calendarEvents[0],
          start_date: new Date(calendarEvents[0].start).toLocaleString(),
          end_date: new Date(calendarEvents[0].end).toLocaleString(),
          resource_id: calendarEvents[0].resourceId,
          color: calendarEvents[0].color
        })
      }
    }, [calendarResources, calendarEvents])

    // Add refresh to window for debugging
    useEffect(() => {
      if (typeof window !== 'undefined') {
        (window as any).refreshCalendar = refreshCalendar
        ;(window as any).debugCalendar = function() {
          console.log('🔍 Calendar Debug Info:')
          console.log('  - Resources:', resources.length)
          console.log('  - Bookings:', bookings.length)
          console.log('  - Loading:', loading)
        }
        ;(window as any).forceCalendarRefresh = function() {
          console.log('🔄 Force refreshing calendar...')
          refreshCalendar()
        }
        console.log('🗓️ To navigate to October 16, 2025:')
        console.log('  1. Use the calendar navigation arrows')
        console.log('  2. Or click "Today" then navigate to Oct 16')
        console.log('🔄 ResourceCalendar: Debug functions available:')
        console.log('  - window.refreshCalendar() - refresh calendar data')
        console.log('  - window.debugCalendar() - show calendar debug info')
        console.log('  - window.forceCalendarRefresh() - force calendar refresh')
        console.log('  - Use calendar navigation to go to October 16, 2025')
      }
    }, [refreshCalendar, resources, bookings, loading])

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