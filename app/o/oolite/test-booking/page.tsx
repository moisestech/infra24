'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UnifiedNavigation, ooliteConfig } from '@/components/navigation'

export default function TestBookingPage() {
  const [message, setMessage] = useState('Ready to test booking system')

  const testBookingAPI = async () => {
    try {
      setMessage('Testing booking API...')
      
      const response = await fetch('/api/resources?organizationId=caf2bc8b-8547-4c55-ac9f-5692e93bd831', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      setMessage(`✅ API Test Successful! Found ${data.data?.length || 0} resources`)
    } catch (error) {
      setMessage(`❌ API Test Failed: ${(error as Error).message}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <UnifiedNavigation config={ooliteConfig} userRole="admin" />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Booking System Test</CardTitle>
            <CardDescription>
              Test the booking system components and API endpoints
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300">{message}</p>
            </div>
            
            <div className="flex space-x-4">
              <Button onClick={testBookingAPI}>
                Test Resources API
              </Button>
              
              <Button 
                onClick={() => setMessage('Ready to test booking system')}
                variant="outline"
              >
                Reset
              </Button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                Next Steps:
              </h3>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Test Resources API endpoint</li>
                <li>• Test Bookings API endpoint</li>
                <li>• Test FullCalendar integration</li>
                <li>• Test booking form validation</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}