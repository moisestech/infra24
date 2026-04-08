'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { ChevronLeft, Moon, Sun, UserCog, Shield } from 'lucide-react'
import { UnifiedNavigation, ooliteConfig, bakehouseConfig } from '@/components/navigation'
import { useTheme } from '@/contexts/ThemeContext'

type UserContext = {
  role?: string
  organization?: { slug?: string; name?: string }
}

export default function ProfileSettingsPage() {
  const { isLoaded } = useUser()
  const { resolvedTheme, setTheme } = useTheme()
  const [userContext, setUserContext] = useState<UserContext>({})

  useEffect(() => {
    async function loadUserContext() {
      try {
        const response = await fetch('/api/users/me')
        if (!response.ok) return
        const data = await response.json()
        setUserContext({
          role: data?.role || 'user',
          organization: data?.organization || undefined,
        })
      } catch (error) {
        console.error('Error loading settings context:', error)
      }
    }

    if (isLoaded) loadUserContext()
  }, [isLoaded])

  const orgSlug = userContext.organization?.slug
  const navigationConfig = orgSlug === 'bakehouse' ? bakehouseConfig : ooliteConfig

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <UnifiedNavigation config={navigationConfig} userRole={(userContext.role as any) || 'user'} />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Profile
          </Link>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Settings</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage appearance and account preferences.
          </p>
        </div>

        <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-2">
            <Sun className="h-5 w-5 text-gray-500 dark:text-gray-300" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Appearance</h2>
          </div>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Choose how Infra24 looks for you.
          </p>
          <div className="grid max-w-xs grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                resolvedTheme === 'light'
                  ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <Sun className="h-4 w-4" />
              Light
            </button>
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                resolvedTheme === 'dark'
                  ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <Moon className="h-4 w-4" />
              Dark
            </button>
          </div>
        </section>

        <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-3 flex items-center gap-2">
            <UserCog className="h-5 w-5 text-gray-500 dark:text-gray-300" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Account</h2>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Profile and identity settings will continue to live here as we expand account controls.
          </p>
        </section>

        <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-3 flex items-center gap-2">
            <Shield className="h-5 w-5 text-gray-500 dark:text-gray-300" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Privacy & Security</h2>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Security and session controls will be added in upcoming iterations.
          </p>
        </section>
      </main>
    </div>
  )
}

