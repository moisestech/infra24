'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { 
  Calendar, 
  Clock, 
  Users, 
  DollarSign, 
  MapPin, 
  User, 
  ArrowLeft,
  BookOpen,
  Target,
  CheckCircle,
  Star,
  ExternalLink
} from 'lucide-react'
import { UnifiedNavigation, ooliteConfig, bakehouseConfig } from '@/components/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'

interface Workshop {
  id: string
  title: string
  description: string
  category: string
  level: string
  duration: number
  max_participants: number
  instructor: string
  price: number
  status: string
  featured: boolean
  image_url?: string
  syllabus?: string
  syllabus_sections?: any[]
  learning_objectives?: string[]
  prerequisites?: string[]
  materials_needed?: string[]
  what_youll_learn?: string[]
  workshop_outline?: any[]
  created_at: string
  updated_at: string
}

interface Organization {
  id: string
  name: string
  slug: string
  theme: {
    primaryColor: string
    secondaryColor: string
    accentColor: string
    logo: string
    favicon: string
    banner?: string
    customCSS?: string
  }
}

function WorkshopPageContent() {
  const params = useParams()
  const router = useRouter()
  const { user, isLoaded } = useUser()
  const [workshop, setWorkshop] = useState<Workshop | null>(null)
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [claimingSpot, setClaimingSpot] = useState(false)
  const [mounted, setMounted] = useState(false)

  const slug = params.slug as string
  const workshopId = params.id as string

  // Ensure component is mounted on client side
  useEffect(() => {
    setMounted(true)
    console.log('🔄 Workshop page: Component mounted on client side')
  }, [])

  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates if component unmounts
    
    async function loadData() {
      try {
        console.log('🔄 Workshop page: Starting data load', { slug, workshopId })
        
        // Get organization details
        console.log('🔄 Workshop page: Fetching organization by slug:', slug)
        const orgResponse = await fetch(`/api/organizations/by-slug/${slug}`)
        console.log('🔄 Workshop page: Organization response status:', orgResponse.status)
        
        if (!isMounted) return; // Exit if component unmounted
        
        if (orgResponse.ok) {
          const orgData = await orgResponse.json()
          console.log('🔄 Workshop page: Organization data received:', orgData)
          
          if (isMounted) {
            setOrganization(orgData.organization)
            console.log('🔄 Workshop page: Organization state set')
          }
          
          // Get workshop details after organization is loaded
          console.log('🔄 Workshop page: Fetching workshops for org:', orgData.organization.id)
          const workshopResponse = await fetch(`/api/organizations/${orgData.organization.id}/workshops`)
          console.log('🔄 Workshop page: Workshops response status:', workshopResponse.status)
          
          if (!isMounted) return; // Exit if component unmounted
          
          if (workshopResponse.ok) {
            const workshopsData = await workshopResponse.json()
            console.log('🔄 Workshop page: Workshops data received:', workshopsData)
            console.log('🔄 Workshop page: Total workshops found:', workshopsData.workshops?.length || 0)
            
            const foundWorkshop = workshopsData.workshops?.find((w: any) => w.id === workshopId)
            console.log('🔄 Workshop page: Looking for workshop ID:', workshopId)
            console.log('🔄 Workshop page: Found workshop:', !!foundWorkshop)
            
            if (!isMounted) return; // Exit if component unmounted
            
            if (foundWorkshop) {
              console.log('🔄 Workshop page: Workshop found, setting state:', foundWorkshop.title)
              setWorkshop(foundWorkshop)
              console.log('🔄 Workshop page: Workshop state set')
            } else {
              console.log('❌ Workshop page: Workshop not found in data')
              console.log('❌ Workshop page: Available workshop IDs:', workshopsData.workshops?.map((w: any) => w.id))
              setError('Workshop not found')
            }
          } else {
            console.log('❌ Workshop page: Failed to fetch workshops:', workshopResponse.status, workshopResponse.statusText)
            if (isMounted) {
              setError('Workshop not found')
            }
          }
        } else {
          console.log('❌ Workshop page: Failed to fetch organization:', orgResponse.status, orgResponse.statusText)
          if (isMounted) {
            setError('Organization not found')
          }
        }
      } catch (err) {
        console.error('❌ Workshop page: Error loading data:', err)
        if (isMounted) {
          setError('Failed to load workshop')
        }
      } finally {
        console.log('🔄 Workshop page: Setting loading to false')
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    // Load data immediately, don't wait for authentication
    console.log('🔄 Workshop page: useEffect triggered, calling loadData')
    loadData()
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [slug, workshopId])

  const handleClaimSpot = async () => {
    if (!user) {
      router.push('/sign-in')
      return
    }

    setClaimingSpot(true)
    try {
      // Find the workshop resource ID
      const resourcesResponse = await fetch(`/api/organizations/${organization?.id}/resources`)
      if (!resourcesResponse.ok) {
        console.error('Failed to fetch resources')
        return
      }
      
      const resourcesData = await resourcesResponse.json()
      const workshopResource = resourcesData.resources?.find((r: any) => 
        r.metadata?.workshop_id === workshopId && r.type === 'workshop'
      )
      
      if (!workshopResource) {
        console.error('Workshop resource not found')
        return
      }

      // Create a booking for this workshop
      const bookingResponse = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resource_id: workshopResource.id,
          start_time: new Date().toISOString(),
          end_time: new Date(Date.now() + (workshop?.duration || 120) * 60 * 1000).toISOString(),
          type: 'workshop',
          notes: `Workshop booking: ${workshop?.title}`,
          organization_id: organization?.id
        }),
      })

      if (bookingResponse.ok) {
        // Redirect to bookings page to confirm
        router.push(`/o/${slug}/bookings?workshop=${workshopId}`)
      } else {
        console.error('Failed to claim spot')
      }
    } catch (err) {
      console.error('Error claiming spot:', err)
    } finally {
      setClaimingSpot(false)
    }
  }

  const getConfig = () => {
    switch (slug) {
      case 'oolite':
        return ooliteConfig
      case 'bakehouse':
        return bakehouseConfig
      default:
        return ooliteConfig
    }
  }

  console.log('🔄 Workshop page: Render check', { mounted, loading, error, workshop: !!workshop, organization: !!organization })

  if (!mounted || loading) {
    console.log('🔄 Workshop page: Rendering loading state', { mounted, loading })
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <UnifiedNavigation config={getConfig()} userRole="user" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !workshop) {
    console.log('🔄 Workshop page: Rendering error state', { error, workshop: !!workshop })
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <UnifiedNavigation config={getConfig()} userRole="user" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Workshop Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The workshop you're looking for doesn't exist or has been removed.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Debug: Error: {error}, Workshop: {workshop ? 'Found' : 'Not found'}
            </p>
            <Button 
              onClick={() => router.push(`/o/${slug}/workshops`)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Workshops
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const isWorkshopUpcoming = new Date() < new Date(workshop.created_at)

  console.log('🔄 Workshop page: Rendering workshop content', { 
    workshopTitle: workshop.title, 
    organizationName: organization?.name,
    isWorkshopUpcoming 
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <UnifiedNavigation config={getConfig()} userRole="user" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => router.push(`/o/${slug}/workshops`)}
            className="mb-6 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Workshops
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Workshop Header */}
            <Card className="mb-8 overflow-hidden">
              {workshop.image_url && (
                <div className="h-64 bg-gray-100 overflow-hidden">
                  <img 
                    src={workshop.image_url} 
                    alt={workshop.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {workshop.featured && (
                        <Badge 
                          className="bg-yellow-100 text-yellow-800 border-yellow-200"
                        >
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                        <Badge 
                          variant="default"
                          className="border-2"
                        >
                        {workshop.category}
                      </Badge>
                      <Badge variant="default">
                        {workshop.level}
                      </Badge>
                    </div>
                    <CardTitle 
                      className="text-3xl font-bold mb-2"
                      style={{ color: organization?.theme.primaryColor || '#47abc4' }}
                    >
                      {workshop.title}
                    </CardTitle>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                      {workshop.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Workshop Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" style={{ color: organization?.theme.primaryColor || '#47abc4' }} />
                      Workshop Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Learning Objectives */}
                    {workshop.learning_objectives && workshop.learning_objectives.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Target className="w-4 h-4" style={{ color: organization?.theme.primaryColor || '#47abc4' }} />
                          What You'll Learn
                        </h4>
                        <ul className="space-y-2">
                          {workshop.learning_objectives.map((objective, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700 dark:text-gray-300">{objective}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Prerequisites */}
                    {workshop.prerequisites && workshop.prerequisites.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3">Prerequisites</h4>
                        <ul className="space-y-1">
                          {workshop.prerequisites.map((prereq, index) => (
                            <li key={index} className="text-gray-700 dark:text-gray-300">
                              • {prereq}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Materials Needed */}
                    {workshop.materials_needed && workshop.materials_needed.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3">Materials Needed</h4>
                        <ul className="space-y-1">
                          {workshop.materials_needed.map((material, index) => (
                            <li key={index} className="text-gray-700 dark:text-gray-300">
                              • {material}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Workshop Outline */}
                    {workshop.workshop_outline && workshop.workshop_outline.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3">Workshop Outline</h4>
                        <div className="space-y-3">
                          {workshop.workshop_outline.map((section, index) => (
                            <div key={index} className="border-l-2 border-gray-200 pl-4">
                              <h5 className="font-medium text-gray-900 dark:text-white">
                                {section.title || `Section ${index + 1}`}
                              </h5>
                              {section.description && (
                                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                                  {section.description}
                                </p>
                              )}
                              {section.duration && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Duration: {section.duration}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Workshop Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Workshop Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Duration</p>
                        <p className="font-medium">{workshop.duration} minutes</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Max Participants</p>
                        <p className="font-medium">{workshop.max_participants} people</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Instructor</p>
                        <p className="font-medium">{workshop.instructor}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Price</p>
                        <p className="font-medium">
                          {workshop.price === 0 ? 'Free' : `$${workshop.price}`}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Card */}
                <Card>
                  <CardContent className="pt-6">
                    {isWorkshopUpcoming ? (
                      <div className="text-center space-y-4">
                        <h3 className="font-semibold text-lg">Ready to Join?</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          Claim your spot in this workshop
                        </p>
                        <Button 
                          onClick={handleClaimSpot}
                          disabled={claimingSpot}
                          className="w-full"
                          style={{
                            backgroundColor: organization?.theme.primaryColor || '#47abc4',
                            borderColor: organization?.theme.primaryColor || '#47abc4',
                            color: 'white'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = organization?.theme.primaryColor || '#6bb8d1'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = organization?.theme.primaryColor || '#47abc4'
                          }}
                        >
                          {claimingSpot ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Claiming Spot...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Claim Your Spot
                            </>
                          )}
                        </Button>
                        <p className="text-xs text-gray-500">
                          You'll be redirected to the booking system to confirm your spot
                        </p>
                      </div>
                    ) : (
                      <div className="text-center space-y-4">
                        <h3 className="font-semibold text-lg">Workshop in Progress</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          This workshop has already started
                        </p>
                        <Button 
                          variant="default"
                          onClick={() => router.push(`/o/${slug}/bookings`)}
                          className="w-full"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Bookings
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
  )
}

export default function WorkshopPage() {
  return <WorkshopPageContent />
}