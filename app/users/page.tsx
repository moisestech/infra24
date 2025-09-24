'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Users, 
  Search, 
  User, 
  Shield,
  Building2,
  Eye,
  Edit,
  MoreHorizontal
} from 'lucide-react'
import { UnifiedNavigation, ooliteConfig, bakehouseConfig } from '@/components/navigation'
import { Badge } from '@/components/ui/Badge'

interface User {
  id: string
  clerk_user_id: string
  email: string
  first_name?: string
  last_name?: string
  image_url?: string
  role: string
  organization_id: string
  created_at: string
  updated_at: string
  subscription_plan: string
  subscription_status: string
}

interface Organization {
  id: string
  name: string
  slug: string
  description?: string
  logo_url?: string
}

export default function UsersPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [orgFilter, setOrgFilter] = useState('')

  useEffect(() => {
    async function loadData() {
      if (!user) return

      try {
        // Load user profile to check role
        const userResponse = await fetch('/api/users/me')
        if (userResponse.ok) {
          const userData = await userResponse.json()
          
          // If user is not super admin, redirect to their organization's users page
          if (userData.user.role !== 'super_admin') {
            if (userData.organization) {
              router.push(`/organizations/${userData.organization.slug}/users`)
              return
            } else {
              router.push('/dashboard')
              return
            }
          }
        }

        // Load all organizations for super admin
        const orgsResponse = await fetch('/api/organizations')
        if (orgsResponse.ok) {
          const orgsData = await orgsResponse.json()
          setOrganizations(orgsData.organizations || [])
        }

        // Load all users for super admin
        const usersResponse = await fetch('/api/users')
        if (usersResponse.ok) {
          const usersData = await usersResponse.json()
          setUsers(usersData.users || [])
        }
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (isLoaded && user) {
      loadData()
    }
  }, [user, isLoaded, router])

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = !roleFilter || user.role === roleFilter
    const matchesOrg = !orgFilter || user.organization_id === orgFilter

    return matchesSearch && matchesRole && matchesOrg
  })

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'error'
      case 'org_admin': return 'warning'
      case 'moderator': return 'info'
      case 'resident': return 'success'
      default: return 'default'
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'success'
      case 'cancelled': return 'error'
      case 'expired': return 'warning'
      case 'past_due': return 'error'
      default: return 'default'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <UnifiedNavigation config={getNavigationConfig()} userRole="admin" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <UnifiedNavigation config={getNavigationConfig()} userRole="admin" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <Users className="h-6 w-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                All Members
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Manage community members across all organizations (Super Admin Only)
            </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Members</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{users.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Admins</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {users.filter(u => u.role === 'org_admin' || u.role === 'super_admin').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Residents</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {users.filter(u => u.role === 'resident').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Organizations</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {organizations.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex space-x-4">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Roles</option>
                <option value="super_admin">Super Admin</option>
                <option value="org_admin">Org Admin</option>
                <option value="moderator">Moderator</option>
                <option value="resident">Resident</option>
              </select>
              
              <select
                value={orgFilter}
                onChange={(e) => setOrgFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Organizations</option>
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => {
            const organization = organizations.find(org => org.id === user.organization_id)
            
            return (
              <div key={user.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {user.image_url ? (
                      <img 
                        src={user.image_url} 
                        alt={`${user.first_name} ${user.last_name}`}
                        className="h-12 w-12 rounded-full"
                      />
                    ) : (
                      <div className="h-12 w-12 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {user.first_name && user.last_name 
                          ? `${user.first_name} ${user.last_name}`
                          : 'Unnamed User'
                        }
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="relative group">
                    <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                      <MoreHorizontal className="h-4 w-4 text-gray-400" />
                    </button>
                    <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-700 rounded-md shadow-lg border border-gray-200 dark:border-gray-600 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                      <Link 
                        href={`/users/${user.clerk_user_id}`}
                        className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        View Profile
                      </Link>
                      <Link 
                        href={`/users/${user.clerk_user_id}/announcements`}
                        className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        View Announcements
                      </Link>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Role:</span>
                    <Badge variant={getRoleBadgeColor(user.role)}>
                      {user.role.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                    <Badge variant={getStatusBadgeColor(user.subscription_status)}>
                      {user.subscription_status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Organization:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {organization?.name || 'Unknown'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Joined:</span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {formatDate(user.created_at)}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex space-x-2">
                    <Link
                      href={`/users/${user.clerk_user_id}`}
                      className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Link>
                    <Link
                      href={`/users/${user.clerk_user_id}/edit`}
                      className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No users found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || roleFilter || orgFilter 
                ? 'Try adjusting your filters or search terms.'
                : 'No users have been added to the system yet.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
