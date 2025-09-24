'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser, SignOutButton } from '@clerk/nextjs'
import { 
  Users, 
  Bell, 
  ChevronDown, 
  User, 
  Settings,
  Plus,
  Filter,
  Menu,
  X,
  Building2,
  Shield,
  BarChart3,
  FileText,
  Map,
  DollarSign,
  TrendingUp,
  Bot,
  Calendar,
  Microscope,
  GraduationCap
} from 'lucide-react'
import { Infra24Logo } from './Infra24Logo'
import { OrganizationLogo } from './OrganizationLogo'
import ArtistIcon from './ArtistIcon'
import { ClerkClientService } from '@/lib/clerk-client'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useTheme } from '@/contexts/ThemeContext'

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
  organization?: Organization | null
}

export default function Navigation({ className = '', organization }: NavigationProps) {
  const { user, isLoaded } = useUser()
  const { resolvedTheme } = useTheme()
  const pathname = usePathname()
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [currentOrg, setCurrentOrg] = useState<Organization | null>(null)
  const [userRole, setUserRole] = useState<string>('')
  const [loading, setLoading] = useState(true)
  
  // Client-side organization detection
  const [showOrgLogo, setShowOrgLogo] = useState(false)
  
  useEffect(() => {
    // Only run on client side after hydration
    const isOnOrgPage = pathname.startsWith('/o/')
    const slug = isOnOrgPage ? pathname.split('/')[2] : (organization?.slug || null)
    
    setShowOrgLogo(!!slug)
  }, [pathname, organization?.slug])
  
  // Detect organization slug for theme colors
  const isOnOrgPage = pathname.startsWith('/o/')
  const orgSlug = isOnOrgPage ? pathname.split('/')[2] : (organization?.slug || null)

  // Organization theme colors (default to Oolite if no organization)
  const getThemeColors = () => {
    if (orgSlug === 'oolite') {
      return {
        primary: '#47abc4',
        primaryLight: '#6bb8d1',
        primaryDark: '#3a8ba3',
        primaryAlpha: 'rgba(71, 171, 196, 0.1)',
        primaryAlphaLight: 'rgba(71, 171, 196, 0.05)',
        primaryAlphaDark: 'rgba(71, 171, 196, 0.15)',
      }
    }
    // Default theme colors
    return {
      primary: '#3b82f6',
      primaryLight: '#60a5fa',
      primaryDark: '#2563eb',
      primaryAlpha: 'rgba(59, 130, 246, 0.1)',
      primaryAlphaLight: 'rgba(59, 130, 246, 0.05)',
      primaryAlphaDark: 'rgba(59, 130, 246, 0.15)',
    }
  }

  const themeColors = getThemeColors()

  // Theme-aware styles for navigation
  const getNavStyles = () => {
    if (resolvedTheme === 'dark') {
      return {
        background: isOnOrgPage ? `linear-gradient(135deg, ${themeColors.primaryAlphaDark} 0%, #1a1a1a 50%, ${themeColors.primaryAlphaDark} 100%)` : '#1a1a1a',
        borderColor: themeColors.primary,
        textPrimary: '#ffffff',
        textSecondary: '#a0a0a0',
        hoverBg: themeColors.primaryAlpha,
        activeBg: themeColors.primaryAlpha,
      }
    } else {
      return {
        background: isOnOrgPage ? `linear-gradient(135deg, ${themeColors.primaryAlphaLight} 0%, #ffffff 50%, ${themeColors.primaryAlphaLight} 100%)` : '#ffffff',
        borderColor: themeColors.primary,
        textPrimary: '#1a1a1a',
        textSecondary: '#666666',
        hoverBg: themeColors.primaryAlpha,
        activeBg: themeColors.primaryAlpha,
      }
    }
  }

  const navStyles = getNavStyles()

  // Helper function to create theme-aware link styles
  const getLinkStyles = (isActive: boolean) => ({
    color: isActive ? themeColors.primary : navStyles.textSecondary,
    backgroundColor: isActive ? navStyles.activeBg : 'transparent'
  })

  const getLinkHandlers = (isActive: boolean) => ({
    onMouseEnter: (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!isActive) {
        e.currentTarget.style.color = navStyles.textPrimary
        e.currentTarget.style.backgroundColor = navStyles.hoverBg
      }
    },
    onMouseLeave: (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!isActive) {
        e.currentTarget.style.color = navStyles.textSecondary
        e.currentTarget.style.backgroundColor = 'transparent'
      }
    }
  })

  useEffect(() => {
    async function loadUserData() {
      if (!user) {
        // No user - set loading to false immediately for guest access
        setLoading(false)
        return
      }

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

    if (isLoaded) {
      loadUserData()
    }
  }, [user, isLoaded])

  const isActive = (path: string) => pathname === path
  const isActiveStartsWith = (path: string) => pathname.startsWith(path)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // Show loading state only if we don't have organization data and Clerk is still loading
  // But if we're on an organization page, we can show the org logo immediately
  // Simplified: only show loading if we have no organization AND no org slug from URL
  
  if (!organization && !orgSlug && (!isLoaded || loading)) {
    return (
      <nav 
        className={`border-b sticky top-0 z-50 ${className}`}
        style={{ 
          background: navStyles.background,
          borderColor: navStyles.borderColor
        }}
      >
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
      <nav 
        className={`border-b sticky top-0 z-50 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 ${className}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {(() => {
                // Use the same logic as the main navigation for organization detection
                const isOnOrgPage = pathname.startsWith('/o/')
                const slug = isOnOrgPage ? pathname.split('/')[2] : (organization?.slug || null)
                const shouldShowOrgLogo = !!slug
                
                
                return shouldShowOrgLogo ? (
                  <Link href={organization ? `/o/${slug}` : "/"} className="flex items-center py-2">
                    <OrganizationLogo 
                      organizationSlug={slug || organization?.slug || ''} 
                      variant="horizontal" 
                      size="md" 
                    />
                  </Link>
                ) : (
                  <Link href="/" className="flex items-center">
                    <Infra24Logo size="lg" showText={true} />
                  </Link>
                )
              })()}
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link 
                href="/sign-in"
                className="px-3 py-2 rounded-md text-sm font-medium"
                style={{ 
                  color: navStyles.textSecondary,
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = navStyles.textPrimary
                  e.currentTarget.style.backgroundColor = navStyles.hoverBg
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = navStyles.textSecondary
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                Sign In
              </Link>
              <Link 
                href="/sign-up"
                className="px-4 py-2 rounded-md text-sm font-medium text-white"
                style={{ 
                  backgroundColor: themeColors.primary,
                  borderColor: themeColors.primary
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = themeColors.primaryLight
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = themeColors.primary
                }}
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
    <nav 
      className={`border-b sticky top-0 z-50 ${className}`}
      style={{ 
        background: navStyles.background,
        borderColor: navStyles.borderColor
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Logo and main nav */}
          <div className="flex items-center space-x-8">
            {/* Logo - Organization logo when on org pages or when organization prop is provided, Infra24 logo otherwise */}
            {(() => {
              // Use the same logic as useEffect to ensure consistency
              const isOnOrgPage = pathname.startsWith('/o/')
              const slug = isOnOrgPage ? pathname.split('/')[2] : (organization?.slug || null)
              const shouldShowOrgLogo = !!slug
              
              
              return shouldShowOrgLogo
            })() ? (
              <Link href={organization ? `/o/${orgSlug}` : "/"} className="flex items-center py-2">
                <OrganizationLogo 
                  organizationSlug={orgSlug || organization?.slug || ''} 
                  variant="horizontal" 
                  size="md" 
                />
              </Link>
            ) : (
              <Link href="/" className="flex items-center">
                <Infra24Logo size="lg" showText={true} />
              </Link>
            )}

            {/* Main Navigation */}
            <div className="hidden lg:flex items-center space-x-1">

              {/* Organization Navigation - Show when on org pages or when organization prop is provided */}
              {((isOnOrgPage && orgSlug) || (organization && orgSlug)) && (
                <>

                  <Link 
                    href={`/o/${orgSlug}/digital-lab`}
                    className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:scale-105"
                    style={getLinkStyles(isActiveStartsWith(`/o/${orgSlug}/digital-lab`))}
                    {...getLinkHandlers(isActiveStartsWith(`/o/${orgSlug}/digital-lab`))}
                  >
                    <Microscope className="h-6 w-6 xl:h-4 xl:w-4" />
                    <span className="hidden xl:block">Digital Lab</span>
                  </Link>

                  <Link 
                    href={`/o/${orgSlug}/workshops`}
                    className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:scale-105"
                    style={getLinkStyles(isActiveStartsWith(`/o/${orgSlug}/workshops`))}
                    {...getLinkHandlers(isActiveStartsWith(`/o/${orgSlug}/workshops`))}
                  >
                    <GraduationCap className="h-6 w-6 xl:h-4 xl:w-4" />
                    <span className="hidden xl:block">Workshops</span>
                  </Link>


                  {/* Admin Dropdown for Organization Pages */}
                  {(userRole === 'org_admin' || userRole === 'super_admin' || userRole === 'moderator') && (
                    <div className="relative group">
                      <button 
                        className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium hover:scale-105 transition-all duration-200"
                        style={{
                          color: navStyles.textSecondary,
                          backgroundColor: 'transparent'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = navStyles.textPrimary
                          e.currentTarget.style.backgroundColor = navStyles.hoverBg
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = navStyles.textSecondary
                          e.currentTarget.style.backgroundColor = 'transparent'
                        }}
                      >
                        <Shield className="h-6 w-6 xl:h-4 xl:w-4" />
                        <span className="hidden xl:block">Admin</span>
                        <ChevronDown className="h-4 w-4 hidden xl:block" />
                      </button>
                      
                      <div 
                        className="absolute right-0 mt-2 w-64 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
                        style={{
                          backgroundColor: navStyles.background.includes('gradient') ? (resolvedTheme === 'dark' ? '#2a2a2a' : '#ffffff') : navStyles.background,
                          borderColor: navStyles.borderColor,
                          border: '1px solid'
                        }}
                      >
                        <div className="py-2">
                          <div 
                            className="px-4 py-2"
                            style={{ borderBottom: `1px solid ${navStyles.borderColor}` }}
                          >
                            <div 
                              className="text-xs font-medium uppercase tracking-wider"
                              style={{ color: navStyles.textSecondary }}
                            >
                              Admin Tools
                            </div>
                          </div>
                          
                          <Link 
                            href={`/o/${orgSlug}/analytics`}
                            className="flex items-center space-x-3 px-4 py-2 text-sm"
                            style={{ color: navStyles.textSecondary }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = navStyles.textPrimary
                              e.currentTarget.style.backgroundColor = navStyles.hoverBg
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = navStyles.textSecondary
                              e.currentTarget.style.backgroundColor = 'transparent'
                            }}
                          >
                            <BarChart3 className="h-4 w-4" />
                            <div>
                              <div>Analytics</div>
                              <div className="text-xs opacity-75">Performance metrics and insights</div>
                            </div>
                          </Link>
                          
                          <Link 
                            href={`/o/${orgSlug}/users`}
                            className="flex items-center space-x-3 px-4 py-2 text-sm"
                            style={{ color: navStyles.textSecondary }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = navStyles.textPrimary
                              e.currentTarget.style.backgroundColor = navStyles.hoverBg
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = navStyles.textSecondary
                              e.currentTarget.style.backgroundColor = 'transparent'
                            }}
                          >
                            <Users className="h-4 w-4" />
                            <div>
                              <div>Members</div>
                              <div className="text-xs opacity-75">Manage organization members</div>
                            </div>
                          </Link>
                          
                          <Link 
                            href={`/o/${orgSlug}/surveys`}
                            className="flex items-center space-x-3 px-4 py-2 text-sm"
                            style={{ color: navStyles.textSecondary }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = navStyles.textPrimary
                              e.currentTarget.style.backgroundColor = navStyles.hoverBg
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = navStyles.textSecondary
                              e.currentTarget.style.backgroundColor = 'transparent'
                            }}
                          >
                            <FileText className="h-4 w-4" />
                            <div>
                              <div>Surveys</div>
                              <div className="text-xs opacity-75">Survey management and analytics</div>
                            </div>
                          </Link>
                          
                          <Link 
                            href={`/o/${orgSlug}/roadmap`}
                            className="flex items-center space-x-3 px-4 py-2 text-sm"
                            style={{ color: navStyles.textSecondary }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = navStyles.textPrimary
                              e.currentTarget.style.backgroundColor = navStyles.hoverBg
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = navStyles.textSecondary
                              e.currentTarget.style.backgroundColor = 'transparent'
                            }}
                          >
                            <Map className="h-4 w-4" />
                            <div>
                              <div>Roadmap</div>
                              <div className="text-xs opacity-75">Strategic development plan</div>
                            </div>
                          </Link>
                          
                          <Link 
                            href={`/o/${orgSlug}/budget`}
                            className="flex items-center space-x-3 px-4 py-2 text-sm"
                            style={{ color: navStyles.textSecondary }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = navStyles.textPrimary
                              e.currentTarget.style.backgroundColor = navStyles.hoverBg
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = navStyles.textSecondary
                              e.currentTarget.style.backgroundColor = 'transparent'
                            }}
                          >
                            <DollarSign className="h-4 w-4" />
                            <div>
                              <div>Budget</div>
                              <div className="text-xs opacity-75">Financial planning and costs</div>
                            </div>
                          </Link>
                          
                          <Link 
                            href={`/o/${orgSlug}/impact-roi`}
                            className="flex items-center space-x-3 px-4 py-2 text-sm"
                            style={{ color: navStyles.textSecondary }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = navStyles.textPrimary
                              e.currentTarget.style.backgroundColor = navStyles.hoverBg
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = navStyles.textSecondary
                              e.currentTarget.style.backgroundColor = 'transparent'
                            }}
                          >
                            <TrendingUp className="h-4 w-4" />
                            <div>
                              <div>Impact & ROI</div>
                              <div className="text-xs opacity-75">Success metrics and outcomes</div>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}





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
              <Link 
                href="/profile" 
                className="flex items-center space-x-2"
                style={{ color: navStyles.textSecondary }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = navStyles.textPrimary
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = navStyles.textSecondary
                }}
              >
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
                <span className="hidden lg:block text-sm font-medium">{user.fullName || user.emailAddresses[0]?.emailAddress}</span>
                <ChevronDown className="hidden lg:block h-4 w-4" />
              </Link>
              
              <div 
                className="absolute right-0 mt-2 w-64 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
                style={{
                  backgroundColor: navStyles.background.includes('gradient') ? (resolvedTheme === 'dark' ? '#2a2a2a' : '#ffffff') : navStyles.background,
                  borderColor: navStyles.borderColor,
                  border: '1px solid'
                }}
              >
                <div className="py-2">
                  <Link 
                    href="/profile"
                    className="block px-4 py-2 text-sm"
                    style={{ color: navStyles.textSecondary }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = navStyles.textPrimary
                      e.currentTarget.style.backgroundColor = navStyles.hoverBg
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = navStyles.textSecondary
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    Your Profile
                  </Link>
                  <Link 
                    href="/settings"
                    className="block px-4 py-2 text-sm"
                    style={{ color: navStyles.textSecondary }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = navStyles.textPrimary
                      e.currentTarget.style.backgroundColor = navStyles.hoverBg
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = navStyles.textSecondary
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    Settings
                  </Link>
                  
                  {/* Organization Access */}
                  {organizations.length > 0 && (
                    <>
                      <div 
                        className="my-1"
                        style={{ borderTop: `1px solid ${navStyles.borderColor}` }}
                      ></div>
                      <div className="px-4 py-2">
                        <div 
                          className="text-xs font-medium uppercase tracking-wider mb-2"
                          style={{ color: navStyles.textSecondary }}
                        >
                          Organizations
                        </div>
                        <div className="space-y-1">
                          {organizations.map((org) => (
                            <Link
                              key={org.id}
                              href={`/o/${org.slug}`}
                              className="flex items-center space-x-2 px-2 py-1 rounded text-sm"
                              style={{ color: navStyles.textSecondary }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.color = navStyles.textPrimary
                                e.currentTarget.style.backgroundColor = navStyles.hoverBg
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.color = navStyles.textSecondary
                                e.currentTarget.style.backgroundColor = 'transparent'
                              }}
                            >
                              <OrganizationLogo organizationSlug={org.slug} variant="horizontal" size="sm" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                  
                  <div 
                    className="my-1"
                    style={{ borderTop: `1px solid ${navStyles.borderColor}` }}
                  ></div>
                  <SignOutButton>
                    <button 
                      className="block w-full text-left px-4 py-2 text-sm"
                      style={{ color: '#ef4444' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = navStyles.hoverBg
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }}
                    >
                      Sign Out
                    </button>
                  </SignOutButton>
                                  </div>
                </div>
              </div>

            {/* Create button - Fourth */}
            {(userRole === 'org_admin' || userRole === 'super_admin' || userRole === 'moderator') && (
              <div className="relative group">
                <button 
                  className="flex items-center space-x-1 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  style={{ 
                    backgroundColor: themeColors.primary,
                    borderColor: themeColors.primary
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = themeColors.primaryLight
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = themeColors.primary
                  }}
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden lg:block">Create</span>
                  <ChevronDown className="hidden lg:block h-4 w-4" />
                </button>
                
                <div 
                  className="absolute right-0 mt-2 w-48 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
                  style={{
                    backgroundColor: navStyles.background.includes('gradient') ? (resolvedTheme === 'dark' ? '#2a2a2a' : '#ffffff') : navStyles.background,
                    borderColor: navStyles.borderColor,
                    border: '1px solid'
                  }}
                >
                  <div className="py-2">
                    <Link 
                      href="/announcements/create"
                      className="block px-4 py-2 text-sm"
                      style={{ color: navStyles.textSecondary }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = navStyles.textPrimary
                        e.currentTarget.style.backgroundColor = navStyles.hoverBg
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = navStyles.textSecondary
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }}
                    >
                      New Announcement
                    </Link>
                    <Link 
                      href="/artists/create"
                      className="block px-4 py-2 text-sm"
                      style={{ color: navStyles.textSecondary }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = navStyles.textPrimary
                        e.currentTarget.style.backgroundColor = navStyles.hoverBg
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = navStyles.textSecondary
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }}
                    >
                      New Artist Profile
                    </Link>
                    {(userRole === 'super_admin') && (
                      <Link 
                        href="/organizations/create"
                        className="block px-4 py-2 text-sm"
                        style={{ color: navStyles.textSecondary }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = navStyles.textPrimary
                          e.currentTarget.style.backgroundColor = navStyles.hoverBg
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = navStyles.textSecondary
                          e.currentTarget.style.backgroundColor = 'transparent'
                        }}
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
              {/* Show organization logo in mobile menu when on org pages or when organization prop is provided */}
              {((isOnOrgPage && orgSlug) || (organization && orgSlug)) && (
                <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700 mb-2">
                  <Link 
                    href={`/o/${orgSlug}`}
                    className="flex items-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <OrganizationLogo 
                      organizationSlug={orgSlug} 
                      variant="horizontal" 
                      size="md" 
                    />
                  </Link>
                </div>
              )}
              
              
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
