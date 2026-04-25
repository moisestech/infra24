'use client'

import { NavigationProps } from './types'
import { NavigationBrand } from './NavigationBrand'
import { NavigationMenu } from './NavigationMenu'
import { AdminTools } from './AdminTools'
import { UserMenu } from './UserMenu'

export function UnifiedNavigation({ 
  config, 
  userRole = 'user', 
  className = '' 
}: NavigationProps) {
  // Safety check for undefined config
  if (!config) {
    console.error('UnifiedNavigation: config is undefined', { config, userRole, className })
    return (
      <nav className={`bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 ${className}`}>
        <div className="container mx-auto px-4 py-2">
          <div className="text-red-500 text-sm">Navigation Error: Config not provided</div>
        </div>
      </nav>
    )
  }

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
        <div className="flex h-16 items-center justify-between gap-2">
          <NavigationBrand organization={organization} className="min-w-0 shrink-0" />

          {/* Icon rail — all breakpoints (scroll on small screens) */}
          <div className="flex min-w-0 flex-1 items-center justify-end gap-1">
            <div className="flex min-w-0 max-w-full flex-1 justify-end overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <NavigationMenu items={filteredUserItems} colors={colors} />
            </div>
            {features.adminTools ? (
              <AdminTools items={filteredAdminItems} colors={colors} userRole={userRole} />
            ) : null}
            <UserMenu colors={colors} />
          </div>
        </div>
      </div>
    </nav>
  )
}
