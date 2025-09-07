'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Navigation from '@/components/ui/Navigation'

export default function FallbackAnnouncementPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadAnnouncement() {
      try {
        setLoading(true)
        const id = params.id as string
        
        // Fetch the announcement to get its organization
        const response = await fetch(`/api/announcements/${id}`)
        
        if (!response.ok) {
          throw new Error('Announcement not found')
        }
        
        const data = await response.json()
        const announcement = data.announcement
        
        // Get the organization data from the announcement response
        if (announcement.organizations) {
          const organization = announcement.organizations
          
          // Redirect to the organization-specific route
          router.replace(`/o/${organization.slug}/announcements/${id}`)
        } else {
          // Fallback: try to get organization by ID
          const orgResponse = await fetch(`/api/organizations/${announcement.org_id}`)
          
          if (orgResponse.ok) {
            const orgData = await orgResponse.json()
            const organization = orgData.organization
            
            // Redirect to the organization-specific route
            router.replace(`/o/${organization.slug}/announcements/${id}`)
          } else {
            throw new Error('Organization not found')
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load announcement')
        setLoading(false)
      }
    }

    if (params.id) {
      loadAnnouncement()
    }
  }, [params.id, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200">
              {error}
            </p>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center text-blue-600 hover:text-blue-500 text-sm font-medium mt-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
