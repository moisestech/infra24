/**
 * Google Calendar Integration Service
 * 
 * Handles Google Calendar API integration for MASTER flow
 * - OAuth2 authentication
 * - Calendar sync
 * - Event management
 * - Conflict detection
 */

import { google } from 'googleapis'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface CalendarEvent {
  id: string
  title: string
  description?: string
  start: Date
  end: Date
  location?: string
  attendees?: string[]
  status: 'confirmed' | 'tentative' | 'cancelled'
  source: 'google' | 'infra24'
}

export interface CalendarIntegration {
  id: string
  organization_id: string
  provider: 'google' | 'outlook' | 'apple'
  external_calendar_id: string
  calendar_name: string
  access_token: string
  refresh_token?: string
  token_expires_at?: Date
  sync_enabled: boolean
  last_sync_at?: Date
  sync_status: 'pending' | 'syncing' | 'success' | 'error'
  error_message?: string
  is_active: boolean
}

export class GoogleCalendarService {
  private oauth2Client: any
  private calendar: any

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    )
    this.calendar = google.calendar({ version: 'v3', auth: this.oauth2Client })
  }

  /**
   * Generate OAuth2 authorization URL
   */
  generateAuthUrl(organizationId: string): string {
    const scopes = [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events'
    ]

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      state: organizationId, // Pass organization ID in state
      prompt: 'consent' // Force consent to get refresh token
    })
  }

  /**
   * Exchange authorization code for tokens
   */
  async exchangeCodeForTokens(code: string, organizationId: string): Promise<CalendarIntegration> {
    try {
      const { tokens } = await this.oauth2Client.getToken(code)
      
      // Set credentials
      this.oauth2Client.setCredentials(tokens)

      // Get calendar list to find primary calendar
      const calendarList = await this.calendar.calendarList.list()
      const primaryCalendar = calendarList.data.items?.find((cal: any) => cal.primary) || calendarList.data.items?.[0]

      if (!primaryCalendar) {
        throw new Error('No calendar found')
      }

      // Save integration to database
      const { data: integration, error } = await supabase
        .from('calendar_integrations')
        .insert({
          organization_id: organizationId,
          provider: 'google',
          external_calendar_id: primaryCalendar.id,
          calendar_name: primaryCalendar.summary || 'Primary Calendar',
          access_token: tokens.access_token!,
          refresh_token: tokens.refresh_token,
          token_expires_at: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
          sync_enabled: true,
          sync_status: 'success',
          is_active: true,
          created_by: 'system',
          updated_by: 'system'
        })
        .select()
        .single()

      if (error) {
        throw new Error(`Database error: ${error.message}`)
      }

      return integration
    } catch (error) {
      console.error('Error exchanging code for tokens:', error)
      throw error
    }
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(integration: CalendarIntegration): Promise<CalendarIntegration> {
    try {
      this.oauth2Client.setCredentials({
        refresh_token: integration.refresh_token
      })

      const { credentials } = await this.oauth2Client.refreshAccessToken()
      
      // Update integration with new tokens
      const { data: updatedIntegration, error } = await supabase
        .from('calendar_integrations')
        .update({
          access_token: credentials.access_token,
          token_expires_at: credentials.expiry_date ? new Date(credentials.expiry_date) : null,
          last_sync_at: new Date(),
          sync_status: 'success',
          error_message: null,
          updated_by: 'system'
        })
        .eq('id', integration.id)
        .select()
        .single()

      if (error) {
        throw new Error(`Database error: ${error.message}`)
      }

      return updatedIntegration
    } catch (error) {
      console.error('Error refreshing access token:', error)
      
      // Update integration with error status
      await supabase
        .from('calendar_integrations')
        .update({
          sync_status: 'error',
          error_message: error instanceof Error ? error.message : 'Unknown error',
          updated_by: 'system'
        })
        .eq('id', integration.id)

      throw error
    }
  }

  /**
   * Sync events from Google Calendar to Infra24
   */
  async syncEventsFromGoogle(integration: CalendarIntegration): Promise<CalendarEvent[]> {
    try {
      // Set credentials
      this.oauth2Client.setCredentials({
        access_token: integration.access_token,
        refresh_token: integration.refresh_token
      })

      // Update sync status
      await supabase
        .from('calendar_integrations')
        .update({
          sync_status: 'syncing',
          updated_by: 'system'
        })
        .eq('id', integration.id)

      // Get events from Google Calendar
      const timeMin = new Date()
      timeMin.setDate(timeMin.getDate() - 7) // Get events from last 7 days
      
      const timeMax = new Date()
      timeMax.setDate(timeMax.getDate() + 30) // Get events for next 30 days

      const response = await this.calendar.events.list({
        calendarId: integration.external_calendar_id,
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString(),
        singleEvents: true,
        orderBy: 'startTime'
      })

      const events: CalendarEvent[] = response.data.items?.map((event: any) => ({
        id: event.id,
        title: event.summary || 'No Title',
        description: event.description,
        start: new Date(event.start.dateTime || event.start.date),
        end: new Date(event.end.dateTime || event.end.date),
        location: event.location,
        attendees: event.attendees?.map((a: any) => a.email) || [],
        status: event.status as 'confirmed' | 'tentative' | 'cancelled',
        source: 'google'
      })) || []

      // Update sync status
      await supabase
        .from('calendar_integrations')
        .update({
          last_sync_at: new Date(),
          sync_status: 'success',
          error_message: null,
          updated_by: 'system'
        })
        .eq('id', integration.id)

      return events
    } catch (error) {
      console.error('Error syncing events from Google:', error)
      
      // Update sync status with error
      await supabase
        .from('calendar_integrations')
        .update({
          sync_status: 'error',
          error_message: error instanceof Error ? error.message : 'Unknown error',
          updated_by: 'system'
        })
        .eq('id', integration.id)

      throw error
    }
  }

  /**
   * Create event in Google Calendar
   */
  async createEvent(integration: CalendarIntegration, event: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> {
    try {
      // Set credentials
      this.oauth2Client.setCredentials({
        access_token: integration.access_token,
        refresh_token: integration.refresh_token
      })

      const googleEvent = {
        summary: event.title,
        description: event.description,
        start: {
          dateTime: event.start.toISOString(),
          timeZone: 'UTC'
        },
        end: {
          dateTime: event.end.toISOString(),
          timeZone: 'UTC'
        },
        location: event.location,
        attendees: event.attendees?.map(email => ({ email })) || []
      }

      const response = await this.calendar.events.insert({
        calendarId: integration.external_calendar_id,
        resource: googleEvent
      })

      return {
        id: response.data.id!,
        ...event,
        source: 'google'
      }
    } catch (error) {
      console.error('Error creating event in Google Calendar:', error)
      throw error
    }
  }

  /**
   * Update event in Google Calendar
   */
  async updateEvent(integration: CalendarIntegration, eventId: string, event: Partial<CalendarEvent>): Promise<CalendarEvent> {
    try {
      // Set credentials
      this.oauth2Client.setCredentials({
        access_token: integration.access_token,
        refresh_token: integration.refresh_token
      })

      const googleEvent: any = {}
      
      if (event.title) googleEvent.summary = event.title
      if (event.description) googleEvent.description = event.description
      if (event.start) googleEvent.start = { dateTime: event.start.toISOString(), timeZone: 'UTC' }
      if (event.end) googleEvent.end = { dateTime: event.end.toISOString(), timeZone: 'UTC' }
      if (event.location) googleEvent.location = event.location
      if (event.attendees) googleEvent.attendees = event.attendees.map(email => ({ email }))

      const response = await this.calendar.events.update({
        calendarId: integration.external_calendar_id,
        eventId: eventId,
        resource: googleEvent
      })

      return {
        id: response.data.id!,
        title: response.data.summary || 'No Title',
        description: response.data.description,
        start: new Date(response.data.start.dateTime || response.data.start.date),
        end: new Date(response.data.end.dateTime || response.data.end.date),
        location: response.data.location,
        attendees: response.data.attendees?.map((a: any) => a.email) || [],
        status: response.data.status as 'confirmed' | 'tentative' | 'cancelled',
        source: 'google'
      }
    } catch (error) {
      console.error('Error updating event in Google Calendar:', error)
      throw error
    }
  }

  /**
   * Delete event from Google Calendar
   */
  async deleteEvent(integration: CalendarIntegration, eventId: string): Promise<void> {
    try {
      // Set credentials
      this.oauth2Client.setCredentials({
        access_token: integration.access_token,
        refresh_token: integration.refresh_token
      })

      await this.calendar.events.delete({
        calendarId: integration.external_calendar_id,
        eventId: eventId
      })
    } catch (error) {
      console.error('Error deleting event from Google Calendar:', error)
      throw error
    }
  }

  /**
   * Get integration by organization ID
   */
  async getIntegration(organizationId: string): Promise<CalendarIntegration | null> {
    const { data: integration, error } = await supabase
      .from('calendar_integrations')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('provider', 'google')
      .eq('is_active', true)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // No integration found
      }
      throw new Error(`Database error: ${error.message}`)
    }

    return integration
  }

  /**
   * Check if token needs refresh
   */
  needsTokenRefresh(integration: CalendarIntegration): boolean {
    if (!integration.token_expires_at) return false
    const now = new Date()
    const expiresAt = new Date(integration.token_expires_at)
    const bufferTime = 5 * 60 * 1000 // 5 minutes buffer
    return now.getTime() + bufferTime >= expiresAt.getTime()
  }
}

// Export singleton instance
export const googleCalendarService = new GoogleCalendarService()
