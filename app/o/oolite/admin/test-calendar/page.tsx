'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Calendar, Download, ExternalLink, CheckCircle, AlertCircle, Clock, MapPin, User } from 'lucide-react'
import { UnifiedNavigation, ooliteConfig } from '@/components/navigation'
import { WorkshopCalendarButton } from '@/components/workshop/WorkshopCalendarButton'

export default function TestCalendarPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null)
  const [formData, setFormData] = useState({
    workshopId: 'caf2bc8b-8547-4c55-ac9f-5692e93bd831', // Our test workshop ID
    workshopTitle: 'AI Art Creation Workshop',
    participantName: 'Test User',
    workshopDate: '2024-03-15',
    workshopTime: '14:00',
    workshopDuration: '3',
    workshopLocation: 'Digital Lab - AI Art Fundamentals',
    instructorName: 'AI Art Specialist',
    description: 'Learn to create stunning digital art using AI tools and techniques.'
  })

  const handleTestCalendar = async () => {
    try {
      setLoading(true)
      setResult(null)

      // Test the calendar API
      const response = await fetch(`/api/workshops/${formData.workshopId}/calendar?type=workshop`)
      
      if (response.ok) {
        const icsContent = await response.text()
        setResult({ 
          success: true, 
          message: `Calendar file generated successfully! (${icsContent.length} characters)` 
        })
      } else {
        const error = await response.json()
        setResult({ success: false, error: error.error || 'Failed to generate calendar file' })
      }
    } catch (error) {
      setResult({ success: false, error: 'Failed to test calendar generation' })
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadTest = async () => {
    try {
      setLoading(true)
      setResult(null)

      const response = await fetch(`/api/workshops/${formData.workshopId}/calendar?type=registration`)
      
      if (!response.ok) {
        throw new Error('Failed to generate calendar file')
      }

      const icsContent = await response.text()
      const filename = `test-workshop-${new Date().toISOString().split('T')[0]}.ics`

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      setResult({ success: true, message: 'Calendar file downloaded successfully!' })

    } catch (error) {
      setResult({ success: false, error: 'Failed to download calendar file' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <UnifiedNavigation config={ooliteConfig} userRole="admin" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Calendar className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Calendar Integration Testing
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Test ICS calendar file generation for workshops
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Test Form */}
          <Card>
            <CardHeader>
              <CardTitle>Test Calendar Generation</CardTitle>
              <CardDescription>
                Test ICS calendar file generation with custom workshop data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Workshop ID
                </label>
                <Input
                  value={formData.workshopId}
                  onChange={(e) => setFormData({ ...formData, workshopId: e.target.value })}
                  placeholder="Workshop ID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Workshop Title
                </label>
                <Input
                  value={formData.workshopTitle}
                  onChange={(e) => setFormData({ ...formData, workshopTitle: e.target.value })}
                  placeholder="Workshop Title"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Workshop Date
                  </label>
                  <Input
                    type="date"
                    value={formData.workshopDate}
                    onChange={(e) => setFormData({ ...formData, workshopDate: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Workshop Time
                  </label>
                  <Input
                    type="time"
                    value={formData.workshopTime}
                    onChange={(e) => setFormData({ ...formData, workshopTime: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (hours)
                </label>
                <Input
                  type="number"
                  value={formData.workshopDuration}
                  onChange={(e) => setFormData({ ...formData, workshopDuration: e.target.value })}
                  placeholder="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <Input
                  value={formData.workshopLocation}
                  onChange={(e) => setFormData({ ...formData, workshopLocation: e.target.value })}
                  placeholder="Workshop Location"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instructor
                </label>
                <Input
                  value={formData.instructorName}
                  onChange={(e) => setFormData({ ...formData, instructorName: e.target.value })}
                  placeholder="Instructor Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Workshop description"
                  rows={3}
                />
              </div>

              <div className="flex space-x-2">
                <Button 
                  onClick={handleTestCalendar} 
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Testing...
                    </>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4 mr-2" />
                      Test Generation
                    </>
                  )}
                </Button>
                
                <Button 
                  onClick={handleDownloadTest} 
                  disabled={loading}
                  variant="secondary"
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Download Test
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>
                Calendar generation results and status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className={`p-4 rounded-lg ${
                  result.success 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    {result.success ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span className={`font-medium ${
                      result.success ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {result.success ? 'Success!' : 'Error'}
                    </span>
                  </div>
                  
                  {result.message && (
                    <p className="text-green-700 text-sm">{result.message}</p>
                  )}
                  
                  {result.error && (
                    <p className="text-red-700 text-sm">{result.error}</p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>No test results yet</p>
                  <p className="text-sm">Run a test to see results here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Calendar Button Demo */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Calendar Button Component Demo</CardTitle>
            <CardDescription>
              Test the WorkshopCalendarButton component
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Workshop Event Preview</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span><strong>Title:</strong> {formData.workshopTitle}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span><strong>Date:</strong> {formData.workshopDate} at {formData.workshopTime}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span><strong>Location:</strong> {formData.workshopLocation}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <span><strong>Instructor:</strong> {formData.instructorName}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <WorkshopCalendarButton
                  workshopId={formData.workshopId}
                  workshopTitle={formData.workshopTitle}
                />
              </div>

              <div className="text-center text-sm text-gray-500">
                <p>Click the buttons above to test calendar integration</p>
                <p>The calendar file will be downloaded and can be imported into any calendar app</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
