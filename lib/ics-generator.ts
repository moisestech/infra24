// import { createEvent } from 'ics'

export interface ICSBookingData {
  bookingId: string
  title: string
  description: string
  startTime: Date
  endTime: Date
  location: string
  artistName: string
  artistEmail: string
  hostEmail: string
  hostName?: string
  organizationName: string
  meetingUrl?: string
}

export function generateICS(data: ICSBookingData): string {
  const start = data.startTime
  const end = data.endTime

  // Format dates for ICS (YYYYMMDDTHHMMSSZ)
  const formatDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }

  const startStr = formatDate(start)
  const endStr = formatDate(end)
  const nowStr = formatDate(new Date())

  // Generate ICS content manually
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'CALSCALE:GREGORIAN',
    'PRODID:-//Infra24//Booking System//EN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:booking-${data.bookingId}@infra24.com`,
    `DTSTAMP:${nowStr}`,
    `DTSTART:${startStr}`,
    `DTEND:${endStr}`,
    `SUMMARY:${data.title}`,
    `DESCRIPTION:${data.description}\\n\\nArtist: ${data.artistName} (${data.artistEmail})\\nHost: ${data.hostName || data.hostEmail}\\nOrganization: ${data.organizationName}\\n\\nBooked via Infra24`,
    `LOCATION:${data.location}`,
    `STATUS:CONFIRMED`,
    `ORGANIZER:CN=${data.hostName || data.hostEmail}:mailto:${data.hostEmail}`,
    `ATTENDEE:CN=${data.artistName}:mailto:${data.artistEmail}`,
    `ATTENDEE:CN=${data.hostName || data.hostEmail}:mailto:${data.hostEmail}`,
    'CATEGORIES:Consultation,Infra24',
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder: Consultation starting in 15 minutes',
    'TRIGGER:-PT15M',
    'END:VALARM',
    'BEGIN:VALARM',
    'ACTION:EMAIL',
    'DESCRIPTION:Reminder: Consultation starting in 1 hour',
    'TRIGGER:-PT1H',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n')

  return icsContent
}

export function generateICSFileName(bookingId: string, title: string): string {
  // Clean the title for filename
  const cleanTitle = title
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase()
    .substring(0, 30)
  
  return `${cleanTitle}-${bookingId.substring(0, 8)}.ics`
}

export function generateGoogleCalendarUrl(data: ICSBookingData): string {
  const start = data.startTime
  const end = data.endTime
  
  // Format dates for Google Calendar (YYYYMMDDTHHMMSSZ)
  const formatDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }
  
  const startStr = formatDate(start)
  const endStr = formatDate(end)
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: data.title,
    dates: `${startStr}/${endStr}`,
    details: `${data.description}\n\nArtist: ${data.artistName} (${data.artistEmail})\nHost: ${data.hostName || data.hostEmail}\nOrganization: ${data.organizationName}\n\nBooked via Infra24`,
    location: data.location,
    trp: 'false'
  })
  
  if (data.meetingUrl) {
    params.append('sprop', data.meetingUrl)
  }
  
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export function generateOutlookCalendarUrl(data: ICSBookingData): string {
  const start = data.startTime
  const end = data.endTime
  
  // Format dates for Outlook Calendar
  const formatDate = (date: Date) => {
    return date.toISOString()
  }
  
  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: data.title,
    startdt: formatDate(start),
    enddt: formatDate(end),
    body: `${data.description}\n\nArtist: ${data.artistName} (${data.artistEmail})\nHost: ${data.hostName || data.hostEmail}\nOrganization: ${data.organizationName}\n\nBooked via Infra24`,
    location: data.location
  })
  
  if (data.meetingUrl) {
    params.append('online', 'true')
    params.append('onlineurl', data.meetingUrl)
  }
  
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`
}
