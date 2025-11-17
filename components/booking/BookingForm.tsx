'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CalendarIcon, Clock, Monitor, Building, GraduationCap, User, Info, AlertTriangle, Wrench, CheckCircle } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Resource, Booking, CreateBookingRequest } from '@/types/booking'
import { useTenant } from '@/components/tenant/TenantProvider'

// Validation schema
const bookingSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().optional(),
  resourceId: z.string().uuid('Please select a valid resource'),
  startDate: z.date({
    message: 'Start date is required'
  }),
  startTime: z.string().min(1, 'Start time is required'),
  endDate: z.date({
    message: 'End date is required'
  }),
  endTime: z.string().min(1, 'End time is required'),
  status: z.enum(['pending', 'confirmed', 'cancelled'])
}).refine((data) => {
  // Check if end date/time is after start date/time
  const startDateTime = new Date(`${format(data.startDate, 'yyyy-MM-dd')}T${data.startTime}`)
  const endDateTime = new Date(`${format(data.endDate, 'yyyy-MM-dd')}T${data.endTime}`)
  return endDateTime > startDateTime
}, {
  message: 'End time must be after start time',
  path: ['endTime']
})

type BookingFormData = z.infer<typeof bookingSchema>

interface BookingFormProps {
  organizationId: string
  resources: Resource[]
  onSubmit: (data: CreateBookingRequest) => Promise<void>
  onCancel: () => void
  initialData?: Partial<Booking>
  isLoading?: boolean
  bookingType?: 'equipment' | 'space' | 'workshop' | 'person'
  preSelectedResource?: string | null
}

