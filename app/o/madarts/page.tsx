'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { Bell, Users, Building2, Calendar, MapPin, Globe, Eye, Edit, ClipboardList, FileCheck, GraduationCap, Copy, Check } from 'lucide-react'
import { UnifiedNavigation, madartsConfig } from '@/components/navigation'
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

export default function MadArtsPage() {
  const { user } = useUser()
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrganization() {
      try {
        const response = await fetch('/api/organizations/by-slug/madarts')
        if (response.ok) {
          const data = await response.json()
          setOrganization(data)
        }
      } catch (error) {
        console.error('Error fetching MadArts organization:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrganization()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-purple-900">
        <UnifiedNavigation config={madartsConfig} />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!organization) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-purple-900">
        <UnifiedNavigation config={madartsConfig} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-purple-900">
      <UnifiedNavigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Organization Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="flex-shrink-0">
              <OrganizationLogo 
                organization={organization}
                width={200}
                height={80}
                className="rounded-lg"
              />
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-pink-100 dark:bg-pink-900 rounded-lg">
                <GraduationCap className="w-6 h-6 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Workshops</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Explore our video performance and digital storytelling workshops
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Bookings</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Book studio time and equipment for your creative projects
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Community</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Connect with fellow artists and creative professionals
            </p>
          </div>
        </div>

        {/* About Section */}
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

      <PageFooter />
    </div>
  )
}
