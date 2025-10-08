'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useTenant } from '@/components/tenant/TenantProvider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Video, 
  Building,
  CheckCircle,
  Download,
  ExternalLink,
  Copy,
  ArrowLeft,
  Mail,
  Phone
} from 'lucide-react'
import { format, parseISO } from 'date-fns'

interface Booking {
  id: string
  title: string
  description: string
  start_time: string
  end_time: string
  status: string
  location: string
  resource_id: string
  metadata: {
    host?: string
    artist_name?: string
    artist_email?: string
    source?: string
  }
  booking_participants: Array<{
    user_id: string
    status: string
  }>
}

interface CalendarUrls {
  google: string
  outlook: string
  ics: string
}

export default function BookingConfirmationPage() {
  const params = useParams()
  const { tenantConfig } = useTenant()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [calendarUrls, setCalendarUrls] = useState<CalendarUrls | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const bookingId = params.id as string

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails()
    }
  }, [bookingId])

  const fetchBookingDetails = async () => {
    try {
      setLoading(true)
      
      // Fetch booking details
      const bookingResponse = await fetch(`/api/bookings?org_id=2133fe94-fb12-41f8-ab37-ea4acd4589f6&booking_id=${bookingId}`)
      const bookingData = await bookingResponse.json()
      
      if (!bookingResponse.ok) {
        throw new Error(bookingData.error || 'Failed to fetch booking')
      }

      const bookingDetails = bookingData.bookings?.[0]
      if (!bookingDetails) {
        throw new Error('Booking not found')
      }

      setBooking(bookingDetails)

      // Fetch calendar URLs
      const calendarResponse = await fetch(`/api/bookings/${bookingId}/calendar-urls`)
      const calendarData = await calendarResponse.json()
      
      if (calendarResponse.ok) {
        setCalendarUrls(calendarData.calendar_urls)
      }

    } catch (err) {
      console.error('Error fetching booking details:', err)
      setError(err instanceof Error ? err.message : 'Failed to load booking details')
    } finally {
      setLoading(false)
    }
  }

  const getResourceType = (resourceId: string) => {
    if (resourceId === '7d683079-3514-4b60-9155-7e4df4c46a30') {
      return { type: 'Remote', icon: Video, color: 'text-blue-600' }
    } else if (resourceId === '67e52569-d67d-4352-8ca3-c3bcbde8c43f') {
      return { type: 'Print Room', icon: Building, color: 'text-green-600' }
    }
    return { type: 'Unknown', icon: MapPin, color: 'text-gray-600' }
  }

  const formatBookingTime = (startTime: string, endTime: string) => {
    const start = parseISO(startTime)
    const end = parseISO(endTime)
    
    return {
      date: format(start, 'EEEE, MMMM d, yyyy'),
      time: `${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}`,
      timezone: 'EST'
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  const downloadICS = () => {
    if (calendarUrls?.ics) {
      window.open(calendarUrls.ics, '_blank')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Loading booking details...</p>
        </div>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-6 h-6 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Booking Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error || 'The booking you\'re looking for doesn\'t exist or has been removed.'}
          </p>
          <Button
            onClick={() => window.location.href = '/book'}
            style={{
              backgroundColor: tenantConfig?.theme?.primaryColor || '#47abc4',
              borderColor: tenantConfig?.theme?.primaryColor || '#47abc4',
            }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Book Another Consultation
          </Button>
        </div>
      </div>
    )
  }

  const resourceInfo = getResourceType(booking.resource_id)
  const timeInfo = formatBookingTime(booking.start_time, booking.end_time)
  const ResourceIcon = resourceInfo.icon

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div 
              className="p-4 rounded-full"
              style={{ backgroundColor: tenantConfig?.theme?.primaryColor ? `${tenantConfig.theme.primaryColor}20` : 'rgba(71, 171, 196, 0.1)' }}
            >
              <CheckCircle 
                className="w-12 h-12" 
                style={{ color: tenantConfig?.theme?.primaryColor || '#47abc4' }}
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your consultation has been successfully scheduled. You'll receive a confirmation email shortly.
          </p>
        </div>

        {/* Booking Details Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <ResourceIcon className={`w-6 h-6 ${resourceInfo.color}`} />
              <div className="flex-1">
                <CardTitle className="text-xl">{booking.title}</CardTitle>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className={resourceInfo.color.replace('text-', 'bg-').replace('-600', '-100') + ' text-' + resourceInfo.color.replace('text-', '')}>
                    {resourceInfo.type}
                  </Badge>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    {booking.status}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{timeInfo.date}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{timeInfo.timezone}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{timeInfo.time}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">30 minutes</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{booking.location}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {booking.metadata?.host?.split('@')[0] || 'TBD'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Host</p>
                </div>
              </div>
            </div>

            {booking.description && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">What you'll discuss:</h3>
                <p className="text-gray-600 dark:text-gray-400">{booking.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Calendar Integration */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Add to Calendar</span>
            </CardTitle>
            <CardDescription>
              Add this consultation to your calendar to receive reminders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {calendarUrls?.google && (
                <Button
                  variant="outline"
                  className="flex items-center justify-center space-x-2"
                  onClick={() => window.open(calendarUrls.google, '_blank')}
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Google Calendar</span>
                </Button>
              )}
              
              {calendarUrls?.outlook && (
                <Button
                  variant="outline"
                  className="flex items-center justify-center space-x-2"
                  onClick={() => window.open(calendarUrls.outlook, '_blank')}
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Outlook</span>
                </Button>
              )}
              
              {calendarUrls?.ics && (
                <Button
                  variant="outline"
                  className="flex items-center justify-center space-x-2 md:col-span-2"
                  onClick={downloadICS}
                >
                  <Download className="w-4 h-4" />
                  <span>Download .ics file</span>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mail className="w-5 h-5" />
              <span>Contact Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Your Email</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {booking.metadata?.artist_email || 'Not provided'}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(booking.metadata?.artist_email || '')}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Host Email</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {booking.metadata?.host || 'TBD'}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(booking.metadata?.host || '')}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            className="flex-1"
            style={{
              backgroundColor: tenantConfig?.theme?.primaryColor || '#47abc4',
              borderColor: tenantConfig?.theme?.primaryColor || '#47abc4',
            }}
            onClick={() => window.location.href = '/book'}
          >
            Book Another Consultation
          </Button>
          
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => window.location.href = '/bookings'}
          >
            View All Bookings
          </Button>
        </div>
      </div>
    </div>
  )
}

