'use client'

import React, { useState, useMemo } from 'react'
import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface TimeSlot {
  time: string
  available: boolean
  duration?: number // in minutes
}

interface TimeSlotSelectorProps {
  selectedTime: string | null
  onTimeSelect: (time: string) => void
  availableSlots?: TimeSlot[]
  className?: string
}

type TimePeriod = 'morning' | 'afternoon' | 'evening'

export function TimeSlotSelector({ 
  selectedTime, 
  onTimeSelect, 
  availableSlots = [],
  className 
}: TimeSlotSelectorProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('morning')

  // Use provided available slots or generate default ones
  const defaultTimeSlots: TimeSlot[] = useMemo(() => {
    console.log('🔍 TimeSlotSelector: availableSlots received:', availableSlots.length)
    if (availableSlots.length > 0) {
      console.log('🔍 TimeSlotSelector: Using provided availableSlots:', availableSlots.slice(0, 5))
      return availableSlots
    }
    
    console.log('🔍 TimeSlotSelector: No availableSlots provided, generating default slots')

    const slots: TimeSlot[] = []
    
    // Morning slots (8 AM - 12 PM)
    for (let hour = 8; hour < 12; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        slots.push({
          time: timeString,
          available: true, // Default to available if no real data
          duration: 30
        })
      }
    }
    
    // Afternoon slots (12 PM - 5 PM)
    for (let hour = 12; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        slots.push({
          time: timeString,
          available: true, // Default to available if no real data
          duration: 30
        })
      }
    }
    
    // Evening slots (5 PM - 8 PM)
    for (let hour = 17; hour < 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        slots.push({
          time: timeString,
          available: true, // Default to available if no real data
          duration: 30
        })
      }
    }
    
    console.log('🔍 TimeSlotSelector: Generated', slots.length, 'default time slots')
    return slots
  }, [availableSlots])

  // Filter slots by selected period
  const filteredSlots = useMemo(() => {
    const filtered = defaultTimeSlots.filter(slot => {
      const [hour] = slot.time.split(':').map(Number)
      
      switch (selectedPeriod) {
        case 'morning':
          return hour >= 8 && hour < 12
        case 'afternoon':
          return hour >= 12 && hour < 17
        case 'evening':
          return hour >= 17 && hour < 20
        default:
          return true
      }
    })
    
    console.log('🔍 TimeSlotSelector: Filtered slots for', selectedPeriod, ':', filtered.length)
    console.log('🔍 TimeSlotSelector: Available slots:', filtered.filter(s => s.available).length)
    console.log('🔍 TimeSlotSelector: Sample filtered slots:', filtered.slice(0, 3).map(s => s.time))
    return filtered
  }, [defaultTimeSlots, selectedPeriod])

  // Format time for display
  const formatTimeDisplay = (time: string) => {
    const [hour, minute] = time.split(':').map(Number)
    const period = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`
  }

  // Get period label
  const getPeriodLabel = (period: TimePeriod) => {
    switch (period) {
      case 'morning': return 'Morning'
      case 'afternoon': return 'Afternoon'
      case 'evening': return 'Evening'
    }
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-sm mb-4">
          <div className="font-medium text-blue-800 dark:text-blue-200 mb-1">Time Picker Debug:</div>
          <div className="text-blue-700 dark:text-blue-300 space-y-1">
            <div>Total Slots: {defaultTimeSlots.length}</div>
            <div>Filtered Slots: {filteredSlots.length}</div>
            <div>Available Slots: {filteredSlots.filter(s => s.available).length}</div>
            <div>Selected Period: {selectedPeriod}</div>
          </div>
        </div>
      )}
      
      {/* Time Period Selector */}
      <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 mb-4">
        {(['morning', 'afternoon', 'evening'] as TimePeriod[]).map((period) => (
          <button
            key={period}
            onClick={() => setSelectedPeriod(period)}
            className={cn(
              "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200",
              selectedPeriod === period
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            )}
          >
            {getPeriodLabel(period)}
          </button>
        ))}
      </div>

      {/* Time Slots */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
          <Clock className="w-4 h-4" />
          <span>Available times for {getPeriodLabel(selectedPeriod).toLowerCase()}</span>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {filteredSlots.map((slot, index) => {
            const isSelected = selectedTime === slot.time
            const isAvailable = slot.available

            return (
              <button
                key={`${slot.time}-${index}`}
                onClick={() => isAvailable && onTimeSelect(slot.time)}
                disabled={!isAvailable}
                className={cn(
                  "p-3 rounded-lg text-center transition-all duration-200 border-2",
                  isSelected && "bg-blue-500 text-white border-blue-500 shadow-lg scale-105",
                  !isSelected && isAvailable && "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md",
                  !isAvailable && "bg-gray-100 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                )}
              >
                <div className={cn(
                  "font-medium",
                  isSelected && "text-white",
                  !isSelected && isAvailable && "text-gray-900 dark:text-white",
                  !isAvailable && "text-gray-400 dark:text-gray-600"
                )}>
                  {formatTimeDisplay(slot.time)}
                </div>
                {slot.duration && (
                  <div className={cn(
                    "text-xs mt-1",
                    isSelected && "text-blue-100",
                    !isSelected && isAvailable && "text-gray-500 dark:text-gray-400",
                    !isAvailable && "text-gray-400 dark:text-gray-600"
                  )}>
                    {slot.duration}min
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Show message if no slots available */}
        {filteredSlots.filter(slot => slot.available).length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No available times for {getPeriodLabel(selectedPeriod).toLowerCase()}</p>
            <p className="text-sm">Try selecting a different time period</p>
          </div>
        )}
      </div>
    </div>
  )
}
