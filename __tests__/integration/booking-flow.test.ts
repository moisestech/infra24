import { test, expect } from '@playwright/test'

test.describe('Booking Flow Integration', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API responses
    await page.route('**/api/organizations/*/resources', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'remote-visit-id',
            name: 'Remote Studio Visit',
            type: 'space',
            is_bookable: true,
            metadata: {
              description: '30-minute remote consultation',
              duration_minutes: 30,
              availability_rules: {
                timezone: 'America/New_York',
                slot_minutes: 30,
                windows: [
                  {
                    by: 'host',
                    host: 'mo@oolite.org',
                    days: ['Tue', 'Wed', 'Thu'],
                    start: '12:00',
                    end: '16:00'
                  }
                ]
              }
            }
          }
        ])
      })
    })

    await page.route('**/api/availability*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          resource_id: 'remote-visit-id',
          timezone: 'America/New_York',
          slot_minutes: 30,
          slots: [
            {
              start: '2025-01-15T12:00:00-05:00',
              end: '2025-01-15T12:30:00-05:00',
              host: 'mo@oolite.org'
            }
          ]
        })
      })
    })

    await page.route('**/api/bookings', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            booking_id: 'test-booking-id',
            confirmation_url: '/bookings/confirmation/test-booking-id',
            reschedule_url: '/api/bookings/test-booking-id/reschedule',
            cancel_url: '/api/bookings/test-booking-id/cancel'
          })
        })
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([])
        })
      }
    })
  })

  test('complete booking flow from public page to confirmation', async ({ page }) => {
    // Navigate to public booking page
    await page.goto('/book')

    // Verify page loads
    await expect(page.getByText('Book a Consultation')).toBeVisible()

    // Select Remote Studio Visit
    await page.getByText('Remote Studio Visit').click()

    // Fill out the form
    await page.fill('input[name="artist_name"]', 'Test Artist')
    await page.fill('input[name="artist_email"]', 'test@example.com')
    await page.fill('textarea[name="goal_text"]', 'Portfolio review and feedback')

    // Select a date (mock date picker)
    await page.getByText('Select Date').click()
    await page.getByText('15').click() // January 15th

    // Select a time slot
    await page.getByText('12:00 PM').click()

    // Submit the booking
    await page.getByRole('button', { name: /book consultation/i }).click()

    // Verify redirect to confirmation page
    await expect(page).toHaveURL(/\/bookings\/confirmation\/test-booking-id/)

    // Verify confirmation page content
    await expect(page.getByText('Booking Confirmed')).toBeVisible()
    await expect(page.getByText('Test Artist')).toBeVisible()
    await expect(page.getByText('Remote Studio Visit')).toBeVisible()
  })

  test('shows equipment status and prevents booking unavailable equipment', async ({ page }) => {
    // Mock unavailable equipment
    await page.route('**/api/organizations/*/resources', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'print-room-id',
            name: 'Print Room Consult',
            type: 'space',
            is_bookable: false,
            metadata: {
              description: 'Print room consultation',
              duration_minutes: 30,
              status: 'maintenance'
            }
          }
        ])
      })
    })

    await page.goto('/book')

    // Verify maintenance badge is shown
    await expect(page.getByText('Maintenance')).toBeVisible()

    // Verify equipment is disabled
    const printRoomButton = page.getByText('Print Room Consult')
    await expect(printRoomButton).toBeDisabled()
  })

  test('handles booking errors gracefully', async ({ page }) => {
    // Mock booking API error
    await page.route('**/api/bookings', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 409,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'Slot no longer available'
          })
        })
      }
    })

    await page.goto('/book')

    // Fill out form
    await page.getByText('Remote Studio Visit').click()
    await page.fill('input[name="artist_name"]', 'Test Artist')
    await page.fill('input[name="artist_email"]', 'test@example.com')
    await page.fill('textarea[name="goal_text"]', 'Portfolio review')

    // Submit booking
    await page.getByRole('button', { name: /book consultation/i }).click()

    // Verify error message is shown
    await expect(page.getByText('Slot no longer available')).toBeVisible()
  })
})



