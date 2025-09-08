'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Bell, Plus, Calendar, User, Tag, Eye, EyeOff, Shield, Play } from 'lucide-react'
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
  type?: string
  sub_type?: string
}

interface Organization {
  id: string
  name: string
  slug: string
}

export default function OrganizationAnnouncementsPage() {
  const params = useParams()
  const slug = params.slug as string
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'published' | 'pending' | 'draft'>('all')
  const [userRole, setUserRole] = useState<string>('')

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
        
        const response = await fetch(`/api/organizations/by-slug/${slug}/announcements`)
        
        if (!response.ok) {
          throw new Error(`Failed to load announcements: ${response.status}`)
        }
        
        const data = await response.json()
        setAnnouncements(data.announcements || [])
        setOrganization(data.organization)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load announcements')
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      loadData()
    }
  }, [slug])

  const filteredAnnouncements = announcements.filter(announcement => {
    if (filter === 'all') return true
    return announcement.status === filter
  })

  // Sort announcements by date (latest first)
  const sortedAnnouncements = filteredAnnouncements.sort((a, b) => {
    const dateA = new Date(a.scheduled_at || a.created_at)
    const dateB = new Date(b.scheduled_at || b.created_at)
    return dateB.getTime() - dateA.getTime()
  })

  // Utility functions for date handling
  const isToday = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isPast = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset time to start of day
    return date < today
  }

  const isUpcoming = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    today.setHours(23, 59, 59, 999) // End of today
    return date > today
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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
      })
    }
  }

  const isAdmin = userRole === 'super_admin' || userRole === 'org_admin' || userRole === 'moderator'

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  const getTypeBadge = (type?: string) => {
    if (!type) return null;
    
    const typeStyles = {
      urgent: { bg: 'bg-red-100', text: 'text-red-800', label: 'Urgent' },
      facility: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Facility' },
      event: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Event' },
      opportunity: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Opportunity' },
      administrative: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Admin' },
    };
    
    const style = typeStyles[type as keyof typeof typeStyles] || typeStyles.event;
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${style.bg} ${style.text}`}>
        {style.label}
      </span>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              ))}
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {organization?.name} Announcements
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Manage and view all announcements for this organization
              </p>
            </div>
            <div className="flex space-x-3">
              <Link
                href={`/o/${slug}/announcements/carousel`}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Play className="h-4 w-4" />
                <span>Carousel View</span>
              </Link>
              
              <Link
                href={`/o/${slug}/announcements/create`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>New Announcement</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex space-x-2">
            {[
              { key: 'all', label: 'All', count: announcements.length },
              { key: 'published', label: 'Published', count: announcements.filter(a => a.status === 'published').length },
              { key: 'pending', label: 'Pending', count: announcements.filter(a => a.status === 'pending').length },
              { key: 'draft', label: 'Draft', count: announcements.filter(a => a.status === 'draft').length }
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === key
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {label} ({count})
              </button>
            ))}
          </div>
        </div>

        {/* Announcements List */}
        <div className="space-y-4">
          {sortedAnnouncements.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No announcements found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {filter === 'all' 
                  ? 'No announcements have been created yet.'
                  : `No ${filter} announcements found.`
                }
              </p>
              <Link
                href={`/o/${slug}/announcements/create`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center space-x-2 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Create First Announcement</span>
              </Link>
            </div>
          ) : (
            sortedAnnouncements.map((announcement) => {
              // Determine the event date - prioritize scheduled_at, then created_at
              const eventDate = announcement.scheduled_at || announcement.created_at
              const formattedEventDate = formatEventDate(eventDate)
              
              // Get time information if available
              const hasTime = announcement.scheduled_at && announcement.scheduled_at !== announcement.created_at
              const timeInfo = hasTime && announcement.scheduled_at ? new Date(announcement.scheduled_at).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              }) : null

              // Determine date status
              const isEventToday = isToday(eventDate)
              const isEventPast = isPast(eventDate)
              const isEventUpcoming = isUpcoming(eventDate)
              
              return (
                <div
                  key={announcement.id}
                  className={`rounded-lg border transition-shadow ${
                    isEventPast 
                      ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-600 opacity-75' 
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md'
                  }`}
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Event Date Column - Prominent on mobile top, left side on desktop */}
                    <div className={`md:w-32 flex-shrink-0 md:border-r border-b md:border-b-0 border-gray-200 dark:border-gray-700 p-4 flex flex-row md:flex-col items-center justify-center relative ${
                      isEventPast 
                        ? 'bg-gray-100 dark:bg-gray-700/50' 
                        : isEventToday 
                          ? 'bg-green-50 dark:bg-green-900/20' 
                          : 'bg-blue-50 dark:bg-blue-900/20'
                    }`}>
                      {/* Today Badge */}
                      {isEventToday && (
                        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                          TODAY
                        </div>
                      )}
                      
                      <div className="text-center flex items-center md:flex-col space-x-2 md:space-x-0">
                        <div className={`text-2xl md:text-3xl font-bold ${
                          isEventPast 
                            ? 'text-gray-500 dark:text-gray-400' 
                            : isEventToday 
                              ? 'text-green-600 dark:text-green-400' 
                              : 'text-blue-600 dark:text-blue-400'
                        }`}>
                          {formattedEventDate.day}
                        </div>
                        <div className="md:block">
                          <div className={`text-sm font-medium uppercase tracking-wide ${
                            isEventPast 
                              ? 'text-gray-500 dark:text-gray-400' 
                              : isEventToday 
                                ? 'text-green-600 dark:text-green-400' 
                                : 'text-blue-600 dark:text-blue-400'
                          }`}>
                            {formattedEventDate.month}
                          </div>
                          <div className={`text-xs ${
                            isEventPast 
                              ? 'text-gray-400 dark:text-gray-500' 
                              : isEventToday 
                                ? 'text-green-500 dark:text-green-300' 
                                : 'text-blue-500 dark:text-blue-300'
                          }`}>
                            {formattedEventDate.year}
                          </div>
                          {timeInfo && (
                            <div className={`text-xs mt-1 font-medium ${
                              isEventPast 
                                ? 'text-gray-400 dark:text-gray-500' 
                                : isEventToday 
                                  ? 'text-green-500 dark:text-green-300' 
                                  : 'text-blue-500 dark:text-blue-300'
                            }`}>
                              {timeInfo}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 p-4 md:p-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4 space-y-3 md:space-y-0">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className={`text-lg font-semibold ${
                              isEventPast 
                                ? 'text-gray-500 dark:text-gray-400' 
                                : 'text-gray-900 dark:text-white'
                            }`}>
                              {announcement.title}
                            </h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(announcement.status)}`}>
                              {announcement.status}
                            </span>
                            {announcement.priority > 0 && (
                              <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full">
                                Priority {announcement.priority}
                              </span>
                            )}
                            {isEventPast && (
                              <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 rounded-full">
                                Past Event
                              </span>
                            )}
                            {getTypeBadge(announcement.type)}
                          </div>
                          
                          <p className={`mb-4 line-clamp-3 ${
                            isEventPast 
                              ? 'text-gray-400 dark:text-gray-500' 
                              : 'text-gray-600 dark:text-gray-400'
                          }`}>
                            {announcement.body}
                          </p>
                          
                          {/* Admin-only information with distinct styling */}
                          {isAdmin && (
                            <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-4">
                              <div className="flex items-center mb-2">
                                <Shield className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mr-2" />
                                <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                  Admin Information
                                </span>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-yellow-700 dark:text-yellow-300">
                                <div className="flex items-center space-x-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>Created: {formatDate(announcement.created_at)}</span>
                                </div>
                                
                                {announcement.published_at && (
                                  <div className="flex items-center space-x-1">
                                    <Eye className="h-3 w-3" />
                                    <span>Published: {formatDate(announcement.published_at)}</span>
                                  </div>
                                )}
                                
                                {announcement.expires_at && (
                                  <div className="flex items-center space-x-1">
                                    <EyeOff className="h-3 w-3" />
                                    <span>Expires: {formatDate(announcement.expires_at)}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {/* Public information */}
                          <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400 mb-3">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span className="font-medium">{formattedEventDate.full}</span>
                            </div>
                          </div>
                          
                          {announcement.tags && announcement.tags.length > 0 && (
                            <div className="flex items-center space-x-2">
                              <Tag className="h-4 w-4 text-gray-400" />
                              <div className="flex flex-wrap gap-1">
                                {announcement.tags.map((tag, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2 md:ml-4">
                          <Link
                            href={`/o/${slug}/announcements/${announcement.id}`}
                            className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                          >
                            View
                          </Link>
                          {isAdmin && (
                            <Link
                              href={`/o/${slug}/announcements/${announcement.id}/edit`}
                              className="text-gray-600 hover:text-gray-500 text-sm font-medium"
                            >
                              Edit
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
