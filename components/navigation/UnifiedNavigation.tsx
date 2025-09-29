'use client'

import { NavigationProps } from './types'
import { NavigationBrand } from './NavigationBrand'
import { NavigationMenu } from './NavigationMenu'
import { AdminTools } from './AdminTools'
import { UserMenu } from './UserMenu'
import { MobileMenu } from './MobileMenu'

export function UnifiedNavigation({ 
  config, 
  userRole = 'user', 
  className = '' 
}: NavigationProps) {
  const { organization, colors, features, navigation } = config

  // Filter navigation items based on feature flags
  const filteredUserItems = navigation.userItems.filter(item => {
    // Map navigation items to feature flags
    const featureMap: Record<string, keyof typeof features> = {
      'surveys': 'surveys',
      'analytics': 'analytics',
      'digital-lab': 'digitalLab',
      'workshops': 'workshops',
      'announcements': 'announcements',
      'members': 'members',
      'submissions': 'submissions',
      'roadmap': 'roadmap',
      'budget': 'budget',
      'impact-roi': 'impactRoi',
      'ai-tools': 'aiTools',
      'bookings': 'bookings'
    }

    // Check if the item's href contains any feature key
    const hasFeature = Object.entries(featureMap).some(([key, feature]) => 
      item.href.includes(key) && features[feature]
    )

    // If no feature mapping found, show the item by default
    return hasFeature || !Object.values(featureMap).some(feature => item.href.includes(feature))
  })

  const filteredAdminItems = navigation.adminItems.filter(item => {
    // Same feature filtering for admin items
    const featureMap: Record<string, keyof typeof features> = {
      'surveys': 'surveys',
      'analytics': 'analytics',
      'digital-lab': 'digitalLab',
      'workshops': 'workshops',
      'announcements': 'announcements',
      'members': 'members',
      'submissions': 'submissions',
      'roadmap': 'roadmap',
      'budget': 'budget',
      'impact-roi': 'impactRoi',
      'ai-tools': 'aiTools',
      'bookings': 'bookings'
    }

    const hasFeature = Object.entries(featureMap).some(([key, feature]) => 
      item.href.includes(key) && features[feature]
    )

    return hasFeature || !Object.values(featureMap).some(feature => item.href.includes(feature))
  })

  return (
    <nav 
      className={`bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 ${className}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Brand */}
          <NavigationBrand organization={organization} />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {/* User Navigation */}
            <NavigationMenu 
              items={filteredUserItems} 
              colors={colors}
            />

            {/* Admin Tools */}
            {features.adminTools && (
              <AdminTools 
                items={filteredAdminItems} 
                colors={colors}
                userRole={userRole}
              />
            )}

            {/* User Menu */}
            <UserMenu colors={colors} />
          </div>

          {/* Mobile Menu */}
          <MobileMenu
            organization={organization}
            userItems={filteredUserItems}
            adminItems={filteredAdminItems}
            colors={colors}
            userRole={userRole}
          />
        </div>
      </div>
    </nav>
  )
}
