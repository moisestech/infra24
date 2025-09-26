'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar, Download, ExternalLink, Loader2 } from 'lucide-react'

interface WorkshopCalendarButtonProps {
  workshopId: string
  workshopTitle: string
  registrationId?: string
  className?: string
  variant?: 'default' | 'outline' | 'secondary'
  size?: 'sm' | 'default' | 'lg'
}

export function WorkshopCalendarButton({ 
  workshopId, 
  workshopTitle,
  registrationId,
  className = '',
  variant = 'outline',
  size = 'default'
}: WorkshopCalendarButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDownloadICS = async () => {
    try {
      setLoading(true)
      setError(null)

      // Generate ICS file and download
      const response = await fetch(`/api/workshops/${workshopId}/calendar?type=registration${registrationId ? `&registrationId=${registrationId}` : ''}`)
      
      if (!response.ok) {
        throw new Error('Failed to generate calendar file')
      }

      // Get the ICS content
      const icsContent = await response.text()
      
      // Create filename
      const date = new Date()
      const dateStr = date.toISOString().split('T')[0]
      const titleStr = workshopTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 30)
      const filename = `registered-${titleStr}-${dateStr}.ics`

      // Create and download the file
      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

    } catch (error) {
      console.error('Error downloading calendar file:', error)
      setError('Failed to download calendar file')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCalendar = async () => {
    try {
      setLoading(true)
      setError(null)

      // Get calendar data
      const response = await fetch(`/api/workshops/${workshopId}/calendar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          registrationId,
          type: 'registration'
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get calendar data')
      }

      const { icsContent, eventData } = await response.json()

      // Try to open calendar app directly
      const calendarUrl = `data:text/calendar;charset=utf8,${encodeURIComponent(icsContent)}`
      window.open(calendarUrl, '_blank')

    } catch (error) {
      console.error('Error adding to calendar:', error)
      setError('Failed to add to calendar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex space-x-2">
        <Button
          onClick={handleDownloadICS}
          disabled={loading}
          variant={variant}
          size={size}
          className={className}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          Download Calendar
        </Button>
        
        <Button
          onClick={handleAddToCalendar}
          disabled={loading}
          variant="secondary"
          size={size}
          className={className}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <ExternalLink className="w-4 h-4 mr-2" />
          )}
          Add to Calendar
        </Button>
      </div>
      
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Add this workshop to your calendar app (Google Calendar, Outlook, Apple Calendar, etc.)
      </p>
    </div>
  )
}

/**
 * Simple calendar button for workshop cards
 */
export function SimpleCalendarButton({ 
  workshopId, 
  workshopTitle,
  registrationId 
}: WorkshopCalendarButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleAddToCalendar = async () => {
    try {
      setLoading(true)

      const response = await fetch(`/api/workshops/${workshopId}/calendar?type=registration${registrationId ? `&registrationId=${registrationId}` : ''}`)
      
      if (!response.ok) {
        throw new Error('Failed to generate calendar file')
      }

      const icsContent = await response.text()
      const date = new Date()
      const dateStr = date.toISOString().split('T')[0]
      const titleStr = workshopTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 30)
      const filename = `registered-${titleStr}-${dateStr}.ics`

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

    } catch (error) {
      console.error('Error adding to calendar:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleAddToCalendar}
      disabled={loading}
      variant="outline"
      size="sm"
      className="text-xs"
    >
      {loading ? (
        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
      ) : (
        <Calendar className="w-3 h-3 mr-1" />
      )}
      Add to Calendar
    </Button>
  )
}
