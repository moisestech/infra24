'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useUser, SignOutButton } from '@clerk/nextjs'
import { ChevronDown, User, Settings, LogOut } from 'lucide-react'
import { ThemeColors } from './types'

interface UserMenuProps {
  colors: ThemeColors
  className?: string
}

export function UserMenu({ colors, className = '' }: UserMenuProps) {
  const { user, isLoaded } = useUser()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  if (!isLoaded || !user) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Link
          href="/sign-in"
          className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors"
          style={{ color: 'inherit' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.primary
            e.currentTarget.style.color = 'white'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = ''
          }}
        >
          Sign In
        </Link>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors"
        style={{
          backgroundColor: isOpen ? colors.primary : 'transparent',
          color: isOpen ? 'white' : undefined,
        }}
        onMouseEnter={(e) => {
          if (!isOpen) {
            e.currentTarget.style.backgroundColor = colors.primary
            e.currentTarget.style.color = 'white'
          }
        }}
        onMouseLeave={(e) => {
          if (!isOpen) {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = ''
          }
        }}
      >
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <span className="hidden xl:inline text-sm">
            {user.firstName || user.emailAddresses[0]?.emailAddress}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="py-1">
            {/* User Info */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {user.firstName && user.lastName 
                  ? `${user.firstName} ${user.lastName}`
                  : user.emailAddresses[0]?.emailAddress
                }
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {user.emailAddresses[0]?.emailAddress}
              </div>
            </div>

            {/* Menu Items */}
            <Link
              href="/profile"
              className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <User className="w-4 h-4 mr-3" />
              Profile
            </Link>

            <Link
              href="/settings"
              className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="w-4 h-4 mr-3" />
              Settings
            </Link>


            {/* Sign Out */}
            <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
              <SignOutButton>
                <button className="flex items-center w-full text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors">
                  <LogOut className="w-4 h-4 mr-3" />
                  Sign Out
                </button>
              </SignOutButton>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
