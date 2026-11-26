import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { BookingForm } from '@/components/booking/BookingForm'
import type { Resource } from '@/types/booking'

// Match the actual tenant hook used by BookingForm (the former test mocked a
// retired hook and tested a retired fetch-based form instead).
jest.mock('@/components/tenant/TenantProvider', () => ({
  useTenant: () => ({
    tenantConfig: {
      theme: { primaryColor: '#00BCD4', secondaryColor: '#0097A7' },
    },
  }),
}))

const resourceId = 'e2a845d4-a421-4c27-a13e-80be430b1111'
const maintenanceResourceId = 'e2a845d4-a421-4c27-a13e-80be430b2222'

const availableEquipment: Resource = {
  id: resourceId,
  organization_id: 'org-test',
  type: 'equipment',
  title: 'Remote Studio Visit',
  description: 'A remote consultation',
  capacity: 1,
  price: 0,
  currency: 'USD',
  is_active: true,
  is_bookable: true,
  metadata: { status: 'available' },
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
  created_by: 'test-user',
  updated_by: 'test-user',
}

const maintenanceEquipment: Resource = {
  ...availableEquipment,
  id: maintenanceResourceId,
  title: 'Print Room Consult',
  is_bookable: false,
  metadata: { status: 'maintenance' },
}

describe('BookingForm — current controlled booking contract', () => {
  const onSubmit = jest.fn<Promise<void>, [unknown]>()
  const onCancel = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    onSubmit.mockResolvedValue(undefined)
  })

  function renderBooking(props: { preSelectedResource?: string; resources?: Resource[] } = {}) {
    return render(
      <BookingForm
        organizationId="org-test"
        resources={props.resources ?? [availableEquipment, maintenanceEquipment]}
        onSubmit={onSubmit}
        onCancel={onCancel}
        {...(props.preSelectedResource ? { preSelectedResource: props.preSelectedResource } : {})}
      />
    )
  }

  it('renders the equipment booking form and its required title', () => {
    renderBooking()
    expect(screen.getByText('Equipment Booking')).toBeInTheDocument()
    expect(screen.getByLabelText(/Booking Title/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save Booking' })).toBeEnabled()
  })

  it('shows the selected available equipment status', async () => {
    renderBooking({ preSelectedResource: resourceId })
    expect(await screen.findByText('This equipment is available for booking')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save Booking' })).toBeEnabled()
  })

  it('prevents saving unavailable or maintenance equipment', async () => {
    renderBooking({ preSelectedResource: maintenanceResourceId })
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Save Booking' })).toBeDisabled()
    })
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('calls the supplied cancel callback', () => {
    renderBooking()
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('requires a title before invoking the booking callback', async () => {
    renderBooking({ preSelectedResource: resourceId })
    fireEvent.click(screen.getByRole('button', { name: 'Save Booking' }))
    expect(await screen.findByText('Title is required')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits a validated booking through onSubmit, not fetch', async () => {
    renderBooking({ preSelectedResource: resourceId })
    fireEvent.change(screen.getByLabelText(/Booking Title/i), {
      target: { value: 'Portfolio review' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Save Booking' }))
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
        organizationId: 'org-test',
        resourceId,
        title: 'Portfolio review',
        startTime: expect.any(String),
        endTime: expect.any(String),
      }))
    })
    expect(onSubmit).toHaveBeenCalledTimes(1)
  })
})
