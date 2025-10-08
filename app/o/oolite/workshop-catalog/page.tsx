'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
// import { Badge } from '@/components/ui/badge'
import { GraduationCap, Users, Calendar, MapPin, Clock, User } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { UnifiedNavigation, ooliteConfig } from '@/components/navigation'
import { format, parseISO } from 'date-fns'
import { SimpleCalendarButton } from '@/components/workshop/WorkshopCalendarButton'

interface Workshop {
  id: string
  title: string
  description: string
  capacity: number
  is_public: boolean
  status: 'draft' | 'published' | 'cancelled'
  registration_open_at: string | null
  registration_close_at: string | null
  created_at: string
  instructor_profile_id: string | null
  default_resource_id: string | null
  resources?: {
    id: string
    title: string
    type: string
  }
  artist_profiles?: {
    id: string
    name: string
    email: string
  }
}

interface WorkshopRegistration {
  id: string
  workshop_id: string
  status: string
  registered_at: string
}

export default function WorkshopCatalogPage() {
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [registrations, setRegistrations] = useState<WorkshopRegistration[]>([])
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
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

      // Load published workshops
      const response = await fetch(`/api/workshops?orgId=${org.id}&status=published`)
      if (response.ok) {
        const { workshops: workshopsData } = await response.json()
        setWorkshops(workshopsData || [])
      }

      // Load user's registrations
      const regResponse = await fetch(`/api/workshop-registrations?orgId=${org.id}`)
      if (regResponse.ok) {
        const { registrations: registrationsData } = await regResponse.json()
        setRegistrations(registrationsData || [])
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (workshopId: string) => {
    try {
      setRegistering(workshopId)
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

      const response = await fetch('/api/workshop-registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orgId: org.id,
          workshopId
        })
      })

      if (response.ok) {
        alert('Successfully registered for the workshop!')
        loadData() // Reload data to update registration status
      } else {
        const error = await response.json()
        alert(`Registration failed: ${error.error}`)
      }
    } catch (error) {
      console.error('Error registering for workshop:', error)
      alert('Error registering for workshop')
    } finally {
      setRegistering(null)
    }
  }

  const isRegistered = (workshopId: string) => {
    return registrations.some(reg => 
      reg.workshop_id === workshopId && reg.status === 'registered'
    )
  }

  const isRegistrationOpen = (workshop: Workshop) => {
    const now = new Date()
    if (workshop.registration_open_at && new Date(workshop.registration_open_at) > now) {
      return false
    }
    if (workshop.registration_close_at && new Date(workshop.registration_close_at) < now) {
      return false
    }
    return true
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
                Workshop Catalog
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Discover and register for Digital Lab workshops
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Workshops</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{workshops.length}</div>
              <p className="text-xs text-muted-foreground">
                Published workshops
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Registrations</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {registrations.filter(r => r.status === 'registered').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Active registrations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {workshops.reduce((sum, w) => sum + w.capacity, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Available spots
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Workshops Grid */}
        {workshops.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <GraduationCap className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No workshops available</h3>
              <p className="mt-1 text-sm text-gray-500">Check back later for new workshop offerings.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workshops.map((workshop) => {
              const registered = isRegistered(workshop.id)
              const registrationOpen = isRegistrationOpen(workshop)
              
              return (
                <Card key={workshop.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{workshop.title}</CardTitle>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Published</span>
                          {workshop.is_public && (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">Public</span>
                          )}
                          {registered && (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">Registered</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {workshop.description}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="w-4 h-4 mr-2" />
                        <span>Capacity: {workshop.capacity} participants</span>
                      </div>
                      
                      {workshop.resources && (
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>{workshop.resources.title}</span>
                        </div>
                      )}
                      
                      {workshop.artist_profiles && (
                        <div className="flex items-center text-sm text-gray-500">
                          <User className="w-4 h-4 mr-2" />
                          <span>Instructor: {workshop.artist_profiles.name}</span>
                        </div>
                      )}
                      
                      {workshop.registration_open_at && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>Registration opens: {format(parseISO(workshop.registration_open_at), 'MMM d, yyyy')}</span>
                        </div>
                      )}
                      
                      {workshop.registration_close_at && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>Registration closes: {format(parseISO(workshop.registration_close_at), 'MMM d, yyyy')}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      {registered ? (
                        <Button variant="outline" className="flex-1" disabled>
                          Already Registered
                        </Button>
                      ) : !registrationOpen ? (
                        <Button variant="outline" className="flex-1" disabled>
                          Registration Closed
                        </Button>
                      ) : (
                        <Button 
                          className="flex-1"
                          onClick={() => handleRegister(workshop.id)}
                          disabled={registering === workshop.id}
                        >
                          {registering === workshop.id ? 'Registering...' : 'Register Now'}
                        </Button>
                      )}
                      
                      {/* Calendar Button */}
                      <SimpleCalendarButton
                        workshopId={workshop.id}
                        workshopTitle={workshop.title}
                      />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
