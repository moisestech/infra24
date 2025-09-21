import { google } from 'googleapis'

// Google Calendar integration for booking reminders
export class GoogleCalendarService {
  private calendar: any

  constructor() {
    // Initialize Google Calendar API
    // Note: This requires proper OAuth setup and service account credentials
    this.calendar = google.calendar({
      version: 'v3',
      auth: new google.auth.GoogleAuth({
        credentials: {
          client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
          private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        },
        scopes: ['https://www.googleapis.com/auth/calendar'],
      }),
    })
  }

  async createEvent(booking: any, userEmail?: string) {
    try {
      const startDate = new Date(booking.start_time)
      const endDate = new Date(booking.end_time)

      const event = {
        summary: `${booking.title} - ${booking.resources.title}`,
        description: `
Digital Lab Booking

Resource: ${booking.resources.title}
Location: ${booking.resources.location}
Duration: ${Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60))} minutes
Price: $${booking.price} ${booking.currency}

${booking.description ? `Project: ${booking.description}` : ''}
${booking.notes ? `Notes: ${booking.notes}` : ''}

Booked through ${booking.organizations.name} Digital Lab
        `.trim(),
        start: {
          dateTime: startDate.toISOString(),
          timeZone: 'America/New_York', // Adjust based on organization location
        },
        end: {
          dateTime: endDate.toISOString(),
          timeZone: 'America/New_York',
        },
        location: booking.resources.location,
        attendees: userEmail ? [{ email: userEmail }] : [],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // 24 hours before
            { method: 'popup', minutes: 60 }, // 1 hour before
            { method: 'popup', minutes: 15 }, // 15 minutes before
          ],
        },
        source: {
          title: `${booking.organizations.name} Digital Lab`,
          url: `https://${booking.organizations.slug}.infra24.digital/digital-lab`,
        },
        extendedProperties: {
          private: {
            bookingId: booking.id,
            organizationId: booking.organization_id,
            resourceId: booking.resource_id,
          },
        },
      }

      const response = await this.calendar.events.insert({
        calendarId: 'primary', // Use organization's calendar ID
        resource: event,
        sendUpdates: 'all',
      })

      return {
        success: true,
        eventId: response.data.id,
        eventLink: response.data.htmlLink,
      }
    } catch (error) {
      console.error('Error creating Google Calendar event:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  async updateEvent(eventId: string, booking: any) {
    try {
      const startDate = new Date(booking.start_time)
      const endDate = new Date(booking.end_time)

      const event = {
        summary: `${booking.title} - ${booking.resources.title}`,
        description: `
Digital Lab Booking

Resource: ${booking.resources.title}
Location: ${booking.resources.location}
Duration: ${Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60))} minutes
Price: $${booking.price} ${booking.currency}

${booking.description ? `Project: ${booking.description}` : ''}
${booking.notes ? `Notes: ${booking.notes}` : ''}

Booked through ${booking.organizations.name} Digital Lab
        `.trim(),
        start: {
          dateTime: startDate.toISOString(),
          timeZone: 'America/New_York',
        },
        end: {
          dateTime: endDate.toISOString(),
          timeZone: 'America/New_York',
        },
        location: booking.resources.location,
      }

      const response = await this.calendar.events.update({
        calendarId: 'primary',
        eventId: eventId,
        resource: event,
        sendUpdates: 'all',
      })

      return {
        success: true,
        eventId: response.data.id,
        eventLink: response.data.htmlLink,
      }
    } catch (error) {
      console.error('Error updating Google Calendar event:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  async deleteEvent(eventId: string) {
    try {
      await this.calendar.events.delete({
        calendarId: 'primary',
        eventId: eventId,
        sendUpdates: 'all',
      })

      return { success: true }
    } catch (error) {
      console.error('Error deleting Google Calendar event:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  // Generate Google Calendar link for manual addition
  generateCalendarLink(booking: any): string {
    const startDate = new Date(booking.start_time)
    const endDate = new Date(booking.end_time)
    
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    }

    const title = encodeURIComponent(`${booking.title} - ${booking.resources.title}`)
    const details = encodeURIComponent(`
Digital Lab Booking

Resource: ${booking.resources.title}
Location: ${booking.resources.location}
Duration: ${Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60))} minutes
Price: $${booking.price} ${booking.currency}

${booking.description ? `Project: ${booking.description}` : ''}
${booking.notes ? `Notes: ${booking.notes}` : ''}

Booked through ${booking.organizations.name} Digital Lab
    `.trim())
    
    const location = encodeURIComponent(booking.resources.location)
    const start = formatDate(startDate)
    const end = formatDate(endDate)

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`
  }
}

// Export singleton instance
export const googleCalendarService = new GoogleCalendarService()
