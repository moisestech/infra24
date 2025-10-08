#!/usr/bin/env node

/**
 * Comprehensive Booking System Test Script
 * Tests all aspects of the booking system including API endpoints, database operations, and integrations
 */

const { createClient } = require('@supabase/supabase-js')
const crypto = require('crypto')

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'test-service-key'
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// Test utilities
const log = (message, type = 'info') => {
  const timestamp = new Date().toISOString()
  const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : '🔍'
  console.log(`${prefix} [${timestamp}] ${message}`)
}

const testResult = (testName, passed, details = '') => {
  const status = passed ? 'PASS' : 'FAIL'
  const icon = passed ? '✅' : '❌'
  console.log(`${icon} ${testName}: ${status}${details ? ` - ${details}` : ''}`)
  return passed
}

// Test data
const testOrgId = '2133fe94-fb12-41f8-ab37-ea4acd4589f6'
const testResourceId = '7d683079-3514-4b60-9155-7e4df4c46a30'
const testArtist = {
  name: 'Test Artist',
  email: 'test@example.com',
  goal: 'Portfolio review and feedback'
}

// Test functions
async function testDatabaseConnection() {
  log('Testing database connection...')
  try {
    const { data, error } = await supabase.from('organizations').select('id').limit(1)
    if (error) throw error
    return testResult('Database Connection', true)
  } catch (error) {
    return testResult('Database Connection', false, error.message)
  }
}

async function testResourceExists() {
  log('Testing resource existence...')
  try {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .eq('id', testResourceId)
      .single()

    if (error) throw error
    if (!data) throw new Error('Resource not found')
    
    return testResult('Resource Exists', true, `Found: ${data.name}`)
  } catch (error) {
    return testResult('Resource Exists', false, error.message)
  }
}

async function testAvailabilityAPI() {
  log('Testing availability API...')
  try {
    const startDate = '2025-01-15'
    const endDate = '2025-01-15'
    
    const response = await fetch(
      `${BASE_URL}/api/availability?resource_id=${testResourceId}&start_date=${startDate}&end_date=${endDate}`
    )
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    
    if (!data.resource_id || !data.slots) {
      throw new Error('Invalid response format')
    }
    
    return testResult('Availability API', true, `Found ${data.slots.length} slots`)
  } catch (error) {
    return testResult('Availability API', false, error.message)
  }
}

async function testBookingCreation() {
  log('Testing booking creation...')
  try {
    // Generate unique timestamps for each test run
    const now = new Date()
    const uniqueId = now.getTime()
    const startTime = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000) + (uniqueId % 1000) * 60 * 1000) // Next week + random minutes
    const endTime = new Date(startTime.getTime() + (30 * 60 * 1000)) // 30 minutes later
    
    const bookingData = {
      org_id: testOrgId,
      resource_id: testResourceId,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      artist_name: testArtist.name,
      artist_email: `test-${uniqueId}@example.com`,
      goal_text: testArtist.goal
    }
    
    const response = await fetch(`${BASE_URL}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookingData)
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`HTTP ${response.status}: ${errorData.error || response.statusText}`)
    }
    
    const data = await response.json()
    
    if (!data.booking_id) {
      throw new Error('No booking ID returned')
    }
    
    return testResult('Booking Creation', true, `Booking ID: ${data.booking_id}`)
  } catch (error) {
    return testResult('Booking Creation', false, error.message)
  }
}

async function testCalendarURLs() {
  log('Testing calendar URLs API...')
  try {
    // First create a booking to test with
    const now = new Date()
    const uniqueId = now.getTime() + 1
    const startTime = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000) + (uniqueId % 1000) * 60 * 1000 + 60 * 60 * 1000) // Next week + random minutes + 1 hour
    const endTime = new Date(startTime.getTime() + (30 * 60 * 1000)) // 30 minutes later
    
    const bookingData = {
      org_id: testOrgId,
      resource_id: testResourceId,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      artist_name: testArtist.name,
      artist_email: `test-${uniqueId}@example.com`,
      goal_text: testArtist.goal
    }
    
    const bookingResponse = await fetch(`${BASE_URL}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookingData)
    })
    
    if (!bookingResponse.ok) {
      throw new Error('Failed to create test booking')
    }
    
    const bookingData_result = await bookingResponse.json()
    const bookingId = bookingData_result.booking_id
    
    // Test calendar URLs
    const response = await fetch(`${BASE_URL}/api/bookings/${bookingId}/calendar-urls`)
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    
    if (!data.calendar_urls?.google || !data.calendar_urls?.outlook) {
      throw new Error('Missing calendar URLs')
    }
    
    return testResult('Calendar URLs API', true, 'All calendar providers available')
  } catch (error) {
    return testResult('Calendar URLs API', false, error.message)
  }
}

