'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useParams, useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Mail, 
  Calendar, 
  Shield, 
  Building2, 
  Edit, 
  Save, 
  X,
  User,
  Users,
  Palette,
  Phone,
  Globe,
  Instagram,
  MapPin,
  FileText,
  Clock,
  Tag
} from 'lucide-react'
import Navigation from '@/components/ui/Navigation'
import ArtistIcon from '@/components/ui/ArtistIcon'

interface Organization {
  id: string
  name: string
  slug: string
  artist_icon?: string
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

interface Artist {
  id: string
  name: string
  email: string
  phone: string
  studio_number: string
  studio_type: string
  studio_location: string
  bio: string
  website_url: string
  instagram_handle: string
  is_claimed: boolean
  claimed_by_clerk_user_id: string | null
  organization: {
    id: string
    name: string
    slug: string
  }
  created_at: string
}

interface Announcement {
  id: string
  title: string
  body: string
  status: string
  priority: string
  tags: string[]
  created_at: string
  published_at: string | null
  expires_at: string | null
}

export default function UserProfilePage() {
  const { user, isLoaded } = useUser()
  const params = useParams()
  const router = useRouter()
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [userData, setUserData] = useState<User | Artist | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [userRole, setUserRole] = useState('')
  const [isArtist, setIsArtist] = useState(false)
  const [editForm, setEditForm] = useState<any>({})
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true)

  const { slug, userId } = params

