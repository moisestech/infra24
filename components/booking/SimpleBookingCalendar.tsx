'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
// import { Badge } from '@/components/ui/badge'
// import { Calendar, Clock, Users, MapPin, Plus, Filter } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { format, addDays, startOfWeek, endOfWeek } from 'date-fns'

interface Resource {
  id: string
  title: string
  type: 'space' | 'equipment' | 'person'
  capacity: number
  organization_id: string
}

interface Booking {
  id: string
  resource_id: string
  start_time: Date
  end_time: Date
  title: string
  user_id: string
  status: 'pending' | 'confirmed' | 'cancelled'
}

interface SimpleBookingCalendarProps {
  orgId: string
  onBookingCreate: (booking: Omit<Booking, 'id' | 'user_id'>) => Promise<void>
  onBookingUpdate: (booking: Booking) => Promise<void>
  onBookingDelete: (bookingId: string) => Promise<void>
}

export function SimpleBookingCalendar({ orgId, onBookingCreate, onBookingUpdate, onBookingDelete }: SimpleBookingCalendarProps) {
  const [resources, setResources] = useState<Resource[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  useEffect(() => {
    fetchResourcesAndBookings()
  }, [orgId, currentWeek])

  const fetchResourcesAndBookings = async () => {
    // Fetch resources
    const { data: resourcesData, error: resourcesError } = await supabase
      .from('resources')
      .select('*')
      .eq('organization_id', orgId)

    if (resourcesError) {
      console.error('Error fetching resources:', resourcesError)
      return
    }
    setResources(resourcesData || [])

    // Fetch bookings for the current week
    const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }) // Monday
    const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 }) // Sunday

    const { data: bookingsData, error: bookingsError } = await supabase
      .from('bookings')
      .select('*')
      .eq('organization_id', orgId)
      .gte('starts_at', weekStart.toISOString())
      .lte('ends_at', weekEnd.toISOString())

    if (bookingsError) {
      console.error('Error fetching bookings:', bookingsError)
      return
    }
    setBookings(bookingsData?.map(b => ({
      ...b,
      start_time: new Date(b.starts_at),
      end_time: new Date(b.ends_at)
    })) || [])
  }

  const daysOfWeek = Array.from({ length: 7 }).map((_, i) => addDays(startOfWeek(currentWeek, { weekStartsOn: 1 }), i))
  const hoursOfDay = Array.from({ length: 24 }).map((_, i) => i)

  const handleCellClick = (date: Date, hour: number, resourceId: string) => {
    const startTime = new Date(date)
    startTime.setHours(hour, 0, 0, 0)
    const endTime = new Date(startTime)
    endTime.setHours(hour + 1, 0, 0, 0)

    const newBooking = {
      resource_id: resourceId,
      start_time: startTime,
      end_time: endTime,
      title: `New Booking for ${resources.find(r => r.id === resourceId)?.title}`,
      user_id: 'clerk_user_id_placeholder', // TODO: Replace with actual user ID
      status: 'pending' as const,
    }
    onBookingCreate(newBooking)
  }

  const getBookingsForCell = (date: Date, hour: number, resourceId: string) => {
    const cellStart = new Date(date)
    cellStart.setHours(hour, 0, 0, 0)
    const cellEnd = new Date(cellStart)
    cellEnd.setHours(hour + 1, 0, 0, 0)

    return bookings.filter(booking =>
      booking.resource_id === resourceId &&
      booking.start_time < cellEnd &&
      booking.end_time > cellStart
    )
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <Button onClick={() => setCurrentWeek(prev => addDays(prev, -7))}>Previous Week</Button>
        <h3 className="text-xl font-semibold">
          {format(startOfWeek(currentWeek, { weekStartsOn: 1 }), 'MMM dd')} - {format(endOfWeek(currentWeek, { weekStartsOn: 1 }), 'MMM dd, yyyy')}
        </h3>
        <Button onClick={() => setCurrentWeek(prev => addDays(prev, 7))}>Next Week</Button>
      </div>

      <div className="grid grid-cols-[auto_repeat(7,minmax(120px,1fr))] gap-px bg-gray-200 dark:bg-gray-700 rounded-lg">
        {/* Corner and Day Headers */}
        <div className="sticky left-0 z-20 bg-gray-100 dark:bg-gray-800 p-2 border-r border-gray-300 dark:border-gray-600">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Time</div>
        </div>
        {daysOfWeek.map((day, dayIndex) => (
          <div key={dayIndex} className="bg-gray-100 dark:bg-gray-800 p-2 text-center border-b border-gray-300 dark:border-gray-600">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {format(day, 'EEE')}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {format(day, 'MMM dd')}
            </div>
          </div>
        ))}

        {/* Time slots and booking cells */}
        {hoursOfDay.map((hour) => (
          <React.Fragment key={hour}>
            {/* Time label */}
            <div className="sticky left-0 z-10 bg-white dark:bg-gray-900 p-2 text-xs text-gray-500 dark:text-gray-400 border-r border-gray-300 dark:border-gray-600">
              {hour.toString().padStart(2, '0')}:00
            </div>
            
            {/* Booking cells for each day */}
            {daysOfWeek.map((day, dayIndex) => (
              <div key={`${hour}-${dayIndex}`} className="relative">
                {resources.map((resource) => {
                  const cellBookings = getBookingsForCell(day, hour, resource.id)
                  return (
                    <div
                      key={`${resource.id}-${hour}-${dayIndex}`}
                      className="h-8 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                      onClick={() => handleCellClick(day, hour, resource.id)}
                    >
                      {cellBookings.map((booking, bookingIndex) => (
                        <div
                          key={booking.id}
                          className={`absolute inset-0 text-xs p-1 rounded ${
                            booking.status === 'confirmed' 
                              ? 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200'
                              : booking.status === 'pending'
                              ? 'bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200'
                              : 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200'
                          }`}
                          style={{ 
                            top: `${bookingIndex * 8}px`,
                            height: '8px',
                            fontSize: '10px'
                          }}
                          title={`${booking.title} (${booking.status})`}
                        >
                          {booking.title.substring(0, 10)}...
                        </div>
                      ))}
                    </div>
                  )
                })}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 flex justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-200 dark:bg-green-800 rounded"></div>
          <span>Confirmed</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-200 dark:bg-yellow-800 rounded"></div>
          <span>Pending</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-200 dark:bg-red-800 rounded"></div>
          <span>Cancelled</span>
        </div>
      </div>
    </div>
  )
}