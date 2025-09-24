'use client'

import { OrganizationLogo } from '@/components/ui/OrganizationLogo'
import { MapPin } from 'lucide-react'

interface Organization {
  id: string
  name: string
  slug: string
  banner_image?: string
  created_at: string
}

interface OrganizationHeaderProps {
  organization: Organization
  userRole?: string
}

export function OrganizationHeader({ organization, userRole }: OrganizationHeaderProps) {
  return (
    <>
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
                {organization.slug === 'oolite' ? 'Digital Lab' : organization.name}
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
              {/* Only show Active status for super admin */}
              {userRole === 'super_admin' && (
                <div className="mb-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 4xl:px-5 4xl:py-2 rounded-full text-xs 4xl:text-2xl font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Active
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