  useEffect(() => {
    async function loadData() {
      if (!user || !slug || !userId) return
      
      try {
        const orgSlug = slug as string
        const targetUserId = userId as string

        // Get user profile and role
        const userResponse = await fetch('/api/users/me')
        if (userResponse.ok) {
          const userData = await userResponse.json()
          setUserRole(userData.role || 'resident')
        }

        // Get organization details
        const orgResponse = await fetch(`/api/organizations/by-slug/${orgSlug}`)
        if (orgResponse.ok) {
          const orgData = await orgResponse.json()
          setOrganization(orgData.organization)
        }

        // Try to get user data - could be either a membership or artist profile
        const usersResponse = await fetch(`/api/organizations/by-slug/${orgSlug}/users`)
        if (usersResponse.ok) {
          const usersData = await usersResponse.json()
          
          // Check if it's a membership
          const membership = usersData.memberships?.find((u: User) => u.clerk_user_id === targetUserId)
          if (membership) {
            setUserData(membership)
            setIsArtist(false)
            setEditForm({
              role: membership.role
            })
            
            // Load announcements for this user
            await loadUserAnnouncements(membership.clerk_user_id)
            return
          }

          // Check if it's an artist profile
          const artist = usersData.artist_profiles?.find((a: Artist) => a.id === targetUserId)
          if (artist) {
            setUserData(artist)
            setIsArtist(true)
            setEditForm({
              studio_type: artist.studio_type,
              is_claimed: artist.is_claimed
            })
            
            // Load announcements for this artist (if claimed)
            if (artist.claimed_by_clerk_user_id) {
              await loadUserAnnouncements(artist.claimed_by_clerk_user_id)
            } else {
              setLoadingAnnouncements(false)
            }
            return
          }
        }

      } catch (error) {
        console.error('Error loading user data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (isLoaded && user) {
      loadData()
    }
  }, [user, isLoaded, slug, userId])

  const loadUserAnnouncements = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}/announcements`)
      if (response.ok) {
        const data = await response.json()
        setAnnouncements(data.announcements || [])
      }
    } catch (error) {
      console.error('Error loading user announcements:', error)
    } finally {
      setLoadingAnnouncements(false)
    }
  }

  const handleSave = async () => {
    if (!userData || !organization) return

    try {
      if (isArtist) {
        // Update artist profile
        const response = await fetch(`/api/artist-profiles/${userData.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editForm),
        })

        if (response.ok) {
          const updatedArtist = await response.json()
          setUserData(updatedArtist.artist)
          setIsEditing(false)
        }
      } else {
        // Update user membership
        if ('clerk_user_id' in userData) {
          const response = await fetch(`/api/users/${userData.clerk_user_id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(editForm),
          })

          if (response.ok) {
            const updatedUser = await response.json()
            setUserData(updatedUser.user)
            setIsEditing(false)
          }
        }
      }
    } catch (error) {
      console.error('Error updating user:', error)
    }
  }

  const canEdit = userRole === 'super_admin' || userRole === 'org_admin'

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!userData || !organization) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              User Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              The user you're looking for doesn't exist or you don't have access to view them.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 mr-4"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                Back
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {isArtist && 'name' in userData ? userData.name : userData.email}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {isArtist ? 'Artist Profile' : 'Member Profile'} • {organization.name}
                </p>
              </div>
            </div>
            {canEdit && (
              <div className="flex items-center space-x-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Profile Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          {isArtist ? (
            // Artist Profile
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <ArtistIcon organization={organization} className="h-8 w-8 text-purple-600 dark:text-purple-400 mr-3" />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {'name' in userData ? userData.name : userData.email}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      {'studio_type' in userData ? userData.studio_type : ''} Artist
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {'is_claimed' in userData ? (
                    userData.is_claimed ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Claimed
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                        Unclaimed
                      </span>
                    )
                  ) : null}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                      <p className="text-gray-900 dark:text-white">{userData.email || 'Not provided'}</p>
                    </div>
                  </div>

                  {'phone' in userData && userData.phone && (
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</p>
                        <p className="text-gray-900 dark:text-white">{userData.phone}</p>
                      </div>
                    </div>
                  )}

                  {'studio_number' in userData && userData.studio_number && (
                    <div className="flex items-center">
                      <Building2 className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Studio</p>
                        <p className="text-gray-900 dark:text-white">
                          {userData.studio_number} {'studio_location' in userData && userData.studio_location && `(${userData.studio_location})`}
                        </p>
                      </div>
                    </div>
                  )}

                  {'website_url' in userData && userData.website_url && (
                    <div className="flex items-center">
                      <Globe className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Website</p>
                        <a 
                          href={userData.website_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {userData.website_url}
                        </a>
                      </div>
                    </div>
                  )}

                  {'instagram_handle' in userData && userData.instagram_handle && (
                    <div className="flex items-center">
                      <Instagram className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Instagram</p>
                        <a 
                          href={`https://instagram.com/${userData.instagram_handle}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          @{userData.instagram_handle}
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {isEditing && canEdit ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Artist Type
                        </label>
                        <select
                          value={editForm.studio_type || ('studio_type' in userData ? userData.studio_type : '')}
                          onChange={(e) => setEditForm({ ...editForm, studio_type: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="Studio">Studio Artist</option>
                          <option value="Associate">Associate Artist</option>
                          <option value="Gallery">Gallery</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Claim Status
                        </label>
                        <select
                          value={editForm.is_claimed?.toString() || ('is_claimed' in userData ? userData.is_claimed.toString() : 'false')}
                          onChange={(e) => setEditForm({ ...editForm, is_claimed: e.target.value === 'true' })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="false">Unclaimed</option>
                          <option value="true">Claimed</option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Member Since</p>
                          <p className="text-gray-900 dark:text-white">
                            {new Date(userData.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {'bio' in userData && userData.bio && (
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Bio</p>
                          <p className="text-gray-900 dark:text-white">{userData.bio}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            // User Membership
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {userData.email}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Organization Member
                    </p>
                  </div>
                </div>
                {'role' in userData && (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    userData.role === 'super_admin' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                    userData.role === 'org_admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                    userData.role === 'moderator' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}>
                    {userData.role.replace('_', ' ')}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                      <p className="text-gray-900 dark:text-white">{userData.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Building2 className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Organization</p>
                      <p className="text-gray-900 dark:text-white">{userData.organization.name}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {isEditing && canEdit ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Role
                      </label>
                      <select
                        value={editForm.role || ('role' in userData ? userData.role : '')}
                        onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="resident">Resident</option>
                        <option value="moderator">Moderator</option>
                        <option value="org_admin">Organization Admin</option>
                        <option value="super_admin">Super Admin</option>
                      </select>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Member Since</p>
                        <p className="text-gray-900 dark:text-white">
                          {new Date(userData.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Announcements Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Announcements
            </h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <FileText className="h-4 w-4 mr-2" />
                {announcements.length} announcement{announcements.length !== 1 ? 's' : ''}
              </div>
              {announcements.length > 0 && (
                <a
                  href={`/o/${organization.slug}/announcements?author=${isArtist ? ('claimed_by_clerk_user_id' in userData ? userData.claimed_by_clerk_user_id : '') : ('clerk_user_id' in userData ? userData.clerk_user_id : '')}`}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 text-sm font-medium"
                >
                  View All →
                </a>
              )}
            </div>
          </div>

          {loadingAnnouncements ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            </div>
          ) : announcements.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {isArtist && 'claimed_by_clerk_user_id' in userData && !userData.claimed_by_clerk_user_id ? 'Profile Not Claimed' : 'No Announcements Yet'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {isArtist && 'claimed_by_clerk_user_id' in userData && !userData.claimed_by_clerk_user_id 
                  ? `${'name' in userData ? userData.name : 'Unknown'} hasn't claimed their profile yet, so they can't create announcements.`
                  : `${isArtist && 'name' in userData ? userData.name : 'Unknown'} hasn't created any announcements yet.`
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {announcement.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {new Date(announcement.created_at).toLocaleDateString()}
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          announcement.status === 'published' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          announcement.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                        }`}>
                          {announcement.status}
                        </span>
                        {announcement.priority && (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            announcement.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                            announcement.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                            'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          }`}>
                            {announcement.priority}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <p className="text-gray-600 dark:text-gray-400 line-clamp-3">
                      {announcement.body}
                    </p>
                  </div>

                  {announcement.tags && announcement.tags.length > 0 && (
                    <div className="mt-4 flex items-center">
                      <Tag className="h-4 w-4 text-gray-400 mr-2" />
                      <div className="flex flex-wrap gap-2">
                        {announcement.tags.map((tag, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
