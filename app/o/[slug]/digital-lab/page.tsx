'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { OoliteNavigation } from '@/components/tenant/OoliteNavigation'
import { TenantProvider } from '@/components/tenant/TenantProvider'
import { OrganizationLogo } from '@/components/ui/OrganizationLogo'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, Clock, Users, MapPin, Monitor, Palette, Zap, CheckCircle, ArrowRight, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'

interface Organization {
  id: string
  name: string
  slug: string
  logo_url?: string
  favicon_url?: string
}

interface Resource {
  id: string
  title: string
  description: string
  type: 'workshop' | 'equipment' | 'space' | 'event'
  category: string
  capacity: number
  duration_minutes: number
  price: number
  currency: string
  location: string
  requirements: string[]
  availability_rules: any
  metadata: any
}

interface TimeSlot {
  starts_at: string
  ends_at: string
  duration_hours: number
  date: string
  time: string
}

export default function DigitalLabPage() {
  const params = useParams()
  const slug = params.slug as string

  const [organization, setOrganization] = useState<Organization | null>(null)
  const [resources, setResources] = useState<Resource[]>([])
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [loading, setLoading] = useState(true)
  const [bookingForm, setBookingForm] = useState({
    user_name: '',
    user_email: '',
    title: '',
    description: '',
    notes: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [showBookingForm, setShowBookingForm] = useState(false)

  useEffect(() => {
    loadData()
  }, [slug])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Load organization data
      const orgResponse = await fetch(`/api/organizations/by-slug/${slug}`)
      if (orgResponse.ok) {
        const orgData = await orgResponse.json()
        setOrganization(orgData.organization)
      }

      // Load Digital Lab resources
      const resourcesResponse = await fetch(`/api/organizations/${slug}/resources?category=Digital Lab Equipment&available=true`)
      if (resourcesResponse.ok) {
        const resourcesData = await resourcesResponse.json()
        setResources(resourcesData.resources || [])
      }
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Failed to load Digital Lab information')
    } finally {
      setLoading(false)
    }
  }

  const handleResourceSelect = async (resourceId: string) => {
    const resource = resources.find(r => r.id === resourceId)
    if (!resource) return

    setSelectedResource(resource)
    setSelectedSlot(null)
    setShowBookingForm(false)

    // Load availability for this resource
    try {
      const availabilityResponse = await fetch(
        `/api/organizations/${slug}/resources/${resourceId}/availability?duration_hours=${Math.ceil(resource.duration_minutes / 60)}`
      )
      if (availabilityResponse.ok) {
        const availabilityData = await availabilityResponse.json()
        setAvailableSlots(availabilityData.available_slots || [])
      }
    } catch (error) {
      console.error('Error loading availability:', error)
      toast.error('Failed to load availability')
    }
  }

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot)
    setBookingForm(prev => ({
      ...prev,
      title: `${selectedResource?.title} - ${slot.date}`
    }))
    setShowBookingForm(true)
  }

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedResource || !selectedSlot) return

    try {
      setSubmitting(true)

      const bookingData = {
        resource_id: selectedResource.id,
        title: bookingForm.title,
        description: bookingForm.description,
        start_time: selectedSlot.starts_at,
        end_time: selectedSlot.ends_at,
        capacity: 1,
        location: selectedResource.location,
        notes: bookingForm.notes,
        user_name: bookingForm.user_name,
        user_email: bookingForm.user_email,
        metadata: {
          booking_source: 'digital_lab_page',
          resource_type: selectedResource.type
        }
      }

      const response = await fetch(`/api/organizations/${slug}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      })

      if (response.ok) {
        const result = await response.json()
        toast.success('Booking created successfully!')
        
        // Reset form
        setSelectedResource(null)
        setSelectedSlot(null)
        setShowBookingForm(false)
        setBookingForm({
          user_name: '',
          user_email: '',
          title: '',
          description: '',
          notes: ''
        })
        
        // TODO: Send email confirmation
        // TODO: Add to Google Calendar
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to create booking')
      }
    } catch (error) {
      console.error('Error creating booking:', error)
      toast.error('Failed to create booking')
    } finally {
      setSubmitting(false)
    }
  }

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'equipment': return <Monitor className="h-6 w-6" />
      case 'workshop': return <Palette className="h-6 w-6" />
      case 'space': return <Users className="h-6 w-6" />
      case 'event': return <Zap className="h-6 w-6" />
      default: return <Monitor className="h-6 w-6" />
    }
  }

  const getResourceColor = (type: string) => {
    switch (type) {
      case 'equipment': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'workshop': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'space': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'event': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  if (loading) {
    return (
      <TenantProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <OoliteNavigation />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </div>
      </TenantProvider>
    )
  }

  return (
    <TenantProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <OoliteNavigation />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center mb-6">
              <OrganizationLogo organizationSlug={slug} size="lg" className="h-16 w-16" />
            </div>
            
            <motion.h1 
              className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Digital Lab
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Book cutting-edge equipment, workshops, and spaces for your creative projects. 
              From 3D printing to AI development, we provide the tools you need to bring your digital art to life.
            </motion.p>
          </motion.div>

          {/* Resources Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {resources.map((resource) => (
              <Card 
                key={resource.id} 
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  selectedResource?.id === resource.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => handleResourceSelect(resource.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${getResourceColor(resource.type)}`}>
                        {getResourceIcon(resource.type)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{resource.title}</CardTitle>
                        <Badge variant="info" className="mt-1">
                          {resource.type}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        ${resource.price}
                      </div>
                      <div className="text-sm text-gray-500">
                        {resource.duration_minutes} min
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <CardDescription className="mb-4">
                    {resource.description}
                  </CardDescription>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{resource.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span>Capacity: {resource.capacity}</span>
                    </div>
                    {resource.requirements.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {resource.requirements.slice(0, 2).map((req, index) => (
                          <Badge key={index} variant="default" className="text-xs">
                            {req}
                          </Badge>
                        ))}
                        {resource.requirements.length > 2 && (
                          <Badge variant="default" className="text-xs">
                            +{resource.requirements.length - 2} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Selected Resource Details */}
          {selectedResource && (
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">{selectedResource.title}</CardTitle>
                      <CardDescription className="text-lg mt-2">
                        {selectedResource.description}
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedResource(null)
                        setSelectedSlot(null)
                        setShowBookingForm(false)
                      }}
                    >
                      Change Resource
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Availability</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {availableSlots.length} slots available in the next 30 days
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Duration</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedResource.duration_minutes} minutes minimum
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Price</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        ${selectedResource.price} {selectedResource.currency}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Available Time Slots */}
          {selectedResource && availableSlots.length > 0 && (
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Available Time Slots
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableSlots.slice(0, 12).map((slot, index) => (
                  <Card 
                    key={index}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-md ${
                      selectedSlot?.starts_at === slot.starts_at ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                    onClick={() => handleSlotSelect(slot)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold">
                            {new Date(slot.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {slot.time}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {slot.duration_hours}h
                          </div>
                          <div className="text-xs text-gray-500">
                            ${selectedResource.price}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {availableSlots.length > 12 && (
                <p className="text-center text-gray-500 mt-4">
                  Showing 12 of {availableSlots.length} available slots
                </p>
              )}
            </motion.div>
          )}

          {/* Booking Form */}
          {showBookingForm && selectedSlot && (
            <motion.div 
              className="max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <span>Complete Your Booking</span>
                  </CardTitle>
                  <CardDescription>
                    {selectedResource?.title} - {new Date(selectedSlot.date).toLocaleDateString()} at {selectedSlot.time}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <form onSubmit={handleBookingSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="user_name">Your Name *</Label>
                        <Input
                          id="user_name"
                          value={bookingForm.user_name}
                          onChange={(e) => setBookingForm(prev => ({ ...prev, user_name: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="user_email">Email Address *</Label>
                        <Input
                          id="user_email"
                          type="email"
                          value={bookingForm.user_email}
                          onChange={(e) => setBookingForm(prev => ({ ...prev, user_email: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="title">Booking Title *</Label>
                      <Input
                        id="title"
                        value={bookingForm.title}
                        onChange={(e) => setBookingForm(prev => ({ ...prev, title: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Project Description</Label>
                      <Textarea
                        id="description"
                        value={bookingForm.description}
                        onChange={(e) => setBookingForm(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        placeholder="Tell us about your project..."
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="notes">Special Requirements</Label>
                      <Textarea
                        id="notes"
                        value={bookingForm.notes}
                        onChange={(e) => setBookingForm(prev => ({ ...prev, notes: e.target.value }))}
                        rows={2}
                        placeholder="Any special requirements or notes..."
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowBookingForm(false)}
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        disabled={submitting}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        {submitting ? 'Creating Booking...' : 'Confirm Booking'}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Features Section */}
          <motion.div 
            className="mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Why Choose Our Digital Lab?
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h4 className="font-semibold mb-2">Cutting-Edge Equipment</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Access to the latest 3D printers, VR/AR kits, and high-performance workstations
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h4 className="font-semibold mb-2">Expert Support</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Get help from experienced instructors and technical staff
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h4 className="font-semibold mb-2">Flexible Scheduling</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Book equipment and spaces that fit your schedule and project timeline
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </TenantProvider>
  )
}
