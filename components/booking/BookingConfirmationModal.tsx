'use client'

import React from 'react'
import { X, CheckCircle, Clock, Mail, Calendar, User, MapPin } from 'lucide-react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useTenant } from '@/components/tenant/TenantProvider'
import { cn } from '@/lib/utils'

interface BookingConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  booking: {
    id: string
    title: string
    start_time: string
    end_time: string
    status: string
    location: string
    user_name: string
    user_email: string
    description?: string
    organizations: {
      name: string
    }
  }
  className?: string
}

export function BookingConfirmationModal({
  isOpen,
  onClose,
  booking,
  className
}: BookingConfirmationModalProps) {
  const { tenantConfig } = useTenant()
  
  if (!isOpen) return null

  const startTime = new Date(booking.start_time)
  const endTime = new Date(booking.end_time)
  const duration = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60))

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4" />
      case 'pending': return <Clock className="w-4 h-4" />
      case 'cancelled': return <X className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'confirmed': 
        return {
          title: 'Booking Confirmed!',
          message: 'Your booking has been approved and confirmed. You can expect to receive a calendar invitation shortly.'
        }
      case 'pending':
        return {
          title: 'Booking Request Submitted!',
          message: 'Your booking request has been submitted and is pending approval. Our staff will review your request and notify you of the decision via email.'
        }
      case 'cancelled':
        return {
          title: 'Booking Cancelled',
          message: 'Your booking has been cancelled. If you need to reschedule, please create a new booking request.'
        }
      default:
        return {
          title: 'Booking Status Updated',
          message: 'Your booking status has been updated. Please check your email for more details.'
        }
    }
  }

  const statusInfo = getStatusMessage(booking.status)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={cn(
        "relative w-full max-w-2xl mx-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl",
        "max-h-[90vh] overflow-y-auto",
        className
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full" style={{ backgroundColor: tenantConfig?.theme.primaryColor + '20' }}>
              {getStatusIcon(booking.status)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {statusInfo.title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {booking.organizations.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Message */}
          <div className="text-center">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {statusInfo.message}
            </p>
            <Badge className={cn("px-4 py-2 text-sm font-medium", getStatusColor(booking.status))}>
              {getStatusIcon(booking.status)}
              <span className="ml-2 capitalize">{booking.status}</span>
            </Badge>
          </div>

          {/* Booking Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Booking Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Date</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {format(startTime, 'EEEE, MMMM d, yyyy')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Time</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {format(startTime, 'h:mm a')} - {format(endTime, 'h:mm a')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Service</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {booking.title}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Location</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {booking.location}
                    </p>
                  </div>
                </div>
              </div>
              
              {booking.description && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Description</p>
                  <p className="text-gray-900 dark:text-white">{booking.description}</p>
                </div>
              )}
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Duration</p>
                <p className="font-medium text-gray-900 dark:text-white">{duration} minutes</p>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          {booking.status === 'pending' && (
            <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/10">
              <CardContent className="p-6">
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-3">
                  What happens next?
                </h3>
                <ul className="space-y-2 text-sm text-yellow-700 dark:text-yellow-300">
                  <li className="flex items-start gap-2">
                    <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>You'll receive an email confirmation at <strong>{booking.user_email}</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Our staff will review your request within 24 hours</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>You'll be notified of approval, denial, or rescheduling via email</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Contact Information */}
          <Card className="bg-gray-50 dark:bg-gray-800">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Need help?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                If you have any questions about your booking or need to make changes, please contact us:
              </p>
              <div className="space-y-2 text-sm">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Email:</strong> digilab@oolitearts.org
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Close
            </Button>
            <Button
              onClick={() => {
                // In a real app, this would open the user's email client
                window.open(`mailto:digilab@oolitearts.org?subject=Booking Question - ${booking.title}&body=Hi, I have a question about my booking (ID: ${booking.id}).`, '_blank')
              }}
              className="flex-1 text-white border-0"
              style={{
                backgroundColor: tenantConfig?.theme.primaryColor || '#47abc4',
                borderColor: tenantConfig?.theme.primaryColor || '#47abc4',
              }}
            >
              <Mail className="w-4 h-4 mr-2" />
              Contact Staff
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
