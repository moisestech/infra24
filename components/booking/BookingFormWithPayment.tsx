'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, Clock, Users, CreditCard, AlertCircle, CheckCircle } from 'lucide-react'
import { PaymentButton } from './PaymentButton'
import { useAuth, useUser } from '@clerk/nextjs'
import { toast } from 'sonner'

const bookingFormSchema = z.object({
  resourceId: z.string().min(1, 'Please select a resource'),
  startTime: z.string().min(1, 'Please select a start time'),
  endTime: z.string().min(1, 'Please select an end time'),
  title: z.string().min(1, 'Please enter a title'),
  description: z.string().optional(),
  contactEmail: z.string().email('Please enter a valid email'),
  contactPhone: z.string().optional(),
  notes: z.string().optional(),
  participantCount: z.number().min(1).max(20),
})

type BookingFormData = z.infer<typeof bookingFormSchema>

interface Resource {
  id: string
  name: string
  type: string
  capacity: number
  pricing_rules: Record<string, number>
  free_for_roles: string[]
  description?: string
}

interface BookingFormWithPaymentProps {
  organizationId: string
  resources: Resource[]
  onBookingCreated?: (bookingId: string) => void
  className?: string
}

export function BookingFormWithPayment({
  organizationId,
  resources,
  onBookingCreated,
  className = ''
}: BookingFormWithPaymentProps) {
  const { isSignedIn } = useAuth()
  const { user } = useUser()
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
  const [userRole, setUserRole] = useState<string>('public')
  const [calculatedPrice, setCalculatedPrice] = useState<number>(0)
  const [isFree, setIsFree] = useState(false)
  const [createdBookingId, setCreatedBookingId] = useState<string | null>(null)
  const [isCreatingBooking, setIsCreatingBooking] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      participantCount: 1,
      contactEmail: user?.emailAddresses?.[0]?.emailAddress || '',
    }
  })

  const watchedResourceId = watch('resourceId')
  const watchedParticipantCount = watch('participantCount')

  // Update selected resource when resource ID changes
  useEffect(() => {
    if (watchedResourceId) {
      const resource = resources.find(r => r.id === watchedResourceId)
      setSelectedResource(resource || null)
    }
  }, [watchedResourceId, resources])

  // Calculate pricing when resource or participant count changes
  useEffect(() => {
    if (selectedResource && userRole) {
      const pricingRules = selectedResource.pricing_rules || {}
      const freeForRoles = selectedResource.free_for_roles || []
      
      // Check if user role gets free access
      if (freeForRoles.includes(userRole)) {
        setCalculatedPrice(0)
        setIsFree(true)
      } else if (pricingRules[userRole] !== undefined) {
        const basePrice = pricingRules[userRole]
        setCalculatedPrice(basePrice * watchedParticipantCount)
        setIsFree(false)
      } else {
        // Default pricing (would need to be set in resource)
        setCalculatedPrice(50 * watchedParticipantCount) // Default $50 per person
        setIsFree(false)
      }
    }
  }, [selectedResource, userRole, watchedParticipantCount])

  // Get user role on component mount
  useEffect(() => {
    if (isSignedIn && user) {
      // In a real app, you'd fetch this from your API
      // For now, we'll use a mock role based on user metadata
      const mockRole = user.publicMetadata?.role as string || 'public'
      setUserRole(mockRole)
    }
  }, [isSignedIn, user])

  const onSubmit = async (data: BookingFormData) => {
    if (!selectedResource) {
      toast.error('Please select a resource')
      return
    }

    setIsCreatingBooking(true)

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          organization_id: organizationId,
          resource_type: selectedResource.type,
          resource_id: selectedResource.id,
          title: data.title,
          description: data.description,
          start_time: data.startTime,
          end_time: data.endTime,
          capacity: selectedResource.capacity,
          current_participants: data.participantCount,
          price: calculatedPrice,
          currency: 'USD',
          location: 'TBD', // Would be set based on resource
          contact_email: data.contactEmail,
          contact_phone: data.contactPhone,
          notes: data.notes,
          payment_required: !isFree,
          payment_amount: calculatedPrice,
          payment_status: isFree ? 'paid' : 'pending',
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create booking')
      }

      setCreatedBookingId(result.booking.id)
      toast.success('Booking created successfully!')
      onBookingCreated?.(result.booking.id)
    } catch (error) {
      console.error('Booking creation error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create booking')
    } finally {
      setIsCreatingBooking(false)
    }
  }

  if (createdBookingId) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Booking Created Successfully
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Your booking has been created. Complete your payment to confirm your reservation.
            </p>
            <PaymentButton
              bookingId={createdBookingId}
              amount={calculatedPrice}
              userRole={userRole}
              isFree={isFree}
              resourceName={selectedResource?.name}
            />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle>Create New Booking</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Resource Selection */}
            <div className="space-y-2">
              <Label htmlFor="resourceId">Resource *</Label>
              <Select onValueChange={(value) => setValue('resourceId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a resource" />
                </SelectTrigger>
                <SelectContent>
                  {resources.map((resource) => (
                    <SelectItem key={resource.id} value={resource.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{resource.name}</span>
                        <Badge variant="outline" className="ml-2">
                          {resource.type}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.resourceId && (
                <p className="text-sm text-red-600">{errors.resourceId.message}</p>
              )}
            </div>

            {/* Resource Details */}
            {selectedResource && (
              <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                <h4 className="font-medium">{selectedResource.name}</h4>
                {selectedResource.description && (
                  <p className="text-sm text-gray-600">{selectedResource.description}</p>
                )}
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    Capacity: {selectedResource.capacity}
                  </div>
                  <div className="flex items-center gap-1">
                    <CreditCard className="w-4 h-4" />
                    {isFree ? 'FREE' : `From $${calculatedPrice}`}
                  </div>
                </div>
              </div>
            )}

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time *</Label>
                <Input
                  id="startTime"
                  type="datetime-local"
                  {...register('startTime')}
                />
                {errors.startTime && (
                  <p className="text-sm text-red-600">{errors.startTime.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time *</Label>
                <Input
                  id="endTime"
                  type="datetime-local"
                  {...register('endTime')}
                />
                {errors.endTime && (
                  <p className="text-sm text-red-600">{errors.endTime.message}</p>
                )}
              </div>
            </div>

            {/* Participant Count */}
            <div className="space-y-2">
              <Label htmlFor="participantCount">Number of Participants</Label>
              <Input
                id="participantCount"
                type="number"
                min="1"
                max={selectedResource?.capacity || 20}
                {...register('participantCount', { valueAsNumber: true })}
              />
              {errors.participantCount && (
                <p className="text-sm text-red-600">{errors.participantCount.message}</p>
              )}
            </div>

            {/* Booking Details */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Studio Visit, Equipment Training"
                {...register('title')}
              />
              {errors.title && (
                <p className="text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what you'd like to accomplish..."
                {...register('description')}
              />
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  {...register('contactEmail')}
                />
                {errors.contactEmail && (
                  <p className="text-sm text-red-600">{errors.contactEmail.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  {...register('contactPhone')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any special requirements or notes..."
                {...register('notes')}
              />
            </div>

            {/* Pricing Summary */}
            {selectedResource && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Pricing Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Your Role:</span>
                    <Badge className="bg-blue-100 text-blue-800">
                      {userRole === 'resident_artist' ? 'Resident Artist' : 
                       userRole === 'staff' ? 'Staff' : 
                       userRole === 'member' ? 'Member' : 'Public'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Participants:</span>
                    <span>{watchedParticipantCount}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Total:</span>
                    <span className={isFree ? 'text-green-600' : 'text-blue-900'}>
                      {isFree ? 'FREE' : `$${calculatedPrice}`}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!isValid || isCreatingBooking}
              className="w-full"
              size="lg"
            >
              {isCreatingBooking ? 'Creating Booking...' : 'Create Booking'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
