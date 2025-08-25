'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  Building2, 
  Bell,
  Edit,
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  ExternalLink
} from 'lucide-react'
import Navigation from '@/components/ui/Navigation'
import { Badge } from '@/components/ui/Badge'

interface UserProfile {
  id: string
  clerk_user_id: string
  email: string
  first_name?: string
  last_name?: string
  image_url?: string
  role: string
  organization_id: string
  created_at: string
  updated_at: string
  subscription_plan: string
  subscription_status: string
  metadata?: any
}

interface Organization {
  id: string
  name: string
  slug: string
  description?: string
  logo_url?: string
}

interface Announcement {
  id: string
  title: string
  body?: string
  status: string
  created_at: string
  published_at?: string
  expires_at?: string
  priority: number
  tags: string[]
}

export default function UserProfilePage() {
  const params = useParams()
  const { user, isLoaded } = useUser()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'announcements'>('overview')

  useEffect(() => {
    async function loadData() {
      if (!user || !params.userId) return

      try {
        // Load user profile
        const userResponse = await fetch(`/api/users/${params.userId}`)
        const userData = await userResponse.json()
        if (userData.user) {
          setUserProfile(userData.user)
          
          // Load organization if user has one
          if (userData.user.organization_id) {
            const orgResponse = await fetch(`/api/organizations/${userData.user.organization_id}`)
            const orgData = await orgResponse.json()
            if (orgData.organization) {
              setOrganization(orgData.organization)
            }
          }
        }

        // Load user's announcements
        const announcementsResponse = await fetch(`/api/users/${params.userId}/announcements`)
        const announcementsData = await announcementsResponse.json()
        setAnnouncements(announcementsData.announcements || [])
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (isLoaded && user) {
      loadData()
    }
  }, [user, isLoaded, params.userId])

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
      case 'active': return 'success'
      case 'cancelled': return 'error'
      case 'expired': return 'warning'
      case 'past_due': return 'error'
      default: return 'default'
    }
  }

  const getAnnouncementStatusIcon = (status: string) => {
    switch (status) {
      case 'published': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />
      case 'rejected': return <XCircle className="h-4 w-4 text-red-500" />
      case 'draft': return <AlertCircle className="h-4 w-4 text-gray-500" />
      default: return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">User not found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The user you're looking for doesn't exist or you don't have permission to view them.
            </p>
            <Link
              href="/users"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Users
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <div className="mb-6">
          <Link
            href="/users"
            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
          </Link>
        </div>

        {/* User Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6">
          <div className="p-6">
            <div className="flex items-start space-x-6">
              {userProfile.image_url ? (
                <img 
                  src={userProfile.image_url} 
                  alt={`${userProfile.first_name} ${userProfile.last_name}`}
                  className="h-20 w-20 rounded-full"
                />
              ) : (
                <div className="h-20 w-20 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <User className="h-10 w-10 text-gray-600 dark:text-gray-400" />
                </div>
              )}
              
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {userProfile.first_name && userProfile.last_name 
                      ? `${userProfile.first_name} ${userProfile.last_name}`
                      : 'Unnamed User'
                    }
                  </h1>
                  <Badge variant={getRoleBadgeColor(userProfile.role)}>
                    {userProfile.role.replace('_', ' ')}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    {userProfile.email}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Joined {formatDate(userProfile.created_at)}
                  </div>
                </div>

                {organization && (
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Building2 className="h-4 w-4 mr-1" />
                    {organization.name}
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                <Link
                  href={`/users/${userProfile.clerk_user_id}/edit`}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('announcements')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'announcements'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                Announcements ({announcements.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* User Details */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">User Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                        <p className="mt-1 text-sm text-gray-900 dark:text-white">{userProfile.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                        <div className="mt-1">
                          <Badge variant={getRoleBadgeColor(userProfile.role)}>
                            {userProfile.role.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subscription Plan</label>
                        <p className="mt-1 text-sm text-gray-900 dark:text-white capitalize">{userProfile.subscription_plan}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                        <div className="mt-1">
                          <Badge variant={getStatusBadgeColor(userProfile.subscription_status)}>
                            {userProfile.subscription_status}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Member Since</label>
                        <p className="mt-1 text-sm text-gray-900 dark:text-white">{formatDate(userProfile.created_at)}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Updated</label>
                        <p className="mt-1 text-sm text-gray-900 dark:text-white">{formatDate(userProfile.updated_at)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Organization Info */}
                {organization && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Organization</h3>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        {organization.logo_url ? (
                          <img src={organization.logo_url} alt={organization.name} className="h-8 w-8 rounded" />
                        ) : (
                          <Building2 className="h-8 w-8 text-blue-600" />
                        )}
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{organization.name}</h4>
                          {organization.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">{organization.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Activity Summary */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Activity Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                      <div className="flex items-center">
                        <Bell className="h-8 w-8 text-blue-600" />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Total Announcements</p>
                          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{announcements.length}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                      <div className="flex items-center">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-green-900 dark:text-green-100">Published</p>
                          <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                            {announcements.filter(a => a.status === 'published').length}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                      <div className="flex items-center">
                        <Clock className="h-8 w-8 text-yellow-600" />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">Pending</p>
                          <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                            {announcements.filter(a => a.status === 'pending').length}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'announcements' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Announcements</h3>
                  <Link
                    href={`/users/${userProfile.clerk_user_id}/announcements`}
                    className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    View All
                    <ExternalLink className="h-4 w-4 ml-1" />
                  </Link>
                </div>
                
                {announcements.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No announcements</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      This user hasn't submitted any announcements yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {announcements.slice(0, 5).map((announcement) => (
                      <div key={announcement.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-medium text-gray-900 dark:text-white">{announcement.title}</h4>
                              {getAnnouncementStatusIcon(announcement.status)}
                            </div>
                            {announcement.body && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                {announcement.body}
                              </p>
                            )}
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                              <span>Created: {formatDateTime(announcement.created_at)}</span>
                              {announcement.published_at && (
                                <span>Published: {formatDateTime(announcement.published_at)}</span>
                              )}
                              {announcement.expires_at && (
                                <span>Expires: {formatDateTime(announcement.expires_at)}</span>
                              )}
                            </div>
                          </div>
                          <Link
                            href={`/announcements/${announcement.id}`}
                            className="ml-4 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
