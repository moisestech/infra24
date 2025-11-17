'use client'

import React, { useState } from 'react'
import { X, Plus, User, Clock, DollarSign } from 'lucide-react'
import { format, addMinutes } from 'date-fns'
import { Button } from '@/components/ui/button'
import { HorizontalDatePicker } from './HorizontalDatePicker'
import { TimeSlotSelector, TimeSlot } from './TimeSlotSelector'
import { BookingTypeSelector, BookingType } from './BookingTypeSelector'
import { useTenant } from '@/components/tenant/TenantProvider'
import { cn } from '@/lib/utils'

interface Service {
  id: string
  name: string
  price: number
  duration: number // in minutes
  description?: string
}

interface Staff {
  id: string
  name: string
  available: boolean
}

interface StreamlinedBookingModalProps {
  isOpen: boolean
  onClose: () => void
  onBookingCreate: (bookingData: any) => Promise<void>
  services: Service[]
  staff: Staff[]
  availableDates?: Date[]
  availableSlots?: TimeSlot[]
  bookingType?: BookingType
  onBookingTypeChange?: (type: BookingType) => void
  className?: string
}

export function StreamlinedBookingModal({
  isOpen,
  onClose,
  onBookingCreate,
  services,
  staff,
  availableDates = [],
  availableSlots = [],
  bookingType = 'equipment',
  onBookingTypeChange,
  className
}: StreamlinedBookingModalProps) {
  const { tenantConfig } = useTenant()
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  
  // Debug logging for date selection
  React.useEffect(() => {
    console.log('🔍 StreamlinedBookingModal: selectedDate changed:', selectedDate)
  }, [selectedDate])
  
  // Wrapper function for date selection with debug logging
  const handleDateSelect = (date: Date) => {
    console.log('🔍 StreamlinedBookingModal: Date selected:', date)
    setSelectedDate(date)
  }
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [selectedService, setSelectedService] = useState<Service | null>(services[0] || null)
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Reset selected service when services change (e.g., booking type changes)
  React.useEffect(() => {
    console.log('🔍 StreamlinedBookingModal: Services changed:', services)
    console.log('🔍 StreamlinedBookingModal: Current selectedService:', selectedService)
    
    if (services.length > 0 && (!selectedService || !services.find(s => s.id === selectedService.id))) {
      console.log('🔍 StreamlinedBookingModal: Setting selectedService to:', services[0])
      setSelectedService(services[0])
    }
  }, [services, selectedService])

  // Debug logging for component state
  React.useEffect(() => {
    console.log('🔍 StreamlinedBookingModal: Component state:', {
      isOpen,
      services: services.length,
      selectedService,
      selectedDate,
      selectedTime,
      availableSlots: availableSlots.length
    })
  }, [isOpen, services, selectedService, selectedDate, selectedTime, availableSlots])

  // Calculate end time based on service duration
  const getEndTime = () => {
    if (!selectedTime || !selectedService) return null
    const [hours, minutes] = selectedTime.split(':').map(Number)
    const startDateTime = new Date()
    startDateTime.setHours(hours, minutes, 0, 0)
    return addMinutes(startDateTime, selectedService.duration)
  }

  // Calculate total price
  const getTotalPrice = () => {
    return selectedService?.price || 0
  }

  // Get total duration
  const getTotalDuration = () => {
    return selectedService?.duration || 0
  }

  // Handle booking submission
  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || !selectedService) return

    try {
      setIsSubmitting(true)
      
      const endTime = getEndTime()
      const bookingData = {
        date: selectedDate,
        startTime: selectedTime,
        endTime: endTime,
        service: selectedService,
        staff: selectedStaff,
        totalPrice: getTotalPrice(),
        duration: getTotalDuration()
      }

      await onBookingCreate(bookingData)
      onClose()
    } catch (error) {
      console.error('Error creating booking:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Check if form is complete
  const isFormComplete = selectedDate && selectedTime && selectedService

  if (!isOpen) return null

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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {selectedDate ? format(selectedDate, 'MMMM yyyy') : 'Book Appointment'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Debug Info */}
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-sm">
              <div className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Debug Info:</div>
              <div className="text-yellow-700 dark:text-yellow-300 space-y-1">
                <div>Services: {services.length}</div>
                <div>Selected Service: {selectedService?.name || 'None'}</div>
                <div>Available Dates: {availableDates.length}</div>
                <div>Available Slots: {availableSlots.length}</div>
              </div>
            </div>
          )}
          
          {/* Booking Type Selection */}
          {onBookingTypeChange && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                What would you like to book?
              </h3>
              <BookingTypeSelector
                selectedType={bookingType}
                onTypeSelect={onBookingTypeChange}
                variant="dropdown"
              />
            </div>
          )}
          
          {/* Date Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Select Date
            </h3>
            <HorizontalDatePicker
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              availableDates={availableDates}
            />
          </div>

          {/* Time Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Select Time
            </h3>
            <TimeSlotSelector
              selectedTime={selectedTime}
              onTimeSelect={setSelectedTime}
              availableSlots={availableSlots}
            />
          </div>

          {/* Service Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Select Service
            </h3>
            
            {/* Service Options */}
            {services.length > 1 && (
              <div className="grid grid-cols-1 gap-3 mb-4">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      selectedService?.id === service.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {service.name}
                        </h4>
                        {service.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {service.description}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          Free
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {service.duration} min
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
            
            {/* Selected Service Summary */}
            {selectedService && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {selectedService.name}
                    </h4>
                    {selectedService.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {selectedService.description}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      Free
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedService.duration} minutes
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Staff Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Staff
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-gray-900 dark:text-white">
                    {selectedStaff ? selectedStaff.name : 'No preference'}
                  </span>
                </div>
                <button className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
                  Change
                </button>
              </div>
            </div>
          </div>

          {/* Selected Time Summary */}
          {selectedTime && selectedService && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
                <Clock className="w-5 h-5" />
                <span className="font-medium">
                  {format(new Date(`2000-01-01T${selectedTime}`), 'h:mm a')} - {format(getEndTime() || new Date(), 'h:mm a')}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="text-right">
              <div className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                <DollarSign className="w-5 h-5" />
                Total: Free
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {getTotalDuration()} minutes
              </div>
            </div>
          </div>
          
          <Button
            onClick={handleSubmit}
            disabled={!isFormComplete || isSubmitting}
            className="w-full text-white border-0"
            style={{
              backgroundColor: tenantConfig?.theme.primaryColor || '#47abc4',
              borderColor: tenantConfig?.theme.primaryColor || '#47abc4',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = tenantConfig?.theme.secondaryColor || '#3a9bb3'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = tenantConfig?.theme.primaryColor || '#47abc4'
            }}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating Booking...
              </div>
            ) : (
              'Continue'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
