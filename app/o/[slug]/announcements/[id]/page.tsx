'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, User, Tag, Eye, EyeOff, Shield, Edit, CheckCircle, Clock, ExternalLink } from 'lucide-react'
import Navigation from '@/components/ui/Navigation'

interface Announcement {
  id: string
  title: string
  body: string
  status: string
  author_clerk_id: string
  created_at: string
  published_at: string
  expires_at: string
  priority: number
  tags: string[]
  org_id: string
  scheduled_at?: string
  location?: string
  visibility?: string
  starts_at?: string
  ends_at?: string
  type?: string
  sub_type?: string
  primary_link?: string
  additional_info?: string
  image_url?: string
}

interface Organization {
  id: string
  name: string
  slug: string
  banner_image?: string
}

export default function AnnouncementViewPage() {
  const params = useParams()
  const router = useRouter()
  const [announcement, setAnnouncement] = useState<Announcement | null>(null)
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<string>('')
  const [isPublishing, setIsPublishing] = useState(false)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        
        // Get user role first
        const userResponse = await fetch('/api/users/me')
        if (userResponse.ok) {
          const userData = await userResponse.json()
          setUserRole(userData.role || 'resident')
        }
        
        const slug = params.slug as string
        const id = params.id as string
        
        // Get organization details
        const orgResponse = await fetch(`/api/organizations/by-slug/${slug}`)
        if (orgResponse.ok) {
          const orgData = await orgResponse.json()
          setOrganization(orgData.organization)
        }
        
        // Get announcement details
        const announcementResponse = await fetch(`/api/announcements/${id}`)
        if (announcementResponse.ok) {
          const announcementData = await announcementResponse.json()
          setAnnouncement(announcementData.announcement)
        } else {
          setError('Announcement not found')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load announcement')
      } finally {
        setLoading(false)
      }
    }

    if (params.slug && params.id) {
      loadData()
    }
  }, [params.slug, params.id])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    })
  }

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      year: date.getFullYear(),
      full: date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    }
  }

  const isAdmin = userRole === 'super_admin' || userRole === 'org_admin' || userRole === 'moderator'

  const handlePublish = async () => {
    if (!announcement) return
    
    setIsPublishing(true)
    try {
      const response = await fetch(`/api/announcements/${announcement.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'published'
        })
      })

      if (response.ok) {
        const data = await response.json()
        setAnnouncement(data.announcement)
        // Show success message or refresh the page
        window.location.reload()
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to publish announcement')
      }
    } catch (err) {
      setError('Failed to publish announcement')
    } finally {
      setIsPublishing(false)
    }
  }

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

  if (error || !announcement || !organization) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200">
              {error || 'Announcement not found'}
            </p>
            <Link
              href={`/o/${organization?.slug || params.slug}/announcements`}
              className="text-blue-600 hover:text-blue-500 text-sm font-medium mt-2 inline-block"
            >
              ← Back to Announcements
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const eventDate = announcement.scheduled_at || announcement.created_at
  const formattedEventDate = formatEventDate(eventDate)
  const hasTime = announcement.scheduled_at && announcement.scheduled_at !== announcement.created_at

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href={`/o/${organization.slug}/announcements`}
            className="inline-flex items-center text-blue-600 hover:text-blue-500 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Announcements
          </Link>
          
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {announcement.title}
            </h1>
            {isAdmin && (
              <div className="flex items-center space-x-3">
                {announcement.status === 'pending' && (
                  <button
                    onClick={handlePublish}
                    disabled={isPublishing}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    {isPublishing ? (
                      <Clock className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                    <span>{isPublishing ? 'Publishing...' : 'Publish'}</span>
                  </button>
                )}
                <Link
                  href={`/o/${organization.slug}/announcements/${announcement.id}/edit`}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Announcement Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Event Date Header */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border-b border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                  {formattedEventDate.day}
                </div>
                <div className="text-lg font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                  {formattedEventDate.month}
                </div>
                <div className="text-sm text-blue-500 dark:text-blue-300">
                  {formattedEventDate.year}
                </div>
                {hasTime && (
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-2">
                    {formattedEventDate.time}
                  </div>
                )}
              </div>
            </div>
            <div className="text-center mt-4">
              <div className="flex items-center justify-center space-x-1 text-blue-600 dark:text-blue-400">
                <Calendar className="h-5 w-5" />
                <span className="font-medium">{formattedEventDate.full}</span>
                {hasTime && (
                  <span className="ml-2 font-medium">at {formattedEventDate.time}</span>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Status and Priority */}
            <div className="flex items-center space-x-3 mb-6">
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                announcement.status === 'published' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : announcement.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
              }`}>
                {announcement.status}
              </span>
              {announcement.priority > 0 && (
                <span className="px-3 py-1 text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full">
                  Priority {announcement.priority}
                </span>
              )}
            </div>

            {/* Body */}
            <div className="prose dark:prose-invert max-w-none mb-6">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {announcement.body}
              </p>
            </div>

            {/* Tags */}
            {announcement.tags && announcement.tags.length > 0 && (
              <div className="flex items-center space-x-2 mb-6">
                <Tag className="h-5 w-5 text-gray-400" />
                <div className="flex flex-wrap gap-2">
                  {announcement.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Rich Announcement Data */}
            {(announcement.location || announcement.type || announcement.primary_link) && (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Event Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {announcement.type && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Type:</span>
                      <span className="px-2 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                        {announcement.type}
                      </span>
                    </div>
                  )}
                  {announcement.sub_type && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Category:</span>
                      <span className="px-2 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                        {announcement.sub_type.replace('_', ' ')}
                      </span>
                    </div>
                  )}
                  {announcement.location && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Location:</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{announcement.location}</span>
                    </div>
                  )}
                  {announcement.visibility && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Visibility:</span>
                      <span className={`px-2 py-1 text-sm rounded ${
                        announcement.visibility === 'public' 
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                          : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                      }`}>
                        {announcement.visibility}
                      </span>
                    </div>
                  )}
                </div>
                {announcement.primary_link && (
                  <div className="mt-4">
                    <a
                      href={announcement.primary_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-500 text-sm font-medium"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Event Details
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Admin Information */}
            {isAdmin && (
              <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
                <div className="flex items-center mb-3">
                  <Shield className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
                  <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Admin Information
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-yellow-700 dark:text-yellow-300">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Created: {formatDate(announcement.created_at)}</span>
                  </div>
                  
                  {announcement.published_at && (
                    <div className="flex items-center space-x-2">
                      <Eye className="h-4 w-4" />
                      <span>Published: {formatDate(announcement.published_at)}</span>
                    </div>
                  )}
                  
                  {announcement.expires_at && (
                    <div className="flex items-center space-x-2">
                      <EyeOff className="h-4 w-4" />
                      <span>Expires: {formatDate(announcement.expires_at)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
