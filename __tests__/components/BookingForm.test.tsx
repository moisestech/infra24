import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BookingForm } from '@/components/booking/BookingForm'

// Mock the useTenant hook
jest.mock('@/hooks/useTenant', () => ({
  useTenant: () => ({
    tenantConfig: {
      theme: {
        primary: '#00BCD4',
        primaryDark: '#0097A7',
        primaryAlpha: 'rgba(0, 188, 212, 0.1)'
      }
    }
  })
}))

// Mock fetch
global.fetch = jest.fn()

describe('BookingForm', () => {
  const mockResources = [
    {
      id: 'resource-1',
      name: 'Remote Studio Visit',
      type: 'space',
      is_bookable: true,
      metadata: {
        description: '30-minute remote consultation',
        duration_minutes: 30
      }
    },
    {
      id: 'resource-2',
      name: 'Print Room Consult',
      type: 'space',
      is_bookable: false,
      metadata: {
        description: 'Print room consultation',
        duration_minutes: 30,
        status: 'maintenance'
      }
    }
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    ;(fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResources)
    })
  })

  it('renders booking form with resource selection', async () => {
    render(<BookingForm />)

    await waitFor(() => {
      expect(screen.getByText('Select Equipment')).toBeInTheDocument()
    })

    expect(screen.getByText('Remote Studio Visit')).toBeInTheDocument()
    expect(screen.getByText('Print Room Consult')).toBeInTheDocument()
  })

  it('shows equipment status badges', async () => {
    render(<BookingForm />)

    await waitFor(() => {
      expect(screen.getByText('Available')).toBeInTheDocument()
      expect(screen.getByText('Maintenance')).toBeInTheDocument()
    })
  })

  it('disables unbookable equipment', async () => {
    render(<BookingForm />)

    await waitFor(() => {
      const printRoomOption = screen.getByText('Print Room Consult')
      expect(printRoomOption.closest('button')).toBeDisabled()
    })
  })

  it('shows status information for selected equipment', async () => {
    render(<BookingForm />)

    await waitFor(() => {
      const remoteVisitOption = screen.getByText('Remote Studio Visit')
      fireEvent.click(remoteVisitOption)
    })

    await waitFor(() => {
      expect(screen.getByText('Equipment Status')).toBeInTheDocument()
      expect(screen.getByText('Available')).toBeInTheDocument()
    })
  })

  it('prevents submission for unbookable equipment', async () => {
    render(<BookingForm />)

    await waitFor(() => {
      const printRoomOption = screen.getByText('Print Room Consult')
      fireEvent.click(printRoomOption)
    })

    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: /book consultation/i })
      expect(submitButton).toBeDisabled()
    })
  })

  it('submits booking form with valid data', async () => {
    ;(fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResources)
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          booking_id: 'test-booking-id',
          confirmation_url: '/bookings/confirmation/test-booking-id'
        })
      })

    render(<BookingForm />)

    await waitFor(() => {
      const remoteVisitOption = screen.getByText('Remote Studio Visit')
      fireEvent.click(remoteVisitOption)
    })

    // Fill out form
    fireEvent.change(screen.getByLabelText(/artist name/i), {
      target: { value: 'Test Artist' }
    })
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    })
    fireEvent.change(screen.getByLabelText(/goal/i), {
      target: { value: 'Portfolio review' }
    })

    // Submit form
    const submitButton = screen.getByRole('button', { name: /book consultation/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/bookings', expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: expect.stringContaining('Test Artist')
      }))
    })
  })
})



