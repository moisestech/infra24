'use client'

import { useState, useEffect, Suspense } from 'react'
import { useUser } from '@clerk/nextjs'
import { Bell, Users, Building2, Calendar, MapPin, Globe, Eye, Edit, Monitor, Palette } from 'lucide-react'
import { OoliteNavigation } from '@/components/tenant/OoliteNavigation'
import { TenantProvider } from '@/components/tenant/TenantProvider'
import ArtistIcon from '@/components/ui/ArtistIcon'
import { OrganizationLogo } from '@/components/ui/OrganizationLogo'
import { SurveyInvitation } from '@/components/survey/SurveyInvitation'

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

interface SurveyForm {
  id: string
  title: string
  description: string
  category: string
  form_schema: {
    title: string
    description: string
    questions: Array<{
      id: string
      question: string
      type: string
    }>
  }
  submission_settings: {
    allow_anonymous: boolean
    require_authentication: boolean
    max_submissions_per_user: number
  }
}

function OoliteOrganizationPageContent() {
  const { user, isLoaded } = useUser()
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [recentAnnouncements, setRecentAnnouncements] = useState<Announcement[]>([])
  const [userCount, setUserCount] = useState(0)
  const [staffCount, setStaffCount] = useState(0)
  const [artistCount, setArtistCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState('')
  const [surveys, setSurveys] = useState<SurveyForm[]>([])

  useEffect(() => {
    async function loadData() {
      const slug = 'oolite' // Hardcoded for this specific page
      console.log('🔄 Oolite page: Starting loadData', { user: !!user, slug })
      if (!user) {
        console.log('❌ Oolite page: Missing user', { user: !!user })
        return
      }
      
      try {
        // Get user profile and role
        const userResponse = await fetch('/api/users/me')
        if (userResponse.ok) {
          const userData = await userResponse.json()
          setUserRole(userData.role || 'resident')
        }

        // Get organization details
        console.log('🔍 Oolite page: Fetching organization details for slug:', slug)
        const orgResponse = await fetch(`/api/organizations/by-slug/${slug}`)
        console.log('📊 Oolite page: Organization response:', { ok: orgResponse.ok, status: orgResponse.status })
        if (orgResponse.ok) {
          const orgData = await orgResponse.json()
          console.log('✅ Oolite page: Organization data:', orgData)
          setOrganization(orgData.organization)
        } else {
          console.log('❌ Oolite page: Failed to fetch organization:', await orgResponse.text())
        }

        // Get recent announcements
        const announcementsResponse = await fetch(`/api/organizations/by-slug/${slug}/announcements?limit=5`)
        if (announcementsResponse.ok) {
          const announcementsData = await announcementsResponse.json()
          setRecentAnnouncements(announcementsData.announcements || [])
        }

        // Get user count and breakdown
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

        // Get surveys for this organization
        console.log('📋 Oolite page: Fetching surveys for slug:', slug)
        const surveysResponse = await fetch(`/api/organizations/by-slug/${slug}/surveys`)
        console.log('📊 Oolite page: Surveys response:', { ok: surveysResponse.ok, status: surveysResponse.status })
        if (surveysResponse.ok) {
          const surveysData = await surveysResponse.json()
          console.log('✅ Oolite page: Surveys data:', surveysData)
          setSurveys(surveysData.surveys || [])
        } else {
          console.log('❌ Oolite page: Failed to fetch surveys:', await surveysResponse.text())
        }

      } catch (error) {
        console.error('❌ Oolite page: Error loading organization data:', error)
      } finally {
        console.log('🏁 Oolite page: Setting loading to false')
        setLoading(false)
      }
    }

    if (isLoaded && user) {
      loadData()
    }
  }, [user, isLoaded])

  console.log('🎯 Oolite page render state:', { isLoaded, loading, organization: !!organization })
  
  if (!isLoaded || loading) {
    console.log('⏳ Oolite page: Showing loading state')
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <OoliteNavigation />
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
        <OoliteNavigation />
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
    <TenantProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <OoliteNavigation />
      <div className="max-w-7xl 4xl:max-w-none mx-auto px-4 sm:px-6 lg:px-8 4xl:px-12 py-8 4xl:py-16">
      
      {/* Banner Background */}
      <div className="relative h-64 md:h-80 overflow-hidden mb-8">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${organization?.banner_image || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'})`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-gray-900" />
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Banner Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {organization.name}
              </h1>
              <p className="text-white/90 text-lg">
                Digital Innovation & Creative Community
              </p>
            </div>
            <div className="hidden md:block">
              <OrganizationLogo 
                organizationSlug={organization.slug}
                size="lg"
                className="h-16 w-16 4xl:h-24 4xl:w-24"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Compact Stats */}
        <div className="grid grid-cols-2 gap-4 xl:gap-6 2xl:gap-8 3xl:gap-10 mb-6 xl:mb-8 2xl:mb-10 3xl:mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 xl:p-6 2xl:p-8 3xl:p-10">
            <div className="flex items-center">
              <Bell className="h-6 w-6 xl:h-8 xl:w-8 2xl:h-10 2xl:w-10 3xl:h-12 3xl:w-12 text-blue-600 dark:text-blue-400" />
              <div className="ml-3 xl:ml-4 2xl:ml-5 3xl:ml-6">
                <p className="text-sm xl:text-base 2xl:text-lg 3xl:text-xl font-medium text-gray-600 dark:text-gray-400">Announcements</p>
                <p className="text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl font-bold text-gray-900 dark:text-white">
                  {recentAnnouncements.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 xl:p-6 2xl:p-8 3xl:p-10">
            <div className="flex items-center">
              <Users className="h-6 w-6 xl:h-8 xl:w-8 2xl:h-10 2xl:w-10 3xl:h-12 3xl:w-12 text-green-600 dark:text-green-400" />
              <div className="ml-3 xl:ml-4 2xl:ml-5 3xl:ml-6">
                <p className="text-sm xl:text-base 2xl:text-lg 3xl:text-xl font-medium text-gray-600 dark:text-gray-400">Members</p>
                <p className="text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl font-bold text-gray-900 dark:text-white">
                  {userCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Section */}
        {(userRole === 'org_admin' || userRole === 'super_admin' || userRole === 'moderator') && (
          <div className="mb-6 xl:mb-8 2xl:mb-10 3xl:mb-12">
            <h2 className="text-lg xl:text-xl 2xl:text-2xl 3xl:text-3xl font-semibold text-gray-900 dark:text-white mb-3 xl:mb-4 2xl:mb-5 3xl:mb-6">
              Admin Dashboard
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 xl:gap-4 2xl:gap-5 3xl:gap-6">
              <a
                href={`/o/${organization.slug}/roadmap`}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg shadow-sm p-3 xl:p-4 2xl:p-5 3xl:p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center">
                  <svg className="h-5 w-5 xl:h-6 xl:w-6 2xl:h-7 2xl:w-7 3xl:h-8 3xl:w-8 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <div>
                    <p className="font-medium text-white text-sm xl:text-base 2xl:text-lg 3xl:text-xl">Roadmap</p>
                    <p className="text-xs xl:text-sm 2xl:text-base 3xl:text-lg text-purple-100">Strategic Planning</p>
                  </div>
                </div>
              </a>

              <a
                href={`/o/${organization.slug}/analytics`}
                className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg shadow-sm p-3 xl:p-4 2xl:p-5 3xl:p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center">
                  <svg className="h-5 w-5 xl:h-6 xl:w-6 2xl:h-7 2xl:w-7 3xl:h-8 3xl:w-8 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <div>
                    <p className="font-medium text-white text-sm xl:text-base 2xl:text-lg 3xl:text-xl">Analytics</p>
                    <p className="text-xs xl:text-sm 2xl:text-base 3xl:text-lg text-green-100">KPIs & Metrics</p>
                  </div>
                </div>
              </a>

              <a
                href={`/o/${organization.slug}/budget`}
                className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg shadow-sm p-3 xl:p-4 2xl:p-5 3xl:p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center">
                  <svg className="h-5 w-5 xl:h-6 xl:w-6 2xl:h-7 2xl:w-7 3xl:h-8 3xl:w-8 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <div>
                    <p className="font-medium text-white text-sm xl:text-base 2xl:text-lg 3xl:text-xl">Budget</p>
                    <p className="text-xs xl:text-sm 2xl:text-base 3xl:text-lg text-orange-100">Financial Planning</p>
                  </div>
                </div>
              </a>

              <a
                href={`/o/${organization.slug}/surveys`}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg shadow-sm p-3 xl:p-4 2xl:p-5 3xl:p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center">
                  <svg className="h-5 w-5 xl:h-6 xl:w-6 2xl:h-7 2xl:w-7 3xl:h-8 3xl:w-8 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div>
                    <p className="font-medium text-white text-sm xl:text-base 2xl:text-lg 3xl:text-xl">Surveys</p>
                    <p className="text-xs xl:text-sm 2xl:text-base 3xl:text-lg text-blue-100">Feedback & Analytics</p>
                  </div>
                </div>
              </a>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-6 xl:mb-8 2xl:mb-10 3xl:mb-12">
          <h2 className="text-lg xl:text-xl 2xl:text-2xl 3xl:text-3xl font-semibold text-gray-900 dark:text-white mb-3 xl:mb-4 2xl:mb-5 3xl:mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 xl:gap-4 2xl:gap-5 3xl:gap-6">
            <a
              href={`/o/${organization.slug}/announcements/display`}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-sm p-3 xl:p-4 2xl:p-5 3xl:p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <Eye className="h-5 w-5 xl:h-6 xl:w-6 2xl:h-7 2xl:w-7 3xl:h-8 3xl:w-8 text-white mr-2" />
                <div>
                  <p className="font-medium text-white text-sm xl:text-base 2xl:text-lg 3xl:text-xl">Announcements</p>
                  <p className="text-xs xl:text-sm 2xl:text-base 3xl:text-lg text-blue-100">Latest Updates</p>
                </div>
              </div>
            </a>

            <a
              href={`/o/${organization.slug}/artists`}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 xl:p-4 2xl:p-5 3xl:p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <ArtistIcon organization={organization} className="h-5 w-5 xl:h-6 xl:w-6 2xl:h-7 2xl:w-7 3xl:h-8 3xl:w-8 text-purple-600 dark:text-purple-400 mr-2" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm xl:text-base 2xl:text-lg 3xl:text-xl">Artists</p>
                </div>
              </div>
            </a>

            <a
              href={`/o/${organization.slug}/workshops`}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 xl:p-4 2xl:p-5 3xl:p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <Palette className="h-5 w-5 xl:h-6 xl:w-6 2xl:h-7 2xl:w-7 3xl:h-8 3xl:w-8 text-pink-600 dark:text-pink-400 mr-2" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm xl:text-base 2xl:text-lg 3xl:text-xl">Workshops</p>
                </div>
              </div>
            </a>

             <a
               href={`/o/${organization.slug}/digital-lab`}
               className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-sm p-3 xl:p-4 2xl:p-5 3xl:p-6 hover:shadow-md transition-shadow"
             >
               <div className="flex items-center">
                 <Monitor className="h-5 w-5 xl:h-6 xl:w-6 2xl:h-7 2xl:w-7 3xl:h-8 3xl:w-8 text-white mr-2" />
                 <div>
                   <p className="font-medium text-white text-sm xl:text-base 2xl:text-lg 3xl:text-xl">Digital Lab</p>
                   <p className="text-xs xl:text-sm 2xl:text-base 3xl:text-lg text-indigo-100">Book Equipment & Spaces</p>
                 </div>
               </div>
             </a>
          </div>
        </div>

        {/* Survey Invitations */}
        {surveys.length > 0 && (
          <div className="mb-6 xl:mb-8 2xl:mb-10 3xl:mb-12">
            <SurveyInvitation 
              organizationSlug={organization.slug}
              surveys={surveys}
              userRole={userRole}
            />
            
            {/* Link to Surveys Page */}
            <div className="mt-4 text-center">
              <a
                href={`/o/${organization.slug}/surveys`}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                View All Surveys & Feedback
              </a>
            </div>
          </div>
        )}

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
      </div>
    </TenantProvider>
  )
}

export default function OoliteOrganizationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OoliteOrganizationPageContent />
    </Suspense>
  );
}

