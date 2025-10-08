'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, CheckCircle, AlertCircle, ExternalLink, Loader2 } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { toast } from 'sonner'

interface CalendarIntegrationProps {
  bookingId?: string
  onCalendarConnected?: (provider: string) => void
  className?: string
}

interface CalendarProvider {
  provider: 'google' | 'microsoft'
  connected: boolean
  calendars?: Array<{
    id: string
    name: string
    primary?: boolean
  }>
  tokenExpiresAt?: string
}

export function CalendarIntegration({
  bookingId,
  onCalendarConnected,
  className = ''
}: CalendarIntegrationProps) {
  const { user } = useUser()
  const [providers, setProviders] = useState<CalendarProvider[]>([
    { provider: 'google', connected: false },
    { provider: 'microsoft', connected: false }
  ])
  const [selectedProvider, setSelectedProvider] = useState<'google' | 'microsoft'>('google')
  const [selectedCalendar, setSelectedCalendar] = useState<string>('')
  const [calendarSyncEnabled, setCalendarSyncEnabled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)

  // Load calendar connection status on mount
  useEffect(() => {
    loadCalendarStatus()
  }, [])

  const loadCalendarStatus = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/calendar/status')
      if (response.ok) {
        const data = await response.json()
        setProviders(data.providers || [])
        
        // Set default calendar for connected providers
        data.providers?.forEach((provider: CalendarProvider) => {
          if (provider.connected && provider.calendars?.length) {
            const primaryCalendar = provider.calendars.find(cal => cal.primary) || provider.calendars[0]
            if (primaryCalendar && !selectedCalendar) {
              setSelectedCalendar(primaryCalendar.id)
            }
          }
        })
      }
    } catch (error) {
      console.error('Error loading calendar status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const connectCalendar = async (provider: 'google' | 'microsoft') => {
    if (!user) return

    setIsConnecting(true)
    try {
      const response = await fetch('/api/calendar/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ provider }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.authUrl) {
          // Redirect to OAuth flow
          window.location.href = data.authUrl
        }
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to connect calendar')
      }
    } catch (error) {
      console.error('Error connecting calendar:', error)
      toast.error('Failed to connect calendar')
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectCalendar = async (provider: 'google' | 'microsoft') => {
    if (!user) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/calendar/disconnect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ provider }),
      })

      if (response.ok) {
        toast.success(`${provider === 'google' ? 'Google' : 'Microsoft'} calendar disconnected`)
        await loadCalendarStatus()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to disconnect calendar')
      }
    } catch (error) {
      console.error('Error disconnecting calendar:', error)
      toast.error('Failed to disconnect calendar')
    } finally {
      setIsLoading(false)
    }
  }

  const updateCalendarSync = async (enabled: boolean) => {
    if (!bookingId) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          calendar_sync_enabled: enabled,
          calendar_provider: enabled ? selectedProvider : null,
        }),
      })

      if (response.ok) {
        setCalendarSyncEnabled(enabled)
        toast.success(enabled ? 'Calendar sync enabled' : 'Calendar sync disabled')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update calendar sync')
      }
    } catch (error) {
      console.error('Error updating calendar sync:', error)
      toast.error('Failed to update calendar sync')
    } finally {
      setIsLoading(false)
    }
  }

  const getProviderDisplayName = (provider: string) => {
    return provider === 'google' ? 'Google Calendar' : 'Microsoft Outlook'
  }

  const getProviderIcon = (provider: string) => {
    return provider === 'google' ? '📅' : '📧'
  }

  const isTokenExpired = (expiresAt?: string) => {
    if (!expiresAt) return false
    return new Date(expiresAt) <= new Date()
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Calendar Integration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Calendar Provider Status */}
        <div className="space-y-3">
          {providers.map((provider) => (
            <div key={provider.provider} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getProviderIcon(provider.provider)}</span>
                <div>
                  <div className="font-medium">{getProviderDisplayName(provider.provider)}</div>
                  <div className="text-sm text-gray-500">
                    {provider.connected ? (
                      isTokenExpired(provider.tokenExpiresAt) ? (
                        <span className="text-orange-600">Token expired</span>
                      ) : (
                        <span className="text-green-600">Connected</span>
                      )
                    ) : (
                      <span className="text-gray-500">Not connected</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {provider.connected ? (
                  <>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Connected
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => disconnectCalendar(provider.provider)}
                      disabled={isLoading}
                    >
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => connectCalendar(provider.provider)}
                    disabled={isConnecting}
                  >
                    {isConnecting ? (
                      <>
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Connect
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Calendar Selection */}
        {providers.some(p => p.connected) && (
          <div className="space-y-2">
            <Label>Calendar Provider</Label>
            <Select value={selectedProvider} onValueChange={(value: 'google' | 'microsoft') => setSelectedProvider(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {providers
                  .filter(p => p.connected)
                  .map((provider) => (
                    <SelectItem key={provider.provider} value={provider.provider}>
                      {getProviderIcon(provider.provider)} {getProviderDisplayName(provider.provider)}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Calendar Selection for Google */}
        {selectedProvider === 'google' && providers.find(p => p.provider === 'google')?.connected && (
          <div className="space-y-2">
            <Label>Google Calendar</Label>
            <Select value={selectedCalendar} onValueChange={setSelectedCalendar}>
              <SelectTrigger>
                <SelectValue placeholder="Select a calendar" />
              </SelectTrigger>
              <SelectContent>
                {providers
                  .find(p => p.provider === 'google')
                  ?.calendars?.map((calendar) => (
                    <SelectItem key={calendar.id} value={calendar.id}>
                      {calendar.name} {calendar.primary && '(Primary)'}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Calendar Sync Toggle */}
        {bookingId && providers.some(p => p.connected) && (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="calendar-sync">Enable Calendar Sync</Label>
              <p className="text-sm text-gray-600">
                Automatically create calendar events for your bookings
              </p>
            </div>
            <Switch
              id="calendar-sync"
              checked={calendarSyncEnabled}
              onCheckedChange={updateCalendarSync}
              disabled={isLoading}
            />
          </div>
        )}

        {/* Benefits */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Calendar Integration Benefits</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Automatically check availability to prevent double bookings</li>
            <li>• Create calendar events when bookings are confirmed</li>
            <li>• Sync booking changes with your calendar</li>
            <li>• Receive calendar notifications for upcoming bookings</li>
          </ul>
        </div>

        {/* Security Notice */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <AlertCircle className="w-3 h-3" />
          <span>Your calendar data is encrypted and only used for booking management</span>
        </div>
      </CardContent>
    </Card>
  )
}
