'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CalendarIcon, Clock, User } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

// Validation schema for artist bookings
const artistBookingSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().optional(),
  startDate: z.date({
    message: 'Start date is required'
  }),
  startTime: z.string().min(1, 'Start time is required'),
  endDate: z.date({
    message: 'End date is required'
  }),
  endTime: z.string().min(1, 'End time is required'),
  meetingType: z.enum(['consultation', 'collaboration', 'mentorship', 'workshop', 'other']),
  contactMethod: z.enum(['in-person', 'video-call', 'phone', 'email']),
  bookerName: z.string().min(1, 'Your name is required'),
  bookerEmail: z.string().email('Valid email is required'),
  bookerPhone: z.string().optional()
}).refine((data) => {
  // Check if end date/time is after start date/time
  const startDateTime = new Date(`${format(data.startDate, 'yyyy-MM-dd')}T${data.startTime}`)
  const endDateTime = new Date(`${format(data.endDate, 'yyyy-MM-dd')}T${data.endTime}`)
  return endDateTime > startDateTime
}, {
  message: 'End time must be after start time',
  path: ['endTime']
})

type ArtistBookingFormData = z.infer<typeof artistBookingSchema>

interface ArtistBookingFormProps {
  organizationId: string
  artistId: string
  artistName: string
  onSubmit: (data: any) => Promise<void>
  onCancel: () => void
  initialData?: Partial<ArtistBookingFormData>
  isLoading?: boolean
}