export function BookingForm({ 
  organizationId,
  resources, 
  onSubmit, 
  onCancel, 
  initialData, 
  isLoading = false,
  bookingType = 'equipment',
  preSelectedResource = null
}: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { tenantConfig } = useTenant()

  // Helper functions for booking type styling and information
  const getBookingTypeConfig = (type: string) => {
    const primaryColor = tenantConfig?.theme.primaryColor || '#3b82f6'
    const primaryAlpha = (tenantConfig?.theme as any)?.primaryAlpha || 'rgba(59, 130, 246, 0.1)'
    
    // Create different shades of the primary color for visual distinction
    const getColorVariants = (baseColor: string, alpha: string) => {
      return {
        bgColor: `bg-opacity-10`,
        borderColor: `border-opacity-20`,
        textColor: 'text-gray-900 dark:text-white',
        iconBg: `bg-opacity-20`,
        iconColor: baseColor,
        bgStyle: { backgroundColor: alpha },
        borderStyle: { borderColor: `${baseColor}33` },
        iconBgStyle: { backgroundColor: `${baseColor}20` }
      }
    }
    
    const colors = getColorVariants(primaryColor, primaryAlpha)
    
    switch (type) {
      case 'equipment':
        return {
          icon: <Monitor className="w-5 h-5" />,
          color: 'primary',
          bgColor: colors.bgColor,
          borderColor: colors.borderColor,
          textColor: colors.textColor,
          iconBg: colors.iconBg,
          iconColor: colors.iconColor,
          bgStyle: colors.bgStyle,
          borderStyle: colors.borderStyle,
          iconBgStyle: colors.iconBgStyle,
          title: 'Equipment Booking',
          description: 'Book digital lab equipment like VR headsets, 3D printers, cameras, and more'
        }
      case 'space':
        return {
          icon: <Building className="w-5 h-5" />,
          color: 'primary',
          bgColor: colors.bgColor,
          borderColor: colors.borderColor,
          textColor: colors.textColor,
          iconBg: colors.iconBg,
          iconColor: colors.iconColor,
          bgStyle: colors.bgStyle,
          borderStyle: colors.borderStyle,
          iconBgStyle: colors.iconBgStyle,
          title: 'Space Booking',
          description: 'Reserve collaborative workspaces, meeting rooms, and studio spaces'
        }
      case 'workshop':
        return {
          icon: <GraduationCap className="w-5 h-5" />,
          color: 'primary',
          bgColor: colors.bgColor,
          borderColor: colors.borderColor,
          textColor: colors.textColor,
          iconBg: colors.iconBg,
          iconColor: colors.iconColor,
          bgStyle: colors.bgStyle,
          borderStyle: colors.borderStyle,
          iconBgStyle: colors.iconBgStyle,
          title: 'Workshop Booking',
          description: 'Join workshops, training sessions, and educational programs'
        }
      case 'person':
        return {
          icon: <User className="w-5 h-5" />,
          color: 'primary',
          bgColor: colors.bgColor,
          borderColor: colors.borderColor,
          textColor: colors.textColor,
          iconBg: colors.iconBg,
          iconColor: colors.iconColor,
          bgStyle: colors.bgStyle,
          borderStyle: colors.borderStyle,
          iconBgStyle: colors.iconBgStyle,
          title: 'Person Booking',
          description: 'Book time with artists, mentors, and specialists'
        }
      default:
        return {
          icon: <CalendarIcon className="w-5 h-5" />,
          color: 'primary',
          bgColor: colors.bgColor,
          borderColor: colors.borderColor,
          textColor: colors.textColor,
          iconBg: colors.iconBg,
          iconColor: colors.iconColor,
          bgStyle: colors.bgStyle,
          borderStyle: colors.borderStyle,
          iconBgStyle: colors.iconBgStyle,
          title: 'Booking',
          description: 'Create a new booking'
        }
    }
  }

  const getBookingPolicy = (type: string) => {
    switch (type) {
      case 'equipment':
        return {
          title: 'Equipment Booking Policy',
          rules: [
            'Equipment can be booked up to 2 weeks in advance',
            'Maximum 4 hours per session',
            'Cancellations must be made 24 hours in advance',
            'All users must complete safety training before using equipment',
            'Follow all posted guidelines and ask staff for assistance when needed'
          ]
        }
      case 'space':
        return {
          title: 'Space Booking Policy',
          rules: [
            'Spaces can be booked up to 1 month in advance',
            'Maximum 8 hours per session',
            'Cancellations must be made 48 hours in advance',
            'Clean up after yourself and report any issues immediately',
            'Respect other users and maintain a collaborative environment'
          ]
        }
      case 'workshop':
        return {
          title: 'Workshop Booking Policy',
          rules: [
            'Workshops can be booked up to 1 month in advance',
            'Registration closes 24 hours before the workshop',
            'Cancellations must be made 48 hours in advance',
            'Arrive 10 minutes early for setup',
            'Bring required materials as specified in the workshop description'
          ]
        }
      case 'person':
        return {
          title: 'Person Booking Policy',
          rules: [
            'Mentor sessions can be booked up to 2 weeks in advance',
            'Maximum 2 hours per session',
            'Cancellations must be made 24 hours in advance',
            'Come prepared with specific questions or project goals',
            'Be respectful of the mentor\'s time and expertise'
          ]
        }
      default:
        return {
          title: 'General Booking Policy',
          rules: [
            'Bookings can be made up to 2 weeks in advance',
            'Cancellations must be made 24 hours in advance',
            'Follow all posted guidelines and policies',
            'Respect other users and maintain a collaborative environment'
          ]
        }
    }
  }

  const typeConfig = getBookingTypeConfig(bookingType)
  const policy = getBookingPolicy(bookingType)

  // Helper function to get equipment status
  const getEquipmentStatus = (resource: Resource) => {
    const status = resource.metadata?.status || 'available'
    const isBookable = resource.is_bookable !== false
    
    if (!isBookable) {
      return {
        status: 'unavailable',
        label: 'Unavailable',
        icon: <AlertTriangle className="w-3 h-3" />,
        color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        description: 'This equipment is currently unavailable for booking'
      }
    }
    
    switch (status) {
      case 'maintenance':
        return {
          status: 'maintenance',
          label: 'Maintenance',
          icon: <Wrench className="w-3 h-3" />,
          color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
          description: 'This equipment is currently under maintenance'
        }
      case 'available':
        return {
          status: 'available',
          label: 'Available',
          icon: <CheckCircle className="w-3 h-3" />,
          color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
          description: 'This equipment is available for booking'
        }
      default:
        return {
          status: 'unknown',
          label: 'Unknown',
          icon: <AlertTriangle className="w-3 h-3" />,
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
          description: 'Status unknown'
        }
    }
  }
  
  // Filter resources based on booking type
  const filteredResources = React.useMemo(() => {
    if (bookingType === 'equipment') {
      return resources.filter(r => r.type === 'equipment')
    } else if (bookingType === 'space') {
      return resources.filter(r => r.type === 'space')
    } else if (bookingType === 'workshop') {
      return resources.filter(r => r.type === 'workshop')
    } else if (bookingType === 'person') {
      return resources.filter(r => r.type === 'person')
    }
    return resources
  }, [resources, bookingType])
  
  // Debug logging
  console.log('🔍 BookingForm: Received resources:', resources)
  console.log('🔍 BookingForm: Filtered resources for', bookingType, ':', filteredResources)

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      resourceId: initialData?.resource_id || preSelectedResource || '',
      startDate: initialData?.start_time ? new Date(initialData.start_time) : new Date(),
      startTime: initialData?.start_time ? format(new Date(initialData.start_time), 'HH:mm') : '09:00',
      endDate: initialData?.end_time ? new Date(initialData.end_time) : new Date(),
      endTime: initialData?.end_time ? format(new Date(initialData.end_time), 'HH:mm') : '10:00',
      status: (initialData?.status as 'pending' | 'confirmed' | 'cancelled') || 'pending'
    }
  })

  // Pre-select resource if provided
  React.useEffect(() => {
    if (preSelectedResource && filteredResources.length > 0) {
      const resource = filteredResources.find(r => r.id === preSelectedResource || r.title.toLowerCase().includes(preSelectedResource.toLowerCase()))
      if (resource) {
        form.setValue('resourceId', resource.id)
        console.log('🔍 BookingForm: Pre-selected resource:', resource.title)
      }
    }
  }, [preSelectedResource, filteredResources, form])

  const handleSubmit = async (data: BookingFormData) => {
    try {
      console.log('🔍 BookingForm: Submitting booking data:', data)
      setIsSubmitting(true)
      
      // Check if selected resource is available for booking
      const selectedResource = filteredResources.find(r => r.id === data.resourceId)
      if (selectedResource) {
        const equipmentStatus = getEquipmentStatus(selectedResource)
        if (equipmentStatus.status === 'unavailable' || equipmentStatus.status === 'maintenance') {
          alert(`Cannot book ${selectedResource.title} - ${equipmentStatus.description}`)
          setIsSubmitting(false)
          return
        }
      }
      
      // Combine date and time
      const startDateTime = new Date(`${format(data.startDate, 'yyyy-MM-dd')}T${data.startTime}`)
      const endDateTime = new Date(`${format(data.endDate, 'yyyy-MM-dd')}T${data.endTime}`)

      const bookingData: CreateBookingRequest = {
        organizationId,
        resourceId: data.resourceId,
        title: data.title,
        description: data.description,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString()
      }

      console.log('🔍 BookingForm: Final booking data:', bookingData)
      await onSubmit(bookingData)
    } catch (error) {
      console.error('❌ BookingForm: Error submitting booking:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const generateTimeOptions = () => {
    const times = []
    for (let hour = 8; hour < 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        times.push(timeString)
      }
    }
    return times
  }

  const timeOptions = generateTimeOptions()

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      {/* Booking Type Header */}
      <div 
        className="border rounded-lg p-4"
        style={{
          ...typeConfig.bgStyle,
          ...typeConfig.borderStyle
        }}
      >
        <div className="flex items-center space-x-3">
          <div 
            className="p-2 rounded-lg"
            style={typeConfig.iconBgStyle}
          >
            <div style={{ color: typeConfig.iconColor }}>
              {typeConfig.icon}
            </div>
          </div>
          <div>
            <h3 className={`font-semibold ${typeConfig.textColor}`}>
              {typeConfig.title}
            </h3>
            <p className={`text-sm ${typeConfig.textColor} opacity-80`}>
              {typeConfig.description}
            </p>
          </div>
        </div>
      </div>

      {/* Booking Policy */}
      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <Info 
              className="w-5 h-5 mt-0.5" 
              style={{ color: tenantConfig?.theme.primaryColor || '#3b82f6' }}
            />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              {policy.title}
            </h4>
            <ul className="space-y-1">
              {policy.rules.map((rule, index) => (
                <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                  <span 
                    className="mr-2"
                    style={{ color: tenantConfig?.theme.primaryColor || '#3b82f6' }}
                  >•</span>
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="md:col-span-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Booking Title *
          </label>
          <Input
            id="title"
            {...form.register('title')}
            placeholder="e.g., Team Meeting, Workshop Session"
            className={cn(
              "text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 placeholder:text-gray-500 dark:placeholder:text-gray-400",
              form.formState.errors.title && 'border-red-500'
            )}
          />
          {form.formState.errors.title && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.formState.errors.title.message}</p>
          )}
        </div>

        {/* Resource Selection */}
        <div>
          <label htmlFor="resourceId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Resource *
          </label>
          <Select
            value={form.watch('resourceId')}
            onValueChange={(value) => form.setValue('resourceId', value)}
          >
            <SelectTrigger className={cn(
              "text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 placeholder:text-gray-500 dark:placeholder:text-gray-400",
              form.formState.errors.resourceId && 'border-red-500'
            )}>
              <SelectValue placeholder="Select a resource" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
              {filteredResources.map((resource) => {
                console.log('🔍 BookingForm: Rendering resource:', resource)
                const equipmentStatus = getEquipmentStatus(resource)
                const isDisabled = equipmentStatus.status === 'unavailable' || equipmentStatus.status === 'maintenance'
                
                return (
                  <SelectItem 
                    key={resource.id} 
                    value={resource.id}
                    disabled={isDisabled}
                    className={isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-2">
                        <span>{resource.title}</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center space-x-1 ${equipmentStatus.color}`}>
                          {equipmentStatus.icon}
                          <span>{equipmentStatus.label}</span>
                        </span>
                      </div>
                      <span className="text-sm text-gray-500 ml-2">
                        ({resource.type} - {resource.capacity} capacity)
                      </span>
                    </div>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
          {form.formState.errors.resourceId && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.formState.errors.resourceId.message}</p>
          )}
        </div>

        {/* Equipment Status Information */}
        {form.watch('resourceId') && bookingType === 'equipment' && (() => {
          const selectedResource = filteredResources.find(r => r.id === form.watch('resourceId'))
          if (!selectedResource) return null
          
          const equipmentStatus = getEquipmentStatus(selectedResource)
          
          return (
            <div className="md:col-span-2">
              <div className={`p-3 rounded-lg border ${equipmentStatus.status === 'available' ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' : 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800'}`}>
                <div className="flex items-center space-x-2">
                  {equipmentStatus.icon}
                  <span className={`font-medium ${equipmentStatus.status === 'available' ? 'text-green-800 dark:text-green-200' : 'text-yellow-800 dark:text-yellow-200'}`}>
                    {equipmentStatus.label}
                  </span>
                </div>
                <p className={`text-sm mt-1 ${equipmentStatus.status === 'available' ? 'text-green-700 dark:text-green-300' : 'text-yellow-700 dark:text-yellow-300'}`}>
                  {equipmentStatus.description}
                </p>
                {equipmentStatus.status === 'maintenance' && (
                  <p className="text-xs mt-2 text-yellow-600 dark:text-yellow-400">
                    Please check back later or contact staff for estimated availability.
                  </p>
                )}
              </div>
            </div>
          )
        })()}

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status
          </label>
          <Select
            value={form.watch('status')}
            onValueChange={(value: 'pending' | 'confirmed' | 'cancelled') => form.setValue('status', value)}
          >
            <SelectTrigger className="text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 placeholder:text-gray-500 dark:placeholder:text-gray-400">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
              <SelectItem value="pending" className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">Pending</SelectItem>
              <SelectItem value="confirmed" className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">Confirmed</SelectItem>
              <SelectItem value="cancelled" className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Start Date */}
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Start Date *
          </label>
          <Input
            type="date"
            {...form.register('startDate', { 
              setValueAs: (value) => value ? new Date(value) : new Date()
            })}
            className={cn(
              "text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 placeholder:text-gray-500 dark:placeholder:text-gray-400",
              form.formState.errors.startDate && 'border-red-500'
            )}
          />
          {form.formState.errors.startDate && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.formState.errors.startDate.message}</p>
          )}
        </div>

        {/* Start Time */}
        <div>
          <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Start Time *
          </label>
          <Select
            value={form.watch('startTime')}
            onValueChange={(value) => form.setValue('startTime', value)}
          >
            <SelectTrigger className={cn(
              "text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 placeholder:text-gray-500 dark:placeholder:text-gray-400",
              form.formState.errors.startTime && 'border-red-500'
            )}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
              {timeOptions.map((time) => (
                <SelectItem key={time} value={time} className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.startTime && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.formState.errors.startTime.message}</p>
          )}
        </div>

        {/* End Date */}
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            End Date *
          </label>
          <Input
            type="date"
            {...form.register('endDate', { 
              setValueAs: (value) => value ? new Date(value) : new Date()
            })}
            className={cn(
              "text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 placeholder:text-gray-500 dark:placeholder:text-gray-400",
              form.formState.errors.endDate && 'border-red-500'
            )}
          />
          {form.formState.errors.endDate && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.formState.errors.endDate.message}</p>
          )}
        </div>

        {/* End Time */}
        <div>
          <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            End Time *
          </label>
          <Select
            value={form.watch('endTime')}
            onValueChange={(value) => form.setValue('endTime', value)}
          >
            <SelectTrigger className={cn(
              "text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 placeholder:text-gray-500 dark:placeholder:text-gray-400",
              form.formState.errors.endTime && 'border-red-500'
            )}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
              {timeOptions.map((time) => (
                <SelectItem key={time} value={time} className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.endTime && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.formState.errors.endTime.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <Textarea
            id="description"
            {...form.register('description')}
            placeholder="Optional description for this booking"
            rows={3}
            className="text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 placeholder:text-gray-500 dark:placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting || isLoading}
          className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || isLoading || (() => {
            const selectedResource = filteredResources.find(r => r.id === form.watch('resourceId'))
            if (!selectedResource) return false
            const equipmentStatus = getEquipmentStatus(selectedResource)
            return equipmentStatus.status === 'unavailable' || equipmentStatus.status === 'maintenance'
          })()}
          className="min-w-[120px] text-white border-0"
          style={{
            backgroundColor: tenantConfig?.theme.primaryColor || '#47abc4',
            borderColor: tenantConfig?.theme.primaryColor || '#47abc4',
          }}
          onMouseEnter={(e) => {
            if (tenantConfig?.theme.secondaryColor) {
              e.currentTarget.style.backgroundColor = tenantConfig.theme.secondaryColor
            } else {
              e.currentTarget.style.backgroundColor = '#3a9bb3' // Same hover as Create Booking button
            }
          }}
          onMouseLeave={(e) => {
            if (tenantConfig?.theme.primaryColor) {
              e.currentTarget.style.backgroundColor = tenantConfig.theme.primaryColor
            } else {
              e.currentTarget.style.backgroundColor = '#47abc4' // Same as Create Booking button
            }
          }}
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </div>
          ) : (
            'Save Booking'
          )}
        </Button>
      </div>
    </form>
  )
}