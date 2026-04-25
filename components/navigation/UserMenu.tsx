'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useUser, SignOutButton } from '@clerk/nextjs'
import { ChevronDown, User, Settings, LogOut, Sun, Moon, LogIn } from 'lucide-react'
import Tooltip from '@/components/ui/Tooltip'
import { ThemeColors } from './types'
import { useTheme } from '@/contexts/ThemeContext'
import { ThemeToggle } from '@/components/ThemeToggle'

interface UserMenuProps {
  colors: ThemeColors
  className?: string
}

export function UserMenu({ colors, className = '' }: UserMenuProps) {
  const { user, isLoaded } = useUser()
  const { resolvedTheme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

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
      <div className={`flex shrink-0 items-center gap-1 ${className}`}>
        <span className="text-gray-700 dark:text-gray-200 [&_button]:text-current">
          <ThemeToggle />
        </span>
        <Tooltip content="Sign in" position="bottom">
          <Link
            href="/sign-in"
            className="flex size-9 items-center justify-center rounded-md text-sm font-medium text-gray-700 transition-colors dark:text-gray-300 sm:size-10"
            style={{ color: 'inherit' }}
            aria-label="Sign in"
            title="Sign in"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.primary
              e.currentTarget.style.color = 'white'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = ''
            }}
          >
            <LogIn className="h-4 w-4" aria-hidden />
            <span className="sr-only">Sign in</span>
          </Link>
        </Tooltip>
      </div>
    )
  }

  const displayName =
    user.firstName?.trim() ||
    user.primaryEmailAddress?.emailAddress ||
    user.emailAddresses[0]?.emailAddress ||
    'Account'

  return (
    <div className={`relative shrink-0 ${className}`} ref={dropdownRef}>
      <Tooltip content={displayName} position="bottom">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex size-9 items-center justify-center gap-0.5 rounded-md text-sm font-medium text-gray-700 transition-colors dark:text-gray-300 sm:size-10"
          style={{
            backgroundColor: isOpen ? colors.primary : 'transparent',
            color: isOpen ? 'white' : undefined,
          }}
          aria-label="Account menu"
          aria-expanded={isOpen}
          title={displayName}
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
          <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-300 dark:bg-gray-600 sm:h-8 sm:w-8">
            {user.imageUrl ? (
              <Image src={user.imageUrl} alt="" width={32} height={32} className="h-full w-full object-cover" />
            ) : (
              <User className="h-4 w-4" aria-hidden />
            )}
          </div>
          <ChevronDown className={`h-3.5 w-3.5 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden />
        </button>
      </Tooltip>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-64 rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <div className="py-1">
            <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {user.firstName && user.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user.emailAddresses[0]?.emailAddress}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {user.emailAddresses[0]?.emailAddress}
              </div>
            </div>

            <Link
              href="/profile"
              className="flex items-center px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              onClick={() => setIsOpen(false)}
            >
              <User className="mr-3 h-4 w-4" />
              Profile
            </Link>

            <Link
              href="/profile/settings"
              className="flex items-center px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="mr-3 h-4 w-4" />
              Settings
            </Link>

            <div className="border-t border-gray-200 px-4 py-3 dark:border-gray-700">
              <div className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Appearance
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`inline-flex items-center justify-center gap-1 rounded-md px-3 py-2 text-xs font-medium transition-colors ${
                    resolvedTheme === 'light'
                      ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  <Sun className="h-3.5 w-3.5" />
                  Light
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`inline-flex items-center justify-center gap-1 rounded-md px-3 py-2 text-xs font-medium transition-colors ${
                    resolvedTheme === 'dark'
                      ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  <Moon className="h-3.5 w-3.5" />
                  Dark
                </button>
              </div>
            </div>

            <div className="border-t border-gray-200 px-4 py-3 dark:border-gray-700">
              <SignOutButton>
                <button
                  type="button"
                  className="flex w-full items-center text-sm text-red-600 transition-colors hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  <LogOut className="mr-3 h-4 w-4" />
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