export function ArtistBookingForm({ 
  organizationId,
  artistId,
  artistName,
  onSubmit, 
  onCancel,
  initialData,
  isLoading = false 
}: ArtistBookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  console.log('🔍 ArtistBookingForm: Creating booking for artist:', artistName, 'ID:', artistId)

  const form = useForm<ArtistBookingFormData>({
    resolver: zodResolver(artistBookingSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      startDate: initialData?.startDate || new Date(),
      startTime: initialData?.startTime || '09:00',
      endDate: initialData?.endDate || new Date(),
      endTime: initialData?.endTime || '10:00',
      meetingType: initialData?.meetingType || 'consultation',
      contactMethod: initialData?.contactMethod || 'in-person',
      bookerName: initialData?.bookerName || '',
      bookerEmail: initialData?.bookerEmail || '',
      bookerPhone: initialData?.bookerPhone || ''
    }
  })

  const handleSubmit = async (data: ArtistBookingFormData) => {
    try {
      console.log('🔍 ArtistBookingForm: Submitting booking data:', data)
      setIsSubmitting(true)
      
      // Combine date and time
      const startDateTime = new Date(`${format(data.startDate, 'yyyy-MM-dd')}T${data.startTime}`)
      const endDateTime = new Date(`${format(data.endDate, 'yyyy-MM-dd')}T${data.endTime}`)

      const bookingData = {
        organizationId,
        artistId,
        title: data.title,
        description: data.description,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        meetingType: data.meetingType,
        contactMethod: data.contactMethod,
        bookerName: data.bookerName,
        bookerEmail: data.bookerEmail,
        bookerPhone: data.bookerPhone,
        status: 'pending'
      }

      console.log('🔍 ArtistBookingForm: Final booking data:', bookingData)
      await onSubmit(bookingData)
    } catch (error) {
      console.error('❌ ArtistBookingForm: Error submitting booking:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const generateTimeOptions = () => {
    const times = []
    for (let hour = 8; hour <= 20; hour++) {
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
      {/* Artist Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <div>
            <h3 className="font-medium text-blue-900 dark:text-blue-100">Booking with {artistName}</h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">Schedule time to meet with this artist</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="md:col-span-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Meeting Title *
          </label>
          <Input
            id="title"
            {...form.register('title')}
            placeholder="e.g., Art Consultation, Collaboration Discussion"
            className={cn(form.formState.errors.title && 'border-red-500')}
          />
          {form.formState.errors.title && (
            <p className="mt-1 text-sm text-red-600">{form.formState.errors.title.message}</p>
          )}
        </div>

        {/* Meeting Type */}
        <div>
          <label htmlFor="meetingType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Meeting Type *
          </label>
          <Select
            value={form.watch('meetingType')}
            onValueChange={(value) => form.setValue('meetingType', value as any)}
          >
            <SelectTrigger className={cn(form.formState.errors.meetingType && 'border-red-500')}>
              <SelectValue placeholder="Select meeting type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="consultation">Consultation</SelectItem>
              <SelectItem value="collaboration">Collaboration</SelectItem>
              <SelectItem value="mentorship">Mentorship</SelectItem>
              <SelectItem value="workshop">Workshop</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.meetingType && (
            <p className="mt-1 text-sm text-red-600">{form.formState.errors.meetingType.message}</p>
          )}
        </div>

        {/* Contact Method */}
        <div>
          <label htmlFor="contactMethod" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Meeting Method *
          </label>
          <Select
            value={form.watch('contactMethod')}
            onValueChange={(value) => form.setValue('contactMethod', value as any)}
          >
            <SelectTrigger className={cn(form.formState.errors.contactMethod && 'border-red-500')}>
              <SelectValue placeholder="Select meeting method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="in-person">In-Person</SelectItem>
              <SelectItem value="video-call">Video Call</SelectItem>
              <SelectItem value="phone">Phone Call</SelectItem>
              <SelectItem value="email">Email Discussion</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.contactMethod && (
            <p className="mt-1 text-sm text-red-600">{form.formState.errors.contactMethod.message}</p>
          )}
        </div>

        {/* Start Date */}
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Start Date *
          </label>
          <Input
            id="startDate"
            type="date"
            {...form.register('startDate', { valueAsDate: true })}
            className={cn(form.formState.errors.startDate && 'border-red-500')}
          />
          {form.formState.errors.startDate && (
            <p className="mt-1 text-sm text-red-600">{form.formState.errors.startDate.message}</p>
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
            <SelectTrigger className={cn(form.formState.errors.startTime && 'border-red-500')}>
              <SelectValue placeholder="Select start time" />
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
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            End Date *
          </label>
          <Input
            id="endDate"
            type="date"
            {...form.register('endDate', { valueAsDate: true })}
            className={cn(form.formState.errors.endDate && 'border-red-500')}
          />
          {form.formState.errors.endDate && (
            <p className="mt-1 text-sm text-red-600">{form.formState.errors.endDate.message}</p>
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
            <SelectTrigger className={cn(form.formState.errors.endTime && 'border-red-500')}>
              <SelectValue placeholder="Select end time" />
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

        {/* Booker Name */}
        <div>
          <label htmlFor="bookerName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Your Name *
          </label>
          <Input
            id="bookerName"
            {...form.register('bookerName')}
            placeholder="Enter your full name"
            className={cn(form.formState.errors.bookerName && 'border-red-500')}
          />
          {form.formState.errors.bookerName && (
            <p className="mt-1 text-sm text-red-600">{form.formState.errors.bookerName.message}</p>
          )}
        </div>

        {/* Booker Email */}
        <div>
          <label htmlFor="bookerEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Your Email *
          </label>
          <Input
            id="bookerEmail"
            type="email"
            {...form.register('bookerEmail')}
            placeholder="Enter your email address"
            className={cn(form.formState.errors.bookerEmail && 'border-red-500')}
          />
          {form.formState.errors.bookerEmail && (
            <p className="mt-1 text-sm text-red-600">{form.formState.errors.bookerEmail.message}</p>
          )}
        </div>

        {/* Booker Phone */}
        <div className="md:col-span-2">
          <label htmlFor="bookerPhone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Your Phone (Optional)
          </label>
          <Input
            id="bookerPhone"
            type="tel"
            {...form.register('bookerPhone')}
            placeholder="Enter your phone number"
            className={cn(form.formState.errors.bookerPhone && 'border-red-500')}
          />
          {form.formState.errors.bookerPhone && (
            <p className="mt-1 text-sm text-red-600">{form.formState.errors.bookerPhone.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Additional Notes
          </label>
          <Textarea
            id="description"
            {...form.register('description')}
            placeholder="Describe what you'd like to discuss or any special requirements..."
            rows={4}
            className={cn(form.formState.errors.description && 'border-red-500')}
          />
          {form.formState.errors.description && (
            <p className="mt-1 text-sm text-red-600">{form.formState.errors.description.message}</p>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isSubmitting ? (
            <>
              <Clock className="w-4 h-4 mr-2 animate-spin" />
              Creating Booking...
            </>
          ) : (
            <>
              <CalendarIcon className="w-4 h-4 mr-2" />
              Create Booking
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
