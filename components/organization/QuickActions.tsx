'use client'

import { Bell, MapPin, ClipboardList, Globe, Calendar, Edit, GraduationCap } from 'lucide-react'
import ArtistIcon from '@/components/ui/ArtistIcon'

interface Organization {
  id: string
  name: string
  slug: string
}

interface QuickActionsProps {
  organization: Organization
  recentAnnouncementsCount: number
  userRole: string
  dashboardConfig?: {
    showAnnouncements: boolean
    showArtists: boolean
    showInteractiveMap: boolean
    showSurveys: boolean
    showXRExperiences: boolean
    showWorkshops: boolean
    showDigitalLab: boolean
  }
}

export function QuickActions({ organization, recentAnnouncementsCount, userRole, dashboardConfig }: QuickActionsProps) {
  return (
    <div className="mb-6 xl:mb-8 2xl:mb-10 3xl:mb-12">
      <h2 className="text-lg xl:text-xl 2xl:text-2xl 3xl:text-3xl font-semibold text-gray-900 dark:text-white mb-3 xl:mb-4 2xl:mb-5 3xl:mb-6">
        Quick Actions
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 xl:gap-4 2xl:gap-5 3xl:gap-6">
        {dashboardConfig?.showAnnouncements !== false && (
          <a
            href={`/o/${organization.slug}/announcements`}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 xl:p-4 2xl:p-5 3xl:p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <Bell className="h-5 w-5 xl:h-6 xl:w-6 2xl:h-7 2xl:w-7 3xl:h-8 3xl:w-8 text-blue-600 dark:text-blue-400 mr-2" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white text-sm xl:text-base 2xl:text-lg 3xl:text-xl">Announcements</p>
                <p className="text-xs xl:text-sm 2xl:text-base 3xl:text-lg text-gray-500 dark:text-gray-400">{recentAnnouncementsCount} active</p>
              </div>
            </div>
          </a>
        )}


        {dashboardConfig?.showArtists !== false && (
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
        )}

        {dashboardConfig?.showInteractiveMap !== false && (
          <a
            href={`/o/${organization.slug}/map`}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 xl:p-4 2xl:p-5 3xl:p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <MapPin className="h-5 w-5 xl:h-6 xl:w-6 2xl:h-7 2xl:w-7 3xl:h-8 3xl:w-8 text-orange-600 dark:text-orange-400 mr-2" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white text-sm xl:text-base 2xl:text-lg 3xl:text-xl">Interactive Map</p>
              </div>
            </div>
          </a>
        )}

        {dashboardConfig?.showSurveys !== false && (
          <a
            href={`/o/${organization.slug}/surveys`}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 xl:p-4 2xl:p-5 3xl:p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <ClipboardList className="h-5 w-5 xl:h-6 xl:w-6 2xl:h-7 2xl:w-7 3xl:h-8 3xl:w-8 text-indigo-600 dark:text-indigo-400 mr-2" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white text-sm xl:text-base 2xl:text-lg 3xl:text-xl">Surveys</p>
              </div>
            </div>
          </a>
        )}

        {dashboardConfig?.showXRExperiences !== false && (
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
        )}

        {dashboardConfig?.showWorkshops !== false && (
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
        )}

        {/* Booking link - conditional based on config */}
        {dashboardConfig?.showDigitalLab !== false && (
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
  )
}
