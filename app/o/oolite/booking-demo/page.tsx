'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Calendar, Wrench, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { UnifiedNavigation, ooliteConfig } from '@/components/navigation'

interface Resource {
  id: string
  title: string
  type: string
  capacity: number
  organization_id: string
}

export default function BookingDemoPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadResources()
  }, [])

  const loadResources = async () => {
    try {
      setLoading(true)
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        }
      )

      // Get Oolite organization ID
      const { data: org } = await supabase
        .from('organizations')
        .select('id')
        .eq('slug', 'oolite')
        .single()

      if (!org) return

      // Load resources
      const { data: resourcesData } = await supabase
        .from('resources')
        .select('id, title, type, capacity, organization_id')
        .eq('organization_id', org.id)
        .eq('is_bookable', true)
        .order('title')

      setResources(resourcesData || [])
    } catch (error) {
      console.error('Error loading resources:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBookingCreate = (resourceId: string) => {
    alert(`New booking would be created for resource: ${resourceId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <UnifiedNavigation config={ooliteConfig} userRole="admin" />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <UnifiedNavigation config={ooliteConfig} userRole="admin" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Digital Lab Booking System
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Demo of the new resource booking system for Oolite Arts
              </p>
            </div>
            <Button onClick={() => alert('New booking form would open')}>
              <Plus className="w-4 h-4 mr-2" />
              New Booking
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Resources</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resources.length}</div>
              <p className="text-xs text-muted-foreground">
                Available for booking
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Equipment</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {resources.filter(r => r.type === 'equipment').length}
              </div>
              <p className="text-xs text-muted-foreground">
                VR headsets, 3D printers, etc.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Spaces</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {resources.filter(r => r.type === 'space').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Digital Lab, conference rooms
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Resources List */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Available Resources</CardTitle>
            <CardDescription>
              Equipment and spaces available for booking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {resources.map((resource) => (
                <div key={resource.id} className="border rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`p-2 rounded-lg ${
                      resource.type === 'equipment' ? 'bg-blue-100' : 'bg-green-100'
                    }`}>
                      {resource.type === 'equipment' ? (
                        <Wrench className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Users className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{resource.title}</h3>
                      <p className="text-sm text-gray-500 capitalize">{resource.type}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Capacity: {resource.capacity} person{resource.capacity > 1 ? 's' : ''}
                  </p>
                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleBookingCreate(resource.id)}
                  >
                    Book Now
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Simple Calendar Grid */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Weekly Schedule</CardTitle>
            <CardDescription>
              Click on time slots to create bookings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="min-w-full">
                {/* Simple time grid */}
                <div className="grid grid-cols-8 gap-2">
                  <div className="p-2 text-sm font-medium text-gray-500">Time</div>
                  {resources.slice(0, 7).map((resource) => (
                    <div key={resource.id} className="p-2 text-sm font-medium text-gray-500 text-center">
                      {resource.title}
                    </div>
                  ))}
                  
                  {/* Time slots */}
                  {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map((time) => (
                    <React.Fragment key={time}>
                      <div className="p-2 text-sm text-gray-600 border-b">{time}</div>
                      {resources.slice(0, 7).map((resource) => (
                        <div 
                          key={`${resource.id}-${time}`}
                          className="p-2 border rounded cursor-pointer hover:bg-blue-50 text-center"
                          onClick={() => handleBookingCreate(resource.id)}
                        >
                          <div className="text-xs text-gray-500">Available</div>
                        </div>
                      ))}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo Info */}
        <Card>
          <CardHeader>
            <CardTitle>Demo Features</CardTitle>
            <CardDescription>
              This demo shows the booking system capabilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">✅ Working Features</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Resource management with Supabase</li>
                  <li>• Equipment and space categorization</li>
                  <li>• Capacity tracking</li>
                  <li>• Real-time data loading</li>
                  <li>• Responsive design</li>
                  <li>• Database integration</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">🚀 Next Steps</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• FullCalendar integration</li>
                  <li>• Workshop creation system</li>
                  <li>• Email confirmations</li>
                  <li>• Calendar invites (ICS)</li>
                  <li>• CRM sync (Boomerang)</li>
                  <li>• Payment processing</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
