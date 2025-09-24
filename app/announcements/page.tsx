'use client'

import { useEffect, useState, Suspense } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Bell, 
  Search, 
  Plus,
  Calendar,
  User,
  Building2,
  Eye,
  Edit,
  Play
} from 'lucide-react'
import { UnifiedNavigation, ooliteConfig } from '@/components/navigation'
import { Badge } from '@/components/ui/Badge'

interface Announcement {
  id: string
  title: string
  body?: string
  status: string
  author_clerk_id: string
  created_at: string
  published_at?: string
  expires_at?: string
  scheduled_at?: string
  priority: number
  tags: string[]
  org_id: string
  type?: string
  sub_type?: string
  organization?: {
    id: string
    name: string
    slug: string
  }
}

interface Organization {
  id: string
  name: string
  slug: string
  description?: string
  logo_url?: string
}

interface AuthorInfo {
  clerk_user_id: string
  first_name?: string
  last_name?: string
  email: string
  image_url?: string
}

function AnnouncementsPageContent() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [authors, setAuthors] = useState<Record<string, AuthorInfo>>({})
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [orgFilter, setOrgFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')

  useEffect(() => {
    async function loadData() {
      if (!user) return

      try {
        // Load user profile to check role
        const userResponse = await fetch('/api/users/me')
        if (userResponse.ok) {
          const userData = await userResponse.json()
          
          // If user is not super admin, redirect to their organization's announcements page
          if (userData.user.role !== 'super_admin') {
            if (userData.organization) {
              router.push(`/organizations/${userData.organization.slug}/announcements`)
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

        // Load all announcements for super admin
        const announcementsResponse = await fetch('/api/announcements')
        if (announcementsResponse.ok) {
          const announcementsData = await announcementsResponse.json()
          setAnnouncements(announcementsData.announcements || [])

          // Load author information for all announcements
          const authorIds = [...new Set(announcementsData.announcements?.map((a: Announcement) => a.author_clerk_id).filter(Boolean) || [])] as string[]
          const authorsMap: Record<string, AuthorInfo> = {}
          
          await Promise.all(
            authorIds.map(async (authorId: string) => {
              try {
                const authorResponse = await fetch(`/api/users/${authorId}`)
                if (authorResponse.ok) {
                  const authorData = await authorResponse.json()
                  authorsMap[authorId] = authorData.user
                }
              } catch (error) {
                console.error(`Error loading author ${authorId}:`, error)
              }
            })
          )
          
          setAuthors(authorsMap)
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

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = 
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.body?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = !statusFilter || announcement.status === statusFilter
    const matchesOrg = !orgFilter || announcement.org_id === orgFilter
    
    const eventDate = announcement.scheduled_at || announcement.created_at
    const matchesDate = !dateFilter || getDateStatus(eventDate) === dateFilter

    return matchesSearch && matchesStatus && matchesOrg && matchesDate
  })

  // Sort announcements by date (latest first, prioritizing scheduled_at)
  const sortedAnnouncements = filteredAnnouncements.sort((a, b) => {
    const dateA = new Date(a.scheduled_at || a.created_at)
    const dateB = new Date(b.scheduled_at || b.created_at)
    return dateB.getTime() - dateA.getTime()
  })

  // Utility functions for date handling
  const isToday = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isTomorrow = (dateString: string) => {
    const date = new Date(dateString)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return date.toDateString() === tomorrow.toDateString()
  }

  const isPast = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset time to start of day
    return date < today
  }

  const isUpcoming = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    today.setHours(23, 59, 59, 999) // End of today
    return date > today
  }

  const getDateStatus = (dateString: string) => {
    if (isToday(dateString)) return 'today'
    if (isTomorrow(dateString)) return 'tomorrow'
    if (isPast(dateString)) return 'past'
    return 'upcoming'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published': return <Badge variant="success">Published</Badge>
      case 'pending': return <Badge variant="warning">Pending</Badge>
      case 'rejected': return <Badge variant="error">Rejected</Badge>
      case 'draft': return <Badge variant="default">Draft</Badge>
      case 'approved': return <Badge variant="info">Approved</Badge>
      default: return <Badge variant="default">{status}</Badge>
    }
  }

  const getTypeBadge = (type?: string) => {
    if (!type) return null;
    
    const typeStyles = {
      urgent: { bg: 'bg-red-100', text: 'text-red-800', label: 'Urgent' },
      facility: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Facility' },
      event: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Event' },
      opportunity: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Opportunity' },
      administrative: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Admin' },
    };
    
    const style = typeStyles[type as keyof typeof typeStyles] || typeStyles.event;
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${style.bg} ${style.text}`}>
        {style.label}
      </span>
    );
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
        <UnifiedNavigation config={ooliteConfig} userRole="admin" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
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
      <UnifiedNavigation config={ooliteConfig} userRole="admin" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <Bell className="h-6 w-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                All Announcements
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Manage announcements across all organizations (Super Admin Only)
            </p>
          </div>
          
          <div className="flex space-x-3">
            <Link
              href="/announcements/create"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Announcement
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <Bell className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{announcements.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <Badge variant="success" className="h-8 w-8">
                <span className="text-2xl font-bold">{announcements.filter(a => a.status === 'published').length}</span>
              </Badge>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Published</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {announcements.filter(a => a.status === 'published').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <Badge variant="warning" className="h-8 w-8">
                <span className="text-2xl font-bold">{announcements.filter(a => a.status === 'pending').length}</span>
              </Badge>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {announcements.filter(a => a.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-gray-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Organizations</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {organizations.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search announcements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex space-x-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="published">Published</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="draft">Draft</option>
                <option value="rejected">Rejected</option>
              </select>
              
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Dates</option>
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past Events</option>
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

        {/* Announcements List */}
        <div className="space-y-4">
          {sortedAnnouncements.map((announcement) => {
            const author = authors[announcement.author_clerk_id]
            const organization = organizations.find(org => org.id === announcement.org_id)
            
            // Determine the event date - prioritize scheduled_at, then created_at
            const eventDate = announcement.scheduled_at || announcement.created_at
            const dateStatus = getDateStatus(eventDate)
            const isEventToday = isToday(eventDate)
            const isEventTomorrow = isTomorrow(eventDate)
            const isEventPast = isPast(eventDate)
            
            return (
              <div 
                key={announcement.id} 
                className={`rounded-lg shadow-sm transition-shadow ${
                  isEventPast 
                    ? 'bg-gray-50 dark:bg-gray-800/50 opacity-75' 
                    : 'bg-white dark:bg-gray-800 hover:shadow-md'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        {getStatusIcon(announcement.status)}
                        <h3 className={`text-lg font-semibold ${
                          isEventPast 
                            ? 'text-gray-500 dark:text-gray-400' 
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {announcement.title}
                        </h3>
                        {announcement.priority > 0 && (
                          <Badge variant="error">
                            Priority {announcement.priority}
                          </Badge>
                        )}
                        {isEventToday && (
                          <Badge variant="success" className="bg-green-500 text-white">
                            TODAY
                          </Badge>
                        )}
                        {isEventTomorrow && (
                          <Badge variant="info" className="bg-blue-500 text-white">
                            TOMORROW
                          </Badge>
                        )}
                        {isEventPast && (
                          <Badge variant="default" className="bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                            Past Event
                          </Badge>
                        )}
                        {getTypeBadge(announcement.type)}
                      </div>
                      
                      {announcement.body && (
                        <p className={`mb-4 line-clamp-2 ${
                          isEventPast 
                            ? 'text-gray-400 dark:text-gray-500' 
                            : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {announcement.body}
                        </p>
                      )}
                      
                      <div className={`flex items-center space-x-6 text-sm ${
                        isEventPast 
                          ? 'text-gray-400 dark:text-gray-500' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>
                            {author 
                              ? `${author.first_name} ${author.last_name}`.trim() || author.email
                              : 'Unknown Author'
                            }
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <Building2 className="h-4 w-4" />
                          <span>{organization?.name || 'Unknown Org'}</span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Created {formatDate(announcement.created_at)}</span>
                        </div>
                        
                        {announcement.published_at && (
                          <div className="flex items-center space-x-1">
                            <Badge variant="success" className="h-4 w-4">✓</Badge>
                            <span>Published {formatDate(announcement.published_at)}</span>
                          </div>
                        )}
                      </div>
                      
                      {announcement.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {announcement.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Link
                        href={announcement.organization?.slug 
                          ? `/o/${announcement.organization.slug}/announcements/${announcement.id}`
                          : `/announcements/${announcement.id}`
                        }
                        className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      
                      <Link
                        href={announcement.organization?.slug 
                          ? `/o/${announcement.organization.slug}/announcements/${announcement.id}/edit`
                          : `/announcements/${announcement.id}/edit`
                        }
                        className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {sortedAnnouncements.length === 0 && (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No announcements found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm || statusFilter || orgFilter || dateFilter
                ? 'Try adjusting your filters or search terms.'
                : 'No announcements have been created yet.'
              }
            </p>
            <Link
              href="/announcements/create"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Announcement
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AnnouncementsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AnnouncementsPageContent />
    </Suspense>
  );
}
