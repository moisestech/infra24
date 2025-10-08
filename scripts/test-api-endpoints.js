#!/usr/bin/env node

/**
 * API Endpoints Test Script
 * Tests all API endpoints with various scenarios
 */

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

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
const testResourceId = '67e52569-d67d-4352-8ca3-c3bcbde8c43f' // Print Room Consult

// API Test functions
async function testAvailabilityEndpoint() {
  log('Testing /api/availability endpoint...')
  
  const testCases = [
    {
      name: 'Valid request',
      params: `resource_id=${testResourceId}&start_date=2025-01-15&end_date=2025-01-15`,
      expectedStatus: 200
    },
    {
      name: 'Missing resource_id',
      params: 'start_date=2025-01-15&end_date=2025-01-15',
      expectedStatus: 400
    },
    {
      name: 'Missing dates',
      params: `resource_id=${testResourceId}`,
      expectedStatus: 400
    },
    {
      name: 'Invalid resource_id',
      params: 'resource_id=invalid-id&start_date=2025-01-15&end_date=2025-01-15',
      expectedStatus: 404
    }
  ]
  
  let passed = 0
  for (const testCase of testCases) {
    try {
      const response = await fetch(`${BASE_URL}/api/availability?${testCase.params}`)
      const passed_test = response.status === testCase.expectedStatus
      testResult(`${testCase.name}`, passed_test, `Status: ${response.status}`)
      if (passed_test) passed++
    } catch (error) {
      testResult(`${testCase.name}`, false, error.message)
    }
  }
  
  return passed === testCases.length
}

async function testBookingsEndpoint() {
  log('Testing /api/bookings endpoint...')
  
  // Generate unique timestamps for each test run
  const now = new Date()
  const uniqueId = now.getTime()
  const startTime = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000)) // Next week
  const endTime = new Date(startTime.getTime() + (30 * 60 * 1000)) // 30 minutes later
  
  const validBookingData = {
    org_id: testOrgId,
    resource_id: testResourceId,
    start_time: startTime.toISOString(),
    end_time: endTime.toISOString(),
    artist_name: 'Test Artist',
    artist_email: `test-${uniqueId}@example.com`,
    goal_text: 'Portfolio review'
  }
  
  const testCases = [
    {
      name: 'Valid booking creation',
      data: validBookingData,
      expectedStatus: 201
    },
    {
      name: 'Missing required fields',
      data: { org_id: testOrgId },
      expectedStatus: 400
    },
    {
      name: 'Invalid email format',
      data: { ...validBookingData, artist_email: 'invalid-email', start_time: new Date(now.getTime() + (24 * 60 * 60 * 1000) + (3 * 60 * 60 * 1000)).toISOString(), end_time: new Date(now.getTime() + (24 * 60 * 60 * 1000) + (3.5 * 60 * 60 * 1000)).toISOString() },
      expectedStatus: 400
    },
    {
      name: 'Invalid resource_id',
      data: { ...validBookingData, resource_id: 'invalid-resource' },
      expectedStatus: 404
    }
  ]
  
  let passed = 0
  for (const testCase of testCases) {
    try {
      const response = await fetch(`${BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testCase.data)
      })
      
      const passed_test = response.status === testCase.expectedStatus
      testResult(`${testCase.name}`, passed_test, `Status: ${response.status}`)
      if (passed_test) passed++
    } catch (error) {
      testResult(`${testCase.name}`, false, error.message)
    }
  }
  
  return passed === testCases.length
}

async function testCalendarURLsEndpoint() {
  log('Testing /api/bookings/[id]/calendar-urls endpoint...')
  
  // First create a booking to test with
  const now = new Date()
  const uniqueId = now.getTime() + 1
  const startTime = new Date(now.getTime() + (24 * 60 * 60 * 1000) + (60 * 60 * 1000)) // Tomorrow + 1 hour
  const endTime = new Date(startTime.getTime() + (30 * 60 * 1000)) // 30 minutes later
  
  const bookingData = {
    org_id: testOrgId,
    resource_id: testResourceId,
    start_time: startTime.toISOString(),
    end_time: endTime.toISOString(),
    artist_name: 'Test Artist',
    artist_email: `test-${uniqueId}@example.com`,
    goal_text: 'Portfolio review'
  }
  
  try {
    const bookingResponse = await fetch(`${BASE_URL}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookingData)
    })
    
    if (!bookingResponse.ok) {
      return testResult('Calendar URLs - Setup', false, 'Failed to create test booking')
    }
    
    const bookingResult = await bookingResponse.json()
    const bookingId = bookingResult.booking_id
    
    // Test calendar URLs
    const response = await fetch(`${BASE_URL}/api/bookings/${bookingId}/calendar-urls`)
    
    if (!response.ok) {
      return testResult('Calendar URLs', false, `Status: ${response.status}`)
    }
    
    const data = await response.json()
    const urls = data.calendar_urls || data
    
    const requiredUrls = ['google', 'outlook', 'ics']
    const hasAllUrls = requiredUrls.every(url => urls[url])
    
    return testResult('Calendar URLs', hasAllUrls, hasAllUrls ? 'All providers available' : 'Missing some providers')
  } catch (error) {
    return testResult('Calendar URLs', false, error.message)
  }
}

