'use client'

import React from 'react'
import { Monitor, Building, GraduationCap, User, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export type BookingType = 'equipment' | 'space' | 'workshop' | 'person'

interface BookingTypeSelectorProps {
  selectedType: BookingType
  onTypeSelect: (type: BookingType) => void
  variant?: 'grid' | 'compact' | 'dropdown'
  className?: string
}

const bookingTypes = [
  {
    id: 'equipment' as BookingType,
    name: 'Equipment',
    description: 'VR headsets, 3D printers, cameras',
    icon: Monitor,
    color: '#47abc4'
  },
  {
    id: 'space' as BookingType,
    name: 'Spaces',
    description: 'Meeting rooms, studio spaces',
    icon: Building,
    color: '#47abc4'
  },
  {
    id: 'workshop' as BookingType,
    name: 'Workshops',
    description: 'Training sessions, programs',
    icon: GraduationCap,
    color: '#47abc4'
  },
  {
    id: 'person' as BookingType,
    name: 'People',
    description: 'Artists, mentors, specialists',
    icon: User,
    color: '#47abc4'
  }
]

export function BookingTypeSelector({
  selectedType,
  onTypeSelect,
  variant = 'grid',
  className
}: BookingTypeSelectorProps) {
  const selectedTypeData = bookingTypes.find(type => type.id === selectedType)

  if (variant === 'compact') {
    return (
      <div className={cn("w-full", className)}>
        <button
          onClick={() => {
            console.log('🔍 BookingTypeSelector: Compact selector clicked')
            console.log('🔍 BookingTypeSelector: Current selectedType:', selectedType)
            console.log('🔍 BookingTypeSelector: Available types:', bookingTypes.map(t => t.id))
            // For now, cycle through types on click
            const currentIndex = bookingTypes.findIndex(t => t.id === selectedType)
            const nextIndex = (currentIndex + 1) % bookingTypes.length
            const nextType = bookingTypes[nextIndex]
            console.log('🔍 BookingTypeSelector: Switching to:', nextType.id)
            onTypeSelect(nextType.id)
          }}
          className="w-full flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <div className="flex-shrink-0">
            {selectedTypeData && (
              <div 
                className="p-2 rounded-lg"
                style={{ backgroundColor: selectedTypeData.color + '20' }}
              >
                <selectedTypeData.icon 
                  className="w-5 h-5" 
                  style={{ color: selectedTypeData.color }}
                />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {selectedTypeData?.name || 'Select Type'}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
              {selectedTypeData?.description || 'Choose what you want to book'}
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              Tap to change
            </p>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
        </button>
      </div>
    )
  }

  if (variant === 'dropdown') {
    return (
      <div className={cn("w-full", className)}>
        <div className="relative">
          <select
            value={selectedType}
            onChange={(e) => onTypeSelect(e.target.value as BookingType)}
            className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
          >
            {bookingTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name} - {type.description}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>
    )
  }

  // Default grid variant
  return (
    <div className={cn("w-full", className)}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {bookingTypes.map((type) => {
          const Icon = type.icon
          const isSelected = selectedType === type.id
          
          return (
            <button
              key={type.id}
              onClick={() => onTypeSelect(type.id)}
              className={cn(
                "p-3 rounded-lg border-2 transition-all duration-200 text-left",
                "hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                isSelected
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md"
                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="p-1.5 rounded-md"
                  style={{ 
                    backgroundColor: isSelected ? type.color : type.color + '20' 
                  }}
                >
                  <Icon 
                    className="w-4 h-4" 
                    style={{ color: isSelected ? 'white' : type.color }}
                  />
                </div>
                <span className={cn(
                  "text-sm font-medium",
                  isSelected 
                    ? "text-blue-900 dark:text-blue-100" 
                    : "text-gray-900 dark:text-white"
                )}>
                  {type.name}
                </span>
              </div>
              <p className={cn(
                "text-xs leading-tight",
                isSelected 
                  ? "text-blue-700 dark:text-blue-300" 
                  : "text-gray-600 dark:text-gray-400"
              )}>
                {type.description}
              </p>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// Mobile-optimized version for small screens
export function MobileBookingTypeSelector({
  selectedType,
  onTypeSelect,
  className
}: Omit<BookingTypeSelectorProps, 'variant'>) {
  return (
    <div className={cn("w-full", className)}>
      {/* Mobile: Show compact selector */}
      <div className="block sm:hidden">
        <BookingTypeSelector
          selectedType={selectedType}
          onTypeSelect={onTypeSelect}
          variant="compact"
        />
      </div>
      
      {/* Desktop: Show grid */}
      <div className="hidden sm:block">
        <BookingTypeSelector
          selectedType={selectedType}
          onTypeSelect={onTypeSelect}
          variant="grid"
        />
      </div>
    </div>
  )
}
