import { google } from 'googleapis'
import { getSupabaseAdmin } from '@/lib/supabase'

export interface CalendarEvent {
  id?: string
  title: string
  description?: string
  startTime: Date
  endTime: Date
  location?: string
  attendees?: Array<{
    email: string
    name?: string
    responseStatus?: 'accepted' | 'declined' | 'tentative' | 'needsAction'
  }>
  metadata?: Record<string, any>
}

export interface CalendarAvailability {
  startTime: Date
  endTime: Date
  isAvailable: boolean
  reason?: string
}

export class GoogleCalendarService {
  private static oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CALENDAR_CLIENT_ID,
    process.env.GOOGLE_CALENDAR_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`
  )

  /**
   * Get user's Google Calendar access token from database
   */
  private static async getUserAccessToken(userId: string): Promise<string | null> {
    try {
      const supabase = getSupabaseAdmin()
      const { data, error } = await supabase
        .from('user_calendar_tokens')
        .select('access_token, refresh_token, expires_at')
        .eq('user_id', userId)
        .eq('provider', 'google')
        .single()

      if (error || !data) {
        return null
      }

      // Check if token is expired and refresh if needed
      if (data.expires_at && new Date(data.expires_at) <= new Date()) {
        return await this.refreshAccessToken(userId, data.refresh_token)
      }

      return data.access_token
    } catch (error) {
      console.error('Error getting user access token:', error)
      return null
    }
  }

  /**
   * Refresh expired access token
   */
  private static async refreshAccessToken(userId: string, refreshToken: string): Promise<string | null> {
    try {
      this.oauth2Client.setCredentials({
        refresh_token: refreshToken
      })

      const { credentials } = await this.oauth2Client.refreshAccessToken()
      
      if (!credentials.access_token) {
        return null
      }

      // Update token in database
      const supabase = getSupabaseAdmin()
      await supabase
        .from('user_calendar_tokens')
        .update({
          access_token: credentials.access_token,
          expires_at: credentials.expiry_date ? new Date(credentials.expiry_date).toISOString() : null,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('provider', 'google')

      return credentials.access_token
    } catch (error) {
      console.error('Error refreshing access token:', error)
      return null
    }
  }

  /**
   * Check availability for a specific time range
   */
  static async checkAvailability(
    userId: string,
    calendarId: string,
    startTime: Date,
    endTime: Date
  ): Promise<CalendarAvailability[]> {
    try {
      const accessToken = await this.getUserAccessToken(userId)
      if (!accessToken) {
        return [{
          startTime,
          endTime,
          isAvailable: false,
          reason: 'No calendar access token found'
        }]
      }

      this.oauth2Client.setCredentials({
        access_token: accessToken
      })

      const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client })

      // Get busy times for the specified range
      const response = await calendar.freebusy.query({
        requestBody: {
          timeMin: startTime.toISOString(),
          timeMax: endTime.toISOString(),
          items: [{ id: calendarId }]
        }
      })

      const busyTimes = response.data.calendars?.[calendarId]?.busy || []
      
      // Convert busy times to availability
      const availability: CalendarAvailability[] = []
      
      if (busyTimes.length === 0) {
        availability.push({
          startTime,
          endTime,
          isAvailable: true
        })
      } else {
        // Check for conflicts
        let currentTime = new Date(startTime)
        
        for (const busyTime of busyTimes) {
          const busyStart = new Date(busyTime.start!)
          const busyEnd = new Date(busyTime.end!)
          
          // Add available time before busy period
          if (currentTime < busyStart) {
            availability.push({
              startTime: new Date(currentTime),
              endTime: new Date(busyStart),
              isAvailable: true
            })
          }
          
          // Add busy time
          availability.push({
            startTime: new Date(busyStart),
            endTime: new Date(busyEnd),
            isAvailable: false,
            reason: 'Calendar conflict'
          })
          
          currentTime = new Date(busyEnd)
        }
        
        // Add remaining available time
        if (currentTime < endTime) {
          availability.push({
            startTime: new Date(currentTime),
            endTime: new Date(endTime),
            isAvailable: true
          })
        }
      }

      return availability
    } catch (error) {
      console.error('Error checking calendar availability:', error)
      return [{
        startTime,
        endTime,
        isAvailable: false,
        reason: 'Error checking calendar'
      }]
    }
  }

  /**
   * Create a calendar event
   */
  static async createEvent(
    userId: string,
    calendarId: string,
    event: CalendarEvent
  ): Promise<{ success: boolean; eventId?: string; error?: string }> {
    try {
      const accessToken = await this.getUserAccessToken(userId)
      if (!accessToken) {
        return { success: false, error: 'No calendar access token found' }
      }

      this.oauth2Client.setCredentials({
        access_token: accessToken
      })

      const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client })

      const calendarEvent = {
        summary: event.title,
        description: event.description,
        start: {
          dateTime: event.startTime.toISOString(),
          timeZone: 'UTC'
        },
        end: {
          dateTime: event.endTime.toISOString(),
          timeZone: 'UTC'
        },
        location: event.location,
        attendees: event.attendees?.map(attendee => ({
          email: attendee.email,
          displayName: attendee.name,
          responseStatus: attendee.responseStatus || 'needsAction'
        })),
        extendedProperties: {
          private: event.metadata || {}
        }
      }

      const response = await calendar.events.insert({
        calendarId,
        requestBody: calendarEvent
      })

      return {
        success: true,
        eventId: response.data.id || undefined
      }
    } catch (error) {
      console.error('Error creating calendar event:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Update a calendar event
   */
  static async updateEvent(
    userId: string,
    calendarId: string,
    eventId: string,
    event: Partial<CalendarEvent>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const accessToken = await this.getUserAccessToken(userId)
      if (!accessToken) {
        return { success: false, error: 'No calendar access token found' }
      }

      this.oauth2Client.setCredentials({
        access_token: accessToken
      })

      const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client })

      const updateData: any = {}
      
      if (event.title) updateData.summary = event.title
      if (event.description) updateData.description = event.description
      if (event.startTime) updateData.start = { dateTime: event.startTime.toISOString(), timeZone: 'UTC' }
      if (event.endTime) updateData.end = { dateTime: event.endTime.toISOString(), timeZone: 'UTC' }
      if (event.location) updateData.location = event.location
      if (event.attendees) {
        updateData.attendees = event.attendees.map(attendee => ({
          email: attendee.email,
          displayName: attendee.name,
          responseStatus: attendee.responseStatus || 'needsAction'
        }))
      }
      if (event.metadata) {
        updateData.extendedProperties = { private: event.metadata }
      }

      await calendar.events.update({
        calendarId,
        eventId,
        requestBody: updateData
      })

      return { success: true }
    } catch (error) {
      console.error('Error updating calendar event:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Delete a calendar event
   */
  static async deleteEvent(
    userId: string,
    calendarId: string,
    eventId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const accessToken = await this.getUserAccessToken(userId)
      if (!accessToken) {
        return { success: false, error: 'No calendar access token found' }
      }

      this.oauth2Client.setCredentials({
        access_token: accessToken
      })

      const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client })

      await calendar.events.delete({
        calendarId,
        eventId
      })

      return { success: true }
    } catch (error) {
      console.error('Error deleting calendar event:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Get user's calendar list
   */
  static async getCalendarList(userId: string): Promise<{ success: boolean; calendars?: any[]; error?: string }> {
    try {
      const accessToken = await this.getUserAccessToken(userId)
      if (!accessToken) {
        return { success: false, error: 'No calendar access token found' }
      }

      this.oauth2Client.setCredentials({
        access_token: accessToken
      })

      const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client })

      const response = await calendar.calendarList.list()

      return {
        success: true,
        calendars: response.data.items || []
      }
    } catch (error) {
      console.error('Error getting calendar list:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Generate OAuth URL for calendar authorization
   */
  static getAuthUrl(userId: string): string {
    const scopes = [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events'
    ]

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      state: userId, // Pass user ID in state for callback
      prompt: 'consent' // Force consent to get refresh token
    })
  }

  /**
   * Exchange authorization code for tokens
   */
  static async exchangeCodeForTokens(code: string, userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { tokens } = await this.oauth2Client.getToken(code)
      
      if (!tokens.access_token) {
        return { success: false, error: 'No access token received' }
      }

      // Store tokens in database
      const supabase = getSupabaseAdmin()
      const { error } = await supabase
        .from('user_calendar_tokens')
        .upsert({
          user_id: userId,
          provider: 'google',
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          expires_at: tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : null,
          scope: tokens.scope,
          updated_at: new Date().toISOString()
        })

      if (error) {
        throw error
      }

      return { success: true }
    } catch (error) {
      console.error('Error exchanging code for tokens:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}
