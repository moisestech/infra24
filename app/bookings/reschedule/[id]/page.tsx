'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Calendar, Clock, MapPin, User, ArrowLeft, Save, X } from 'lucide-react'

interface Booking {
  id: string
  title: string
  start_time: string
  end_time: string
  location: string
  status: string
  metadata: {
    artist_name: string
    artist_email: string
    host: string
    meeting_url?: string
    meeting_code?: string
  }
  resources: {
    title: string
    location: string
  }
}

export default function ReschedulePage() {
  const params = useParams()
  const router = useRouter()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  // Form state
  const [newStartTime, setNewStartTime] = useState('')
  const [newEndTime, setNewEndTime] = useState('')
  const [notes, setNotes] = useState('')

  const bookingId = params.id as string
  const token = new URLSearchParams(window.location.search).get('token')

  useEffect(() => {
    if (!token) {
      setError('Invalid reschedule link')
      setLoading(false)
      return
    }

    // Fetch booking details
    fetch(`/api/bookings/${bookingId}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error)
        } else {
          setBooking(data.booking)
          // Pre-fill form with current times
          const startDate = new Date(data.booking.start_time)
          const endDate = new Date(data.booking.end_time)
          
          setNewStartTime(startDate.toISOString().slice(0, 16))
          setNewEndTime(endDate.toISOString().slice(0, 16))
        }
        setLoading(false)
      })
      .catch(err => {
        setError('Failed to load booking details')
        setLoading(false)
      })
  }, [bookingId, token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/bookings/${bookingId}/reschedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          start_time: new Date(newStartTime).toISOString(),
          end_time: new Date(newEndTime).toISOString(),
          notes
        })
      })

      const data = await response.json()

      if (data.error) {
        setError(data.error)
      } else {
        setSuccess(true)
        setTimeout(() => {
          router.push(`/bookings/confirmation/${bookingId}`)
        }, 2000)
      }
    } catch (err) {
      setError('Failed to reschedule booking')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading booking details...</p>
        </div>
      </div>
    )
  }

  if (error && !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <X className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/bookings')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Bookings
          </button>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-green-100 rounded-full p-3 w-16 h-16 mx-auto mb-4">
            <Save className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Rescheduled!</h1>
          <p className="text-gray-600 mb-4">Your booking has been successfully rescheduled.</p>
          <p className="text-sm text-gray-500">Redirecting to confirmation page...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Reschedule Booking</h1>
          <p className="text-gray-600 mt-2">Update your booking time and details</p>
        </div>

        {/* Current Booking Info */}
        {booking && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Booking</h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="font-medium">{booking.title}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(booking.start_time).toLocaleDateString()} at{' '}
                    {new Date(booking.start_time).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-400 mr-3" />
                <p className="text-sm text-gray-600">
                  Duration: {Math.round((new Date(booking.end_time).getTime() - new Date(booking.start_time).getTime()) / (1000 * 60))} minutes
                </p>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                <p className="text-sm text-gray-600">{booking.location}</p>
              </div>
              <div className="flex items-center">
                <User className="h-5 w-5 text-gray-400 mr-3" />
                <p className="text-sm text-gray-600">
                  {booking.metadata.artist_name} ({booking.metadata.artist_email})
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Reschedule Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">New Booking Details</h2>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="start_time" className="block text-sm font-medium text-gray-700 mb-2">
                New Start Time
              </label>
              <input
                type="datetime-local"
                id="start_time"
                value={newStartTime}
                onChange={(e) => setNewStartTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="end_time" className="block text-sm font-medium text-gray-700 mb-2">
                New End Time
              </label>
              <input
                type="datetime-local"
                id="end_time"
                value={newEndTime}
                onChange={(e) => setNewEndTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Any additional information about the rescheduled booking..."
              />
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Rescheduling...' : 'Reschedule Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}





