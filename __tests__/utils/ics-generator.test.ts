import { generateICS } from '@/lib/ics-generator'

describe('ICS Generator', () => {
  const mockBooking = {
    id: 'test-booking-id',
    title: 'Remote Studio Visit — Test Artist',
    description: 'Portfolio review and feedback',
    start_time: '2025-01-15T12:00:00-05:00',
    end_time: '2025-01-15T12:30:00-05:00',
    location: 'Google Meet/Zoom',
    metadata: {
      host: 'mo@oolite.org',
      artist_name: 'Test Artist',
      artist_email: 'test@example.com'
    }
  }

  it('should generate valid ICS content', () => {
    const icsContent = generateICS(mockBooking)

    expect(icsContent).toContain('BEGIN:VCALENDAR')
    expect(icsContent).toContain('END:VCALENDAR')
    expect(icsContent).toContain('BEGIN:VEVENT')
    expect(icsContent).toContain('END:VEVENT')
    expect(icsContent).toContain('SUMMARY:Remote Studio Visit — Test Artist')
    expect(icsContent).toContain('DESCRIPTION:Portfolio review and feedback')
    expect(icsContent).toContain('LOCATION:Google Meet/Zoom')
  })

  it('should format dates correctly', () => {
    const icsContent = generateICS(mockBooking)

    // ICS format: YYYYMMDDTHHMMSSZ
    expect(icsContent).toContain('DTSTART:20250115T170000Z')
    expect(icsContent).toContain('DTEND:20250115T173000Z')
  })

  it('should include UID with booking ID', () => {
    const icsContent = generateICS(mockBooking)

    expect(icsContent).toContain(`UID:${mockBooking.id}@infra24.com`)
  })

  it('should handle missing optional fields', () => {
    const minimalBooking = {
      id: 'minimal-booking-id',
      title: 'Test Booking',
      start_time: '2025-01-15T12:00:00-05:00',
      end_time: '2025-01-15T12:30:00-05:00'
    }

    const icsContent = generateICS(minimalBooking)

    expect(icsContent).toContain('SUMMARY:Test Booking')
    expect(icsContent).toContain('DESCRIPTION:')
    expect(icsContent).toContain('LOCATION:')
  })

  it('should escape special characters in description', () => {
    const bookingWithSpecialChars = {
      ...mockBooking,
      description: 'Meeting with "special" characters & symbols'
    }

    const icsContent = generateICS(bookingWithSpecialChars)

    expect(icsContent).toContain('DESCRIPTION:Meeting with \\"special\\" characters & symbols')
  })

  it('should include organizer information', () => {
    const icsContent = generateICS(mockBooking)

    expect(icsContent).toContain('ORGANIZER:CN=mo@oolite.org:mailto:mo@oolite.org')
  })

  it('should include attendee information', () => {
    const icsContent = generateICS(mockBooking)

    expect(icsContent).toContain('ATTENDEE:CN=Test Artist:mailto:test@example.com')
  })
})















