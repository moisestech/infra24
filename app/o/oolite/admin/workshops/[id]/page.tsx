'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Calendar, Users, Clock, MapPin, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { WorkshopSessionManager } from '@/components/workshop/WorkshopSessionManager'
import { UnifiedNavigation, ooliteConfig } from '@/components/navigation'

interface Workshop {
  id: string
  title: string
  description: string
  category: string
  difficulty_level: string
  duration_minutes: number
  max_participants: number
  price: number
  currency: string
  is_active: boolean
  created_at: string
  updated_at: string
  organization_id: string
}

export default function WorkshopDetailPage() {
  const params = useParams()
  const workshopId = params.id as string
  const [workshop, setWorkshop] = useState<Workshop | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchWorkshop()
  }, [workshopId])

  const fetchWorkshop = async () => {
    try {
      const response = await fetch(`/api/workshops/${workshopId}`)
      const result = await response.json()
      
      if (result.success) {
        setWorkshop(result.data)
      } else {
        setError(result.error || 'Failed to fetch workshop')
      }
    } catch (error) {
      console.error('Error fetching workshop:', error)
      setError('Failed to fetch workshop')
    } finally {
      setLoading(false)
    }
  }

  const handleSessionCreated = (session: any) => {
    console.log('Session created:', session)
    // Could show a toast notification here
  }

  const handleSessionUpdated = (session: any) => {
    console.log('Session updated:', session)
    // Could show a toast notification here
  }

  const handleSessionDeleted = (sessionId: string) => {
    console.log('Session deleted:', sessionId)
    // Could show a toast notification here
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <UnifiedNavigation config={ooliteConfig} userRole="admin" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading workshop...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error || !workshop) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <UnifiedNavigation config={ooliteConfig} userRole="admin" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
              <p className="text-gray-600">{error || 'Workshop not found'}</p>
              <Link href="/o/oolite/admin/workshops">
                <Button className="mt-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Workshops
                </Button>
              </Link>
            </CardContent>
          </Card>
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
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/o/oolite/admin/workshops">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Workshops
              </Button>
            </Link>
          </div>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{workshop.title}</h1>
              <div className="flex items-center space-x-4 mt-2">
                <Badge variant={workshop.is_active ? "default" : "error"}>
                  {workshop.is_active ? 'Active' : 'Inactive'}
                </Badge>
                <Badge variant="info">{workshop.category}</Badge>
                <Badge variant="info">{workshop.difficulty_level}</Badge>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit Workshop
              </Button>
              <Button variant="outline" className="text-red-600 hover:text-red-700">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Workshop Details */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Workshop Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Description</h4>
                  <p className="text-gray-600 dark:text-gray-300">{workshop.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Duration</p>
                      <p className="text-sm text-gray-600">{workshop.duration_minutes} min</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Max Participants</p>
                      <p className="text-sm text-gray-600">{workshop.max_participants}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Price:</span>
                  <span className="text-lg font-semibold text-green-600">
                    {workshop.currency} {workshop.price}
                  </span>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-xs text-gray-500">
                    Created: {format(parseISO(workshop.created_at), 'MMM dd, yyyy')}
                  </p>
                  <p className="text-xs text-gray-500">
                    Updated: {format(parseISO(workshop.updated_at), 'MMM dd, yyyy')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Workshop Sessions */}
          <div className="lg:col-span-2">
            <WorkshopSessionManager
              workshopId={workshopId}
              organizationId={workshop.organization_id}
              onSessionCreated={handleSessionCreated}
              onSessionUpdated={handleSessionUpdated}
              onSessionDeleted={handleSessionDeleted}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
