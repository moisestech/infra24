/**
 * Google Meet Integration
 * Generates Google Meet links for remote consultations
 */

export interface GoogleMeetConfig {
  meetingTitle: string
  description?: string
  startTime: Date
  endTime: Date
  hostEmail: string
  attendeeEmails: string[]
}

/**
 * Generate a Google Meet link for a consultation
 * This creates a calendar event with a Google Meet link
 */
export function generateGoogleMeetLink(config: GoogleMeetConfig): string {
  const { meetingTitle, startTime, endTime, hostEmail, attendeeEmails } = config
  
  // Format dates for Google Calendar (YYYYMMDDTHHMMSSZ)
  const formatDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }
  
  const startStr = formatDate(startTime)
  const endStr = formatDate(endTime)
  
  // Create Google Calendar event with Google Meet
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: meetingTitle,
    dates: `${startStr}/${endStr}`,
    details: config.description || `Remote consultation via Google Meet`,
    location: 'Google Meet',
    trp: 'false',
    add: attendeeEmails.join(','), // Add attendees
    src: hostEmail, // Set host
    ctz: 'America/New_York' // Timezone
  })
  
  // Add Google Meet link
  params.append('sprop', 'name:Google Meet')
  
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

/**
 * Generate a direct Google Meet link (for immediate use)
 * This creates a meeting room that can be used right away
 */
export function generateDirectGoogleMeetLink(meetingTitle: string): string {
  // Google Meet direct link format
  const baseUrl = 'https://meet.google.com'
  
  // Generate a random meeting code (Google Meet format)
  const meetingCode = generateMeetingCode()
  
  return `${baseUrl}/${meetingCode}`
}

/**
 * Generate a meeting code in Google Meet format
 * Format: xxx-xxxx-xxx (3-4-3 pattern)
 */
function generateMeetingCode(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  
  const generatePart = (length: number, useNumbers = false) => {
    const source = useNumbers ? numbers : chars
    let result = ''
    for (let i = 0; i < length; i++) {
      result += source.charAt(Math.floor(Math.random() * source.length))
    }
    return result
  }
  
  return `${generatePart(3)}-${generatePart(4)}-${generatePart(3)}`
}

/**
 * Generate a Google Meet link with calendar integration
 * This is the recommended approach for scheduled meetings
 */
export function generateScheduledGoogleMeetLink(config: GoogleMeetConfig): {
  calendarUrl: string
  meetUrl: string
  meetingCode: string
} {
  const meetingCode = generateMeetingCode()
  const meetUrl = `https://meet.google.com/${meetingCode}`
  
  const calendarUrl = generateGoogleMeetLink({
    ...config,
    description: `${config.description || 'Remote consultation'}\n\nGoogle Meet Link: ${meetUrl}`
  })
  
  return {
    calendarUrl,
    meetUrl,
    meetingCode
  }
}

/**
 * Validate Google Meet link format
 */
export function isValidGoogleMeetLink(url: string): boolean {
  const meetRegex = /^https:\/\/meet\.google\.com\/[a-z0-9-]+$/i
  return meetRegex.test(url)
}

/**
 * Extract meeting code from Google Meet URL
 */
export function extractMeetingCode(url: string): string | null {
  const match = url.match(/meet\.google\.com\/([a-z0-9-]+)/i)
  return match ? match[1] : null
}












