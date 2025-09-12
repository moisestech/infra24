'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser, SignOutButton } from '@clerk/nextjs'
import { 
  Home, 
  Users, 
  Bell, 
  ChevronDown, 
  User, 
  Settings,
  Plus,
  Filter,
  Menu,
  X,
  Building2
} from 'lucide-react'
import SmartSignIcon from './SmartSignIcon'
import OrganizationLogo from './OrganizationLogo'
import ArtistIcon from './ArtistIcon'
import { ClerkClientService } from '@/lib/clerk-client'
import { ThemeToggle } from '@/components/ThemeToggle'

interface Organization {
  id: string
  name: string
  slug: string
  logo_url?: string
  artist_icon?: string
  banner_image?: string
}

interface NavigationProps {
  className?: string
}

export default function Navigation({ className = '' }: NavigationProps) {
  const { user, isLoaded } = useUser()
  const pathname = usePathname()
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [currentOrg, setCurrentOrg] = useState<Organization | null>(null)
  const [userRole, setUserRole] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUserData() {
      if (!user) return

      try {
        // For now, we'll fetch user data via API routes
        // This is a simplified approach - in a real app you'd want to cache this
        const response = await fetch('/api/users/me')
        if (response.ok) {
          const userData = await response.json()
          setUserRole(userData.role || 'resident')
          
          // Load organizations based on user role
          if (userData.role === 'super_admin') {
            const orgsResponse = await fetch('/api/organizations')
            if (orgsResponse.ok) {
              const orgsData = await orgsResponse.json()
              setOrganizations(orgsData.organizations || [])
            }
          } else if (userData.organization) {
            setOrganizations([userData.organization])
            setCurrentOrg(userData.organization)
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (isLoaded && user) {
      loadUserData()
    }
  }, [user, isLoaded])

  const isActive = (path: string) => pathname === path
  const isActiveStartsWith = (path: string) => pathname.startsWith(path)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  if (!isLoaded || loading) {
    return (
      <nav className={`bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mr-2"></div>
              <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  if (!user) {
    return (
      <nav className={`bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <SmartSignIcon size={32} showText={true} />
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/sign-in"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign In
              </Link>
              <Link 
                href="/sign-up"
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className={`bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Logo and main nav */}
          <div className="flex items-center space-x-8">
            {/* Smart Sign Logo - takes you to home */}
            <Link href="/" className="flex items-center">
              <SmartSignIcon size={32} showText={true} autoHideOnMobile={true} />
            </Link>
            
            {/* Organization Logo - takes you to current org */}
            {currentOrg && currentOrg.logo_url && (
              <Link href={`/o/${currentOrg.slug}`} className="flex items-center">
                <img 
                  src={currentOrg.logo_url} 
                  alt={currentOrg.name}
                  className="h-8 w-auto"
                />
              </Link>
            )}

            {/* Main Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              <Link 
                href="/"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/') 
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Home className="h-4 w-4" />
                <span className="nav-text-hidden lg:block">Home</span>
              </Link>

              {/* Organizations Dropdown */}
              <div className="relative group">
                <button className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <SmartSignIcon size={16} showText={false} />
                  <span className="nav-text-hidden lg:block">Organizations</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                
                <div className="absolute left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    {organizations.map((org) => (
                      <div key={org.id} className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {org.name}
                          </span>
                          {currentOrg?.id === org.id && (
                            <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                              Current
                            </span>
                          )}
                        </div>
                        <div className="mt-1 space-y-1">
                          <Link 
                            href={`/organizations/${org.slug}`}
                            className="block text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                          >
                            Overview
                          </Link>
                          <Link 
                            href={`/organizations/${org.slug}/announcements`}
                            className="block text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                          >
                            Announcements
                          </Link>
                          <Link 
                            href={`/organizations/${org.slug}/users`}
                            className="block text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                          >
                            Members
                          </Link>
                          <Link 
                            href={`/organizations/${org.slug}/artists`}
                            className="block text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                          >
                            Artists
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Members Dropdown */}
              <div className="relative group">
                <button className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <Users className="h-4 w-4" />
                  <span className="nav-text-hidden lg:block">Members</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                
                <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    <Link 
                      href="/users"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      All Members
                    </Link>
                    <Link 
                      href="/users?role=resident"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Residents
                    </Link>
                    <Link 
                      href="/users?role=moderator"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Moderators
                    </Link>
                    <Link 
                      href="/users?role=org_admin"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Admins
                    </Link>
                  </div>
                </div>
              </div>

              {/* Announcements */}
              <Link 
                href="/announcements"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActiveStartsWith('/announcements') 
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Bell className="h-4 w-4" />
                <span className="nav-text-hidden lg:block">Announcements</span>
              </Link>


            </div>
          </div>

          {/* Right side - User menu and actions */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button - First on mobile */}
            <div className="lg:hidden">
              <button
                onClick={toggleMobileMenu}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white p-2 rounded-md"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>

            {/* Theme Toggle - Second */}
            <ThemeToggle />

            {/* User menu - Third */}
            <div className="relative group">
              <Link href="/profile" className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                {user.imageUrl ? (
                  <img 
                    src={user.imageUrl} 
                    alt={user.fullName || 'User'} 
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </div>
                )}
                <span className="nav-text-hidden lg:block text-sm font-medium">{user.fullName || user.emailAddresses[0]?.emailAddress}</span>
                <ChevronDown className="nav-text-hidden lg:block h-4 w-4" />
              </Link>
              
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <Link 
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Your Profile
                  </Link>
                  <Link 
                    href="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Settings
                  </Link>
                  
                  {/* Organization Access */}
                  {organizations.length > 0 && (
                    <>
                      <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                      <div className="px-4 py-2">
                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                          Organizations
                        </div>
                        <div className="space-y-1">
                          {organizations.map((org) => (
                            <Link
                              key={org.id}
                              href={`/o/${org.slug}`}
                              className="flex items-center space-x-2 px-2 py-1 rounded text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              <OrganizationLogo organization={org} size="sm" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                  <SignOutButton>
                    <button className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                      Sign Out
                    </button>
                  </SignOutButton>
                                  </div>
                </div>
              </div>

            {/* Create button - Fourth */}
            {(userRole === 'org_admin' || userRole === 'super_admin' || userRole === 'moderator') && (
              <div className="relative group">
                <button className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                  <Plus className="h-4 w-4" />
                  <span className="nav-text-hidden lg:block">Create</span>
                  <ChevronDown className="nav-text-hidden lg:block h-4 w-4" />
                </button>
                
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    <Link 
                      href="/announcements/create"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      New Announcement
                    </Link>
                    <Link 
                      href="/artists/create"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      New Artist Profile
                    </Link>
                    {(userRole === 'super_admin') && (
                      <Link 
                        href="/organizations/create"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        New Organization
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}
            </div>
          </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
              <Link
                href="/"
                className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center space-x-2">
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </div>
              </Link>
              
              <Link
                href="/dashboard"
                className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Dashboard</span>
                </div>
              </Link>
              
              <Link
                href="/profile"
                className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </div>
              </Link>
              
              <Link
                href="/announcements"
                className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center space-x-2">
                  <Bell className="h-4 w-4" />
                  <span>Announcements</span>
                </div>
              </Link>
              
              <Link
                href="/users"
                className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Users</span>
                </div>
              </Link>
              

              
              {/* Organizations in mobile menu */}
              {organizations.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                  <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Organizations
                  </div>
                  {organizations.map((org) => (
                    <div key={org.id} className="pl-3">
                      <Link
                        href={`/o/${org.slug}`}
                        className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="flex items-center space-x-2">
                          <OrganizationLogo organization={org} size="sm" />
                          <span>{org.name}</span>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Sign Out in mobile menu */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                <SignOutButton>
                  <button 
                    className="block w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Out
                  </button>
                </SignOutButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
