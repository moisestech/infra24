'use client'

import { useState, useEffect } from 'react'
import { SimpleBookingCalendar } from '@/components/booking/SimpleBookingCalendar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Calendar, Wrench, Users } from 'lucide-react'
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
  user_id: string
  status: 'pending' | 'confirmed' | 'cancelled'
}

export default function DemoCalendarPage() {
  const [resources, setResources] = useState<Resource[]>([])
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

  const handleBookingCreate = async (booking: Omit<Booking, 'id' | 'user_id'>) => {
    try {
      console.log('Creating booking:', booking)
      // For demo purposes, just log the booking
      alert(`Demo booking created: ${booking.title} from ${booking.start_time.toLocaleString()} to ${booking.end_time.toLocaleString()}`)
    } catch (error) {
      console.error('Error creating booking:', error)
    }
  }

  const handleBookingUpdate = async (booking: Booking) => {
    try {
      console.log('Updating booking:', booking)
      alert(`Demo booking updated: ${booking.title}`)
    } catch (error) {
      console.error('Error updating booking:', error)
    }
  }

  const handleBookingDelete = async (bookingId: string) => {
    try {
      console.log('Deleting booking:', bookingId)
      alert(`Demo booking deleted: ${bookingId}`)
    } catch (error) {
      console.error('Error deleting booking:', error)
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
              <p className="text-gray-600">Loading demo calendar...</p>
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Booking Calendar Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Simple booking calendar demonstration
          </p>
        </div>

        {/* Resources Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                <Wrench className="w-8 h-8 text-green-600" />
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
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calendar Demo */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Booking Calendar Demo</CardTitle>
            <CardDescription>
              Click and drag to create bookings, or drag existing bookings to reschedule.
              This is a demo - actual bookings will be saved to the database.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {resources.length > 0 ? (
              <SimpleBookingCalendar
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
                <Button onClick={fetchResources}>
                  Refresh Resources
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}