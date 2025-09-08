'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { Search, Filter, User, Mail, Calendar, Shield, Building2, Eye, Edit, Users, Copy, UserPlus } from 'lucide-react'
import Navigation from '@/components/ui/Navigation'
import ArtistIcon from '@/components/ui/ArtistIcon'
import Tooltip from '@/components/ui/Tooltip'
import EditUserModal from '@/components/ui/EditUserModal'
import Toast from '@/components/ui/Toast'
import UserBadges from '@/components/ui/UserBadges'
import UserAvatar from '@/components/ui/UserAvatar'
import Pagination from '@/components/ui/Pagination'
import OrganizationLogo from '@/components/ui/OrganizationLogo'

interface Organization {
  id: string
  name: string
  slug: string
  artist_icon?: string
  logo_url?: string
}

interface User {
  id: string
  clerk_user_id: string
  email: string
  role: string
  created_at: string
  organization: {
    id: string
    name: string
    slug: string
  }
}

interface MemberType {
  id: string
  type_key: string
  label: string
  description?: string
  is_staff: boolean
  default_role_on_claim: string
  sort_order: number
}

interface Artist {
  id: string
  name: string
  email: string
  phone: string
  studio_number: string
  studio_type: string
  is_claimed: boolean
  claimed_by_clerk_user_id: string | null
  member_type_id?: string
  member_type?: MemberType
  role?: string
  profile_image?: string
  organization: {
    id: string
    name: string
    slug: string
  }
  created_at: string
}

type FilterType = 'all' | 'artists' | 'staff' | 'resident' | 'moderator' | 'org_admin' | 'super_admin' | 'studio' | 'associate' | 'gallery'

