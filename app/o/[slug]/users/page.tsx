'use client'

import { useState, useEffect } from 'react'
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
  const [filterType, setFilterType] = useState<FilterType>('all')
  const [userRole, setUserRole] = useState('')
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(12)
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

  // Update URL when filter changes
  const updateFilter = (newFilter: FilterType) => {
    setFilterType(newFilter)
    const params = new URLSearchParams(searchParams.toString())
    params.set('filter', newFilter)
    router.push(`?${params.toString()}`, { scroll: false })
  }

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

  const getFilteredData = () => {
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
    return data.filter(item => {
      const searchLower = searchTerm.toLowerCase()
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

  const filteredData = getFilteredData()
  
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
        return 'members'
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
          <div className="flex items-center justify-between mb-4 lg:hidden">
            <a
              href={`/o/${organization.slug}`}
              className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
            >
              <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </a>
            <div className="flex items-center">
              {organization.logo_url ? (
                <img
                  src={organization.logo_url}
                  alt={`${organization.name} logo`}
                  className="h-6 w-6 rounded object-cover mr-2"
                />
              ) : (
                <ArtistIcon organization={organization} className="h-6 w-6 text-purple-600 dark:text-purple-400 mr-2" />
              )}
              <span className="font-semibold text-gray-900 dark:text-white">{organization.name}</span>
            </div>
            <div className="w-8"></div> {/* Spacer for centering */}
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="mr-4">
                {organization.logo_url ? (
                  <img
                    src={organization.logo_url}
                    alt={`${organization.name} logo`}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                    {organization.name.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {organization.name} - Members
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage and view organization members and artists
                </p>
              </div>
            </div>
            <a
              href={`/o/${organization.slug}`}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 text-sm font-medium"
            >
              ← Back to Organization
            </a>
          </div>

          {/* Search and Filter - Always visible */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${filterType === 'artists' ? 'artists' : filterType === 'studio' ? 'studio artists' : filterType === 'associate' ? 'associate artists' : filterType === 'gallery' ? 'gallery artists' : 'members'}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={filterType}
              onChange={(e) => updateFilter(e.target.value as FilterType)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Members</option>
              <option value="artists">All Artists</option>
              <option value="studio">Studio Artists</option>
              <option value="associate">Associate Artists</option>
              <option value="gallery">Gallery</option>
              <option value="resident">Residents</option>
              <option value="moderator">Moderators</option>
              <option value="org_admin">Admins</option>
              <option value="super_admin">Super Admins</option>
            </select>
          </div>

          {/* Stats - Horizontal scroll on mobile */}
          <div className="overflow-x-auto pb-2">
            <div className="flex gap-3 min-w-max">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 min-w-[140px]">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <div className="ml-2 min-w-0">
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 truncate">Total Members</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{users.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 min-w-[140px]">
                <div className="flex items-center">
                  <ArtistIcon organization={organization} className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                  <div className="ml-2 min-w-0">
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 truncate">Total Artists</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{artists.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 min-w-[140px]">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <div className="ml-2 min-w-0">
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 truncate">Claimed Artists</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {artists.filter(a => a.is_claimed).length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 min-w-[140px]">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                  <div className="ml-2 min-w-0">
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 truncate">Available to Claim</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {artists.filter(a => !a.is_claimed).length}
                    </p>
                  </div>
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
                Showing {startIndex + 1}-{Math.min(endIndex, filteredData.length)} of {filteredData.length} {filterType === 'artists' ? 'artists' : 'members'}
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
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No {filterType === 'artists' ? 'artists' : 'members'} found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || filterType !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : `No ${getEmptyStateText(filterType)} have been added yet.`
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {paginatedData.map((item) => (
              <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  {/* User Avatar */}
                  <UserAvatar
                    name={isArtist(item) ? item.name : item.email}
                    email={item.email}
                    imageUrl={item.profile_image}
                    size="sm"
                    className="flex-shrink-0"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {isArtist(item) ? item.name : item.email}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          {isArtist(item) && item.studio_number && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Studio {item.studio_number}
                            </span>
                          )}
                          {isArtist(item) && item.member_type && (
                            <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-1.5 py-0.5 rounded">
                              {item.member_type.label}
                            </span>
                          )}
                          {!isArtist(item) && item.role && item.role !== 'resident' && (
                            <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-1.5 py-0.5 rounded">
                              {item.role.replace('_', ' ')}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 ml-2">
                        {isArtist(item) ? (
                          item.is_claimed ? (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              Claimed
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                              Unclaimed
                            </span>
                          )
                        ) : (
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(item.role)}`}>
                            {item.role.replace('_', ' ')}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* User Badges */}
                    <UserBadges 
                      memberType={isArtist(item) ? item.member_type : null}
                      role={item.role}
                      className="mb-2"
                    />
                  </div>
                </div>

                {/* Footer: Date and Actions */}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                  {/* Admin Only: Added Date */}
                  {(userRole === 'super_admin' || userRole === 'org_admin' || userRole === 'moderator') && (
                    <div className="flex items-center text-xs text-purple-600 dark:text-purple-400">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span className="font-medium">Added: {new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                  )}
                  
                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <a
                      href={`/o/${organization.slug}/users/${item.id}`}
                      className="text-blue-600 hover:text-blue-500 text-xs font-medium"
                    >
                      View
                    </a>
                    
                    {/* Claim button for unclaimed artists */}
                    {isArtist(item) && !item.is_claimed && user && (
                      <button
                        onClick={() => handleClaimArtist(item.id, item.name)}
                        disabled={claiming === item.id}
                        className="inline-flex items-center px-2 py-1 text-xs font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400 rounded-md transition-colors"
                      >
                        {claiming === item.id ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                            Claiming...
                          </>
                        ) : (
                          <>
                            <UserPlus className="h-3 w-3 mr-1" />
                            Claim
                          </>
                        )}
                      </button>
                    )}
                    
                    {((userRole === 'super_admin' || userRole === 'org_admin') || 
                      (isArtist(item) && item.claimed_by_clerk_user_id === user?.id) ||
                      (!isArtist(item) && item.clerk_user_id === user?.id)) && (
                      <button 
                        onClick={() => handleEditUser(item)}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <Edit className="h-3 w-3" />
                      </button>
                    )}
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
