'use client'

import { useState, useEffect } from 'react'
import { ResourceCalendar } from '@/components/booking/ResourceCalendar'
import { BookingForm } from '@/components/booking/BookingForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Calendar } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { UnifiedNavigation, ooliteConfig } from '@/components/navigation'

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
  description?: string
  status: 'pending' | 'confirmed' | 'cancelled'
  created_by_clerk_id: string
}

export default function AdminCalendarPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  useEffect(() => {
    fetchResources()
  }, [])

  const fetchResources = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('organization_id', 'caf2bc8b-8547-4c55-ac9f-5692e93bd831') // Oolite org ID
        .eq('is_bookable', true)

      if (error) {
        console.error('Error fetching resources:', error)
        return
      }

      setResources(data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBookingCreate = async (booking: Omit<Booking, 'id' | 'created_by_clerk_id'>) => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          organizationId: 'caf2bc8b-8547-4c55-ac9f-5692e93bd831',
          resourceId: booking.resource_id,
          title: booking.title,
          description: booking.description || '',
          startTime: booking.start_time.toISOString(),
          endTime: booking.end_time.toISOString(),
          status: booking.status
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create booking')
      }

      const result = await response.json()
      console.log('Booking created:', result.data)
      
      // Close form
      setShowBookingForm(false)
      setSelectedBooking(null)
    } catch (error) {
      console.error('Error creating booking:', error)
      alert('Failed to create booking: ' + (error as Error).message)
    }
  }

  const handleBookingUpdate = async (booking: Booking) => {
    try {
      const response = await fetch(`/api/bookings/${booking.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: booking.title,
          description: booking.description || '',
          startTime: booking.start_time.toISOString(),
          endTime: booking.end_time.toISOString(),
          status: booking.status
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update booking')
      }

      const result = await response.json()
      console.log('Booking updated:', result.data)
    } catch (error) {
      console.error('Error updating booking:', error)
      alert('Failed to update booking: ' + (error as Error).message)
    }
  }

  const handleBookingDelete = async (bookingId: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete booking')
      }

      console.log('Booking deleted:', bookingId)
    } catch (error) {
      console.error('Error deleting booking:', error)
      alert('Failed to delete booking: ' + (error as Error).message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <UnifiedNavigation config={ooliteConfig} userRole="admin" />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading calendar...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <UnifiedNavigation config={ooliteConfig} userRole="admin" />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Resource Calendar
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage bookings for Digital Lab equipment and spaces
              </p>
            </div>
            <Button
              onClick={() => setShowBookingForm(true)}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>New Booking</span>
            </Button>
          </div>
        </div>

        {/* Resources Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Resources</p>
                  <p className="text-2xl font-bold">{resources.length}</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Equipment</p>
                  <p className="text-2xl font-bold">
                    {resources.filter(r => r.type === 'equipment').length}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Spaces</p>
                  <p className="text-2xl font-bold">
                    {resources.filter(r => r.type === 'space').length}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">People</p>
                  <p className="text-2xl font-bold">
                    {resources.filter(r => r.type === 'person').length}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Calendar</CardTitle>
            <CardDescription>
              Click and drag to create bookings, or drag existing bookings to reschedule.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {resources.length > 0 ? (
              <ResourceCalendar
                orgId="caf2bc8b-8547-4c55-ac9f-5692e93bd831"
                onBookingCreate={handleBookingCreate}
                onBookingUpdate={handleBookingUpdate}
                onBookingDelete={handleBookingDelete}
              />
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No Resources Available
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Add resources to start managing bookings
                </p>
                <Button onClick={() => setShowBookingForm(true)}>
                  Add First Resource
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Booking Form Modal */}
        {showBookingForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Create New Booking
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Book time on Digital Lab equipment or spaces
                </p>
              </div>
              <BookingForm
                resources={resources}
                onSubmit={handleBookingCreate}
                onCancel={() => {
                  setShowBookingForm(false)
                  setSelectedBooking(null)
                }}
                initialData={selectedBooking || undefined}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}