export default function OrganizationUsersPage() {
  const { user, isLoaded } = useUser()
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [artists, setArtists] = useState<Artist[]>([])
  const [memberTypes, setMemberTypes] = useState<MemberType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<FilterType>('all')
  const [userRole, setUserRole] = useState('')
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(20) // Increased for better mobile experience
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; isVisible: boolean }>({
    message: '',
    type: 'success',
    isVisible: false
  })
  const [claiming, setClaiming] = useState<string | null>(null)

  // Get filter from URL params
  const urlFilter = searchParams.get('filter') || 'all'

  useEffect(() => {
    setFilterType(urlFilter as FilterType)
  }, [urlFilter])

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Update URL when filter changes
  const updateFilter = useCallback((newFilter: FilterType) => {
    setFilterType(newFilter)
    setCurrentPage(1) // Reset to first page when filter changes
    const params = new URLSearchParams(searchParams.toString())
    params.set('filter', newFilter)
    router.push(`?${params.toString()}`, { scroll: false })
  }, [searchParams, router])

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearchTerm])

  useEffect(() => {
    async function loadData() {
      if (!user || !params.slug) return
      
      try {
        const slug = params.slug as string

        // Get user profile and role
        const userResponse = await fetch('/api/users/me')
        if (userResponse.ok) {
          const userData = await userResponse.json()
          setUserRole(userData.role || 'resident')
        }

        // Get organization details
        const orgResponse = await fetch(`/api/organizations/by-slug/${slug}`)
        if (orgResponse.ok) {
          const orgData = await orgResponse.json()
          setOrganization(orgData.organization)
        }

        // Get users and artists for this organization
        const usersResponse = await fetch(`/api/organizations/by-slug/${slug}/users`)
        if (usersResponse.ok) {
          const usersData = await usersResponse.json()
          setUsers(usersData.memberships || [])
          setArtists(usersData.artist_profiles || [])
          setMemberTypes(usersData.member_types || [])
        }

      } catch (error) {
        console.error('Error loading organization data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (isLoaded && user) {
      loadData()
    }
  }, [user, isLoaded, params.slug])

  // Type guard to check if item is an artist
  const isArtist = (item: any): item is Artist => {
    return 'studio_number' in item && 'is_claimed' in item
  }

  const filteredData = useMemo(() => {
    let data: any[] = []
    
    if (filterType === 'artists') {
      data = artists
    } else if (filterType === 'staff') {
      data = users.filter(u => ['super_admin', 'org_admin', 'moderator', 'staff'].includes(u.role))
    } else if (filterType === 'studio' || filterType === 'associate' || filterType === 'gallery') {
      data = artists.filter(a => a.studio_type?.toLowerCase() === filterType)
    } else if (filterType === 'all') {
      data = [...users, ...artists]
    } else {
      data = users.filter(u => u.role === filterType)
    }

    // Apply search filter
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase()
      data = data.filter(item => {
        if (isArtist(item)) {
          return item.name?.toLowerCase().includes(searchLower) ||
                 item.email?.toLowerCase().includes(searchLower) ||
                 item.studio_number?.toLowerCase().includes(searchLower)
        } else {
          return item.email?.toLowerCase().includes(searchLower) ||
                 item.role?.toLowerCase().includes(searchLower)
        }
      })
    }

    return data
  }, [users, artists, filterType, debouncedSearchTerm])
  
  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedData = filteredData.slice(startIndex, endIndex)
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top of the list
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'org_admin':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'moderator':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'resident':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getEmptyStateText = (filterType: FilterType) => {
    switch (filterType) {
      case 'artists':
        return 'artists'
      case 'staff':
        return 'staff members'
      default:
        return 'community members'
    }
  }

  const handleEditUser = (user: any) => {
    setEditingUser(user)
    setEditModalOpen(true)
  }

  const handleClaimArtist = async (artistId: string, artistName: string) => {
    if (!user) return;

    setClaiming(artistId);
    setToast({ message: '', type: 'success', isVisible: false });

    try {
      const response = await fetch('/api/artists/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          artist_id: artistId,
          claim_reason: `I am ${artistName} and would like to claim my artist profile.`,
          supporting_evidence: `My email address (${user.emailAddresses[0]?.emailAddress}) and name (${user.firstName} ${user.lastName}) match this artist profile.`
        }),
      });

      if (response.ok) {
        setToast({ message: `Successfully submitted claim for ${artistName}. An administrator will review your request.`, type: 'success', isVisible: true });
        // Refresh the data to update the claim status
        setTimeout(() => window.location.reload(), 2000);
      } else {
        const error = await response.json();
        setToast({ message: error.error || 'Failed to submit claim request', type: 'error', isVisible: true });
      }
    } catch (error) {
      console.error('Error claiming artist:', error);
      setToast({ message: 'Failed to submit claim request. Please try again.', type: 'error', isVisible: true });
    } finally {
      setClaiming(null);
    }
  };

  // Edit permissions are now handled directly in the JSX for more granular control

  const handleSaveUser = async (formData: any) => {
    if (!editingUser) return

    try {
      const isArtistUser = isArtist(editingUser)
      
      if (isArtistUser) {
        // Update artist profile
        const response = await fetch(`/api/artist-profiles/${editingUser.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })

        if (!response.ok) {
          throw new Error('Failed to update artist profile')
        }

        // Update local state
        setArtists(prev => prev.map(artist => 
          artist.id === editingUser.id 
            ? { ...artist, ...formData }
            : artist
        ))
      } else {
        // Update user membership
        const response = await fetch(`/api/users/${editingUser.clerk_user_id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })

        if (!response.ok) {
          throw new Error('Failed to update user')
        }

        // Update local state
        setUsers(prev => prev.map(user => 
          user.clerk_user_id === editingUser.clerk_user_id 
            ? { ...user, ...formData }
            : user
        ))
      }

      setToast({
        message: `${isArtistUser ? 'Artist' : 'User'} updated successfully!`,
        type: 'success',
        isVisible: true
      })
    } catch (error: any) {
      setToast({
        message: error.message || 'Failed to update user',
        type: 'error',
        isVisible: true
      })
      throw error
    }
  }

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!organization) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <Building2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Organization Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              The organization you're looking for doesn't exist or you don't have access to it.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Mobile Header */}
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <a
              href={`/o/${organization.slug}`}
              className="flex items-center px-3 py-2 text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Back</span>
            </a>
            <div className="flex items-center">
              {organization.logo_url ? (
                <img
                  src={organization.logo_url}
                  alt={`${organization.name} logo`}
                  className="h-8 w-8 rounded-lg object-cover mr-3"
                />
              ) : (
                <ArtistIcon organization={organization} className="h-8 w-8 text-purple-600 dark:text-purple-400 mr-3" />
              )}
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">{organization.name}</h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">Members</p>
              </div>
            </div>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:flex items-center justify-between mb-6 xl:mb-8 2xl:mb-10 3xl:mb-12">
            <div className="flex items-center">
              <div className="mr-4 xl:mr-6 2xl:mr-8 3xl:mr-10">
                <OrganizationLogo 
                  organization={organization}
                  size="lg"
                  className="h-12 w-12 xl:h-16 xl:w-16 2xl:h-20 2xl:w-20 3xl:h-24 3xl:w-24"
                />
              </div>
              <div>
                <h1 className="text-3xl xl:text-4xl 2xl:text-5xl 3xl:text-6xl font-bold text-gray-900 dark:text-white mb-2 xl:mb-3 2xl:mb-4 3xl:mb-5">
                  Bakehouse Art Complex - Members
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-base xl:text-lg 2xl:text-xl 3xl:text-2xl">
                  Meet our community of artists and members
                </p>
              </div>
            </div>
            <a
              href={`/o/${organization.slug}`}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 text-sm xl:text-base 2xl:text-lg 3xl:text-xl font-medium"
            >
              ← Back to Organization
            </a>
          </div>

          {/* Search and Filter - Always visible */}
          <div className="flex flex-col gap-4 xl:gap-6 2xl:gap-8 3xl:gap-10 mb-6 xl:mb-8 2xl:mb-10 3xl:mb-12">
            <div className="relative">
              <Search className="absolute left-3 xl:left-4 2xl:left-5 3xl:left-6 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 xl:h-6 xl:w-6 2xl:h-7 2xl:w-7 3xl:h-8 3xl:w-8 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${filterType === 'artists' ? 'artists' : filterType === 'studio' ? 'studio artists' : filterType === 'associate' ? 'associate artists' : filterType === 'gallery' ? 'gallery artists' : 'community members'}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 sm:pl-12 xl:pl-14 2xl:pl-16 3xl:pl-18 pr-4 xl:pr-6 2xl:pr-8 3xl:pr-10 py-3 sm:py-2.5 xl:py-4 2xl:py-5 3xl:py-6 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base xl:text-lg 2xl:text-xl 3xl:text-2xl"
              />
            </div>
            
            <div className="flex flex-wrap gap-2 sm:gap-3 xl:gap-4 2xl:gap-5 3xl:gap-6">
              {[
                { value: 'all', label: 'All Members', count: users.length + artists.length },
                { value: 'artists', label: 'All Artists', count: artists.length },
                { value: 'studio', label: 'Studio', count: artists.filter(a => a.studio_type?.toLowerCase() === 'studio').length },
                { value: 'associate', label: 'Associate', count: artists.filter(a => a.studio_type?.toLowerCase() === 'associate').length },
                { value: 'gallery', label: 'Gallery', count: artists.filter(a => a.studio_type?.toLowerCase() === 'gallery').length },
                { value: 'resident', label: 'Residents', count: users.filter(u => u.role === 'resident').length },
                { value: 'moderator', label: 'Moderators', count: users.filter(u => u.role === 'moderator').length },
                { value: 'org_admin', label: 'Admins', count: users.filter(u => u.role === 'org_admin').length }
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => updateFilter(filter.value as FilterType)}
                  className={`inline-flex items-center px-3 xl:px-4 2xl:px-5 3xl:px-6 py-2 xl:py-3 2xl:py-4 3xl:py-5 text-xs sm:text-sm xl:text-base 2xl:text-lg 3xl:text-xl font-medium rounded-full border transition-colors ${
                    filterType === filter.value
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {filter.label}
                  <span className={`ml-1.5 xl:ml-2 2xl:ml-2.5 3xl:ml-3 px-1.5 xl:px-2 2xl:px-2.5 3xl:px-3 py-0.5 xl:py-1 2xl:py-1.5 3xl:py-2 text-xs xl:text-sm 2xl:text-base 3xl:text-lg rounded-full ${
                    filterType === filter.value
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}>
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Stats - Responsive grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 xl:gap-6 2xl:gap-8 3xl:gap-10">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4 xl:p-6 2xl:p-8 3xl:p-10">
              <div className="flex items-center">
                <Users className="h-5 w-5 xl:h-6 xl:w-6 2xl:h-7 2xl:w-7 3xl:h-8 3xl:w-8 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <div className="ml-2 xl:ml-3 2xl:ml-4 3xl:ml-5 min-w-0">
                    <p className="text-xs sm:text-sm xl:text-base 2xl:text-lg 3xl:text-xl font-medium text-gray-600 dark:text-gray-400 truncate">Community Members</p>
                  <p className="text-lg sm:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl font-bold text-gray-900 dark:text-white">{users.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4 xl:p-6 2xl:p-8 3xl:p-10">
              <div className="flex items-center">
                <ArtistIcon organization={organization} className="h-5 w-5 xl:h-6 xl:w-6 2xl:h-7 2xl:w-7 3xl:h-8 3xl:w-8 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                <div className="ml-2 xl:ml-3 2xl:ml-4 3xl:ml-5 min-w-0">
                  <p className="text-xs sm:text-sm xl:text-base 2xl:text-lg 3xl:text-xl font-medium text-gray-600 dark:text-gray-400 truncate">Total Artists</p>
                  <p className="text-lg sm:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl font-bold text-gray-900 dark:text-white">{artists.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4 xl:p-6 2xl:p-8 3xl:p-10">
              <div className="flex items-center">
                <Shield className="h-5 w-5 xl:h-6 xl:w-6 2xl:h-7 2xl:w-7 3xl:h-8 3xl:w-8 text-green-600 dark:text-green-400 flex-shrink-0" />
                <div className="ml-2 xl:ml-3 2xl:ml-4 3xl:ml-5 min-w-0">
                  <p className="text-xs sm:text-sm xl:text-base 2xl:text-lg 3xl:text-xl font-medium text-gray-600 dark:text-gray-400 truncate">Claimed Artists</p>
                  <p className="text-lg sm:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl font-bold text-gray-900 dark:text-white">
                    {artists.filter(a => a.is_claimed).length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4 xl:p-6 2xl:p-8 3xl:p-10">
              <div className="flex items-center">
                <User className="h-5 w-5 xl:h-6 xl:w-6 2xl:h-7 2xl:w-7 3xl:h-8 3xl:w-8 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                <div className="ml-2 xl:ml-3 2xl:ml-4 3xl:ml-5 min-w-0">
                  <p className="text-xs sm:text-sm xl:text-base 2xl:text-lg 3xl:text-xl font-medium text-gray-600 dark:text-gray-400 truncate">Available to Claim</p>
                  <p className="text-lg sm:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl font-bold text-gray-900 dark:text-white">
                    {artists.filter(a => !a.is_claimed).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Sticky Pagination Header */}
        {totalPages > 1 && (
          <div className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 mb-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredData.length)} of {filteredData.length} {filterType === 'artists' ? 'artists' : 'community members'}
              </div>
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        )}

        {/* Members Grid */}
        {filteredData.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
              <Users className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3">
              No {filterType === 'artists' ? 'artists' : 'community members'} found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
              {searchTerm || filterType !== 'all' 
                ? 'Try adjusting your search or filter criteria to find what you\'re looking for.'
                : `No ${getEmptyStateText(filterType)} have been added to this organization yet.`
              }
            </p>
            {(searchTerm || filterType !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('')
                  updateFilter('all')
                }}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-4 sm:gap-6 xl:gap-8 2xl:gap-10 3xl:gap-12">
            {paginatedData.map((item) => (
              <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-5 xl:p-6 2xl:p-8 3xl:p-10 hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
                <div className="flex items-start gap-4 xl:gap-6 2xl:gap-8 3xl:gap-10">
                  {/* Column 1: Large Avatar */}
                  <div className="flex-shrink-0">
                    <UserAvatar
                      name={isArtist(item) ? item.name : item.email}
                      email={item.email}
                      imageUrl={item.profile_image}
                      size="lg"
                      className="w-16 h-16 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 3xl:w-28 3xl:h-28"
                    />
                  </div>
                  
                  {/* Column 2: Information */}
                  <div className="flex-1 min-w-0">
                    {/* Row 1: Name */}
                    <h3 className="text-sm sm:text-base xl:text-lg 2xl:text-xl 3xl:text-2xl font-semibold text-gray-900 dark:text-white mb-2 xl:mb-3 2xl:mb-4 3xl:mb-5 truncate" title={isArtist(item) ? item.name : item.email}>
                      {isArtist(item) ? item.name : item.email}
                    </h3>
                    
                    {/* Row 2: Type & Added Date */}
                    <div className="mb-3 xl:mb-4 2xl:mb-5 3xl:mb-6">
                      <div className="text-xs xl:text-sm 2xl:text-base 3xl:text-lg text-gray-500 dark:text-gray-400 mb-1">
                        {isArtist(item) ? (
                          <span>{item.studio_type || 'Artist'}</span>
                        ) : (
                          <span>{item.role.replace('_', ' ')}</span>
                        )}
                      </div>
                      {(userRole === 'org_admin' || userRole === 'super_admin') && (
                        <div className="text-xs xl:text-sm 2xl:text-base 3xl:text-lg text-gray-400 dark:text-gray-500">
                          Added: {new Date(item.created_at).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    
                    {/* Row 3: Actions */}
                    <div className="flex items-center space-x-2 xl:space-x-3 2xl:space-x-4 3xl:space-x-5">
                      <a
                        href={`/o/${organization.slug}/users/${item.id}`}
                        className="inline-flex items-center px-3 xl:px-4 2xl:px-5 3xl:px-6 py-1.5 xl:py-2 2xl:py-2.5 3xl:py-3 text-xs xl:text-sm 2xl:text-base 3xl:text-lg font-medium text-blue-600 hover:text-blue-500 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 rounded-md transition-colors"
                      >
                        View
                      </a>
                      
                      {/* Edit button - Admin and Super Admin only */}
                      {(userRole === 'org_admin' || userRole === 'super_admin') && (
                        <button 
                          onClick={() => handleEditUser(item)}
                          className="inline-flex items-center justify-center p-1.5 xl:p-2 2xl:p-2.5 3xl:p-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                          title="Edit user"
                        >
                          <Edit className="h-3 w-3 xl:h-4 xl:w-4 2xl:h-5 2xl:w-5 3xl:h-6 3xl:w-6" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center">
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <EditUserModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveUser}
        user={editingUser}
        isArtist={editingUser ? isArtist(editingUser) : false}
        userRole={userRole}
        memberTypes={memberTypes}
      />

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  )
}
