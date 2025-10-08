'use client'

import React, { useState, useEffect } from 'react'
import { useTenant } from '@/components/tenant/TenantProvider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Video, 
  Building,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ExternalLink
} from 'lucide-react'
import { format, addDays, startOfDay, endOfDay } from 'date-fns'

interface TimeSlot {
  start: string
  end: string
  host: string
}

interface BookingResource {
  id: string
  title: string
  description: string
  duration_minutes: number
  location: string
  metadata: {
    booking_type: string
    meeting_platform?: string
  }
}

export default function BookPage() {
  const { tenantConfig } = useTenant()
  const [selectedResource, setSelectedResource] = useState<BookingResource | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'select' | 'date' | 'time' | 'form' | 'confirm'>('select')
  
  // Form data
  const [formData, setFormData] = useState({
    artist_name: '',
    artist_email: '',
    goal_text: '',
    consent_recording: false
  })

  const bookingResources: BookingResource[] = [
    {
      id: '7d683079-3514-4b60-9155-7e4df4c46a30', // Remote Studio Visit
      title: 'Remote Studio Visit',
      description: '30-minute remote consultation with Oolite staff for portfolio feedback, project guidance, and artistic development',
      duration_minutes: 30,
      location: 'Google Meet/Zoom',
      metadata: {
        booking_type: 'remote_visit',
        meeting_platform: 'google_meet'
      }
    },
    {
      id: '67e52569-d67d-4352-8ca3-c3bcbde8c43f', // Print Room Consult
      title: 'Print Room Consult',
      description: '30-minute in-person consultation in the Print Room for technical guidance, equipment training, and project support',
      duration_minutes: 30,
      location: 'Print Room - Oolite Arts',
      metadata: {
        booking_type: 'print_room',
        meeting_platform: 'in_person'
      }
    }
  ]

  const fetchAvailableSlots = async (date: string) => {
    if (!selectedResource) return

    setLoading(true)
    try {
      const response = await fetch(
        `/api/availability?resource_id=${selectedResource.id}&start_date=${date}&end_date=${date}`
      )
      const data = await response.json()
      setAvailableSlots(data.slots || [])
    } catch (error) {
      console.error('Error fetching available slots:', error)
      setAvailableSlots([])
    } finally {
      setLoading(false)
    }
  }

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    fetchAvailableSlots(date)
    setStep('time')
  }

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot)
    setStep('form')
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedResource || !selectedSlot) return

    setLoading(true)
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          org_id: '2133fe94-fb12-41f8-ab37-ea4acd4589f6', // Oolite org ID
          resource_id: selectedResource.id,
          start_time: selectedSlot.start,
          end_time: selectedSlot.end,
          artist_name: formData.artist_name,
          artist_email: formData.artist_email,
          goal_text: formData.goal_text,
          consent_recording: formData.consent_recording
        })
      })

      const result = await response.json()
      
      if (response.ok) {
        // Redirect to confirmation page
        window.location.href = `/bookings/confirmation/${result.booking_id}`
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      console.error('Error creating booking:', error)
      alert('Failed to create booking. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const generateDateOptions = () => {
    const dates = []
    const today = new Date()
    
    // Generate next 14 days
    for (let i = 1; i <= 14; i++) {
      const date = addDays(today, i)
      dates.push({
        value: format(date, 'yyyy-MM-dd'),
        label: format(date, 'EEE, MMM d'),
        isToday: i === 1
      })
    }
    
    return dates
  }

  const formatTimeSlot = (slot: TimeSlot) => {
    const start = new Date(slot.start)
    const end = new Date(slot.end)
    return {
      time: format(start, 'h:mm a'),
      duration: `${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}`,
      host: slot.host.split('@')[0]
    }
  }

  const renderResourceSelection = () => (
    <div className="space-y-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Book a Consultation
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Choose the type of consultation that best fits your needs
        </p>
      </div>

      <div className="grid gap-4">
        {bookingResources.map((resource) => (
          <Card 
            key={resource.id}
            className="cursor-pointer transition-all hover:shadow-lg border-2 hover:border-blue-300"
            onClick={() => {
              setSelectedResource(resource)
              setStep('date')
            }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div 
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: tenantConfig?.theme?.primaryColor ? `${tenantConfig.theme.primaryColor}20` : 'rgba(71, 171, 196, 0.1)' }}
                >
                  {resource.metadata.meeting_platform === 'in_person' ? (
                    <Building className="w-6 h-6" style={{ color: tenantConfig?.theme?.primaryColor || '#47abc4' }} />
                  ) : (
                    <Video className="w-6 h-6" style={{ color: tenantConfig?.theme?.primaryColor || '#47abc4' }} />
                  )}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{resource.duration_minutes} min</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{resource.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">
                {resource.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderDateSelection = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-3 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setStep('select')}
          className="p-2"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-xl font-semibold">Select Date</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {selectedResource?.title}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {generateDateOptions().map((date) => (
          <Button
            key={date.value}
            variant="outline"
            className="h-auto p-4 flex flex-col items-center space-y-1"
            onClick={() => handleDateSelect(date.value)}
          >
            <span className="font-medium">{date.label}</span>
            {date.isToday && (
              <Badge variant="default" className="text-xs">
                Soonest
              </Badge>
            )}
          </Button>
        ))}
      </div>
    </div>
  )

  const renderTimeSelection = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-3 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setStep('date')}
          className="p-2"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-xl font-semibold">Select Time</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {selectedDate && format(new Date(selectedDate), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Loading available times...</p>
        </div>
      ) : availableSlots.length === 0 ? (
        <div className="text-center py-8">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No available times for this date</p>
          <Button
            variant="outline"
            onClick={() => setStep('date')}
            className="mt-3"
          >
            Choose Different Date
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {availableSlots.map((slot, index) => {
            const formatted = formatTimeSlot(slot)
            return (
              <Button
                key={index}
                variant="outline"
                className="w-full h-auto p-4 flex items-center justify-between"
                onClick={() => handleSlotSelect(slot)}
              >
                <div className="flex items-center space-x-3">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">{formatted.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span className="text-sm text-gray-500">{formatted.host}</span>
                </div>
              </Button>
            )
          })}
        </div>
      )}
    </div>
  )

  const renderBookingForm = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-3 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setStep('time')}
          className="p-2"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-xl font-semibold">Your Information</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {selectedSlot && formatTimeSlot(selectedSlot).duration}
          </p>
        </div>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div>
          <label htmlFor="artist_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Full Name *
          </label>
          <Input
            id="artist_name"
            type="text"
            required
            value={formData.artist_name}
            onChange={(e) => setFormData({ ...formData, artist_name: e.target.value })}
            placeholder="Your full name"
          />
        </div>

        <div>
          <label htmlFor="artist_email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email Address *
          </label>
          <Input
            id="artist_email"
            type="email"
            required
            value={formData.artist_email}
            onChange={(e) => setFormData({ ...formData, artist_email: e.target.value })}
            placeholder="your.email@example.com"
          />
        </div>

        <div>
          <label htmlFor="goal_text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            What would you like to discuss? *
          </label>
          <Textarea
            id="goal_text"
            required
            value={formData.goal_text}
            onChange={(e) => setFormData({ ...formData, goal_text: e.target.value })}
            placeholder="Briefly describe your project, questions, or goals for this consultation..."
            rows={3}
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="consent_recording"
            checked={formData.consent_recording}
            onChange={(e) => setFormData({ ...formData, consent_recording: e.target.checked })}
            className="rounded"
          />
          <label htmlFor="consent_recording" className="text-sm text-gray-600 dark:text-gray-400">
            I consent to this session being recorded for quality purposes (optional)
          </label>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full"
          style={{
            backgroundColor: tenantConfig?.theme?.primaryColor || '#47abc4',
            borderColor: tenantConfig?.theme?.primaryColor || '#47abc4',
          }}
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Creating Booking...
            </div>
          ) : (
            'Confirm Booking'
          )}
        </Button>
      </form>
    </div>
  )

  const renderConfirmation = () => (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
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

      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Booking Confirmed!
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          You'll receive a confirmation email with meeting details shortly.
        </p>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-left">
        <h3 className="font-semibold mb-2">Booking Details</h3>
        <div className="space-y-1 text-sm">
          <div><strong>Type:</strong> {selectedResource?.title}</div>
          <div><strong>Date:</strong> {selectedDate && format(new Date(selectedDate), 'EEEE, MMMM d, yyyy')}</div>
          <div><strong>Time:</strong> {selectedSlot && formatTimeSlot(selectedSlot).duration}</div>
          <div><strong>Host:</strong> {selectedSlot && formatTimeSlot(selectedSlot).host}</div>
          <div><strong>Location:</strong> {selectedResource?.location}</div>
        </div>
      </div>

      <div className="space-y-3">
        <Button
          className="w-full"
          style={{
            backgroundColor: tenantConfig?.theme?.primaryColor || '#47abc4',
            borderColor: tenantConfig?.theme?.primaryColor || '#47abc4',
          }}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Add to Calendar
        </Button>
        
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            setStep('select')
            setSelectedResource(null)
            setSelectedDate('')
            setSelectedSlot(null)
            setFormData({
              artist_name: '',
              artist_email: '',
              goal_text: '',
              consent_recording: false
            })
          }}
        >
          Book Another Consultation
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md mx-auto px-4 py-8">
        {step === 'select' && renderResourceSelection()}
        {step === 'date' && renderDateSelection()}
        {step === 'time' && renderTimeSelection()}
        {step === 'form' && renderBookingForm()}
        {step === 'confirm' && renderConfirmation()}
      </div>
    </div>
  )
}
