'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, User, Tag, Eye, EyeOff, Shield, Edit, CheckCircle, Clock, ExternalLink, FileCheck } from 'lucide-react'
import { UnifiedNavigation, ooliteConfig, bakehouseConfig } from '@/components/navigation'
import { useTheme } from '@/contexts/ThemeContext'

interface Announcement {
  id: string
  title: string
  content: string
  type: string
  priority: string
  visibility: string
  start_date?: string
  end_date?: string
  location?: string
  key_people?: any[]
  metadata?: any
  is_active: boolean
  created_at: string
  updated_at: string
  created_by: string
  updated_by: string
}

interface Organization {
  id: string
  name: string
  slug: string
  banner_image?: string
}

export default function AnnouncementViewPage() {
  const params = useParams()
  const slug = params.slug as string
  // Get navigation config based on organization slug
  const getNavigationConfig = () => {
    const slug = params.slug as string
    switch (slug) {
      case 'oolite':
        return ooliteConfig
      case 'bakehouse':
        return bakehouseConfig
      default:
        return ooliteConfig // Default fallback
    }
  }
  const router = useRouter()
  const { resolvedTheme } = useTheme()
  const [announcement, setAnnouncement] = useState<Announcement | null>(null)
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<string>('')
  const [isPublishing, setIsPublishing] = useState(false)

  // Organization theme colors with dark mode support
  const getThemeColors = () => {
    const slug = params.slug as string
    const isDark = resolvedTheme === 'dark'
    
    if (slug === 'oolite') {
      return {
        primary: '#00B4D8', // Cyan Blue
        primaryLight: isDark ? '#0A1A1F' : '#E6F7FF', // Dark: very dark cyan, Light: very light cyan
        primaryDark: '#0099CC', // Darker cyan
        secondary: isDark ? '#1F2937' : '#FFFFFF', // Dark: gray-800, Light: white
        accent: '#47ABC4',
        background: isDark ? '#111827' : '#F9FAFB', // Dark: gray-900, Light: gray-50
        cardBackground: isDark ? '#1F2937' : '#FFFFFF', // Dark: gray-800, Light: white
        textPrimary: isDark ? '#F9FAFB' : '#111827', // Dark: gray-50, Light: gray-900
        textSecondary: isDark ? '#D1D5DB' : '#6B7280' // Dark: gray-300, Light: gray-500
      }
    }
    // Default colors for other organizations
    return {
      primary: '#3B82F6', // Blue
      primaryLight: isDark ? '#0F172A' : '#EFF6FF', // Dark: slate-900, Light: very light blue
      primaryDark: '#2563EB', // Darker blue
      secondary: isDark ? '#1F2937' : '#FFFFFF', // Dark: gray-800, Light: white
      accent: '#3B82F6',
      background: isDark ? '#111827' : '#F9FAFB', // Dark: gray-900, Light: gray-50
      cardBackground: isDark ? '#1F2937' : '#FFFFFF', // Dark: gray-800, Light: white
      textPrimary: isDark ? '#F9FAFB' : '#111827', // Dark: gray-50, Light: gray-900
      textSecondary: isDark ? '#D1D5DB' : '#6B7280' // Dark: gray-300, Light: gray-500
    }
  }

  const themeColors = getThemeColors()

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        
        const slug = params.slug as string
        const id = params.id as string
        
        // Try to get user role first (this will fail if not logged in, which is fine)
        try {
          const userResponse = await fetch('/api/users/me')
          if (userResponse.ok) {
            const userData = await userResponse.json()
            setUserRole(userData.role || 'resident')
          }
        } catch (userError) {
          // User is not logged in, continue without user role
          console.log('User not authenticated, accessing as guest')
        }
        
        // Try to get announcement via public API first
        let announcementResponse = await fetch(`/api/organizations/by-slug/${slug}/announcements/${id}/public`)
        let announcementData = null
        
        if (announcementResponse.ok) {
          announcementData = await announcementResponse.json()
          setAnnouncement(announcementData.announcement)
          setOrganization(announcementData.organization)
        } else {
          // If public API fails, try the private API (for logged-in users)
          announcementResponse = await fetch(`/api/announcements/${id}`)
          if (announcementResponse.ok) {
            announcementData = await announcementResponse.json()
            setAnnouncement(announcementData.announcement)
            
            // Get organization details for private API
            const orgResponse = await fetch(`/api/organizations/by-slug/${slug}`)
            if (orgResponse.ok) {
              const orgData = await orgResponse.json()
              setOrganization(orgData.organization)
            }
          } else {
            // Both APIs failed
            if (announcementResponse.status === 401) {
              setError('This announcement requires you to be logged in. Please sign in to view this content.')
            } else if (announcementResponse.status === 403) {
              setError('You do not have permission to view this announcement.')
            } else if (announcementResponse.status === 404) {
              setError('Announcement not found. It may have been removed or is not publicly accessible.')
            } else {
              setError('Failed to load announcement. Please try again later.')
            }
          }
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
          is_active: true
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
      <div 
        className="min-h-screen"
        style={{
          background: `linear-gradient(135deg, ${themeColors.primaryLight} 0%, ${themeColors.background} 50%, ${themeColors.primaryLight} 100%)`
        }}
      >
        <UnifiedNavigation config={getNavigationConfig()} userRole="admin" />
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
    const isAuthError = error?.includes('requires you to be logged in')
    const isPermissionError = error?.includes('permission')
    
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <UnifiedNavigation config={getNavigationConfig()} userRole="admin" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className={`rounded-lg p-6 ${
            isAuthError 
              ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
              : isPermissionError
              ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
          }`}>
            <div className="text-center">
              <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full mb-4 ${
                isAuthError 
                  ? 'bg-blue-100 dark:bg-blue-900'
                  : isPermissionError
                  ? 'bg-yellow-100 dark:bg-yellow-900'
                  : 'bg-red-100 dark:bg-red-900'
              }`}>
                {isAuthError ? (
                  <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                ) : isPermissionError ? (
                  <Shield className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                ) : (
                  <EyeOff className="h-6 w-6 text-red-600 dark:text-red-400" />
                )}
              </div>
              
              <h3 className={`text-lg font-medium mb-2 ${
                isAuthError 
                  ? 'text-blue-800 dark:text-blue-200'
                  : isPermissionError
                  ? 'text-yellow-800 dark:text-yellow-200'
                  : 'text-red-800 dark:text-red-200'
              }`}>
                {isAuthError 
                  ? 'Sign In Required'
                  : isPermissionError
                  ? 'Access Restricted'
                  : 'Announcement Not Found'
                }
              </h3>
              
              <p className={`mb-6 ${
                isAuthError 
                  ? 'text-blue-700 dark:text-blue-300'
                  : isPermissionError
                  ? 'text-yellow-700 dark:text-yellow-300'
                  : 'text-red-700 dark:text-red-300'
              }`}>
                {error || 'This announcement could not be found or is no longer available.'}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {isAuthError && (
                  <>
                    <Link
                      href="/sign-in"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/sign-up"
                      className="inline-flex items-center px-4 py-2 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Create Account
                    </Link>
                  </>
                )}
                
                <Link
                  href={`/o/${organization?.slug || params.slug}/announcements`}
                  className="inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
                  style={{
                    borderColor: themeColors.primary,
                    color: themeColors.primary,
                    backgroundColor: themeColors.cardBackground
                  }}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Announcements
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const eventDate = announcement.start_date || announcement.created_at
  const formattedEventDate = formatEventDate(eventDate)
  const hasTime = announcement.start_date && announcement.start_date !== announcement.created_at

  return (
    <div 
      className="min-h-screen"
      style={{
        background: `linear-gradient(135deg, ${themeColors.primaryLight} 0%, ${themeColors.background} 50%, ${themeColors.primaryLight} 100%)`
      }}
    >
      <UnifiedNavigation config={getNavigationConfig()} userRole="admin" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href={`/o/${organization.slug}/announcements`}
            className="inline-flex items-center mb-4 transition-colors"
            style={{
              color: themeColors.primary
            }}
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
                {!announcement.is_active && (
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
        <div 
          className="rounded-lg shadow-sm border overflow-hidden"
          style={{
            backgroundColor: themeColors.cardBackground,
            borderColor: themeColors.primary
          }}
        >
          {/* Event Date Header */}
          <div 
            className="border-b p-6"
            style={{ 
              backgroundColor: themeColors.primaryLight,
              borderColor: themeColors.primary
            }}
          >
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div 
                  className="text-4xl font-bold"
                  style={{ color: themeColors.primary }}
                >
                  {formattedEventDate.day}
                </div>
                <div 
                  className="text-lg font-medium uppercase tracking-wide"
                  style={{ color: themeColors.primaryDark }}
                >
                  {formattedEventDate.month}
                </div>
                <div 
                  className="text-sm"
                  style={{ color: themeColors.primary }}
                >
                  {formattedEventDate.year}
                </div>
                {hasTime && (
                  <div 
                    className="text-lg font-bold mt-2"
                    style={{ color: themeColors.primary }}
                  >
                    {formattedEventDate.time}
                  </div>
                )}
              </div>
            </div>
            <div className="text-center mt-4">
              <div 
                className="flex items-center justify-center space-x-1"
                style={{ color: themeColors.primary }}
              >
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
                announcement.is_active 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
              }`}>
                {announcement.is_active ? 'Active' : 'Inactive'}
              </span>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                announcement.visibility === 'public'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : announcement.visibility === 'members_only'
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
              }`}>
                {announcement.visibility}
              </span>
              {announcement.priority !== 'normal' && (
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  announcement.priority === 'urgent'
                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    : announcement.priority === 'high'
                    ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }`}>
                  {announcement.priority}
                </span>
              )}
            </div>

            {/* Body */}
            <div className="prose dark:prose-invert max-w-none mb-6">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {announcement.content}
              </p>
            </div>

            {/* Survey Action Button */}
            {announcement.title.toLowerCase().includes('survey') && (
              <div className="mb-6">
                <div 
                  className="border rounded-lg p-6"
                  style={{ 
                    backgroundColor: themeColors.primaryLight,
                    borderColor: themeColors.primary
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 
                        className="text-lg font-semibold mb-2"
                        style={{ color: themeColors.primaryDark }}
                      >
                        Ready to take the survey?
                      </h3>
                      <p 
                        className="text-sm"
                        style={{ color: themeColors.primary }}
                      >
                        This survey takes 10-12 minutes and helps us tailor our workshops and resources to your needs.
                      </p>
                    </div>
                    <Link
                      href={`/o/${organization.slug}/surveys/2bd6aaa7-69e5-441e-bc26-607d841e046d`}
                      className="text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 hover:opacity-90"
                      style={{ 
                        backgroundColor: themeColors.primary
                      }}
                    >
                      <FileCheck className="h-5 w-5" />
                      <span>Take Survey</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Key People */}
            {announcement.key_people && announcement.key_people.length > 0 && (
              <div className="flex items-center space-x-2 mb-6">
                <User className="h-5 w-5 text-gray-400" />
                <div className="flex flex-wrap gap-2">
                  {announcement.key_people.map((person: any, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full"
                    >
                      {person.name || person}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Event Details */}
            {(announcement.location || announcement.type || announcement.start_date || announcement.end_date) && (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Event Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {announcement.type && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Type:</span>
                      <span className="px-2 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                        {announcement.type.replace('_', ' ')}
                      </span>
                    </div>
                  )}
                  {announcement.location && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Location:</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{announcement.location}</span>
                    </div>
                  )}
                  {announcement.start_date && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Start Date:</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {new Date(announcement.start_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {announcement.end_date && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">End Date:</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {new Date(announcement.end_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
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
                  
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4" />
                    <span>Updated: {formatDate(announcement.updated_at)}</span>
                  </div>
                  
                  {announcement.end_date && (
                    <div className="flex items-center space-x-2">
                      <EyeOff className="h-4 w-4" />
                      <span>Ends: {formatDate(announcement.end_date)}</span>
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
