'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { UnifiedNavigation, ooliteConfig, bakehouseConfig } from '@/components/navigation'
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
import { useTheme } from '@/contexts/ThemeContext'
import { ThemeToggle } from '@/components/ThemeToggle'
import { OrganizationThemeProvider, useOrganizationTheme } from '@/components/carousel/OrganizationThemeContext'

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

function DigitalLabPageContent() {
  const params = useParams()
  const slug = params.slug as string
  const { resolvedTheme } = useTheme()

  // Get navigation config based on organization slug
  const getNavigationConfig = () => {
    switch (slug) {
      case 'oolite':
        return ooliteConfig
      case 'bakehouse':
        return bakehouseConfig
      default:
        return ooliteConfig // Default fallback
    }
  }

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

  // Get organization theme colors with fallback
  let themeColors
  try {
    const orgTheme = useOrganizationTheme()
    themeColors = orgTheme?.theme?.colors
  } catch (error) {
    console.warn('OrganizationTheme not available, using fallback colors')
  }

  const fallbackColors = {
    primary: '#47abc4',
    primaryLight: '#6bb8d1',
    primaryDark: '#3a8ba3',
    secondary: '#8b5cf6',
    accent: '#06b6d4',
    background: '#ffffff',
    cardBackground: '#ffffff',
    textPrimary: '#111827',
    textSecondary: '#6b7280'
  }
  const colors = themeColors || fallbackColors

  // Theme-aware styles using organization colors
  const getThemeStyles = () => {
    if (resolvedTheme === 'dark') {
      return {
        background: `linear-gradient(135deg, ${colors.primary || '#3b82f6'}20 0%, #1a1a1a 50%, ${colors.primary || '#3b82f6'}20 100%)`,
        headerBg: '#2a2a2a',
        headerBorder: '#404040',
        cardBg: colors.background || '#2a2a2a',
        cardBorder: '#404040',
        textPrimary: '#ffffff',
        textSecondary: '#a0a0a0',
        buttonBg: colors.primary,
        buttonHover: colors.primary || '#3b82f6',
      }
    } else {
      return {
        background: `linear-gradient(135deg, ${colors.primary || '#3b82f6'}10 0%, ${colors.background || '#ffffff'} 50%, ${colors.primary || '#3b82f6'}10 100%)`,
        headerBg: colors.background || '#ffffff',
        headerBorder: '#e5e5e5',
        cardBg: colors.background || '#ffffff',
        cardBorder: '#e5e5e5',
        textPrimary: '#000000',
        textSecondary: '#666666',
        buttonBg: colors.primary,
        buttonHover: colors.primary || '#3b82f6',
      }
    }
  }

  const themeStyles = getThemeStyles()

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
        <OrganizationThemeProvider initialSlug={slug}>
          <div 
            className="min-h-screen"
            style={{ background: themeStyles.background }}
          >
            <UnifiedNavigation config={ooliteConfig} userRole="admin" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex items-center justify-center h-64">
                <div 
                  className="animate-spin rounded-full h-12 w-12 border-b-2"
                  style={{ borderColor: colors.primary }}
                ></div>
              </div>
            </div>
          </div>
        </OrganizationThemeProvider>
      </TenantProvider>
    )
  }

  return (
    <TenantProvider>
      <OrganizationThemeProvider initialSlug={slug}>
        <div 
          className="min-h-screen"
          style={{ background: themeStyles.background }}
        >
          <UnifiedNavigation config={ooliteConfig} userRole="admin" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1"></div>
              <div className="flex items-center justify-center">
                <OrganizationLogo organizationSlug={slug} size="lg" className="h-12 w-12 sm:h-16 sm:w-16" />
              </div>
              <div className="flex-1 flex justify-end">
                <ThemeToggle />
              </div>
            </div>
            
            <motion.h1 
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
              style={{ color: themeStyles.textPrimary }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Digital Lab
            </motion.h1>
            
            <motion.p 
              className="text-lg sm:text-xl max-w-3xl mx-auto px-4"
              style={{ color: themeStyles.textSecondary }}
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
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {resources.map((resource) => (
              <Card 
                key={resource.id} 
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  selectedResource?.id === resource.id ? 'ring-2' : ''
                }`}
                style={{ 
                  backgroundColor: themeStyles.cardBg,
                  borderColor: themeStyles.cardBorder,
                  ...(selectedResource?.id === resource.id ? { 
                    ringColor: colors.primary,
                    borderColor: colors.primary 
                  } : {})
                }}
                onClick={() => handleResourceSelect(resource.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${getResourceColor(resource.type)}`}>
                        {getResourceIcon(resource.type)}
                      </div>
                      <div>
                        <CardTitle className="text-lg" style={{ color: themeStyles.textPrimary }}>{resource.title}</CardTitle>
                        <Badge variant="info" className="mt-1">
                          {resource.type}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold" style={{ color: colors.primary }}>
                        ${resource.price}
                      </div>
                      <div className="text-sm" style={{ color: themeStyles.textSecondary }}>
                        {resource.duration_minutes} min
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <CardDescription className="mb-4" style={{ color: themeStyles.textSecondary }}>
                    {resource.description}
                  </CardDescription>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" style={{ color: themeStyles.textSecondary }} />
                      <span style={{ color: themeStyles.textSecondary }}>{resource.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" style={{ color: themeStyles.textSecondary }} />
                      <span style={{ color: themeStyles.textSecondary }}>Capacity: {resource.capacity}</span>
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
              <Card style={{ backgroundColor: themeStyles.cardBg, borderColor: themeStyles.cardBorder }}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl" style={{ color: themeStyles.textPrimary }}>{selectedResource.title}</CardTitle>
                      <CardDescription className="text-lg mt-2" style={{ color: themeStyles.textSecondary }}>
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
                      <h4 className="font-semibold mb-2" style={{ color: themeStyles.textPrimary }}>Availability</h4>
                      <p className="text-sm" style={{ color: themeStyles.textSecondary }}>
                        {availableSlots.length} slots available in the next 30 days
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2" style={{ color: themeStyles.textPrimary }}>Duration</h4>
                      <p className="text-sm" style={{ color: themeStyles.textSecondary }}>
                        {selectedResource.duration_minutes} minutes minimum
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2" style={{ color: themeStyles.textPrimary }}>Price</h4>
                      <p className="text-sm" style={{ color: themeStyles.textSecondary }}>
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
              <h3 className="text-2xl font-bold mb-6" style={{ color: themeStyles.textPrimary }}>
                Available Time Slots
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {availableSlots.slice(0, 12).map((slot, index) => (
                  <Card 
                    key={index}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-md ${
                      selectedSlot?.starts_at === slot.starts_at ? 'ring-2' : ''
                    }`}
                    style={{ 
                      backgroundColor: themeStyles.cardBg,
                      borderColor: themeStyles.cardBorder,
                      ...(selectedSlot?.starts_at === slot.starts_at ? { 
                        ringColor: colors.primary,
                        borderColor: colors.primary,
                        backgroundColor: resolvedTheme === 'dark' ? `${colors.primary}20` : `${colors.primary}10`
                      } : {})
                    }}
                    onClick={() => handleSlotSelect(slot)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold" style={{ color: themeStyles.textPrimary }}>
                            {new Date(slot.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                          <div className="text-sm" style={{ color: themeStyles.textSecondary }}>
                            {slot.time}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium" style={{ color: themeStyles.textPrimary }}>
                            {slot.duration_hours}h
                          </div>
                          <div className="text-xs" style={{ color: themeStyles.textSecondary }}>
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
              <Card style={{ backgroundColor: themeStyles.cardBg, borderColor: themeStyles.cardBorder }}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2" style={{ color: themeStyles.textPrimary }}>
                    <CheckCircle className="h-6 w-6" style={{ color: colors.primary }} />
                    <span>Complete Your Booking</span>
                  </CardTitle>
                  <CardDescription style={{ color: themeStyles.textSecondary }}>
                    {selectedResource?.title} - {new Date(selectedSlot.date).toLocaleDateString()} at {selectedSlot.time}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <form onSubmit={handleBookingSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="user_name" style={{ color: themeStyles.textPrimary }}>Your Name *</Label>
                        <Input
                          id="user_name"
                          value={bookingForm.user_name}
                          onChange={(e) => setBookingForm(prev => ({ ...prev, user_name: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="user_email" style={{ color: themeStyles.textPrimary }}>Email Address *</Label>
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
                      <Label htmlFor="title" style={{ color: themeStyles.textPrimary }}>Booking Title *</Label>
                      <Input
                        id="title"
                        value={bookingForm.title}
                        onChange={(e) => setBookingForm(prev => ({ ...prev, title: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="description" style={{ color: themeStyles.textPrimary }}>Project Description</Label>
                      <Textarea
                        id="description"
                        value={bookingForm.description}
                        onChange={(e) => setBookingForm(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        placeholder="Tell us about your project..."
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="notes" style={{ color: themeStyles.textPrimary }}>Special Requirements</Label>
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
                        style={{ 
                          backgroundColor: colors.primary,
                          borderColor: colors.primary
                        }}
                        className="hover:opacity-90"
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
            <h3 className="text-2xl font-bold mb-8 text-center" style={{ color: themeStyles.textPrimary }}>
              Why Choose Our Digital Lab?
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              <Card style={{ backgroundColor: themeStyles.cardBg, borderColor: themeStyles.cardBorder }}>
                <CardContent className="p-6 text-center">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: `${colors.primary}20` }}
                  >
                    <Sparkles className="h-6 w-6" style={{ color: colors.primary }} />
                  </div>
                  <h4 className="font-semibold mb-2" style={{ color: themeStyles.textPrimary }}>Cutting-Edge Equipment</h4>
                  <p className="text-sm" style={{ color: themeStyles.textSecondary }}>
                    Access to the latest 3D printers, VR/AR kits, and high-performance workstations
                  </p>
                </CardContent>
              </Card>
              
              <Card style={{ backgroundColor: themeStyles.cardBg, borderColor: themeStyles.cardBorder }}>
                <CardContent className="p-6 text-center">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: `${colors.primary}20` }}
                  >
                    <Users className="h-6 w-6" style={{ color: colors.primary }} />
                  </div>
                  <h4 className="font-semibold mb-2" style={{ color: themeStyles.textPrimary }}>Expert Support</h4>
                  <p className="text-sm" style={{ color: themeStyles.textSecondary }}>
                    Get help from experienced instructors and technical staff
                  </p>
                </CardContent>
              </Card>
              
              <Card style={{ backgroundColor: themeStyles.cardBg, borderColor: themeStyles.cardBorder }}>
                <CardContent className="p-6 text-center">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: `${colors.primary}20` }}
                  >
                    <Calendar className="h-6 w-6" style={{ color: colors.primary }} />
                  </div>
                  <h4 className="font-semibold mb-2" style={{ color: themeStyles.textPrimary }}>Flexible Scheduling</h4>
                  <p className="text-sm" style={{ color: themeStyles.textSecondary }}>
                    Book equipment and spaces that fit your schedule and project timeline
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
        </div>
      </OrganizationThemeProvider>
    </TenantProvider>
  )
}

export default function DigitalLabPage() {
  return <DigitalLabPageContent />
}