async function testICSEndpoint() {
  log('Testing /api/bookings/[id]/ics endpoint...')
  
  // Create a test booking
  const now = new Date()
  const uniqueId = now.getTime() + 2
  const startTime = new Date(now.getTime() + (24 * 60 * 60 * 1000) + (2 * 60 * 60 * 1000)) // Tomorrow + 2 hours
  const endTime = new Date(startTime.getTime() + (30 * 60 * 1000)) // 30 minutes later
  
  const bookingData = {
    org_id: testOrgId,
    resource_id: testResourceId,
    start_time: startTime.toISOString(),
    end_time: endTime.toISOString(),
    artist_name: 'Test Artist',
    artist_email: `test-${uniqueId}@example.com`,
    goal_text: 'Portfolio review'
  }
  
  try {
    const bookingResponse = await fetch(`${BASE_URL}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookingData)
    })
    
    if (!bookingResponse.ok) {
      return testResult('ICS Generation - Setup', false, 'Failed to create test booking')
    }
    
    const bookingResult = await bookingResponse.json()
    const bookingId = bookingResult.booking_id
    
    // Test ICS generation
    const response = await fetch(`${BASE_URL}/api/bookings/${bookingId}/ics`)
    
    if (!response.ok) {
      return testResult('ICS Generation', false, `Status: ${response.status}`)
    }
    
    const icsContent = await response.text()
    const isValidICS = icsContent.includes('BEGIN:VCALENDAR') && icsContent.includes('END:VCALENDAR')
    
    return testResult('ICS Generation', isValidICS, isValidICS ? 'Valid ICS format' : 'Invalid ICS format')
  } catch (error) {
    return testResult('ICS Generation', false, error.message)
  }
}

async function testResourcesEndpoint() {
  log('Testing /api/organizations/[orgId]/resources endpoint...')
  
  try {
    const response = await fetch(`${BASE_URL}/api/organizations/${testOrgId}/resources`)
    
    if (!response.ok) {
      return testResult('Resources Endpoint', false, `Status: ${response.status}`)
    }
    
    const data = await response.json()
    const resources = data.resources || data
    const hasResources = Array.isArray(resources) && resources.length > 0
    
    return testResult('Resources Endpoint', hasResources, hasResources ? `Found ${resources.length} resources` : 'No resources found')
  } catch (error) {
    return testResult('Resources Endpoint', false, error.message)
  }
}

async function testOrganizationEndpoint() {
  log('Testing /api/organizations/by-slug/[slug] endpoint...')
  
  try {
    const response = await fetch(`${BASE_URL}/api/organizations/by-slug/oolite`)
    
    if (!response.ok) {
      return testResult('Organization Endpoint', false, `Status: ${response.status}`)
    }
    
    const data = await response.json()
    const org = data.organization || data
    const hasValidOrg = org.id && org.name && org.slug
    
    return testResult('Organization Endpoint', hasValidOrg, hasValidOrg ? `Found: ${org.name}` : 'Invalid organization data')
  } catch (error) {
    return testResult('Organization Endpoint', false, error.message)
  }
}

// Main test runner
async function runAPITests() {
  log('Starting API endpoints tests...', 'info')
  console.log('='.repeat(60))
  
  const tests = [
    { name: 'Organization Endpoint', fn: testOrganizationEndpoint },
    { name: 'Resources Endpoint', fn: testResourcesEndpoint },
    { name: 'Availability Endpoint', fn: testAvailabilityEndpoint },
    { name: 'Bookings Endpoint', fn: testBookingsEndpoint },
    { name: 'Calendar URLs Endpoint', fn: testCalendarURLsEndpoint },
    { name: 'ICS Endpoint', fn: testICSEndpoint }
  ]
  
  let passed = 0
  let total = tests.length
  
  for (const test of tests) {
    try {
      log(`Running ${test.name} tests...`)
      const result = await test.fn()
      if (result) passed++
      console.log('') // Add spacing between test suites
    } catch (error) {
      log(`${test.name} failed with error: ${error.message}`, 'error')
    }
  }
  
  console.log('='.repeat(60))
  log(`API Test Results: ${passed}/${total} test suites passed`, passed === total ? 'success' : 'error')
  
  if (passed === total) {
    log('🎉 All API tests passed!', 'success')
    process.exit(0)
  } else {
    log('❌ Some API tests failed. Please check the errors above.', 'error')
    process.exit(1)
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runAPITests().catch((error) => {
    log(`API test runner failed: ${error.message}`, 'error')
    process.exit(1)
  })
}

module.exports = {
  runAPITests,
  testAvailabilityEndpoint,
  testBookingsEndpoint,
  testCalendarURLsEndpoint,
  testICSEndpoint,
  testResourcesEndpoint,
  testOrganizationEndpoint
}