'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Building2, 
  Bell, 
  Users, 
  BarChart3, 
  Plus,
  Calendar,
  MapPin,
  ArrowRight,
  Shield,
  Settings
} from 'lucide-react'
import Navigation from '@/components/ui/Navigation'
import { Badge } from '@/components/ui/Badge'
import OrganizationLogo from '@/components/ui/OrganizationLogo'

interface UserProfile {
  id: string
  clerk_user_id: string
  email: string
  first_name?: string
  last_name?: string
  role: string
  organization_id: string
  subscription_plan: string
  subscription_status: string
}

interface Organization {
  id: string
  name: string
  slug: string
  description?: string
  logo_url?: string
  artist_icon?: string
  banner_image?: string
}

interface Announcement {
  id: string
  title: string
  body?: string
  status: string
  created_at: string
  published_at?: string
  expires_at?: string
  scheduled_at?: string
  priority: number
  tags: string[]
  author_clerk_id: string
  org_id: string
  organization?: {
    name: string
    slug: string
  }
  author?: {
    name: string
    email: string
  }
}

export default function DashboardPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [recentAnnouncements, setRecentAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboardData() {
      if (!user) return

      try {
        // Load user profile and organization
        const userResponse = await fetch('/api/users/me')
        if (userResponse.ok) {
          const userData = await userResponse.json()
          setUserProfile(userData.user)
          setOrganization(userData.organization)
        }

        // Load recent announcements
        const announcementsResponse = await fetch('/api/announcements/recent')
        if (announcementsResponse.ok) {
          const announcementsData = await announcementsResponse.json()
          setRecentAnnouncements(announcementsData.announcements || [])
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (isLoaded && user) {
      loadDashboardData()
    }
  }, [user, isLoaded])

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    router.push('/sign-in')
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'error'
      case 'org_admin': return 'warning'
      case 'moderator': return 'info'
      case 'resident': return 'success'
      default: return 'default'
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'published': return 'success'
      case 'pending': return 'warning'
      case 'draft': return 'default'
      case 'rejected': return 'error'
      default: return 'default'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {userProfile?.first_name || user.firstName || 'User'}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your organization and announcements from your dashboard
          </p>
        </div>

        {/* User Info Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {user.imageUrl ? (
                <img 
                  src={user.imageUrl} 
                  alt="Profile" 
                  className="h-16 w-16 rounded-full"
                />
              ) : (
                <div className="h-16 w-16 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <Users className="h-8 w-8 text-gray-600 dark:text-gray-400" />
                </div>
              )}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {userProfile?.first_name && userProfile?.last_name 
                    ? `${userProfile.first_name} ${userProfile.last_name}`
                    : user.fullName || user.emailAddresses[0]?.emailAddress
                  }
                </h2>
                <p className="text-gray-600 dark:text-gray-400">{userProfile?.email}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant={getRoleBadgeColor(userProfile?.role || '')}>
                    {userProfile?.role?.replace('_', ' ') || 'User'}
                  </Badge>
                  {organization && (
                    <Badge variant="info">
                      {organization.name}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <Link
              href="/profile"
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Settings className="h-4 w-4 mr-2" />
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Organization Access */}
        {userProfile?.role === 'super_admin' && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Your Organizations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                href="/o/bakehouse"
                className="bg-white dark:bg-gray-800 rounded-lg p-4 hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center space-x-3">
                  <OrganizationLogo 
                    organization={{ name: 'Bakehouse Art Complex', slug: 'bakehouse' }}
                    size="md"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Bakehouse</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Art Complex</p>
                  </div>
                </div>
              </Link>
              
              <Link
                href="/o/oolite"
                className="bg-white dark:bg-gray-800 rounded-lg p-4 hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center space-x-3">
                  <OrganizationLogo 
                    organization={{ name: 'Oolite Arts', slug: 'oolite' }}
                    size="md"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Oolite Arts</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Artist Support</p>
                  </div>
                </div>
              </Link>
              
              <Link
                href="/o/fountainhead"
                className="bg-white dark:bg-gray-800 rounded-lg p-4 hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center space-x-3">
                  <OrganizationLogo 
                    organization={{ name: 'Fountainhead', slug: 'fountainhead' }}
                    size="md"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Fountainhead</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Artist Studios</p>
                  </div>
                </div>
              </Link>

              <Link
                href="/o/locust-projects"
                className="bg-white dark:bg-gray-800 rounded-lg p-4 hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center space-x-3">
                  <OrganizationLogo 
                    organization={{ name: 'Locust Projects', slug: 'locust-projects' }}
                    size="md"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Locust Projects</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Contemporary Art</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link
            href="/announcements/create"
            className="bg-white dark:bg-gray-800 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <Plus className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Create Announcement</h3>
                <p className="text-gray-600 dark:text-gray-400">Post a new announcement</p>
              </div>
            </div>
          </Link>

          <Link
            href={organization ? `/o/${organization.slug}/announcements` : '/announcements'}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <Bell className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">View Announcements</h3>
                <p className="text-gray-600 dark:text-gray-400">Manage your announcements</p>
              </div>
            </div>
          </Link>

          <Link
            href={organization ? `/o/${organization.slug}/users` : '/users'}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Manage Users</h3>
                <p className="text-gray-600 dark:text-gray-400">View organization members</p>
              </div>
            </div>
          </Link>

          <Link
            href="/analytics"
            className="bg-white dark:bg-gray-800 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Analytics</h3>
                <p className="text-gray-600 dark:text-gray-400">View engagement data</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Announcements */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Announcements</h2>
            <Link
              href={organization ? `/organizations/${organization.slug}/announcements` : '/announcements'}
              className="text-blue-600 hover:text-blue-500 text-sm font-medium"
            >
              View All
              <ArrowRight className="inline h-4 w-4 ml-1" />
            </Link>
          </div>

          {recentAnnouncements.length > 0 ? (
            <div className="space-y-4">
              {recentAnnouncements.slice(0, 5).map((announcement) => {
                // Determine the event date - prioritize scheduled_at, then created_at
                const eventDate = announcement.scheduled_at || announcement.created_at
                const date = new Date(eventDate)
                
                // Convert to EST
                const estDate = new Date(date.toLocaleString("en-US", {timeZone: "America/New_York"}))
                const formattedDate = {
                  day: estDate.getDate(),
                  month: estDate.toLocaleDateString('en-US', { month: 'short' }),
                  year: estDate.getFullYear(),
                  time: announcement.scheduled_at ? estDate.toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit',
                    hour12: true,
                    timeZone: 'America/New_York'
                  }) : null,
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
                  <div key={announcement.id} className="flex border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    {/* Calendar Date Column */}
                    <div className="w-20 md:w-24 flex-shrink-0 bg-blue-50 dark:bg-blue-900/20 border-r border-gray-200 dark:border-gray-700 p-3 flex flex-col items-center justify-center">
                      <div className="text-center">
                        <div className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {formattedDate.day}
                        </div>
                        <div className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                          {formattedDate.month}
                        </div>
                        <div className="text-xs text-blue-500 dark:text-blue-300">
                          {formattedDate.year}
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
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            {announcement.organization && (
                              <OrganizationLogo 
                                organization={announcement.organization}
                                size="sm"
                              />
                            )}
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                              {announcement.title}
                            </h3>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                            {announcement.organization && (
                              <span className="font-medium text-blue-600 dark:text-blue-400">
                                {announcement.organization.name}
                              </span>
                            )}
                            {announcement.author && (
                              <span>by {announcement.author.name}</span>
                            )}
                            <Badge variant={getStatusBadgeColor(announcement.status)}>
                              {announcement.status}
                            </Badge>
                            {announcement.priority > 0 && (
                              <span className="text-orange-600">Priority {announcement.priority}</span>
                            )}
                          </div>
                        </div>
                        <Link
                          href={announcement.organization?.slug 
                            ? `/o/${announcement.organization.slug}/announcements/${announcement.id}`
                            : `/announcements/${announcement.id}`
                          }
                          className="text-blue-600 hover:text-blue-500 text-sm font-medium ml-4"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No announcements yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Create your first announcement to get started
              </p>
              <Link
                href="/announcements/create"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Announcement
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
