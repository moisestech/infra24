/**
 * Waitlist Form Component
 * Allows users to join the waitlist for fully booked resources
 */

'use client'

import { useState } from 'react'
import { Clock, Users, AlertCircle, CheckCircle } from 'lucide-react'

interface WaitlistFormProps {
  resourceId: string
  orgId: string
  resourceTitle: string
  onSuccess?: (entryId: string) => void
  onError?: (error: string) => void
}

export default function WaitlistForm({ 
  resourceId, 
  orgId, 
  resourceTitle, 
  onSuccess, 
  onError 
}: WaitlistFormProps) {
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    requested_start_time: '',
    requested_end_time: '',
    notes: '',
    urgency: 'medium' as 'low' | 'medium' | 'high'
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'add',
          org_id: orgId,
          resource_id: resourceId,
          user_name: formData.user_name,
          user_email: formData.user_email,
          requested_start_time: formData.requested_start_time,
          requested_end_time: formData.requested_end_time,
          metadata: {
            notes: formData.notes,
            urgency: formData.urgency
          }
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join waitlist')
      }

      setSubmitted(true)
      onSuccess?.(data.entry_id)

    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred'
      setError(errorMessage)
      onError?.(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          You're on the waitlist!
        </h3>
        <p className="text-green-700 mb-4">
          We'll notify you as soon as a slot becomes available for <strong>{resourceTitle}</strong>.
        </p>
        <div className="bg-green-100 rounded-lg p-4 text-sm text-green-800">
          <p className="font-medium mb-2">What happens next?</p>
          <ul className="text-left space-y-1">
            <li>• You'll receive an email when slots become available</li>
            <li>• You'll have 2 hours to book before the next person is notified</li>
            <li>• Your waitlist entry expires after 24 hours</li>
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center mb-4">
        <Clock className="h-6 w-6 text-blue-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">
          Join Waitlist for {resourceTitle}
        </h3>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <Users className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">How the waitlist works:</p>
            <ul className="space-y-1">
              <li>• You'll be notified when slots become available</li>
              <li>• Notifications are sent in priority order</li>
              <li>• You have 2 hours to book before the next person is notified</li>
            </ul>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-2" />
            <div className="text-sm text-red-800">
              <p className="font-medium">Error</p>
              <p>{error}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="user_name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              id="user_name"
              name="user_name"
              value={formData.user_name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label htmlFor="user_email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              id="user_email"
              name="user_email"
              value={formData.user_email}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email address"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="requested_start_time" className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Start Time *
            </label>
            <input
              type="datetime-local"
              id="requested_start_time"
              name="requested_start_time"
              value={formData.requested_start_time}
              onChange={handleInputChange}
              required
              min={new Date().toISOString().slice(0, 16)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="requested_end_time" className="block text-sm font-medium text-gray-700 mb-1">
              Preferred End Time *
            </label>
            <input
              type="datetime-local"
              id="requested_end_time"
              name="requested_end_time"
              value={formData.requested_end_time}
              onChange={handleInputChange}
              required
              min={formData.requested_start_time || new Date().toISOString().slice(0, 16)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 mb-1">
            Urgency Level
          </label>
          <select
            id="urgency"
            name="urgency"
            value={formData.urgency}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="low">Low - Flexible timing</option>
            <option value="medium">Medium - Preferred timing</option>
            <option value="high">High - Time sensitive</option>
          </select>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Additional Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Any additional information about your booking needs..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Joining Waitlist...' : 'Join Waitlist'}
        </button>
      </form>

      <div className="mt-4 text-xs text-gray-500 text-center">
        By joining the waitlist, you agree to receive notifications about available slots.
        You can remove yourself from the waitlist at any time.
      </div>
    </div>
  )
}



