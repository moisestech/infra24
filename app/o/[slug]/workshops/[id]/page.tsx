'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useTenant } from '@/components/tenant/TenantProvider'
import { TenantLayout } from '@/components/tenant/TenantLayout'
import { UnifiedNavigation, ooliteConfig, bakehouseConfig } from '@/components/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/Badge'
import { Clock, Users, Calendar, BookOpen, ArrowLeft, Play, Star, CheckCircle } from 'lucide-react'
import Link from 'next/link'

interface Workshop {
  id: string
  title: string
  description: string
  instructor: string
  duration_minutes: number
  max_participants: number
  price: number
  status: string
  featured: boolean
  has_learn_content: boolean
  learning_objectives: string[]
  estimated_learn_time: number
  learn_difficulty: string
  prerequisites: string[]
  materials_needed: string[]
  image_url?: string
  start_date?: string
  interest_count?: number
  course_available?: boolean
  syllabus_sections?: Array<{
    title: string
    content: string
    duration: string
  }>
  what_youll_learn?: string[]
  workshop_outline?: Array<{
    section: string
    topics: string[]
    duration: string
  }>
}

interface WorkshopInterest {
  interest_count: number
  user_interested: boolean
}

export default function WorkshopDetailPage() {
  const params = useParams()
  const { slug, id: workshopId } = params
  const { tenantId, tenantConfig, isLoading: tenantLoading, error: tenantError } = useTenant()
  const [workshop, setWorkshop] = useState<Workshop | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [interest, setInterest] = useState<WorkshopInterest | null>(null)
  const [interestLoading, setInterestLoading] = useState(false)

  console.log('🚀 WorkshopDetailPage component is executing!')
  console.log('🚀 Params:', { slug, workshopId })
  console.log('🚀 Tenant:', { tenantId, tenantLoading, tenantError })

  useEffect(() => {
    console.log('🚀 useEffect triggered, fetching workshop:', workshopId)
    
    const fetchWorkshop = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/workshops/${workshopId}`)
        console.log('🚀 API response status:', response.status)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch workshop: ${response.status}`)
        }
        
        const data = await response.json()
        console.log('🚀 Workshop data received:', data)
        
        if (data.success && data.data) {
          setWorkshop(data.data)
        } else {
          throw new Error('Workshop not found')
        }
      } catch (err) {
        console.error('🚀 Error fetching workshop:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch workshop')
      } finally {
        setLoading(false)
      }
    }

    const fetchInterest = async () => {
      try {
        const response = await fetch(`/api/workshops/${workshopId}/interest`)
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setInterest(data.data)
          }
        }
      } catch (err) {
        console.error('🚀 Error fetching interest:', err)
      }
    }

    if (workshopId) {
      fetchWorkshop()
      fetchInterest()
    }
  }, [workshopId])

  const handleInterestClick = async () => {
    if (!workshopId || interestLoading) return
    
    try {
      setInterestLoading(true)
      const response = await fetch(`/api/workshops/${workshopId}/interest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          // Refresh interest data
          const interestResponse = await fetch(`/api/workshops/${workshopId}/interest`)
          if (interestResponse.ok) {
            const interestData = await interestResponse.json()
            if (interestData.success) {
              setInterest(interestData.data)
            }
          }
        }
      }
    } catch (err) {
      console.error('🚀 Error recording interest:', err)
    } finally {
      setInterestLoading(false)
    }
  }

  // Get navigation config based on tenant
  const getNavigationConfig = () => {
    if (tenantId === 'oolite') return ooliteConfig
    if (tenantId === 'bakehouse') return bakehouseConfig
    return ooliteConfig // fallback
  }

  if (tenantLoading || loading) {
    return (
      <TenantLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      </TenantLayout>
    )
  }

  if (tenantError || error) {
    return (
      <TenantLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-gray-600">{tenantError || error}</p>
          </div>
        </div>
      </TenantLayout>
    )
  }

  if (!workshop) {
    return (
      <TenantLayout>
        <div className="min-h-screen bg-gray-50">
          <UnifiedNavigation config={getNavigationConfig()} userRole="admin" />
          <div className="max-w-4xl mx-auto px-4 py-16">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Workshop Not Found</h1>
              <p className="text-gray-600 mb-8">The workshop you're looking for doesn't exist.</p>
              <Link href={`/o/${slug}/workshops`}>
                <Button>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Workshops
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </TenantLayout>
    )
  }

  return (
    <TenantLayout>
      <div className="min-h-screen bg-gray-50">
        <UnifiedNavigation config={getNavigationConfig()} userRole="admin" />
        <div className="max-w-6xl mx-auto px-4 py-16">
          {/* Back Button */}
          <div className="mb-8">
            <Link href={`/o/${slug}/workshops`}>
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Workshops
              </Button>
            </Link>
          </div>

          {/* Workshop Banner */}
          {workshop.image_url && (
            <div className="mb-8">
              <div className="relative h-64 md:h-80 rounded-lg overflow-hidden">
                <img
                  src={workshop.image_url}
                  alt={workshop.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              </div>
            </div>
          )}

          {/* Workshop Header */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="default" className="bg-blue-100 text-blue-800">
                {workshop.learn_difficulty || 'Beginner'}
              </Badge>
              <Badge variant="default" className="bg-green-100 text-green-800">
                {workshop.status}
              </Badge>
              {workshop.featured && (
                <Badge variant="default" className="bg-yellow-100 text-yellow-800">
                  <Star className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
              {workshop.has_learn_content && (
                <Badge variant="default" className="bg-purple-100 text-purple-800">
                  <BookOpen className="w-3 h-3 mr-1" />
                  Learn Content Available
                </Badge>
              )}
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{workshop.title}</h1>
            <p className="text-xl text-gray-600 mb-6">{workshop.description}</p>
            
            <div className="flex flex-wrap gap-6 text-sm text-gray-600">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                {workshop.duration_minutes} minutes
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Up to {workshop.max_participants} participants
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {workshop.start_date ? 
                  `Starts: ${new Date(workshop.start_date).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}` : 
                  'Next session: TBD'
                }
              </div>
              <div className="flex items-center">
                <BookOpen className="w-4 h-4 mr-2" />
                Instructor: {workshop.instructor}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Workshop Content */}
              <Card>
                <CardHeader>
                  <CardTitle>Workshop Overview</CardTitle>
                  <CardDescription>What you'll learn and experience</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 mb-4">{workshop.description}</p>
                    
                    {workshop.learning_objectives && workshop.learning_objectives.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3">Learning Objectives</h3>
                        <ul className="space-y-2">
                          {workshop.learning_objectives.map((objective, index) => (
                            <li key={index} className="flex items-start">
                              <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                              <span>{objective}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {workshop.what_youll_learn && workshop.what_youll_learn.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3">What You'll Learn</h3>
                        <ul className="space-y-2">
                          {workshop.what_youll_learn.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <CheckCircle className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Workshop Outline */}
              {workshop.workshop_outline && workshop.workshop_outline.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Workshop Outline</CardTitle>
                    <CardDescription>Detailed breakdown of the workshop</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {workshop.workshop_outline.map((section, index) => (
                        <div key={index} className="border-l-4 border-blue-200 pl-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-gray-900">{section.section}</h3>
                            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {section.duration}
                            </span>
                          </div>
                          <ul className="space-y-1">
                            {section.topics.map((topic, topicIndex) => (
                              <li key={topicIndex} className="text-sm text-gray-600">
                                • {topic}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Prerequisites */}
              {workshop.prerequisites && workshop.prerequisites.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Prerequisites</CardTitle>
                    <CardDescription>What you need to know before attending</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {workshop.prerequisites.map((prereq, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                          {prereq}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Materials Needed */}
              {workshop.materials_needed && workshop.materials_needed.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Materials Needed</CardTitle>
                    <CardDescription>What to bring to the workshop</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {workshop.materials_needed.map((material, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                          {material}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Registration/Action Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Join This Workshop</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Available Spots:</span>
                      <span className="font-semibold">
                        {workshop.max_participants}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Level:</span>
                      <Badge variant="default">{workshop.learn_difficulty || 'Beginner'}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <Badge className="bg-green-100 text-green-800">
                        {workshop.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Price:</span>
                      <span className="font-semibold">
                        {workshop.price === 0 ? 'Free' : `$${workshop.price}`}
                      </span>
                    </div>
                    {interest && (
                      <div className="flex justify-between">
                        <span>Interest:</span>
                        <span className="font-semibold text-blue-600">
                          {interest.interest_count} people interested
                        </span>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Button 
                        className="w-full" 
                        size="lg"
                        style={{ 
                          backgroundColor: tenantConfig?.theme?.primary || '#3b82f6',
                          color: 'white'
                        }}
                        onClick={handleInterestClick}
                        disabled={interestLoading || interest?.user_interested}
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        {interestLoading ? 'Saving...' : 
                         interest?.user_interested ? 'Interest Recorded!' : 
                         'Save Your Spot'}
                      </Button>
                      
                      {workshop.has_learn_content && workshop.course_available && (
                        <Button 
                          variant="outline" 
                          className="w-full" 
                          size="lg"
                          style={{ 
                            borderColor: tenantConfig?.theme?.primary || '#3b82f6',
                            color: tenantConfig?.theme?.primary || '#3b82f6'
                          }}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Begin Course
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Workshop Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Workshop Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{workshop.duration_minutes} minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Instructor:</span>
                      <span className="font-medium">{workshop.instructor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Max Participants:</span>
                      <span className="font-medium">{workshop.max_participants}</span>
                    </div>
                    {workshop.estimated_learn_time && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Learn Time:</span>
                        <span className="font-medium">{workshop.estimated_learn_time} minutes</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Contact */}
              <Card>
                <CardHeader>
                  <CardTitle>Questions?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Contact the instructor or our team for more information.
                  </p>
                  <Button variant="outline" className="w-full">
                    Contact Instructor
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </TenantLayout>
  )
}