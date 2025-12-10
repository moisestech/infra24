'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useParams } from 'next/navigation'
import { Bell, Users, Building2, Calendar, MapPin, Globe, Eye, Edit, ClipboardList, FileCheck, GraduationCap, Copy, Check, Grid3x3, ArrowRight } from 'lucide-react'
import { UnifiedNavigation, ooliteConfig, bakehouseConfig } from '@/components/navigation'
import ArtistIcon from '@/components/ui/ArtistIcon'
import { OrganizationLogo } from '@/components/ui/OrganizationLogo'
import { MiniAnalyticsWidget } from '@/components/analytics/WorkshopAnalyticsWidget'
import { PageFooter } from '@/components/common/PageFooter'
import { BackgroundPattern } from '@/components/BackgroundPattern'
import { AnnouncementType, AnnouncementSubType } from '@/types/announcement'

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
  content: string
  type: string
  priority: string
  visibility: string
  status: string
  start_date: string | null
  end_date: string | null
  scheduled_at?: string
  expires_at?: string
  location: string | null
  key_people: any[]
  metadata: any
  is_active: boolean
  created_at: string
  updated_at: string
  created_by: string
  updated_by: string
  image_url?: string
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
  const slug = params.slug as string

  // Get navigation config based on organization slug
  const getNavigationConfig = () => {
    switch (slug) {
      case 'oolite':
        return ooliteConfig;
      case 'bakehouse':
        return bakehouseConfig;
      default:
        return ooliteConfig; // Default fallback
    }
  };

  const [organization, setOrganization] = useState<Organization | null>(null)
  const [recentAnnouncements, setRecentAnnouncements] = useState<Announcement[]>([])
  const [userCount, setUserCount] = useState(0)
  const [staffCount, setStaffCount] = useState(0)
  const [artistCount, setArtistCount] = useState(0)
  const [surveyCount, setSurveyCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      if (!params.slug) return
      
      try {
        const slug = params.slug as string

        // Get user profile and role (only if authenticated)
        if (user) {
          const userResponse = await fetch('/api/users/me')
          if (userResponse.ok) {
            const userData = await userResponse.json()
            setUserRole(userData.role || 'resident')
          }
        }

        // Get organization details from tenant config (fallback when DB is not available)
        console.log('🔍 Generic org page: Using tenant config for organization details')
        const { getTenantConfig } = await import('@/lib/tenant')
        const tenantConfig = getTenantConfig(slug)
        
        if (tenantConfig) {
          console.log('✅ Generic org page: Using tenant config:', tenantConfig)
          setOrganization({
            id: tenantConfig.id,
            name: tenantConfig.name,
            slug: tenantConfig.slug,
            banner_image: tenantConfig.theme.banner,
            created_at: new Date().toISOString()
          })
        } else {
          console.log('❌ Generic org page: No tenant config found for slug:', slug)
        }

        // Get recent announcements (public endpoint)
        try {
          const announcementsResponse = await fetch(`/api/organizations/by-slug/${slug}/announcements/public`)
          if (announcementsResponse.ok) {
            const announcementsData = await announcementsResponse.json()
            setRecentAnnouncements(announcementsData.announcements || [])
          } else {
            // Set default announcements when API fails
            setRecentAnnouncements([
              {
                id: '1',
                title: `Welcome to ${tenantConfig?.name || 'Our Organization'}`,
                content: 'We are excited to welcome you to our digital platform. Explore our workshops, connect with artists, and discover new opportunities.',
                type: 'general',
                priority: 'normal',
                visibility: 'public',
                status: 'published',
                start_date: null,
                end_date: null,
                location: null,
                key_people: [],
                metadata: {},
                is_active: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                created_by: 'system',
                updated_by: 'system'
              }
            ])
          }
        } catch (error) {
          console.log('❌ Generic org page: Failed to fetch announcements, using defaults')
          setRecentAnnouncements([
            {
              id: '1',
              title: `Welcome to ${tenantConfig?.name || 'Our Organization'}`,
              content: 'We are excited to welcome you to our digital platform. Explore our workshops, connect with artists, and discover new opportunities.',
              type: 'general',
              priority: 'normal',
              visibility: 'public',
              status: 'published',
              start_date: null,
              end_date: null,
              location: null,
              key_people: [],
              metadata: {},
              is_active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              created_by: 'system',
              updated_by: 'system'
            }
          ])
        }

        // Get user count and breakdown (only if authenticated)
        if (user) {
          const usersResponse = await fetch(`/api/organizations/by-slug/${slug}/users`)
          if (usersResponse.ok) {
            const usersData = await usersResponse.json()
            const memberships = usersData.memberships || []
            const artistProfiles = usersData.artist_profiles || []
            
            // Calculate total members (memberships + artists)
            const totalMembers = memberships.length + artistProfiles.length
            
            // Calculate staff count (memberships with admin/moderator roles)
            const staffMembers = memberships.filter((m: any) => 
              ['super_admin', 'org_admin', 'moderator', 'staff'].includes(m.role)
            )
            
            console.log('Debug - Memberships:', memberships)
            console.log('Debug - Staff members:', staffMembers)
            console.log('Debug - Artist profiles:', artistProfiles)
            
            setUserCount(totalMembers)
            setStaffCount(staffMembers.length)
            setArtistCount(artistProfiles.length)
          }
        } else {
          // Set default public values when not authenticated
          setUserCount(0)
          setStaffCount(0)
          setArtistCount(0)
        }

        // Get survey count for all users (public information)
        try {
          const surveysResponse = await fetch(`/api/organizations/by-slug/${slug}/surveys`)
          if (surveysResponse.ok) {
            const surveysData = await surveysResponse.json()
            setSurveyCount(surveysData.surveys?.length || 0)
          }
        } catch (error) {
          console.log('Failed to fetch survey count:', error)
          setSurveyCount(0)
        }

      } catch (error) {
        console.error('Error loading organization data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (isLoaded) {
      loadData()
    }
  }, [user, isLoaded, params.slug])

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <UnifiedNavigation config={getNavigationConfig()} userRole="admin" />
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
        <UnifiedNavigation config={getNavigationConfig()} userRole="admin" />
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

  const copyAnnouncementId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (error) {
      console.error('Failed to copy ID:', error)
    }
  }

  const isSurveyAnnouncement = (announcement: Announcement) => {
    const title = announcement.title.toLowerCase()
    const content = announcement.content?.toLowerCase() || ''
    const metadata = announcement.metadata || {}
    
    return (
      title.includes('survey') ||
      content.includes('survey') ||
      metadata.survey_type ||
      metadata.call_to_action === 'Take Survey' ||
      metadata.action_url?.includes('/surveys')
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <UnifiedNavigation config={getNavigationConfig()} userRole="admin" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
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
        <div className="mb-6 4xl:mb-12">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 4xl:space-x-6 mb-2 4xl:mb-4">
                <OrganizationLogo 
                  organizationSlug={organization.slug}
                  variant="horizontal"
                  size="lg"
                  className="h-12 4xl:h-24"
                />
                <h1 className="text-3xl 4xl:text-6xl font-bold text-gray-900 dark:text-white">
                  {organization.name}
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 4xl:px-5 4xl:py-2 rounded-full text-xs 4xl:text-2xl font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Active
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 4xl:gap-8 text-sm 4xl:text-2xl text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 4xl:h-8 4xl:w-8 mr-1" />
                  Member since {new Date(organization.created_at).getFullYear()}
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Sign In Prompt for Guest Users */}
        {!user && (
          <div className="mb-6 xl:mb-8 2xl:mb-10 3xl:mb-12">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg xl:text-xl 2xl:text-2xl font-semibold mb-2">
                    Join {organization.name}
                  </h3>
                  <p className="text-blue-100 text-sm xl:text-base 2xl:text-lg">
                    Sign in to access exclusive content, workshops, and connect with our community.
                  </p>
                </div>
                <div className="flex space-x-3">
                  <a
                    href="/sign-in"
                    className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                  >
                    Sign In
                  </a>
                  <a
                    href="/sign-up"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-400 transition-colors"
                  >
                    Join Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Featured 360 Section */}
        <div className="mb-6 xl:mb-8 2xl:mb-10 3xl:mb-12">
          <a
            href={`/o/${organization.slug}/360`}
            className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl shadow-lg p-6 xl:p-8 2xl:p-10 hover:shadow-xl transition-all duration-300 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 xl:h-20 xl:w-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Grid3x3 className="h-8 w-8 xl:h-10 xl:w-10 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl xl:text-3xl 2xl:text-4xl font-bold text-white mb-2">
                    Explore 360 Interactive Experiences
                  </h2>
                  <p className="text-indigo-100 text-base xl:text-lg 2xl:text-xl">
                    Discover interactive web applications, data visualizations, and immersive tools
                  </p>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-2 text-white group-hover:translate-x-2 transition-transform duration-300">
                <span className="font-medium">Explore</span>
                <ArrowRight className="h-5 w-5" />
              </div>
            </div>
          </a>
        </div>

        {/* Quick Actions */}
        <div className="mb-6 xl:mb-8 2xl:mb-10 3xl:mb-12">
          <h2 className="text-lg xl:text-xl 2xl:text-2xl 3xl:text-3xl font-semibold text-gray-900 dark:text-white mb-3 xl:mb-4 2xl:mb-5 3xl:mb-6">
            {user ? 'Quick Actions' : 'Explore Our Platform'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 xl:gap-4 2xl:gap-5 3xl:gap-6">
            <a
              href={`/o/${organization.slug}/announcements`}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 xl:p-4 2xl:p-5 3xl:p-6 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 group"
            >
              <div className="flex items-center">
                <Bell className="h-5 w-5 xl:h-6 xl:w-6 2xl:h-7 2xl:w-7 3xl:h-8 3xl:w-8 text-blue-600 dark:text-blue-400 mr-2 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm xl:text-base 2xl:text-lg 3xl:text-xl group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">Announcements</p>
                  <p className="text-xs xl:text-sm 2xl:text-base 3xl:text-lg text-gray-500 dark:text-gray-400">{recentAnnouncements.length} active</p>
                </div>
              </div>
            </a>

            <a
              href={`/o/${organization.slug}/announcements/display`}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-sm p-3 xl:p-4 2xl:p-5 3xl:p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <Eye className="h-5 w-5 xl:h-6 xl:w-6 2xl:h-7 2xl:w-7 3xl:h-8 3xl:w-8 text-white mr-2" />
                <div>
                  <p className="font-medium text-white text-sm xl:text-base 2xl:text-lg 3xl:text-xl">View Announcements</p>
                  <p className="text-xs xl:text-sm 2xl:text-base 3xl:text-lg text-blue-100">Display Mode</p>
                </div>
              </div>
            </a>


            <a
              href={`/o/${organization.slug}/artists`}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 xl:p-4 2xl:p-5 3xl:p-6 hover:shadow-md hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-200 group"
            >
              <div className="flex items-center">
                <ArtistIcon organization={organization} className="h-5 w-5 xl:h-6 xl:w-6 2xl:h-7 2xl:w-7 3xl:h-8 3xl:w-8 text-purple-600 dark:text-purple-400 mr-2 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm xl:text-base 2xl:text-lg 3xl:text-xl group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">Artists</p>
                </div>
              </div>
            </a>

            <a
              href={`/o/${organization.slug}/map`}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 xl:p-4 2xl:p-5 3xl:p-6 hover:shadow-md hover:border-orange-300 dark:hover:border-orange-600 transition-all duration-200 group"
            >
              <div className="flex items-center">
                <MapPin className="h-5 w-5 xl:h-6 xl:w-6 2xl:h-7 2xl:w-7 3xl:h-8 3xl:w-8 text-orange-600 dark:text-orange-400 mr-2 group-hover:text-orange-700 dark:group-hover:text-orange-300 transition-colors" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm xl:text-base 2xl:text-lg 3xl:text-xl group-hover:text-orange-700 dark:group-hover:text-orange-300 transition-colors">Interactive Map</p>
                </div>
              </div>
            </a>

            <a
              href={`/o/${organization.slug}/surveys`}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 xl:p-4 2xl:p-5 3xl:p-6 hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-200 group"
            >
              <div className="flex items-center">
                <ClipboardList className="h-5 w-5 xl:h-6 xl:w-6 2xl:h-7 2xl:w-7 3xl:h-8 3xl:w-8 text-indigo-600 dark:text-indigo-400 mr-2 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm xl:text-base 2xl:text-lg 3xl:text-xl group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">Surveys</p>
                  <p className="text-xs xl:text-sm 2xl:text-base 3xl:text-lg text-gray-500 dark:text-gray-400">{surveyCount} available</p>
                </div>
              </div>
            </a>

            <a
              href={`/o/${organization.slug}/xr`}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg shadow-sm p-3 xl:p-4 2xl:p-5 3xl:p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <Globe className="h-5 w-5 xl:h-6 xl:w-6 2xl:h-7 2xl:w-7 3xl:h-8 3xl:w-8 text-white mr-2" />
                <div>
                  <p className="font-medium text-white text-sm xl:text-base 2xl:text-lg 3xl:text-xl">XR Experiences</p>
                  <p className="text-xs xl:text-sm 2xl:text-base 3xl:text-lg text-purple-100">VR & Maquettes</p>
                </div>
              </div>
            </a>

            <a
              href={`/o/${organization.slug}/360`}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-sm p-3 xl:p-4 2xl:p-5 3xl:p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <Grid3x3 className="h-5 w-5 xl:h-6 xl:w-6 2xl:h-7 2xl:w-7 3xl:h-8 3xl:w-8 text-white mr-2" />
                <div>
                  <p className="font-medium text-white text-sm xl:text-base 2xl:text-lg 3xl:text-xl">360 Experiences</p>
                  <p className="text-xs xl:text-sm 2xl:text-base 3xl:text-lg text-indigo-100">Interactive Apps</p>
                </div>
              </div>
            </a>

            <a
              href={`/o/${organization.slug}/workshops`}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 xl:p-4 2xl:p-5 3xl:p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <GraduationCap className="h-5 w-5 xl:h-6 xl:w-6 2xl:h-7 2xl:w-7 3xl:h-8 3xl:w-8 text-pink-600 dark:text-pink-400 mr-2" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm xl:text-base 2xl:text-lg 3xl:text-xl">Workshops</p>
                </div>
              </div>
            </a>

            {/* Oolite-specific Booking link */}
            {organization.slug === 'oolite' && (
              <a
                href={`/o/${organization.slug}/bookings`}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 xl:p-4 2xl:p-5 3xl:p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 xl:h-6 xl:w-6 2xl:h-7 2xl:w-7 3xl:h-8 3xl:w-8 text-cyan-600 dark:text-cyan-400 mr-2" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm xl:text-base 2xl:text-lg 3xl:text-xl">Booking</p>
                    <p className="text-xs xl:text-sm 2xl:text-base 3xl:text-lg text-gray-600 dark:text-gray-400">XR & Technology</p>
                  </div>
                </div>
              </a>
            )}

            {(userRole === 'org_admin' || userRole === 'super_admin' || userRole === 'moderator') && (
              <>
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
                
                <a
                  href={`/o/${organization.slug}/admin/surveys`}
                  className="bg-indigo-600 text-white rounded-lg shadow-sm p-3 hover:bg-indigo-700 transition-colors"
                >
                  <div className="flex items-center">
                    <ClipboardList className="h-5 w-5 mr-2" />
                    <div>
                      <p className="font-medium text-sm">Manage Surveys</p>
                    </div>
                  </div>
                </a>
              </>
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
                  
                  // Check if this is a survey announcement using improved detection
                  const isSurveyAnn = isSurveyAnnouncement(announcement)
                  const isHighPrioritySurvey = isSurveyAnn && 
                    (announcement.priority === 'high' || announcement.title.toLowerCase().includes('urgent') || announcement.title.toLowerCase().includes('important'))
                  
                  // Determine announcement type and subtype for pattern selection
                  const getAnnouncementType = (): AnnouncementType => {
                    const title = announcement.title.toLowerCase()
                    const type = announcement.type?.toLowerCase()
                    
                    if (title.includes('urgent') || announcement.priority === 'high') return 'urgent'
                    if (title.includes('event') || type === 'event') return 'event'
                    if (title.includes('facility') || type === 'facility') return 'facility'
                    if (title.includes('opportunity') || type === 'opportunity') return 'opportunity'
                    if (title.includes('administrative') || type === 'administrative') return 'administrative'
                    
                    return 'opportunity' // Default fallback
                  }

                  const getAnnouncementSubType = (): AnnouncementSubType => {
                    const title = announcement.title.toLowerCase()
                    
                    if (title.includes('workshop')) return 'workshop'
                    if (title.includes('exhibition')) return 'exhibition'
                    if (title.includes('meeting')) return 'meeting'
                    if (title.includes('deadline')) return 'deadline'
                    if (title.includes('survey')) return 'survey'
                    
                    return 'general'
                  }

                  return (
                    <div 
                      key={announcement.id} 
                      className={`rounded-lg shadow-sm border overflow-hidden hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer group ${
                        isHighPrioritySurvey 
                          ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-700 hover:border-yellow-300 dark:hover:border-yellow-600' 
                          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                      }`}
                    >
                      <a 
                        href={`/o/${organization.slug}/announcements/${announcement.id}`}
                        className="block"
                      >
                        <div className="flex">
                        {/* Image Column - Show image if available, otherwise show pattern */}
                        <div className="w-20 flex-shrink-0 relative overflow-hidden">
                          {announcement.image_url ? (
                            <img 
                              src={announcement.image_url}
                              alt={announcement.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <BackgroundPattern
                              type={getAnnouncementType()}
                              subType={getAnnouncementSubType()}
                              width={80}
                              height={120}
                              organizationSlug={organization.slug}
                            />
                          )}
                        </div>

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
                              <h3 className="font-medium text-gray-900 dark:text-white mb-1 text-sm truncate group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                                {announcement.title}
                              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                {announcement.content ? announcement.content.substring(0, 100) + '...' : announcement.title}
              </p>
                              <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                                <span className={`px-2 py-1 rounded-full ${
                                  announcement.status === 'published' 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                }`}>
                                  {announcement.status}
                                </span>
                                {isHighPrioritySurvey && (
                                  <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                    High Priority
                                  </span>
                                )}
                                <span>{new Date(announcement.created_at).toLocaleDateString()}</span>
                                {announcement.end_date && (
                                  <span className="text-orange-600 dark:text-orange-400">
                                    Ends: {new Date(announcement.end_date).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-1 ml-2">
                              {/* Dev-only copy ID button */}
                              {process.env.NODE_ENV === 'development' && (
                                <button 
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    copyAnnouncementId(announcement.id)
                                  }}
                                  className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                  title="Copy Announcement ID"
                                >
                                  {copiedId === announcement.id ? (
                                    <Check className="h-4 w-4 text-green-600" />
                                  ) : (
                                    <Copy className="h-4 w-4" />
                                  )}
                                </button>
                              )}
                              <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                                <Eye className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      </a>
                      
                      {/* Survey Action Button */}
                      {isSurveyAnn && (
                        <div className="px-3 pb-3">
                          <a
                            href="/o/oolite/surveys"
                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FileCheck className="w-3 h-3 mr-1" />
                            Take Survey
                          </a>
                        </div>
                      )}
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
                Community
              </h2>
              <a
                href={`/o/${organization.slug}/members`}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 text-sm font-medium"
              >
                View members →
              </a>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Connect with our community of artists, staff, and supporters
                </p>
                <a
                  href={`/o/${organization.slug}/members`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Explore Members
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Workshop Analytics Widget */}
        {organization.slug === 'oolite' && (
          <div className="mt-8">
            <MiniAnalyticsWidget organizationId={organization.id} />
          </div>
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
