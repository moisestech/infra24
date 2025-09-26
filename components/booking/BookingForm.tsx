'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CalendarIcon, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

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

interface Resource {
  id: string
  title: string
  type: 'space' | 'equipment' | 'person'
  capacity: number
}

interface Booking {
  id: string
  resource_id: string
  title: string
  description?: string
  start_time: Date
  end_time: Date
  status: 'pending' | 'confirmed' | 'cancelled'
  created_by_clerk_id: string
}

interface BookingFormProps {
  resources: Resource[]
  onSubmit: (data: Omit<Booking, 'id' | 'created_by_clerk_id'>) => Promise<void>
  onCancel: () => void
  initialData?: Partial<Booking>
  isLoading?: boolean
}

export function BookingForm({ 
  resources, 
  onSubmit, 
  onCancel, 
  initialData,
  isLoading = false 
}: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      resourceId: initialData?.resource_id || '',
      startDate: initialData?.start_time ? new Date(initialData.start_time) : new Date(),
      startTime: initialData?.start_time ? format(new Date(initialData.start_time), 'HH:mm') : '09:00',
      endDate: initialData?.end_time ? new Date(initialData.end_time) : new Date(),
      endTime: initialData?.end_time ? format(new Date(initialData.end_time), 'HH:mm') : '10:00',
      status: (initialData?.status as 'pending' | 'confirmed' | 'cancelled') || 'pending'
    }
  })

  const handleSubmit = async (data: BookingFormData) => {
    try {
      setIsSubmitting(true)
      
      // Combine date and time
      const startDateTime = new Date(`${format(data.startDate, 'yyyy-MM-dd')}T${data.startTime}`)
      const endDateTime = new Date(`${format(data.endDate, 'yyyy-MM-dd')}T${data.endTime}`)

      const bookingData: Omit<Booking, 'id' | 'created_by_clerk_id'> = {
        resource_id: data.resourceId,
        title: data.title,
        description: data.description,
        start_time: startDateTime,
        end_time: endDateTime,
        status: data.status
      }

      await onSubmit(bookingData)
    } catch (error) {
      console.error('Error submitting booking:', error)
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="md:col-span-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Booking Title *
          </label>
          <Input
            id="title"
            {...form.register('title')}
            placeholder="e.g., Team Meeting, Workshop Session"
            className={cn(form.formState.errors.title && 'border-red-500')}
          />
          {form.formState.errors.title && (
            <p className="mt-1 text-sm text-red-600">{form.formState.errors.title.message}</p>
          )}
        </div>

        {/* Resource Selection */}
        <div>
          <label htmlFor="resourceId" className="block text-sm font-medium text-gray-700 mb-2">
            Resource *
          </label>
          <Select
            value={form.watch('resourceId')}
            onValueChange={(value) => form.setValue('resourceId', value)}
          >
            <SelectTrigger className={cn(form.formState.errors.resourceId && 'border-red-500')}>
              <SelectValue placeholder="Select a resource" />
            </SelectTrigger>
            <SelectContent>
              {resources.map((resource) => (
                <SelectItem key={resource.id} value={resource.id}>
                  <div className="flex items-center justify-between w-full">
                    <span>{resource.title}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      ({resource.type} - {resource.capacity} capacity)
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.resourceId && (
            <p className="mt-1 text-sm text-red-600">{form.formState.errors.resourceId.message}</p>
          )}
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <Select
            value={form.watch('status')}
            onValueChange={(value: 'pending' | 'confirmed' | 'cancelled') => form.setValue('status', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Start Date */}
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
            Start Date *
          </label>
          <Input
            type="date"
            {...form.register('startDate', { 
              setValueAs: (value) => value ? new Date(value) : new Date()
            })}
            className={cn(form.formState.errors.startDate && 'border-red-500')}
          />
          {form.formState.errors.startDate && (
            <p className="mt-1 text-sm text-red-600">{form.formState.errors.startDate.message}</p>
          )}
        </div>

        {/* Start Time */}
        <div>
          <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-2">
            Start Time *
          </label>
          <Select
            value={form.watch('startTime')}
            onValueChange={(value) => form.setValue('startTime', value)}
          >
            <SelectTrigger className={cn(form.formState.errors.startTime && 'border-red-500')}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeOptions.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.startTime && (
            <p className="mt-1 text-sm text-red-600">{form.formState.errors.startTime.message}</p>
          )}
        </div>

        {/* End Date */}
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
            End Date *
          </label>
          <Input
            type="date"
            {...form.register('endDate', { 
              setValueAs: (value) => value ? new Date(value) : new Date()
            })}
            className={cn(form.formState.errors.endDate && 'border-red-500')}
          />
          {form.formState.errors.endDate && (
            <p className="mt-1 text-sm text-red-600">{form.formState.errors.endDate.message}</p>
          )}
        </div>

        {/* End Time */}
        <div>
          <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-2">
            End Time *
          </label>
          <Select
            value={form.watch('endTime')}
            onValueChange={(value) => form.setValue('endTime', value)}
          >
            <SelectTrigger className={cn(form.formState.errors.endTime && 'border-red-500')}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeOptions.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.endTime && (
            <p className="mt-1 text-sm text-red-600">{form.formState.errors.endTime.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <Textarea
            id="description"
            {...form.register('description')}
            placeholder="Optional description for this booking"
            rows={3}
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
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="min-w-[120px]"
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