'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useParams } from 'next/navigation'
import { Bell, Users, Building2, Calendar, MapPin, Globe, Eye, Edit } from 'lucide-react'
import Navigation from '@/components/ui/Navigation'
import ArtistIcon from '@/components/ui/ArtistIcon'

interface Organization {
  id: string
  name: string
  slug: string
  artist_icon?: string
  banner_image?: string
  created_at: string
}

interface Announcement {
  id: string
  title: string
  body: string
  status: string
  priority: string
  created_at: string
  published_at: string | null
  expires_at: string | null
  scheduled_at?: string
}

interface User {
  id: string
  clerk_user_id: string
  email: string
  role: string
  created_at: string
}

export default function OrganizationPage() {
  const { user, isLoaded } = useUser()
  const params = useParams()
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [recentAnnouncements, setRecentAnnouncements] = useState<Announcement[]>([])
  const [userCount, setUserCount] = useState(0)
  const [staffCount, setStaffCount] = useState(0)
  const [artistCount, setArtistCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState('')

  useEffect(() => {
    async function loadData() {
      if (!user || !params.slug) return
      
      try {
        // Get user profile and role
        const userResponse = await fetch('/api/users/me')
        if (userResponse.ok) {
          const userData = await userResponse.json()
          setUserRole(userData.role || 'resident')
        }

        const slug = params.slug as string

        // Get organization details
        const orgResponse = await fetch(`/api/organizations/by-slug/${slug}`)
        if (orgResponse.ok) {
          const orgData = await orgResponse.json()
          setOrganization(orgData.organization)
        }

        // Get recent announcements
        const announcementsResponse = await fetch(`/api/organizations/by-slug/${slug}/announcements?limit=5`)
        if (announcementsResponse.ok) {
          const announcementsData = await announcementsResponse.json()
          setRecentAnnouncements(announcementsData.announcements || [])
        }

        // Get user count and breakdown
        const usersResponse = await fetch(`/api/organizations/${slug}/users`)
        if (usersResponse.ok) {
          const usersData = await usersResponse.json()
          const totalUsers = usersData.users?.length || 0
          const memberships = usersData.memberships || []
          const artistProfiles = usersData.artist_profiles || []
          
          // Calculate staff count (memberships with admin/moderator roles)
          const staffMembers = memberships.filter((m: any) => 
            ['super_admin', 'org_admin', 'moderator', 'staff'].includes(m.role)
          )
          
          console.log('Debug - Memberships:', memberships)
          console.log('Debug - Staff members:', staffMembers)
          console.log('Debug - Artist profiles:', artistProfiles)
          
          setUserCount(totalUsers)
          setStaffCount(staffMembers.length)
          setArtistCount(artistProfiles.length)
        }

      } catch (error) {
        console.error('Error loading organization data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (isLoaded && user) {
      loadData()
    }
  }, [user, isLoaded, params.slug])

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!organization) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <Building2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Organization Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              The organization you're looking for doesn't exist or you don't have access to it.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      {/* Banner Background */}
      {organization?.banner_image && (
        <div className="relative h-64 md:h-80 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${organization.banner_image})`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-gray-900" />
          <div className="relative h-full flex items-end">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 w-full">
              <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
                {organization.name}
              </h1>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {organization.name}
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Active
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  Member since {new Date(organization.created_at).getFullYear()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center">
              <Bell className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Announcements</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {recentAnnouncements.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center">
              <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Members</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {userCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <a
              href={`/o/${organization.slug}/announcements`}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">Announcements</p>
                </div>
              </div>
            </a>

            <a
              href={`/o/${organization.slug}/announcements/display`}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-sm p-3 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <Eye className="h-5 w-5 text-white mr-2" />
                <div>
                  <p className="font-medium text-white text-sm">View Announcements</p>
                  <p className="text-xs text-blue-100">Display Mode</p>
                </div>
              </div>
            </a>

            <a
              href={`/o/${organization.slug}/users?filter=staff`}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <Users className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">Staff</p>
                </div>
              </div>
            </a>

            <a
              href={`/o/${organization.slug}/artists`}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <ArtistIcon organization={organization} className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">Artists</p>
                </div>
              </div>
            </a>

            {(userRole === 'org_admin' || userRole === 'super_admin' || userRole === 'moderator') && (
              <a
                href={`/o/${organization.slug}/announcements/create`}
                className="bg-blue-600 text-white rounded-lg shadow-sm p-3 hover:bg-blue-700 transition-colors"
              >
                <div className="flex items-center">
                  <Edit className="h-5 w-5 mr-2" />
                  <div>
                    <p className="font-medium text-sm">Create</p>
                  </div>
                </div>
              </a>
            )}
          </div>
        </div>

        {/* Recent Activity - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Announcements */}
          {recentAnnouncements.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  <span className="hidden md:inline">Recent </span><span className="md:hidden">Recent</span><span className="hidden md:inline">Announcements</span>
                </h2>
                <a
                  href={`/o/${organization.slug}/announcements`}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 text-sm font-medium"
                >
                  View all →
                </a>
              </div>
              <div className="space-y-3">
                {recentAnnouncements.slice(0, 3).map((announcement) => {
                  // Determine the event date - prioritize scheduled_at, then created_at
                  const eventDate = announcement.scheduled_at || announcement.created_at
                  const date = new Date(eventDate)
                  
                  // Convert to EST
                  const estDate = new Date(date.toLocaleString("en-US", {timeZone: "America/New_York"}))
                  const formattedDate = {
                    day: estDate.getDate(),
                    month: estDate.toLocaleDateString('en-US', { month: 'short' }),
                    year: estDate.getFullYear(),
                    startTime: announcement.scheduled_at ? estDate.toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                      timeZone: 'America/New_York'
                    }) : null,
                    endTime: announcement.expires_at ? new Date(announcement.expires_at).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                      timeZone: 'America/New_York'
                    }) : null
                  }
                  
                  return (
                    <div key={announcement.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                      <div className="flex">
                        {/* Calendar Date Column */}
                        <div className="w-16 flex-shrink-0 bg-blue-50 dark:bg-blue-900/20 border-r border-gray-200 dark:border-gray-700 p-2 flex flex-col items-center justify-center">
                          <div className="text-center">
                            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                              {formattedDate.day}
                            </div>
                            <div className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                              {formattedDate.month}
                            </div>
                            {formattedDate.startTime && (
                              <div className="text-xs text-blue-500 dark:text-blue-300 mt-1 font-medium">
                                {formattedDate.startTime}
                              </div>
                            )}
                            {formattedDate.endTime && (
                              <div className="text-xs text-blue-500 dark:text-blue-300 font-medium">
                                - {formattedDate.endTime}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-gray-900 dark:text-white mb-1 text-sm truncate">
                                {announcement.title}
                              </h3>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                                {announcement.body.substring(0, 100)}...
                              </p>
                              <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                                <span className={`px-2 py-1 rounded-full ${
                                  announcement.status === 'published' 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                }`}>
                                  {announcement.status}
                                </span>
                                <span>{new Date(announcement.created_at).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ml-2">
                              <Eye className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Members Summary */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Members
              </h2>
              <a
                href={`/o/${organization.slug}/users`}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 text-sm font-medium"
              >
                View all →
              </a>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Members</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{userCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Active Artists</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {artistCount}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Staff</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {staffCount}
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                <a
                  href={`/o/${organization.slug}/users`}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 text-sm font-medium"
                >
                  Manage Members →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
