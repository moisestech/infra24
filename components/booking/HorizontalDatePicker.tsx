'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format, addDays, startOfWeek, endOfWeek, isSameDay, isToday, isTomorrow } from 'date-fns'
import { cn } from '@/lib/utils'

interface HorizontalDatePickerProps {
  selectedDate: Date | null
  onDateSelect: (date: Date) => void
  availableDates?: Date[]
  className?: string
}

export function HorizontalDatePicker({ 
  selectedDate, 
  onDateSelect, 
  availableDates = [],
  className 
}: HorizontalDatePickerProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Generate week dates
  const generateWeekDates = (weekStart: Date) => {
    const dates = []
    for (let i = 0; i < 7; i++) {
      dates.push(addDays(weekStart, i))
    }
    return dates
  }

  const weekDates = generateWeekDates(startOfWeek(currentWeek, { weekStartsOn: 1 }))
  
  // Filter to only show available dates
  const availableWeekDates = weekDates.filter(date => {
    if (availableDates.length === 0) return true // If no availability data, show all dates
    return availableDates.some(availableDate => isSameDay(availableDate, date))
  })

  // Check if a date is available
  const isDateAvailable = (date: Date) => {
    if (availableDates.length === 0) return true // If no availability data, assume all dates are available
    return availableDates.some(availableDate => isSameDay(availableDate, date))
  }

  // Check if a date is selected
  const isDateSelected = (date: Date) => {
    return selectedDate ? isSameDay(selectedDate, date) : false
  }

  // Navigation functions
  const goToPreviousWeek = () => {
    setCurrentWeek(prev => addDays(prev, -7))
  }

  const goToNextWeek = () => {
    setCurrentWeek(prev => addDays(prev, 7))
  }

  // Auto-scroll to selected date when it changes
  useEffect(() => {
    if (selectedDate && scrollContainerRef.current) {
      const selectedElement = scrollContainerRef.current.querySelector(`[data-date="${format(selectedDate, 'yyyy-MM-dd')}"]`)
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
      }
    }
  }, [selectedDate])

  return (
    <div className={cn("w-full", className)}>
      {/* Navigation Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousWeek}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Previous week"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {format(startOfWeek(currentWeek, { weekStartsOn: 1 }), 'MMM d')} - {format(endOfWeek(currentWeek, { weekStartsOn: 1 }), 'MMM d, yyyy')}
          </h3>
        </div>
        
        <button
          onClick={goToNextWeek}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Next week"
        >
          <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Date Picker */}
      <div className="relative">
        <div 
          ref={scrollContainerRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {availableWeekDates.length === 0 ? (
            <div className="w-full text-center py-8 text-gray-500 dark:text-gray-400">
              <p>No available dates in this week</p>
              <p className="text-sm">Try navigating to a different week</p>
            </div>
          ) : (
            availableWeekDates.map((date) => {
              const isAvailable = isDateAvailable(date)
              const isSelected = isDateSelected(date)
              const isTodayDate = isToday(date)
              const isTomorrowDate = isTomorrow(date)

              return (
                <button
                  key={date.toISOString()}
                  data-date={format(date, 'yyyy-MM-dd')}
                  onClick={() => isAvailable && onDateSelect(date)}
                  disabled={!isAvailable}
                  className={cn(
                    "flex-shrink-0 w-16 p-3 rounded-lg text-center transition-all duration-200",
                    "border-2 border-transparent",
                    isSelected && "bg-blue-500 text-white border-blue-500 shadow-lg scale-105",
                    !isSelected && isAvailable && "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md",
                    !isAvailable && "bg-gray-100 dark:bg-gray-900 text-gray-400 dark:text-gray-600 cursor-not-allowed",
                    isTodayDate && !isSelected && "ring-2 ring-blue-200 dark:ring-blue-800"
                  )}
                >
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    {format(date, 'EEE')}
                  </div>
                  <div className={cn(
                    "text-lg font-semibold",
                    isSelected && "text-white",
                    !isSelected && isAvailable && "text-gray-900 dark:text-white",
                    !isAvailable && "text-gray-400 dark:text-gray-600"
                  )}>
                    {format(date, 'd')}
                  </div>
                  
                  {/* Availability Indicator */}
                  {isAvailable && !isSelected && (
                    <div className="w-1 h-1 bg-green-500 rounded-full mx-auto mt-1" />
                  )}
                  
                  {/* Special Labels */}
                  {isTodayDate && !isSelected && (
                    <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-1">
                      Today
                    </div>
                  )}
                  {isTomorrowDate && !isSelected && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">
                      Tomorrow
                    </div>
                  )}
                </button>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}