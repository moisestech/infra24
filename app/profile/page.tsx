'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { User, Mail, Shield, Building2, Edit, Save, X, Calendar } from 'lucide-react'
import { UnifiedNavigation, ooliteConfig, bakehouseConfig } from '@/components/navigation'
import AvatarUpload from '@/components/ui/AvatarUpload'

interface UserProfile {
  id: string
  clerk_user_id: string
  role: string
  organization_id: string | null
  joined_at: string
  profile_image?: string
  organization?: {
    id: string
    name: string
    slug: string
  }
}

export default function ProfilePage() {
  const { user, isLoaded } = useUser()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    organization: ''
  })

  useEffect(() => {
    async function loadProfile() {
      if (!user) return

      try {
        const response = await fetch('/api/users/me')
        if (response.ok) {
          const userData = await response.json()
          setProfile(userData.user)
          
          // Set form data
          setFormData({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.emailAddresses[0]?.emailAddress || '',
            role: userData.role || '',
            organization: userData.organization?.name || ''
          })
        }
      } catch (error) {
        console.error('Error loading profile:', error)
      } finally {
        setLoading(false)
      }
    }

    if (isLoaded && user) {
      loadProfile()
    }
  }, [user, isLoaded])

  const handleAvatarUpload = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/users/avatar', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        // Reload profile data to get updated avatar URL
        const profileResponse = await fetch('/api/users/me')
        if (profileResponse.ok) {
          const userData = await profileResponse.json()
          setProfile(userData.user)
        }
      } else {
        throw new Error('Upload failed')
      }
    } catch (error) {
      console.error('Error uploading avatar:', error)
      throw error
    }
  }

  const handleAvatarRemove = async () => {
    try {
      const response = await fetch('/api/users/avatar', {
        method: 'DELETE'
      })

      if (response.ok) {
        // Reload profile data to get updated avatar URL
        const profileResponse = await fetch('/api/users/me')
        if (profileResponse.ok) {
          const userData = await profileResponse.json()
          setProfile(userData.user)
        }
      } else {
        throw new Error('Remove failed')
      }
    } catch (error) {
      console.error('Error removing avatar:', error)
      throw error
    }
  }

  const handleSave = async () => {
    try {
      // Update Clerk user data
      await user?.update({
        firstName: formData.firstName,
        lastName: formData.lastName
      })

      setEditing(false)
      // Reload profile data
      const response = await fetch('/api/users/me')
      if (response.ok) {
        const userData = await response.json()
        setProfile(userData.user)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const getRoleDisplayName = (role: string) => {
    const roleNames: { [key: string]: string } = {
      'super_admin': 'Super Administrator',
      'org_admin': 'Organization Administrator',
      'moderator': 'Moderator',
      'resident': 'Resident',
      'artist': 'Artist'
    }
    return roleNames[role] || role
  }

  const getRoleColor = (role: string) => {
    const colors: { [key: string]: string } = {
      'super_admin': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'org_admin': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'moderator': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'resident': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'artist': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    }
    return colors[role] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <UnifiedNavigation config={getNavigationConfig()} userRole="admin" />
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <UnifiedNavigation config={getNavigationConfig()} userRole="admin" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Profile Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Please sign in to view your profile.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <UnifiedNavigation config={getNavigationConfig()} userRole="admin" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Your Profile
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your account information and preferences
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {editing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
                  >
                    <X className="h-4 w-4" />
                    <span>Cancel</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center space-x-4 mb-6">
                <AvatarUpload
                  currentImageUrl={profile?.profile_image}
                  name={user.fullName || undefined}
                  email={user.emailAddresses[0]?.emailAddress}
                  onUpload={handleAvatarUpload}
                  onRemove={handleAvatarRemove}
                  size="lg"
                />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {user.fullName || 'User'}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {user.emailAddresses[0]?.emailAddress}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Name
                  </label>
                  {editing ? (
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        placeholder="First Name"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        placeholder="Last Name"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  ) : (
                    <p className="text-gray-900 dark:text-white">
                      {user.fullName || 'Not set'}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <p className="text-gray-900 dark:text-white flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-gray-500" />
                    {user.emailAddresses[0]?.emailAddress}
                  </p>
                </div>

                {/* Role */}
                {profile && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Role
                    </label>
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 mr-2 text-gray-500" />
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(profile.role)}`}>
                        {getRoleDisplayName(profile.role)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Organization */}
                {profile?.organization && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Organization
                    </label>
                    <p className="text-gray-900 dark:text-white flex items-center">
                      <Building2 className="h-4 w-4 mr-2 text-gray-500" />
                      {profile.organization.name}
                    </p>
                  </div>
                )}

                {/* Member Since */}
                {profile && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Member Since
                    </label>
                    <p className="text-gray-900 dark:text-white flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      {new Date(profile.joined_at).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <a
                  href="/dashboard"
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                >
                  Dashboard
                </a>
                <a
                  href="/settings"
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                >
                  Settings
                </a>
                {profile?.organization && (
                  <a
                    href={`/o/${profile.organization.slug}`}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                  >
                    Organization
                  </a>
                )}
              </div>
            </div>

            {/* Account Status */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Account Status
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Email Verified</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Yes
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
