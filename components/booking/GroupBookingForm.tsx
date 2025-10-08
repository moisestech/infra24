'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, Users, Settings, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

const groupBookingFormSchema = z.object({
  resourceId: z.string().min(1, 'Please select a resource'),
  title: z.string().min(1, 'Please enter a title'),
  description: z.string().optional(),
  startTime: z.string().min(1, 'Please select a start time'),
  endTime: z.string().min(1, 'Please select an end time'),
  capacity: z.number().min(1).max(100),
  groupBookingType: z.enum(['public', 'private', 'invite_only']),
  waitlistEnabled: z.boolean(),
  price: z.number().min(0),
  location: z.string().optional(),
})

type GroupBookingFormData = z.infer<typeof groupBookingFormSchema>

interface Resource {
  id: string
  name: string
  type: string
  description?: string
}

interface GroupBookingFormProps {
  organizationId: string
  resources: Resource[]
  onBookingCreated?: (bookingId: string) => void
  className?: string
}

export function GroupBookingForm({
  organizationId,
  resources,
  onBookingCreated,
  className = ''
}: GroupBookingFormProps) {
  const [isCreating, setIsCreating] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm<GroupBookingFormData>({
    resolver: zodResolver(groupBookingFormSchema),
    defaultValues: {
      capacity: 10,
      groupBookingType: 'public',
      waitlistEnabled: false,
      price: 0,
    }
  })

  const watchedResourceId = watch('resourceId')
  const watchedCapacity = watch('capacity')
  const watchedGroupBookingType = watch('groupBookingType')
  const watchedWaitlistEnabled = watch('waitlistEnabled')

  const selectedResource = resources.find(r => r.id === watchedResourceId)

  const onSubmit = async (data: GroupBookingFormData) => {
    if (!selectedResource) {
      toast.error('Please select a resource')
      return
    }

    setIsCreating(true)

    try {
      const response = await fetch('/api/group-bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          organizationId,
          resourceId: data.resourceId,
          resourceType: selectedResource.type,
          title: data.title,
          description: data.description,
          startTime: data.startTime,
          endTime: data.endTime,
          capacity: data.capacity,
          groupBookingType: data.groupBookingType,
          waitlistEnabled: data.waitlistEnabled,
          price: data.price,
          location: data.location,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create group booking')
      }

      toast.success('Group booking created successfully!')
      onBookingCreated?.(result.bookingId)
    } catch (error) {
      console.error('Group booking creation error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create group booking')
    } finally {
      setIsCreating(false)
    }
  }

  const getBookingTypeColor = (type: string) => {
    switch (type) {
      case 'public':
        return 'bg-green-100 text-green-800'
      case 'private':
        return 'bg-blue-100 text-blue-800'
      case 'invite_only':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getBookingTypeDescription = (type: string) => {
    switch (type) {
      case 'public':
        return 'Anyone can join this group booking'
      case 'private':
        return 'Only invited participants can join'
      case 'invite_only':
        return 'Participants must be invited to join'
      default:
        return ''
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Create Group Booking
          </CardTitle>
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
                <Badge variant="outline">{selectedResource.type}</Badge>
              </div>
            )}

            {/* Booking Details */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Photography Workshop, Studio Session"
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
                placeholder="Describe what participants will learn or do..."
                {...register('description')}
              />
            </div>

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

            {/* Capacity */}
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity *</Label>
              <Input
                id="capacity"
                type="number"
                min="1"
                max="100"
                {...register('capacity', { valueAsNumber: true })}
              />
              {errors.capacity && (
                <p className="text-sm text-red-600">{errors.capacity.message}</p>
              )}
              <p className="text-sm text-gray-600">
                Maximum number of participants for this group booking
              </p>
            </div>

            {/* Group Booking Type */}
            <div className="space-y-2">
              <Label>Booking Type</Label>
              <Select 
                value={watchedGroupBookingType} 
                onValueChange={(value: 'public' | 'private' | 'invite_only') => setValue('groupBookingType', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-800">Public</Badge>
                      <span>Anyone can join</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="private">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-100 text-blue-800">Private</Badge>
                      <span>Invited participants only</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="invite_only">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-purple-100 text-purple-800">Invite Only</Badge>
                      <span>Must be invited to join</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-600">
                {getBookingTypeDescription(watchedGroupBookingType)}
              </p>
            </div>

            {/* Waitlist Toggle */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="space-y-1">
                <Label htmlFor="waitlistEnabled">Enable Waitlist</Label>
                <p className="text-sm text-gray-600">
                  Allow participants to join a waitlist when fully booked
                </p>
              </div>
              <Switch
                id="waitlistEnabled"
                checked={watchedWaitlistEnabled}
                onCheckedChange={(checked) => setValue('waitlistEnabled', checked)}
              />
            </div>

            {/* Pricing */}
            <div className="space-y-2">
              <Label htmlFor="price">Price per Person (USD)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                {...register('price', { valueAsNumber: true })}
              />
              <p className="text-sm text-gray-600">
                Set to $0 for free group bookings
              </p>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g., Studio A, Conference Room, Online"
                {...register('location')}
              />
            </div>

            {/* Booking Summary */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Booking Summary</h4>
              <div className="space-y-1 text-sm text-blue-800">
                <div className="flex justify-between">
                  <span>Type:</span>
                  <Badge className={getBookingTypeColor(watchedGroupBookingType)}>
                    {watchedGroupBookingType === 'public' ? 'Public' : 
                     watchedGroupBookingType === 'private' ? 'Private' : 'Invite Only'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Capacity:</span>
                  <span>{watchedCapacity} participants</span>
                </div>
                <div className="flex justify-between">
                  <span>Waitlist:</span>
                  <span>{watchedWaitlistEnabled ? 'Enabled' : 'Disabled'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Price:</span>
                  <span>${watchedCapacity * (watch('price') || 0)} total</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!isValid || isCreating}
              className="w-full"
              size="lg"
            >
              {isCreating ? 'Creating Group Booking...' : 'Create Group Booking'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
