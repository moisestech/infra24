'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, X } from 'lucide-react'
import Navigation from '@/components/ui/Navigation'
import { UserPicker } from '@/components/ui/UserPicker'
import { AnnouncementPerson } from '@/types/people'

interface Announcement {
  id: string
  title: string
  body: string
  status: string
  author_clerk_id: string
  created_at: string
  published_at: string
  expires_at: string
  priority: number
  tags: string[]
  org_id: string
  scheduled_at?: string
  key_people?: AnnouncementPerson[]
}

interface Organization {
  id: string
  name: string
  slug: string
}

export default function AnnouncementEditPage() {
  const params = useParams()
  const router = useRouter()
  const [announcement, setAnnouncement] = useState<Announcement | null>(null)
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<string>('')

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    status: 'draft',
    priority: 0,
    tags: [] as string[],
    scheduled_at: '',
    scheduled_time: '',
    expires_at: '',
    expires_time: '',
    author_clerk_id: ''
  })
  
  const [selectedPeople, setSelectedPeople] = useState<AnnouncementPerson[]>([])

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        
        // Get user role first
        const userResponse = await fetch('/api/users/me')
        if (userResponse.ok) {
          const userData = await userResponse.json()
          setUserRole(userData.role || 'resident')
        }
        
        const slug = params.slug as string
        const id = params.id as string
        
        // Get organization details
        const orgResponse = await fetch(`/api/organizations/by-slug/${slug}`)
        if (orgResponse.ok) {
          const orgData = await orgResponse.json()
          setOrganization(orgData.organization)
        }
        
        // Get announcement details
        const announcementResponse = await fetch(`/api/announcements/${id}`)
        if (announcementResponse.ok) {
          const announcementData = await announcementResponse.json()
          const ann = announcementData.announcement
          setAnnouncement(ann)
          
          // Populate form data
          const scheduledDate = ann.scheduled_at ? new Date(ann.scheduled_at) : null
          const expiresDate = ann.expires_at ? new Date(ann.expires_at) : null
          
          setFormData({
            title: ann.title || '',
            body: ann.body || '',
            status: ann.status || 'draft',
            priority: ann.priority || 0,
            tags: ann.tags || [],
            scheduled_at: scheduledDate ? scheduledDate.toISOString().split('T')[0] : '',
            scheduled_time: scheduledDate ? scheduledDate.toTimeString().slice(0, 5) : '',
            expires_at: expiresDate ? expiresDate.toISOString().split('T')[0] : '',
            expires_time: expiresDate ? expiresDate.toTimeString().slice(0, 5) : '',
            author_clerk_id: ann.author_clerk_id || ''
          })
          
          // Set selected people
          setSelectedPeople(ann.key_people || [])
        } else {
          setError('Announcement not found')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load announcement')
      } finally {
        setLoading(false)
      }
    }

    if (params.slug && params.id) {
      loadData()
    }
  }, [params.slug, params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const id = params.id as string
      
      // Combine date and time fields
      const updateData = { ...formData }
      
      if (formData.scheduled_at && formData.scheduled_time) {
        updateData.scheduled_at = `${formData.scheduled_at}T${formData.scheduled_time}:00`
      } else if (formData.scheduled_at) {
        updateData.scheduled_at = `${formData.scheduled_at}T00:00:00`
      }
      
      if (formData.expires_at && formData.expires_time) {
        updateData.expires_at = `${formData.expires_at}T${formData.expires_time}:00`
      } else if (formData.expires_at) {
        updateData.expires_at = `${formData.expires_at}T00:00:00`
      }
      
      // Remove time fields from the data sent to API and add people
      const { scheduled_time, expires_time, ...apiData } = updateData
      const apiDataWithPeople = {
        ...apiData,
        key_people: selectedPeople
      }
      
      const response = await fetch(`/api/announcements/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiDataWithPeople),
      })

      if (!response.ok) {
        throw new Error('Failed to update announcement')
      }

      // Redirect to view page
      router.push(`/o/${params.slug}/announcements/${id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update announcement')
    } finally {
      setSaving(false)
    }
  }

  const isAdmin = userRole === 'super_admin' || userRole === 'org_admin' || userRole === 'moderator'

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !announcement || !organization || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200">
              {error || (!isAdmin ? 'Access denied' : 'Announcement not found')}
            </p>
            <Link
              href={`/o/${organization?.slug || params.slug}/announcements`}
              className="text-blue-600 hover:text-blue-500 text-sm font-medium mt-2 inline-block"
            >
              ← Back to Announcements
            </Link>
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
        <div className="mb-6">
          <Link
            href={`/o/${organization.slug}/announcements/${announcement.id}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-500 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Announcement
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Edit Announcement
          </h1>
        </div>

        {/* Edit Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Body */}
            <div>
              <label htmlFor="body" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Content
              </label>
              <textarea
                id="body"
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Status and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="draft">Draft</option>
                  <option value="pending">Pending</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Priority
                </label>
                <select
                  id="priority"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={0}>Normal</option>
                  <option value={1}>High</option>
                  <option value={2}>Urgent</option>
                </select>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="scheduled_at" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Event Date
                </label>
                <input
                  type="date"
                  id="scheduled_at"
                  value={formData.scheduled_at}
                  onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="scheduled_time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Event Time
                </label>
                <input
                  type="time"
                  id="scheduled_time"
                  value={formData.scheduled_time || ''}
                  onChange={(e) => setFormData({ ...formData, scheduled_time: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Leave empty if no specific time
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="expires_at" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Expires At
                </label>
                <input
                  type="date"
                  id="expires_at"
                  value={formData.expires_at}
                  onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="expires_time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Expires Time
                </label>
                <input
                  type="time"
                  id="expires_time"
                  value={formData.expires_time || ''}
                  onChange={(e) => setFormData({ ...formData, expires_time: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Leave empty if no specific time
                </p>
              </div>
            </div>

            {/* People */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                People
              </label>
              <UserPicker
                selectedPeople={selectedPeople}
                onPeopleChange={setSelectedPeople}
                organizationSlug={params.slug as string}
                className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800"
              />
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                id="tags"
                value={formData.tags.join(', ')}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
                })}
                placeholder="event, workshop, important"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Author Selection (Super Admin Only) */}
            {userRole === 'super_admin' && (
              <div>
                <label htmlFor="author_clerk_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Author (Super Admin Only)
                </label>
                <input
                  type="text"
                  id="author_clerk_id"
                  value={formData.author_clerk_id}
                  onChange={(e) => setFormData({ ...formData, author_clerk_id: e.target.value })}
                  placeholder="Enter Clerk User ID"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Enter the Clerk User ID of the new author
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Link
                href={`/o/${organization.slug}/announcements/${announcement.id}`}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <X className="h-4 w-4 mr-2 inline" />
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
