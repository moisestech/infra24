'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { Bell, Users, Building2, Calendar, MapPin, Globe, Eye, Edit, ClipboardList, FileCheck, GraduationCap, Copy, Check, Video, Camera, Palette, Mic } from 'lucide-react'
import { UnifiedNavigation } from '@/components/navigation'
import { madartsConfig } from '@/components/navigation/configs/madarts'
import { OrganizationLogo } from '@/components/organization/OrganizationLogo'
import { PageFooter } from '@/components/common/PageFooter'

interface Organization {
  id: string
  name: string
  slug: string
  description?: string
  logo_url?: string
  website?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zip_code?: string
  country?: string
  settings?: any
  theme?: any
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
}

interface Workshop {
  id: string
  title: string
  description: string
  level: string
  duration: number
  image_url?: string
  created_at: string
}

export default function MadArtsPage() {
  const { user, isLoaded } = useUser()
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [recentAnnouncements, setRecentAnnouncements] = useState<Announcement[]>([])
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        // Load organization data
        const orgResponse = await fetch('/api/organizations/by-slug/madarts')
        if (orgResponse.ok) {
          const responseData = await orgResponse.json()
          console.log('🎨 API Response Data:', responseData)
          console.log('🎨 Available fields:', Object.keys(responseData))
          
          // Extract organization data from the response
          const orgData = responseData.organization
          console.log('🎨 MadArts Organization Data:', orgData)
          console.log('🖼️ Banner Image URL:', orgData?.banner_image)
          console.log('🎨 Logo URL:', orgData?.logo_url)
          console.log('🎨 Organization fields:', Object.keys(orgData || {}))
          setOrganization(orgData)
        }

        // Load recent announcements
        try {
          const announcementsResponse = await fetch('/api/organizations/by-slug/madarts/announcements/public')
          if (announcementsResponse.ok) {
            const announcementsData = await announcementsResponse.json()
            setRecentAnnouncements(announcementsData.announcements || [])
          }
        } catch (error) {
          console.log('Failed to fetch announcements:', error)
          setRecentAnnouncements([])
        }

        // Load workshops
        try {
          const workshopsResponse = await fetch('/api/organizations/01e09cce-83da-4b0f-94ce-b227e949414a/workshops')
          console.log('🎓 Workshops API Response Status:', workshopsResponse.status)
          if (workshopsResponse.ok) {
            const workshopsData = await workshopsResponse.json()
            console.log('🎓 Workshops API Response Data:', workshopsData)
            console.log('🎓 Number of workshops found:', workshopsData.workshops?.length || 0)
            
            // Log each workshop details
            if (workshopsData.workshops && workshopsData.workshops.length > 0) {
              workshopsData.workshops.forEach((workshop: any, index: number) => {
                console.log(`🎓 Workshop ${index + 1}:`, {
                  id: workshop.id,
                  title: workshop.title,
                  description: workshop.description,
                  level: workshop.level,
                  duration: workshop.duration,
                  image_url: workshop.image_url,
                  created_at: workshop.created_at
                })
              })
              
              // Check specifically for Video Performance workshop
              const videoPerformanceWorkshop = workshopsData.workshops.find((w: any) => 
                w.title.toLowerCase().includes('video') || 
                w.title.toLowerCase().includes('performance') ||
                w.title.toLowerCase().includes('tere')
              )
              
              if (videoPerformanceWorkshop) {
                console.log('🎬 Video Performance Workshop Found:', videoPerformanceWorkshop)
              } else {
                console.log('❌ Video Performance Workshop NOT found in results')
              }
            } else {
              console.log('❌ No workshops found for MadArts organization')
            }
            
            setWorkshops(workshopsData.workshops || [])
          } else {
            console.error('❌ Failed to fetch workshops:', workshopsResponse.status, workshopsResponse.statusText)
          }
        } catch (error) {
          console.error('❌ Error fetching workshops:', error)
          setWorkshops([])
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
  }, [user, isLoaded])

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-purple-900">
        <UnifiedNavigation config={madartsConfig} />
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
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-purple-900">
        <UnifiedNavigation config={madartsConfig} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <Building2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Organization Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              The MadArts organization could not be found.
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

  const getAnnouncementImage = (announcement: Announcement) => {
    const title = announcement.title.toLowerCase()
    if (title.includes('workshop')) return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&h=120&fit=crop&crop=center'
    if (title.includes('video')) return 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=200&h=120&fit=crop&crop=center'
    if (title.includes('performance')) return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=120&fit=crop&crop=center'
    if (title.includes('event')) return 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=200&h=120&fit=crop&crop=center'
    return 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=200&h=120&fit=crop&crop=center'
  }

  // Debug logging for navigation config
  console.log('🧭 Navigation Config Debug:', madartsConfig)
  console.log('🧭 Navigation Organization Logo URLs:', {
    logo_url: madartsConfig.organization.logo_url,
    logo_url_light: madartsConfig.organization.logo_url_light,
    logo_url_dark: madartsConfig.organization.logo_url_dark
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-purple-900">
      <UnifiedNavigation config={madartsConfig} />
      
      {/* Banner Background */}
      {(() => {
        console.log('🖼️ Banner Debug:', {
          hasOrganization: !!organization,
          bannerImage: organization?.banner_image,
          willShowBanner: !!(organization?.banner_image)
        })
        return organization?.banner_image && (
          <div className="relative h-64 md:h-80 overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${organization.banner_image})`
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-pink-900/60 to-purple-900/60" />
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
              <div className="text-white">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {organization.name}
                </h1>
                <p className="text-xl md:text-2xl text-pink-100 max-w-2xl">
                  {organization.description}
                </p>
              </div>
            </div>
          </div>
        )
      })()}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
        {/* Organization Header */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="flex-shrink-0">
                {organization.logo_url ? (
                  <img 
                    src={organization.logo_url}
                    alt={`${organization.name} Logo`}
                    width={200}
                    height={80}
                    className="rounded-lg object-contain"
                  />
                ) : (
                  <div className="w-[200px] h-[80px] bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400 font-semibold">
                      {organization.name}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {organization.name}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                  {organization.description}
                </p>
                
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  {organization.website && (
                    <a 
                      href={organization.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 transition-colors"
                    >
                      <Globe className="w-4 h-4" />
                      Website
                    </a>
                  )}
                  {organization.email && (
                    <a 
                      href={`mailto:${organization.email}`}
                      className="flex items-center gap-2 text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 transition-colors"
                    >
                      <Bell className="w-4 h-4" />
                      Contact
                    </a>
                  )}
                  {organization.address && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4" />
                      {organization.city}, {organization.state}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sign In Prompt for Non-Authenticated Users */}
        {!user && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-2xl font-bold mb-2">
                    Join the MadArts Community
                  </h3>
                  <p className="text-pink-100 text-sm xl:text-base 2xl:text-lg">
                    Sign in to access exclusive workshops, video performance training, and connect with fellow artists.
                  </p>
                </div>
                <div className="flex space-x-3">
                  <a
                    href="/sign-in"
                    className="bg-white text-pink-600 px-4 py-2 rounded-lg font-medium hover:bg-pink-50 transition-colors"
                  >
                    Sign In
                  </a>
                  <a
                    href="/sign-up"
                    className="bg-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-pink-400 transition-colors"
                  >
                    Join Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            {user ? 'Quick Actions' : 'Explore Our Platform'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a
              href="/o/madarts/announcements"
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl hover:border-pink-300 dark:hover:border-pink-600 transition-all duration-200 group"
            >
              <div className="flex items-center">
                <Bell className="h-6 w-6 text-pink-600 dark:text-pink-400 mr-3 group-hover:text-pink-700 dark:group-hover:text-pink-300 transition-colors" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white group-hover:text-pink-700 dark:group-hover:text-pink-300 transition-colors">Announcements</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{recentAnnouncements.length} active</p>
                </div>
              </div>
            </a>

            <a
              href="/o/madarts/workshops"
              className="bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center">
                <GraduationCap className="h-6 w-6 text-white mr-3" />
                <div>
                  <p className="font-medium text-white">Workshops</p>
                  <p className="text-sm text-pink-100">{workshops.length} available</p>
                </div>
              </div>
            </a>

            <a
              href="/o/madarts/bookings"
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-200 group"
            >
              <div className="flex items-center">
                <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400 mr-3 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">Bookings</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Studio Time</p>
                </div>
              </div>
            </a>

            <a
              href="/o/madarts/members"
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-200 group"
            >
              <div className="flex items-center">
                <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-3 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">Community</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Artists</p>
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* Recent Activity - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Announcements */}
          {recentAnnouncements.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Recent Announcements
                </h2>
                <a
                  href="/o/madarts/announcements"
                  className="text-pink-600 dark:text-pink-400 hover:text-pink-500 dark:hover:text-pink-300 text-sm font-medium"
                >
                  View all →
                </a>
              </div>
              <div className="space-y-4">
                {recentAnnouncements.slice(0, 3).map((announcement) => {
                  const eventDate = announcement.scheduled_at || announcement.created_at
                  const date = new Date(eventDate)
                  const formattedDate = {
                    day: date.getDate(),
                    month: date.toLocaleDateString('en-US', { month: 'short' }),
                    year: date.getFullYear(),
                  }

                  return (
                    <div 
                      key={announcement.id} 
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-200 cursor-pointer group"
                    >
                      <a 
                        href={`/o/madarts/announcements/${announcement.id}`}
                        className="block"
                      >
                        <div className="flex">
                          {/* Image Column */}
                          <div className="w-20 flex-shrink-0">
                            <img 
                              src={getAnnouncementImage(announcement)}
                              alt={announcement.title}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Calendar Date Column */}
                          <div className="w-16 flex-shrink-0 bg-pink-50 dark:bg-pink-900/20 border-r border-gray-200 dark:border-gray-700 p-2 flex flex-col items-center justify-center">
                            <div className="text-center">
                              <div className="text-lg font-bold text-pink-600 dark:text-pink-400">
                                {formattedDate.day}
                              </div>
                              <div className="text-xs text-pink-500 dark:text-pink-400">
                                {formattedDate.month}
                              </div>
                              <div className="text-xs text-pink-500 dark:text-pink-400">
                                {formattedDate.year}
                              </div>
                            </div>
                          </div>

                          {/* Content Column */}
                          <div className="flex-1 p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors line-clamp-2">
                                  {announcement.title}
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                  {announcement.content}
                                </p>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.preventDefault()
                                  copyAnnouncementId(announcement.id)
                                }}
                                className="ml-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                title="Copy ID"
                              >
                                {copiedId === announcement.id ? (
                                  <Check className="h-3 w-3 text-green-500" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </a>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Featured Workshops */}
          {workshops.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Featured Workshops
                </h2>
                <a
                  href="/o/madarts/workshops"
                  className="text-pink-600 dark:text-pink-400 hover:text-pink-500 dark:hover:text-pink-300 text-sm font-medium"
                >
                  View all →
                </a>
              </div>
              <div className="space-y-4">
                {workshops.slice(0, 3).map((workshop) => (
                  <div 
                    key={workshop.id} 
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-200 cursor-pointer group"
                  >
                    <a href={`/o/madarts/workshops/${workshop.id}`} className="block">
                      <div className="flex">
                        {/* Workshop Icon */}
                        <div className="w-16 flex-shrink-0 bg-purple-50 dark:bg-purple-900/20 border-r border-gray-200 dark:border-gray-700 p-3 flex items-center justify-center">
                          <Video className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-4">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
                            {workshop.title}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                            {workshop.description}
                          </p>
                          <div className="flex items-center mt-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                              {workshop.level}
                            </span>
                            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                              {workshop.duration} min
                            </span>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* About Section */}
        <div className="mt-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              About MadArts
            </h2>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                MadArts is a creative organization focused on video performance, digital storytelling, 
                and multimedia arts education. We provide comprehensive workshops and training programs 
                for artists, content creators, and performers looking to master their craft in the digital age.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mt-4">
                Our mission is to empower creative professionals with the skills, tools, and community 
                they need to succeed in today's digital landscape. From video performance techniques 
                to advanced multimedia production, we offer hands-on learning experiences that bridge 
                traditional arts with cutting-edge technology.
              </p>
            </div>
          </div>
        </div>
      </div>

      <PageFooter />
    </div>
  )
}