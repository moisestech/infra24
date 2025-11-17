'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { StreamlinedBookingModal } from '@/components/booking/StreamlinedBookingModal'
import { Calendar, Clock, Users, DollarSign } from 'lucide-react'

export default function BookingDemoPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Sample data
  const services = [
    {
      id: '1',
      name: 'Haircut',
      price: 35.00,
      duration: 30,
      description: 'Professional haircut and styling'
    },
    {
      id: '2',
      name: 'Beard Trim',
      price: 20.00,
      duration: 15,
      description: 'Precision beard trimming and shaping'
    },
    {
      id: '3',
      name: 'Haircut + Beard',
      price: 50.00,
      duration: 45,
      description: 'Complete grooming package'
    }
  ]

  const staff = [
    { id: '1', name: 'John Smith', available: true },
    { id: '2', name: 'Mike Johnson', available: true },
    { id: '3', name: 'Sarah Wilson', available: false }
  ]

  const handleBookingCreate = async (bookingData: any) => {
    console.log('Creating booking:', bookingData)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    alert(`Booking created successfully!\n\nDate: ${bookingData.date.toDateString()}\nTime: ${bookingData.startTime}\nService: ${bookingData.service.name}\nTotal: $${bookingData.totalPrice.toFixed(2)}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Streamlined Booking System
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Experience our new simplified booking flow that makes scheduling appointments effortless and intuitive.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Visual Date Picker</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Horizontal scrollable date selection with availability indicators
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <Clock className="w-8 h-8 text-green-600 dark:text-green-400 mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Time Periods</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Segmented time selection (Morning/Afternoon/Evening) with available slots
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <Users className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Pre-populated Services</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Services are pre-selected to reduce form complexity
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <DollarSign className="w-8 h-8 text-orange-600 dark:text-orange-400 mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Live Pricing</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Real-time total calculation with duration display
            </p>
          </div>
        </div>

        {/* Demo Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Try the New Booking Experience
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Click the button below to see our streamlined booking modal in action
            </p>
            
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Book Appointment
            </Button>
          </div>
        </div>

        {/* Comparison Section */}
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6">
            <h3 className="font-semibold text-red-900 dark:text-red-100 mb-3">❌ Old Booking Form</h3>
            <ul className="text-sm text-red-800 dark:text-red-200 space-y-2">
              <li>• Multiple form fields to fill out</li>
              <li>• Calendar grid that's hard to navigate</li>
              <li>• Dropdown time selectors</li>
              <li>• Feels like filling out paperwork</li>
              <li>• High abandonment rate</li>
            </ul>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
            <h3 className="font-semibold text-green-900 dark:text-green-100 mb-3">✅ New Streamlined Flow</h3>
            <ul className="text-sm text-green-800 dark:text-green-200 space-y-2">
              <li>• Visual, click-based interactions</li>
              <li>• Horizontal date picker with availability</li>
              <li>• Segmented time periods</li>
              <li>• Feels like a modern app</li>
              <li>• Higher conversion rates</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Streamlined Booking Modal */}
      <StreamlinedBookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBookingCreate={handleBookingCreate}
        services={services}
        staff={staff}
      />
    </div>
  )
}
