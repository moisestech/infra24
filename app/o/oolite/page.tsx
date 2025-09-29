'use client'

import { useState, useEffect, Suspense } from 'react'
import { useUser } from '@clerk/nextjs'
import { Building2 } from 'lucide-react'
import { UnifiedNavigation, ooliteConfig } from '@/components/navigation'
import { TenantProvider } from '@/components/tenant/TenantProvider'
import { OrganizationHeader } from '@/components/organization/OrganizationHeader'
import { SignInPrompt } from '@/components/organization/SignInPrompt'
import { QuickActions } from '@/components/organization/QuickActions'
import { RecentAnnouncements } from '@/components/organization/RecentAnnouncements'

interface Organization {
  id: string
  name: string
  slug: string
  artist_icon?: string
  banner_image?: string
  created_at: string
  dashboard?: {
    showAnnouncements: boolean
    showArtists: boolean
    showInteractiveMap: boolean
    showSurveys: boolean
    showXRExperiences: boolean
    showWorkshops: boolean
    showDigitalLab: boolean
  }
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
  location: string | null
  key_people: any[]
  metadata: any
  is_active: boolean
  created_at: string
  updated_at: string
  created_by: string
  updated_by: string
}


function OoliteOrganizationPageContent() {
  const { user, isLoaded } = useUser()
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [recentAnnouncements, setRecentAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState('')

  useEffect(() => {
    async function loadData() {
      const slug = 'oolite' // Hardcoded for this specific page
      console.log('🔄 Oolite page: Starting loadData', { user: !!user, slug })
      
      // Load public data regardless of authentication status
      
      try {
        // Get user profile and role (only if authenticated)
        if (user) {
          const userResponse = await fetch('/api/users/me')
          if (userResponse.ok) {
            const userData = await userResponse.json()
            setUserRole(userData.role || 'resident')
          }
        }

        // Get organization details from tenant config (fallback when DB is not available)
        console.log('🔍 Oolite page: Using tenant config for organization details')
        const { getTenantConfig } = await import('@/lib/tenant')
        const tenantConfig = getTenantConfig(slug)
        
        if (tenantConfig) {
          console.log('✅ Oolite page: Using tenant config:', tenantConfig)
          setOrganization({
            id: '2133fe94-fb12-41f8-ab37-ea4acd4589f6', // Use actual organization ID
            name: tenantConfig.name,
            slug: tenantConfig.slug,
            banner_image: tenantConfig.theme.banner,
            created_at: new Date().toISOString(),
            dashboard: tenantConfig.dashboard
          })
        } else {
          console.log('❌ Oolite page: No tenant config found for slug:', slug)
        }

        // Get recent announcements (public endpoint)
        try {
          const announcementsResponse = await fetch(`/api/organizations/by-slug/${slug}/announcements/public`)
          if (announcementsResponse.ok) {
            const announcementsData = await announcementsResponse.json()
            setRecentAnnouncements(announcementsData.announcements || [])
          } else {
            // Set default announcements when API fails
            setRecentAnnouncements([])
          }
        } catch (error) {
          console.error('❌ Oolite page: Error fetching announcements:', error)
          setRecentAnnouncements([])
        }


      } catch (error) {
        console.error('❌ Oolite page: Error loading organization data:', error)
      } finally {
        console.log('🏁 Oolite page: Setting loading to false')
        setLoading(false)
      }
    }

    if (isLoaded) {
      loadData()
    }
  }, [user, isLoaded])

  console.log('🎯 Oolite page render state:', { isLoaded, loading, organization: !!organization })
  
  if (!isLoaded || loading) {
    console.log('⏳ Oolite page: Showing loading state')
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <UnifiedNavigation config={ooliteConfig} userRole="admin" />
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
        <UnifiedNavigation config={ooliteConfig} userRole="admin" />
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
        <UnifiedNavigation config={ooliteConfig} userRole="admin" />
        <div className="max-w-7xl 4xl:max-w-none mx-auto px-4 sm:px-6 lg:px-8 4xl:px-12 py-8 4xl:py-16">
          <OrganizationHeader organization={organization} userRole={userRole} />

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
                      <p className="text-xs xl:text-sm 2xl:text-base 3xl:text-lg text-blue-100">Manage Surveys</p>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          )}

          {/* Sign In Prompt for Guest Users */}
          {!user && (
            <SignInPrompt organizationName={organization.name} />
          )}


          {/* Quick Actions */}
          <QuickActions 
            organization={organization}
            recentAnnouncementsCount={recentAnnouncements.length}
            userRole={userRole}
            dashboardConfig={organization.dashboard}
          />

          {/* Recent Announcements */}
          <RecentAnnouncements 
            announcements={recentAnnouncements}
            organization={organization}
          />
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