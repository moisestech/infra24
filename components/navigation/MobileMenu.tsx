'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { NavigationItem, ThemeColors } from './types'
import { NavigationBrand } from './NavigationBrand'
import { AdminTools } from './AdminTools'
import { UserMenu } from './UserMenu'
import { Organization } from './types'
import { hasAdminAccess } from '@/lib/utils/admin-access'

interface MobileMenuProps {
  organization: Organization
  userItems: NavigationItem[]
  adminItems: NavigationItem[]
  colors: ThemeColors
  userRole?: 'user' | 'admin' | 'super_admin'
  className?: string
}

export function MobileMenu({ 
  organization,
  userItems, 
  adminItems, 
  colors, 
  userRole = 'user',
  className = '' 
}: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { user } = useUser()
  
  // Get user email from Clerk
  const userEmail = user?.emailAddresses?.[0]?.emailAddress
  
  // Check if user has admin access (either by role or email)
  const hasAccess = hasAdminAccess(userRole, userEmail)

  const isActive = (href: string) => {
    if (href === '/o/oolite' || href === '/o/bakehouse') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <div className={`md:hidden ${className}`}>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-white hover:bg-opacity-80 transition-colors"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsOpen(false)} />
          
          <div className="fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 shadow-xl">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <NavigationBrand organization={organization} />
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-white hover:bg-opacity-80 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation Items */}
              <div className="flex-1 overflow-y-auto py-4">
                <div className="px-4 space-y-2">
                  {/* User Navigation */}
                  <div className="mb-6">
                    <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Navigation
                    </h3>
                    <div className="space-y-1">
                      {userItems.map((item) => {
                        const isActiveItem = isActive(item.href)
                        const Icon = item.icon

                        return (
                          <Link
                            key={item.href}
                            href={item.disabled ? '#' : item.href}
                            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                              isActiveItem
                                ? 'text-white'
                                : 'text-gray-700 dark:text-gray-300 hover:text-white hover:bg-opacity-80'
                            } ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                            style={{
                              backgroundColor: isActiveItem ? colors.primary : 'transparent',
                            }}
                            onClick={(e) => {
                              if (item.disabled) {
                                e.preventDefault()
                              } else {
                                setIsOpen(false)
                              }
                            }}
                          >
                            <Icon className="w-5 h-5 mr-3" />
                            <span className="flex-1">{item.name}</span>
                            {item.badge && (
                              <span className="px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        )
                      })}
                    </div>
                  </div>

                  {/* Admin Navigation */}
                  {hasAccess && adminItems.length > 0 && (
                    <div className="mb-6">
                      <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Administration
                      </h3>
                      <div className="space-y-1">
                        {adminItems.map((item) => {
                          const isActiveItem = isActive(item.href)
                          const Icon = item.icon

                          return (
                            <Link
                              key={item.href}
                              href={item.disabled ? '#' : item.href}
                              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                isActiveItem
                                  ? 'text-white'
                                  : 'text-gray-700 dark:text-gray-300 hover:text-white hover:bg-opacity-80'
                              } ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                              style={{
                                backgroundColor: isActiveItem ? colors.primary : 'transparent',
                              }}
                              onClick={(e) => {
                                if (item.disabled) {
                                  e.preventDefault()
                                } else {
                                  setIsOpen(false)
                                }
                              }}
                            >
                              <Icon className="w-5 h-5 mr-3" />
                              <div className="flex-1">
                                <div>{item.name}</div>
                                {item.description && (
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {item.description}
                                  </div>
                                )}
                              </div>
                              {item.badge && (
                                <span className="px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                                  {item.badge}
                                </span>
                              )}
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                <UserMenu colors={colors} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