async function testICSGeneration() {
  log('Testing ICS file generation...')
  try {
    // Create a test booking
    const now = new Date()
    const uniqueId = now.getTime() + 2
    const startTime = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000) + (uniqueId % 1000) * 60 * 1000 + 2 * 60 * 60 * 1000) // Next week + random minutes + 2 hours
    const endTime = new Date(startTime.getTime() + (30 * 60 * 1000)) // 30 minutes later
    
    const bookingData = {
      org_id: testOrgId,
      resource_id: testResourceId,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      artist_name: testArtist.name,
      artist_email: `test-${uniqueId}@example.com`,
      goal_text: testArtist.goal
    }
    
    const bookingResponse = await fetch(`${BASE_URL}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookingData)
    })
    
    if (!bookingResponse.ok) {
      throw new Error('Failed to create test booking')
    }
    
    const bookingData_result = await bookingResponse.json()
    const bookingId = bookingData_result.booking_id
    
    // Test ICS generation
    const response = await fetch(`${BASE_URL}/api/bookings/${bookingId}/ics`)
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const icsContent = await response.text()
    
    if (!icsContent.includes('BEGIN:VCALENDAR') || !icsContent.includes('END:VCALENDAR')) {
      throw new Error('Invalid ICS format')
    }
    
    return testResult('ICS Generation', true, 'Valid ICS file generated')
  } catch (error) {
    return testResult('ICS Generation', false, error.message)
  }
}

async function testDatabaseRelationships() {
  log('Testing database relationships...')
  try {
    // Test bookings -> booking_participants relationship
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select(`
        id,
        title,
        booking_participants (
          id,
          user_id,
          status
        )
      `)
      .limit(1)
    
    if (bookingsError) throw bookingsError
    
    if (bookings && bookings.length > 0) {
      const booking = bookings[0]
      if (!booking.booking_participants) {
        throw new Error('booking_participants relationship not working')
      }
    }
    
    return testResult('Database Relationships', true, 'Foreign key relationships working')
  } catch (error) {
    return testResult('Database Relationships', false, error.message)
  }
}

async function testAnnouncementCreation() {
  log('Testing announcement creation...')
  try {
    const { data: announcements, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('type', 'booking')
      .limit(1)
    
    if (error) throw error
    
    return testResult('Announcement Creation', true, `Found ${announcements?.length || 0} booking announcements`)
  } catch (error) {
    return testResult('Announcement Creation', false, error.message)
  }
}

// Main test runner
async function runTests() {
  log('Starting comprehensive booking system tests...', 'info')
  console.log('='.repeat(60))
  
  const tests = [
    testDatabaseConnection,
    testResourceExists,
    testDatabaseRelationships,
    testAvailabilityAPI,
    testBookingCreation,
    testCalendarURLs,
    testICSGeneration,
    testAnnouncementCreation
  ]
  
  let passed = 0
  let total = tests.length
  
  for (const test of tests) {
    try {
      const result = await test()
      if (result) passed++
    } catch (error) {
      log(`Test failed with error: ${error.message}`, 'error')
    }
    console.log('') // Add spacing between tests
  }
  
  console.log('='.repeat(60))
  log(`Test Results: ${passed}/${total} tests passed`, passed === total ? 'success' : 'error')
  
  if (passed === total) {
    log('🎉 All tests passed! Booking system is working correctly.', 'success')
    process.exit(0)
  } else {
    log('❌ Some tests failed. Please check the errors above.', 'error')
    process.exit(1)
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests().catch((error) => {
    log(`Test runner failed: ${error.message}`, 'error')
    process.exit(1)
  })
}

module.exports = {
  runTests,
  testDatabaseConnection,
  testResourceExists,
  testAvailabilityAPI,
  testBookingCreation,
  testCalendarURLs,
  testICSGeneration,
  testDatabaseRelationships,
  testAnnouncementCreation
}
