'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Mail, Send, CheckCircle, AlertCircle } from 'lucide-react'
import { UnifiedNavigation, ooliteConfig } from '@/components/navigation'

export default function TestEmailPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null)
  const [formData, setFormData] = useState({
    email: 'test@example.com',
    workshopTitle: 'AI Art Creation Workshop',
    participantName: 'Test User',
    workshopDate: 'March 15, 2024',
    workshopTime: '2:00 PM - 5:00 PM',
    workshopLocation: 'Digital Lab - AI Art Fundamentals',
    instructorName: 'AI Art Specialist',
    language: 'en'
  })

  const handleSendTestEmail = async () => {
    try {
      setLoading(true)
      setResult(null)

      const response = await fetch('/api/test-workshop-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setResult({ success: true, message: data.message })
      } else {
        setResult({ success: false, error: data.error })
      }
    } catch (error) {
      setResult({ success: false, error: 'Failed to send test email' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <UnifiedNavigation config={ooliteConfig} userRole="admin" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Mail className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Email Testing
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Test workshop registration email templates
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Email Form */}
          <Card>
            <CardHeader>
              <CardTitle>Test Workshop Email</CardTitle>
              <CardDescription>
                Send a test workshop registration confirmation email
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="test@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Participant Name
                </label>
                <Input
                  value={formData.participantName}
                  onChange={(e) => setFormData({ ...formData, participantName: e.target.value })}
                  placeholder="Test User"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Workshop Title
                </label>
                <Input
                  value={formData.workshopTitle}
                  onChange={(e) => setFormData({ ...formData, workshopTitle: e.target.value })}
                  placeholder="AI Art Creation Workshop"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Workshop Date
                  </label>
                  <Input
                    value={formData.workshopDate}
                    onChange={(e) => setFormData({ ...formData, workshopDate: e.target.value })}
                    placeholder="March 15, 2024"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Workshop Time
                  </label>
                  <Input
                    value={formData.workshopTime}
                    onChange={(e) => setFormData({ ...formData, workshopTime: e.target.value })}
                    placeholder="2:00 PM - 5:00 PM"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <Input
                  value={formData.workshopLocation}
                  onChange={(e) => setFormData({ ...formData, workshopLocation: e.target.value })}
                  placeholder="Digital Lab - AI Art Fundamentals"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instructor
                </label>
                <Input
                  value={formData.instructorName}
                  onChange={(e) => setFormData({ ...formData, instructorName: e.target.value })}
                  placeholder="AI Art Specialist"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <Select 
                  value={formData.language} 
                  onValueChange={(value) => setFormData({ ...formData, language: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleSendTestEmail} 
                disabled={loading || !formData.email}
                className="w-full"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Test Email
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>
                Email sending results and status
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
                      {result.success ? 'Email Sent Successfully!' : 'Email Failed'}
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
                  <Mail className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>No test results yet</p>
                  <p className="text-sm">Send a test email to see results here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Email Preview */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Email Preview</CardTitle>
            <CardDescription>
              Preview of the workshop registration email template
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 rounded-lg p-4 text-sm">
              <div className="font-semibold mb-2">Subject:</div>
              <div className="mb-4">[Oolite Arts] Registration Confirmed: {formData.workshopTitle}</div>
              
              <div className="font-semibold mb-2">Content Preview:</div>
              <div className="space-y-2 text-gray-700">
                <p>Hi {formData.participantName || 'Participant'},</p>
                <p>Great news! Your workshop registration has been successfully confirmed.</p>
                <p><strong>Workshop:</strong> {formData.workshopTitle}</p>
                {formData.workshopDate && <p><strong>Date:</strong> {formData.workshopDate}</p>}
                {formData.workshopTime && <p><strong>Time:</strong> {formData.workshopTime}</p>}
                {formData.workshopLocation && <p><strong>Location:</strong> {formData.workshopLocation}</p>}
                {formData.instructorName && <p><strong>Instructor:</strong> {formData.instructorName}</p>}
                <p>You'll receive a reminder 24 hours before the workshop.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
