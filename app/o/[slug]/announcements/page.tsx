'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Bell, Plus, Calendar, User, Tag, Eye, EyeOff, Shield, Play, MapPin, Users, Building2, ExternalLink, Clock, Info, FileCheck, Copy } from 'lucide-react'
import { UnifiedNavigation, ooliteConfig, bakehouseConfig } from '@/components/navigation'
import { AnnouncementIdDisplay } from '@/components/admin/AnnouncementIdDisplay'
import { BackgroundPattern } from '@/components/BackgroundPattern'
import { AnnouncementType, AnnouncementSubType } from '@/types/announcement'
import { PageFooter } from '@/components/common/PageFooter'

interface Announcement {
  id: string
  title: string
  content: string
  type: string
  priority: string
  visibility: string
  start_date: string | null
  end_date: string | null
  location: string | null
  key_people: any[]
  metadata: any
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
}

export default function OrganizationAnnouncementsPage() {
  const params = useParams()
  const slug = params.slug as string
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'public' | 'internal' | 'members_only'>('all')
  const [userRole, setUserRole] = useState<string>('')
  const [editingEndDate, setEditingEndDate] = useState<string | null>(null)
  const [tempEndDate, setTempEndDate] = useState<string>('')
  const [updating, setUpdating] = useState<string | null>(null)

  // Get navigation config based on organization slug
  const getNavigationConfig = () => {
    switch (slug) {
      case 'oolite':
        return ooliteConfig
      case 'bakehouse':
        return bakehouseConfig
      default:
        return ooliteConfig // Default fallback
    }
  }

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        console.log('🔍 Loading announcements for slug:', slug)
        
        // Try to get user role (optional - don't fail if not authenticated)
        try {
          console.log('👤 Attempting to fetch user data...')
          const userResponse = await fetch('/api/users/me')
          console.log('👤 User response status:', userResponse.status)
          
          if (userResponse.ok) {
            const userData = await userResponse.json()
            console.log('👤 User data:', userData)
            setUserRole(userData.role || 'resident')
          } else {
            console.log('👤 User not authenticated, status:', userResponse.status)
          }
        } catch (userError) {
          // User not authenticated - that's okay, we'll show public announcements
          console.log('👤 User not authenticated, showing public announcements only:', userError)
        }
        
        // Try to get announcements - first try authenticated endpoint, then public
        console.log('📢 Attempting to fetch announcements from authenticated endpoint...')
        let response = await fetch(`/api/organizations/by-slug/${slug}/announcements`)
        console.log('📢 Authenticated endpoint response status:', response.status)
        
        if (!response.ok) {
          console.log('📢 Authenticated endpoint failed, status:', response.status)
          
          if (response.status === 401) {
            console.log('📢 Unauthorized, trying public endpoint...')
            // If unauthorized, try the public endpoint
            response = await fetch(`/api/organizations/by-slug/${slug}/announcements/public`)
            console.log('📢 Public endpoint response status:', response.status)
          } else {
            // For other errors, also try public endpoint as fallback
            console.log('📢 Other error, trying public endpoint as fallback...')
            response = await fetch(`/api/organizations/by-slug/${slug}/announcements/public`)
            console.log('📢 Public endpoint fallback response status:', response.status)
          }
        }
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error('📢 Both endpoints failed. Last response:', response.status, errorText)
          throw new Error(`Failed to load announcements: ${response.status} - ${errorText}`)
        }
        
        const data = await response.json()
        console.log('📢 Successfully loaded announcements:', data)
        setAnnouncements(data.announcements || [])
        setOrganization(data.organization)
      } catch (err) {
        console.error('❌ Error loading announcements:', err)
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
    if (filter === 'active') return announcement.is_active
    if (filter === 'inactive') return !announcement.is_active
    if (filter === 'public') return announcement.visibility === 'public'
    if (filter === 'internal') return announcement.visibility === 'internal'
    if (filter === 'members_only') return announcement.visibility === 'members_only'
    return true
  })

  // Sort announcements by date (latest first)
  const sortedAnnouncements = filteredAnnouncements.sort((a, b) => {
    const dateA = new Date(a.created_at)
    const dateB = new Date(b.created_at)
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

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toISOString().split('T')[0]
  }

  const handleEditEndDate = (announcementId: string, currentEndDate?: string) => {
    setEditingEndDate(announcementId)
    setTempEndDate(formatDateForInput(currentEndDate || ''))
  }

  const handleCancelEdit = () => {
    setEditingEndDate(null)
    setTempEndDate('')
  }

  const handleSaveEndDate = async (announcementId: string) => {
    try {
      setUpdating(announcementId)
      
      const response = await fetch(`/api/announcements/${announcementId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          end_date: tempEndDate ? new Date(tempEndDate).toISOString() : null
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update end date')
      }

      // Update the local state
      setAnnouncements(prev => prev.map(announcement => 
        announcement.id === announcementId 
          ? { ...announcement, end_date: tempEndDate ? new Date(tempEndDate).toISOString() : null }
          : announcement
      ))

      setEditingEndDate(null)
      setTempEndDate('')
    } catch (error) {
      console.error('Error updating end date:', error)
      alert('Failed to update end date. Please try again.')
    } finally {
      setUpdating(null)
    }
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

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  }

  const getVisibilityColor = (visibility: string) => {
    switch (visibility) {
      case 'public':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'internal':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'members_only':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  // Determine announcement type and subtype for pattern selection
  const getAnnouncementType = (announcement: Announcement): AnnouncementType => {
    const title = announcement.title.toLowerCase()
    const type = announcement.type?.toLowerCase()
    
    if (title.includes('urgent') || announcement.priority === 'high') return 'urgent'
    if (title.includes('event') || type === 'event') return 'event'
    if (title.includes('facility') || type === 'facility') return 'facility'
    if (title.includes('opportunity') || type === 'opportunity') return 'opportunity'
    if (title.includes('administrative') || type === 'administrative') return 'administrative'
    
    // Organization-specific types
    if (slug === 'bakehouse') {
      if (title.includes('attention') && title.includes('artist')) return 'attention_artists'
      if (title.includes('attention') && title.includes('public')) return 'attention_public'
      if (title.includes('fun fact')) return 'fun_fact'
      if (title.includes('promotion')) return 'promotion'
      if (title.includes('gala')) return 'gala_announcement'
    }
    
    return 'opportunity' // Default fallback
  }

  const getAnnouncementSubType = (announcement: Announcement): AnnouncementSubType => {
    const title = announcement.title.toLowerCase()
    
    if (title.includes('workshop')) return 'workshop'
    if (title.includes('exhibition')) return 'exhibition'
    if (title.includes('meeting')) return 'meeting'
    if (title.includes('deadline')) return 'deadline'
    if (title.includes('survey')) return 'survey'
    
    return 'general'
  }

  const getTypeBadge = (type?: string) => {
    if (!type) return null;
    
    const typeStyles = {
      urgent: { bg: 'bg-red-100', text: 'text-red-800', label: 'Urgent' },
      facility: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Facility' },
      event: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Event' },
      opportunity: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Opportunity' },
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
        <UnifiedNavigation config={getNavigationConfig()} userRole={userRole as any} />
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
        <UnifiedNavigation config={getNavigationConfig()} userRole={userRole as any} />
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
      <UnifiedNavigation config={getNavigationConfig()} userRole="admin" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Announcements
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Manage and view all announcements for this organization
              </p>
            </div>
            <div className="flex space-x-3">
              <Link
                href={`/o/${slug}/announcements/display`}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Eye className="h-4 w-4" />
                <span>Display Mode</span>
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

        {/* Admin Summary - only show for admins */}
        {isAdmin && announcements.length > 0 && (
          <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Admin Quick Access
              </h3>
              <span className="text-xs text-yellow-600 dark:text-yellow-400">
                {announcements.length} announcement{announcements.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="flex items-center justify-between bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 p-2">
                  <div className="flex-1 min-w-0">
                    <code className="text-xs font-mono text-gray-700 dark:text-gray-300 truncate block">
                      {announcement.id}
                    </code>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {announcement.title}
                    </p>
                  </div>
                  <button
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(announcement.id)
                        console.log('Copied ID:', announcement.id)
                      } catch (err) {
                        console.error('Failed to copy ID:', err)
                      }
                    }}
                    className="ml-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    title="Copy ID"
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All', count: announcements.length },
              { key: 'active', label: 'Active', count: announcements.filter(a => a.is_active).length },
              { key: 'inactive', label: 'Inactive', count: announcements.filter(a => !a.is_active).length },
              { key: 'public', label: 'Public', count: announcements.filter(a => a.visibility === 'public').length },
              { key: 'internal', label: 'Internal', count: announcements.filter(a => a.visibility === 'internal').length },
              { key: 'members_only', label: 'Members Only', count: announcements.filter(a => a.visibility === 'members_only').length }
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
              // Determine the event date - use created_at
              const eventDate = announcement.created_at
              const formattedEventDate = formatEventDate(eventDate)
              
              // Get time information if available
              const hasTime = false // No scheduled_at field available
              const timeInfo = null

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
                  {/* Admin ID Display - only show for admins */}
                  {isAdmin && (
                    <AnnouncementIdDisplay
                      announcement={announcement}
                      onEdit={(id) => {
                        console.log('Edit announcement ID:', id)
                        // TODO: Implement edit functionality
                      }}
                      onDelete={(id) => {
                        console.log('Delete announcement ID:', id)
                        // Remove the announcement from the local state
                        setAnnouncements(prev => prev.filter(a => a.id !== id))
                      }}
                    />
                  )}
                  
                  <div className="flex flex-col md:flex-row">
                    {/* Event Date Column with Background Pattern - Prominent on mobile top, left side on desktop */}
                    <div className={`md:w-32 flex-shrink-0 md:border-r border-b md:border-b-0 border-gray-200 dark:border-gray-700 p-4 flex flex-row md:flex-col items-center justify-center relative overflow-hidden ${
                      isEventPast 
                        ? 'bg-gray-100 dark:bg-gray-700/50' 
                        : isEventToday 
                          ? 'bg-green-50 dark:bg-green-900/20' 
                          : 'bg-blue-50 dark:bg-blue-900/20'
                    }`}>
                      {/* Background Pattern */}
                      <div className="absolute inset-0 opacity-5">
                        <BackgroundPattern
                          type={getAnnouncementType(announcement)}
                          subType={getAnnouncementSubType(announcement)}
                          width={128}
                          height={120}
                          organizationSlug={slug}
                        />
                      </div>
                      {/* Today Badge */}
                      {isEventToday && (
                        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                          TODAY
                        </div>
                      )}
                      
                      <div className="text-center flex items-center md:flex-col space-x-2 md:space-x-0 relative z-10">
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
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(announcement.is_active)}`}>
                              {announcement.is_active ? 'Active' : 'Inactive'}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getVisibilityColor(announcement.visibility)}`}>
                              {announcement.visibility}
                            </span>
                            {announcement.priority !== 'normal' && (
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                announcement.priority === 'urgent'
                                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                  : announcement.priority === 'high'
                                  ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                              }`}>
                                {announcement.priority}
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
                            {announcement.content}
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
                                
                                {announcement.created_at && (
                                  <div className="flex items-center space-x-1">
                                    <Eye className="h-3 w-3" />
                                    <span>Published: {formatDate(announcement.created_at)}</span>
                                  </div>
                                )}
                                
                                {announcement.end_date && (
                                  <div className="flex items-center space-x-1">
                                    <EyeOff className="h-3 w-3" />
                                    <span>Expires: {formatDate(announcement.end_date)}</span>
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
                          
                          {/* Enhanced Metadata Display */}
                          <div className="space-y-3">
                            {/* Key People */}
                            {announcement.key_people && announcement.key_people.length > 0 && (
                              <div className="flex items-center space-x-2">
                                <User className="h-4 w-4 text-gray-400" />
                                <div className="flex flex-wrap gap-1">
                                  {announcement.key_people.map((person: any, index: number) => (
                                    <span
                                      key={index}
                                      className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
                                    >
                                      {person.name || person}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Location */}
                            {announcement.location && (
                              <div className="flex items-center space-x-2">
                                <MapPin className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  {announcement.location}
                                </span>
                              </div>
                            )}

                            {/* Date Range */}
                            {(announcement.start_date || announcement.end_date) && (
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4 text-gray-400" />
                                <div className="flex items-center space-x-2">
                                  {announcement.start_date && (
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                      {new Date(announcement.start_date).toLocaleDateString()}
                                    </span>
                                  )}
                                  {announcement.start_date && announcement.end_date && (
                                    <span className="text-gray-400">-</span>
                                  )}
                                  {announcement.end_date && (
                                    <div className="flex items-center space-x-2">
                                      {editingEndDate === announcement.id ? (
                                        <div className="flex items-center space-x-2">
                                          <input
                                            type="date"
                                            value={tempEndDate}
                                            onChange={(e) => setTempEndDate(e.target.value)}
                                            className="text-sm border border-gray-300 rounded px-2 py-1"
                                            disabled={updating === announcement.id}
                                          />
                                          <button
                                            onClick={() => handleSaveEndDate(announcement.id)}
                                            disabled={updating === announcement.id}
                                            className="text-green-600 hover:text-green-500 text-xs font-medium disabled:opacity-50"
                                          >
                                            {updating === announcement.id ? 'Saving...' : 'Save'}
                                          </button>
                                          <button
                                            onClick={handleCancelEdit}
                                            disabled={updating === announcement.id}
                                            className="text-gray-600 hover:text-gray-500 text-xs font-medium disabled:opacity-50"
                                          >
                                            Cancel
                                          </button>
                                        </div>
                                      ) : (
                                        <div className="flex items-center space-x-2">
                                          <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {new Date(announcement.end_date).toLocaleDateString()}
                                          </span>
                                          {isAdmin && (
                                            <button
                                              onClick={() => handleEditEndDate(announcement.id, announcement.end_date || undefined)}
                                              className="text-blue-600 hover:text-blue-500 text-xs font-medium"
                                            >
                                              Edit
                                            </button>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* End Date Only (when no start date) */}
                            {!announcement.start_date && announcement.end_date && (
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4 text-gray-400" />
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm text-gray-600 dark:text-gray-400">
                                    Ends: 
                                  </span>
                                  {editingEndDate === announcement.id ? (
                                    <div className="flex items-center space-x-2">
                                      <input
                                        type="date"
                                        value={tempEndDate}
                                        onChange={(e) => setTempEndDate(e.target.value)}
                                        className="text-sm border border-gray-300 rounded px-2 py-1"
                                        disabled={updating === announcement.id}
                                      />
                                      <button
                                        onClick={() => handleSaveEndDate(announcement.id)}
                                        disabled={updating === announcement.id}
                                        className="text-green-600 hover:text-green-500 text-xs font-medium disabled:opacity-50"
                                      >
                                        {updating === announcement.id ? 'Saving...' : 'Save'}
                                      </button>
                                      <button
                                        onClick={handleCancelEdit}
                                        disabled={updating === announcement.id}
                                        className="text-gray-600 hover:text-gray-500 text-xs font-medium disabled:opacity-50"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="flex items-center space-x-2">
                                      <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {new Date(announcement.end_date).toLocaleDateString()}
                                      </span>
                                      {isAdmin && (
                                        <button
                                          onClick={() => handleEditEndDate(announcement.id, announcement.end_date || undefined)}
                                          className="text-blue-600 hover:text-blue-500 text-xs font-medium"
                                        >
                                          Edit
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
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
                    
                    {/* Survey Action Button */}
                    {announcement.title.toLowerCase().includes('survey') && (
                      <div className="px-4 pb-4 md:px-6 md:pb-6">
                        <a
                          href={`/o/${slug}/surveys`}
                          className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                        >
                          <FileCheck className="w-3 h-3 mr-1" />
                          Take Survey
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}

          {/* Page Footer */}
          <PageFooter 
            organizationSlug={slug}
            showGetStarted={true}
            showGuidelines={true}
            showTerms={true}
          />
        </div>
      </div>
    </div>
  )
}
