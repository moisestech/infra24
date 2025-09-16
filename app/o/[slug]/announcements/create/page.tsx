'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Bell, Save, X } from 'lucide-react'
import Navigation from '@/components/ui/Navigation'
import { UserPicker } from '@/components/ui/UserPicker'
import { AnnouncementPerson } from '@/types/people'

interface Organization {
  id: string
  name: string
  slug: string
}

export default function CreateAnnouncementPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    status: 'draft',
    priority: 0,
    tags: '',
    visibility: 'internal',
    scheduled_at: '',
    scheduled_time: '',
    expires_at: '',
    expires_time: ''
  })
  
  const [selectedPeople, setSelectedPeople] = useState<AnnouncementPerson[]>([])

  useEffect(() => {
    async function loadOrganization() {
      try {
        const response = await fetch(`/api/organizations/by-slug/${slug}`)
        if (response.ok) {
          const data = await response.json()
          setOrganization(data.organization)
        }
      } catch (err) {
        setError('Failed to load organization')
      }
    }

    if (slug) {
      loadOrganization()
    }
  }, [slug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      // Prepare the data, ensuring datetime fields are properly formatted
      const submitData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        scheduled_at: formData.scheduled_at ? new Date(formData.scheduled_at).toISOString() : null,
        expires_at: formData.expires_at ? new Date(formData.expires_at).toISOString() : null,
        key_people: selectedPeople
      }

      const response = await fetch(`/api/organizations/by-slug/${slug}/announcements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      if (!response.ok) {
        throw new Error(`Failed to create announcement: ${response.status}`)
      }

      const data = await response.json()
      router.push(`/o/${slug}/announcements/${data.announcement.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create announcement')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
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
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Create Announcement
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Create a new announcement for {organization?.name}
              </p>
            </div>
            <button
              onClick={() => router.back()}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-800 dark:text-red-200">{error}</p>
              </div>
            )}

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter announcement title"
              />
            </div>

            {/* Body */}
            <div>
              <label htmlFor="body" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Content *
              </label>
              <textarea
                id="body"
                name="body"
                value={formData.body}
                onChange={handleChange}
                required
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter announcement content..."
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
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="draft">Draft</option>
                  <option value="pending">Pending Review</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value={0}>Normal</option>
                  <option value={1}>High</option>
                  <option value={2}>Urgent</option>
                </select>
              </div>
            </div>

            {/* Visibility and Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="visibility" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Visibility
                </label>
                <select
                  id="visibility"
                  name="visibility"
                  value={formData.visibility}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="internal">Internal Only</option>
                  <option value="external">External Only</option>
                  <option value="both">Both</option>
                </select>
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter tags separated by commas"
                />
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
                organizationSlug={slug}
                className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-700"
              />
            </div>

            {/* Schedule and Expiry */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="scheduled_at" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Schedule For
                </label>
                <input
                  type="datetime-local"
                  id="scheduled_at"
                  name="scheduled_at"
                  value={formData.scheduled_at}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="expires_at" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Expires At
                </label>
                <input
                  type="datetime-local"
                  id="expires_at"
                  name="expires_at"
                  value={formData.expires_at}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>{saving ? 'Creating...' : 'Create Announcement'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
