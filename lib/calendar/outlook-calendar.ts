import { ConfidentialClientApplication } from '@azure/msal-node'
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
    responseStatus?: 'accepted' | 'declined' | 'tentative' | 'none'
  }>
  metadata?: Record<string, any>
}

export interface CalendarAvailability {
  startTime: Date
  endTime: Date
  isAvailable: boolean
  reason?: string
}

export class OutlookCalendarService {
  private static msalInstance: ConfidentialClientApplication | null = null

  private static getMsalInstance(): ConfidentialClientApplication {
    if (!this.msalInstance) {
      if (!process.env.MICROSOFT_CLIENT_ID || !process.env.MICROSOFT_CLIENT_SECRET) {
        throw new Error('Microsoft Graph API credentials not configured')
      }
      
      const msalConfig = {
        auth: {
          clientId: process.env.MICROSOFT_CLIENT_ID,
          clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
          authority: 'https://login.microsoftonline.com/common'
        }
      }
      
      this.msalInstance = new ConfidentialClientApplication(msalConfig)
    }
    return this.msalInstance
  }

  /**
   * Get user's Microsoft Graph access token from database
   */
  private static async getUserAccessToken(userId: string): Promise<string | null> {
    try {
      const supabase = getSupabaseAdmin()
      const { data, error } = await supabase
        .from('user_calendar_tokens')
        .select('access_token, refresh_token, expires_at')
        .eq('user_id', userId)
        .eq('provider', 'microsoft')
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
      const refreshTokenRequest = {
        refreshToken: refreshToken,
        scopes: ['https://graph.microsoft.com/calendars.readwrite']
      }

      const response = await this.getMsalInstance().acquireTokenByRefreshToken(refreshTokenRequest)
      
      if (!response?.accessToken) {
        return null
      }

      // Update token in database
      const supabase = getSupabaseAdmin()
      await supabase
        .from('user_calendar_tokens')
        .update({
          access_token: response.accessToken,
          expires_at: response.expiresOn ? new Date(response.expiresOn).toISOString() : null,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('provider', 'microsoft')

      return response.accessToken
    } catch (error) {
      console.error('Error refreshing access token:', error)
      return null
    }
  }

  /**
   * Get Microsoft Graph client with authentication
   */
  private static async getGraphClient(userId: string): Promise<any | null> {
    try {
      const accessToken = await this.getUserAccessToken(userId)
      if (!accessToken) {
        return null
      }

      // Only initialize the client if we have a valid access token
      if (accessToken && accessToken.length > 0) {
        // Dynamic import to avoid initialization during build
        const { Client } = await import('@microsoft/microsoft-graph-client')
        return Client.init({
          authProvider: (done: any) => {
            done(null, accessToken)
          }
        })
      }
      
      return null
    } catch (error) {
      console.error('Error creating Graph client:', error)
      return null
    }
  }

  /**
   * Check availability for a specific time range
   */
  static async checkAvailability(
    userId: string,
    startTime: Date,
    endTime: Date
  ): Promise<CalendarAvailability[]> {
    try {
      const graphClient = await this.getGraphClient(userId)
      if (!graphClient) {
        return [{
          startTime,
          endTime,
          isAvailable: false,
          reason: 'No calendar access token found'
        }]
      }

      // Get calendar events for the specified range
      const events = await graphClient
        .api('/me/calendar/calendarView')
        .query({
          startDateTime: startTime.toISOString(),
          endDateTime: endTime.toISOString()
        })
        .get()

      const busyTimes = events.value || []
      
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
        
        for (const event of busyTimes) {
          const eventStart = new Date(event.start.dateTime)
          const eventEnd = new Date(event.end.dateTime)
          
          // Add available time before busy period
          if (currentTime < eventStart) {
            availability.push({
              startTime: new Date(currentTime),
              endTime: new Date(eventStart),
              isAvailable: true
            })
          }
          
          // Add busy time
          availability.push({
            startTime: new Date(eventStart),
            endTime: new Date(eventEnd),
            isAvailable: false,
            reason: `Calendar conflict: ${event.subject}`
          })
          
          currentTime = new Date(eventEnd)
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
    event: CalendarEvent
  ): Promise<{ success: boolean; eventId?: string; error?: string }> {
    try {
      const graphClient = await this.getGraphClient(userId)
      if (!graphClient) {
        return { success: false, error: 'No calendar access token found' }
      }

      const calendarEvent = {
        subject: event.title,
        body: {
          contentType: 'text',
          content: event.description || ''
        },
        start: {
          dateTime: event.startTime.toISOString(),
          timeZone: 'UTC'
        },
        end: {
          dateTime: event.endTime.toISOString(),
          timeZone: 'UTC'
        },
        location: event.location ? {
          displayName: event.location
        } : undefined,
        attendees: event.attendees?.map(attendee => ({
          emailAddress: {
            address: attendee.email,
            name: attendee.name
          },
          type: 'required'
        })),
        singleValueExtendedProperties: event.metadata ? Object.entries(event.metadata).map(([key, value]) => ({
          id: `String {${key}} Name Infra24`,
          value: String(value)
        })) : undefined
      }

      const response = await graphClient
        .api('/me/events')
        .post(calendarEvent)

      return {
        success: true,
        eventId: response.id
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
    eventId: string,
    event: Partial<CalendarEvent>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const graphClient = await this.getGraphClient(userId)
      if (!graphClient) {
        return { success: false, error: 'No calendar access token found' }
      }

      const updateData: any = {}
      
      if (event.title) updateData.subject = event.title
      if (event.description) updateData.body = { contentType: 'text', content: event.description }
      if (event.startTime) updateData.start = { dateTime: event.startTime.toISOString(), timeZone: 'UTC' }
      if (event.endTime) updateData.end = { dateTime: event.endTime.toISOString(), timeZone: 'UTC' }
      if (event.location) updateData.location = { displayName: event.location }
      if (event.attendees) {
        updateData.attendees = event.attendees.map(attendee => ({
          emailAddress: {
            address: attendee.email,
            name: attendee.name
          },
          type: 'required'
        }))
      }
      if (event.metadata) {
        updateData.singleValueExtendedProperties = Object.entries(event.metadata).map(([key, value]) => ({
          id: `String {${key}} Name Infra24`,
          value: String(value)
        }))
      }

      await graphClient
        .api(`/me/events/${eventId}`)
        .patch(updateData)

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
    eventId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const graphClient = await this.getGraphClient(userId)
      if (!graphClient) {
        return { success: false, error: 'No calendar access token found' }
      }

      await graphClient
        .api(`/me/events/${eventId}`)
        .delete()

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
      const graphClient = await this.getGraphClient(userId)
      if (!graphClient) {
        return { success: false, error: 'No calendar access token found' }
      }

      const response = await graphClient
        .api('/me/calendars')
        .get()

      return {
        success: true,
        calendars: response.value || []
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
  static async getAuthUrl(userId: string): Promise<string> {
    const authCodeUrlParameters = {
      scopes: ['https://graph.microsoft.com/calendars.readwrite'],
      redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/microsoft/callback`,
      state: userId // Pass user ID in state for callback
    }

    return await this.getMsalInstance().getAuthCodeUrl(authCodeUrlParameters)
  }

  /**
   * Exchange authorization code for tokens
   */
  static async exchangeCodeForTokens(code: string, userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const tokenRequest = {
        code: code,
        scopes: ['https://graph.microsoft.com/calendars.readwrite'],
        redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/microsoft/callback`
      }

      const response = await this.getMsalInstance().acquireTokenByCode(tokenRequest)
      
      if (!response?.accessToken) {
        return { success: false, error: 'No access token received' }
      }

      // Store tokens in database
      const supabase = getSupabaseAdmin()
      const { error } = await supabase
        .from('user_calendar_tokens')
        .upsert({
          user_id: userId,
          provider: 'microsoft',
          access_token: response.accessToken,
          refresh_token: response.refreshOn,
          expires_at: response.expiresOn ? new Date(response.expiresOn).toISOString() : null,
          scope: response.scopes?.join(' '),
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
