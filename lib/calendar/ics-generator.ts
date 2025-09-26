import { format, addHours } from 'date-fns'

export interface WorkshopEventData {
  title: string
  description?: string
  startDate: Date
  endDate: Date
  location?: string
  instructor?: string
  organizationName: string
  workshopId: string
  registrationId?: string
  maxParticipants?: number
  currentParticipants?: number
  url?: string
}

/**
 * Generate ICS (iCalendar) content for a workshop event
 */
export function generateWorkshopICS(data: WorkshopEventData): string {
  const {
    title,
    description,
    startDate,
    endDate,
    location,
    instructor,
    organizationName,
    workshopId,
    registrationId,
    maxParticipants,
    currentParticipants,
    url
  } = data

  // Format dates for ICS (UTC format)
  const formatICSDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }

  // Generate unique UID for the event
  const uid = `${workshopId}-${registrationId || 'workshop'}-${Date.now()}@${organizationName.toLowerCase().replace(/\s+/g, '')}.com`

  // Build description with workshop details
  const eventDescription = [
    description || `Join us for ${title}`,
    '',
    'Workshop Details:',
    `• Organization: ${organizationName}`,
    instructor ? `• Instructor: ${instructor}` : '',
    location ? `• Location: ${location}` : '',
    maxParticipants ? `• Capacity: ${currentParticipants || 0}/${maxParticipants} participants` : '',
    registrationId ? `• Registration ID: ${registrationId}` : '',
    '',
    'What to bring:',
    '• Your ID',
    '• Any required materials (check workshop details)',
    '• Arrive 10 minutes early for check-in',
    '',
    'Need help? Contact us for assistance.',
    '',
    url ? `More info: ${url}` : ''
  ].filter(Boolean).join('\\n')

  // Build location string
  const eventLocation = location ? location : `${organizationName} Digital Lab`

  // Generate ICS content
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Infra24//Workshop Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTART:${formatICSDate(startDate)}`,
    `DTEND:${formatICSDate(endDate)}`,
    `DTSTAMP:${formatICSDate(new Date())}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${eventDescription}`,
    `LOCATION:${eventLocation}`,
    `STATUS:CONFIRMED`,
    `TRANSP:OPAQUE`,
    `SEQUENCE:0`,
    `CATEGORIES:WORKSHOP,EDUCATION`,
    `ORGANIZER:CN=${organizationName}:mailto:workshops@${organizationName.toLowerCase().replace(/\s+/g, '')}.com`,
    `URL:${url || ''}`,
    'BEGIN:VALARM',
    'TRIGGER:-PT24H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Workshop reminder - 24 hours',
    'END:VALARM',
    'BEGIN:VALARM',
    'TRIGGER:-PT1H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Workshop reminder - 1 hour',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n')

  return icsContent
}

/**
 * Generate ICS file for workshop registration confirmation
 */
export function generateWorkshopRegistrationICS(data: WorkshopEventData): string {
  const registrationData = {
    ...data,
    title: `[REGISTERED] ${data.title}`,
    description: `You are registered for this workshop. ${data.description || ''}`
  }
  
  return generateWorkshopICS(registrationData)
}

/**
 * Generate ICS file for workshop cancellation
 */
export function generateWorkshopCancellationICS(data: WorkshopEventData): string {
  const cancellationData = {
    ...data,
    title: `[CANCELLED] ${data.title}`,
    description: `This workshop has been cancelled. ${data.description || ''}`
  }
  
  return generateWorkshopICS(cancellationData)
}

/**
 * Generate multiple ICS events for a workshop series
 */
export function generateWorkshopSeriesICS(events: WorkshopEventData[]): string {
  const icsHeader = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Infra24//Workshop Series Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH'
  ]

  const icsFooter = ['END:VCALENDAR']

  const eventBlocks = events.map(event => {
    const icsContent = generateWorkshopICS(event)
    // Extract just the VEVENT block from the full ICS
    const lines = icsContent.split('\r\n')
    const startIndex = lines.findIndex(line => line === 'BEGIN:VEVENT')
    const endIndex = lines.findIndex(line => line === 'END:VEVENT')
    return lines.slice(startIndex, endIndex + 1).join('\r\n')
  })

  return [...icsHeader, ...eventBlocks, ...icsFooter].join('\r\n')
}

/**
 * Helper function to create workshop event data from database records
 */
export function createWorkshopEventData(
  workshop: any,
  organization: any,
  registration?: any,
  baseDate?: Date
): WorkshopEventData {
  // Use provided date or default to next week
  const eventDate = baseDate || addHours(new Date(), 24 * 7) // 1 week from now
  
  // Default workshop duration (3 hours)
  const duration = workshop.duration_minutes ? workshop.duration_minutes / 60 : 3
  const endDate = addHours(eventDate, duration)

  return {
    title: workshop.title,
    description: workshop.description,
    startDate: eventDate,
    endDate: endDate,
    location: workshop.resources?.title || 'Digital Lab',
    instructor: workshop.instructor || workshop.artist_profiles?.name,
    organizationName: organization.name,
    workshopId: workshop.id,
    registrationId: registration?.id,
    maxParticipants: workshop.max_participants,
    currentParticipants: registration ? 1 : 0,
    url: `https://${organization.slug}.infra24.com/workshops/${workshop.id}`
  }
}

/**
 * Generate ICS filename for download
 */
export function generateICSFilename(title: string, date: Date, type: 'workshop' | 'registration' | 'cancellation' = 'workshop'): string {
  const dateStr = format(date, 'yyyy-MM-dd')
  const titleStr = title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 30)
  
  const typePrefix = type === 'registration' ? 'registered-' : type === 'cancellation' ? 'cancelled-' : ''
  
  return `${typePrefix}${titleStr}-${dateStr}.ics`
}
