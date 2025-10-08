'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Users, Clock, MapPin, Calendar, UserPlus, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'

interface GroupBookingCardProps {
  booking: {
    id: string
    title: string
    description?: string
    startTime: string
    endTime: string
    capacity: number
    currentParticipants: number
    availableSpots: number
    price: number
    location?: string
    groupBookingType: 'public' | 'private' | 'invite_only'
    waitlistEnabled: boolean
    resources?: {
      name: string
      type: string
    }
  }
  onJoinBooking?: (bookingId: string) => void
  onViewDetails?: (bookingId: string) => void
  className?: string
}

export function GroupBookingCard({
  booking,
  onJoinBooking,
  onViewDetails,
  className = ''
}: GroupBookingCardProps) {
  const [isJoining, setIsJoining] = useState(false)

  const handleJoinBooking = async () => {
    if (!onJoinBooking) return
    
    setIsJoining(true)
    try {
      await onJoinBooking(booking.id)
    } finally {
      setIsJoining(false)
    }
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
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

  const getBookingTypeLabel = (type: string) => {
    switch (type) {
      case 'public':
        return 'Public'
      case 'private':
        return 'Private'
      case 'invite_only':
        return 'Invite Only'
      default:
        return 'Unknown'
    }
  }

  const isFullyBooked = booking.availableSpots <= 0
  const isAlmostFull = booking.availableSpots <= 2
  const progressPercentage = (booking.currentParticipants / booking.capacity) * 100

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-lg">{booking.title}</CardTitle>
            {booking.description && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {booking.description}
              </p>
            )}
          </div>
          <Badge className={getBookingTypeColor(booking.groupBookingType)}>
            {getBookingTypeLabel(booking.groupBookingType)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Booking Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span>{format(new Date(booking.startTime), 'MMM dd, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span>
              {format(new Date(booking.startTime), 'h:mm a')} - {format(new Date(booking.endTime), 'h:mm a')}
            </span>
          </div>
          {booking.location && (
            <div className="flex items-center gap-2 col-span-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span>{booking.location}</span>
            </div>
          )}
        </div>

        {/* Resource Information */}
        {booking.resources && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">{booking.resources.name}</span>
              <Badge variant="outline" className="text-xs">
                {booking.resources.type}
              </Badge>
            </div>
          </div>
        )}

        {/* Capacity and Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span>
                {booking.currentParticipants} of {booking.capacity} participants
              </span>
            </div>
            <span className={`font-medium ${
              isFullyBooked ? 'text-red-600' : 
              isAlmostFull ? 'text-orange-600' : 
              'text-green-600'
            }`}>
              {booking.availableSpots} spots left
            </span>
          </div>
          
          <Progress 
            value={progressPercentage} 
            className="h-2"
          />
        </div>

        {/* Pricing */}
        {booking.price > 0 && (
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <span className="text-sm text-blue-800">Price per person:</span>
            <span className="font-semibold text-blue-900">
              {formatAmount(booking.price)}
            </span>
          </div>
        )}

        {/* Waitlist Notice */}
        {isFullyBooked && booking.waitlistEnabled && (
          <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <AlertCircle className="w-4 h-4 text-orange-600" />
            <span className="text-sm text-orange-800">
              Fully booked, but waitlist is available
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {onViewDetails && (
            <Button
              variant="outline"
              onClick={() => onViewDetails(booking.id)}
              className="flex-1"
            >
              View Details
            </Button>
          )}
          
          {onJoinBooking && (
            <Button
              onClick={handleJoinBooking}
              disabled={isJoining || (isFullyBooked && !booking.waitlistEnabled)}
              className="flex-1"
            >
              {isJoining ? (
                'Joining...'
              ) : isFullyBooked && booking.waitlistEnabled ? (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Join Waitlist
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Join Booking
                </>
              )}
            </Button>
          )}
        </div>

        {/* Booking Type Restrictions */}
        {booking.groupBookingType === 'invite_only' && (
          <div className="flex items-center gap-2 p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <AlertCircle className="w-4 h-4 text-purple-600" />
            <span className="text-sm text-purple-800">
              This is an invite-only booking
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
