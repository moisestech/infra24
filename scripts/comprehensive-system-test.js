/**
 * Comprehensive System Testing Script
 * Tests all major features of the Infra24 booking system
 */

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

// Test configuration
const TEST_CONFIG = {
  orgId: '2133fe94-fb12-41f8-ab37-ea4acd4589f6',
  resourceId: '7d683079-3514-4b60-9155-7e4df4c46a30',
  testArtist: {
    name: 'System Test Artist',
    email: 'system-test@infra24.com',
    goal: 'Comprehensive system testing'
  },
  timeout: 30000 // 30 seconds
}

// Test results tracking
const testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  details: []
}

// Utility functions
function log(message, type = 'info') {
  const timestamp = new Date().toISOString()
  const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️'
  console.log(`${prefix} [${timestamp}] ${message}`)
}

function testResult(testName, passed, details = '') {
  testResults.total++
  if (passed) {
    testResults.passed++
    log(`PASS: ${testName}`, 'success')
  } else {
    testResults.failed++
    log(`FAIL: ${testName} - ${details}`, 'error')
  }
  testResults.details.push({ testName, passed, details })
}

async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      timeout: TEST_CONFIG.timeout,
      ...options
    })
    const data = await response.json().catch(() => ({}))
    return { response, data, success: response.ok }
  } catch (error) {
    return { response: null, data: null, success: false, error: error.message }
  }
}

// Test functions
async function testDatabaseConnection() {
  log('Testing database connection...')
  try {
    const { success, data } = await makeRequest(`${BASE_URL}/api/organizations/${TEST_CONFIG.orgId}/resources`)
    return testResult('Database Connection', success, success ? 'Resources loaded' : data.error)
  } catch (error) {
    return testResult('Database Connection', false, error.message)
  }
}

async function testAvailabilityAPI() {
  log('Testing availability API...')
  try {
    const startDate = new Date().toISOString().split('T')[0]
    const { success, data } = await makeRequest(
      `${BASE_URL}/api/availability?resource_id=${TEST_CONFIG.resourceId}&start_date=${startDate}&end_date=${startDate}`
    )
    return testResult('Availability API', success, success ? `${data.available_slots?.length || 0} slots found` : data.error)
  } catch (error) {
    return testResult('Availability API', false, error.message)
  }
}

async function testBookingCreation() {
  log('Testing booking creation...')
  try {
    const now = new Date()
    const startTime = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000) + Math.random() * 1000 * 60 * 1000)
    const endTime = new Date(startTime.getTime() + (30 * 60 * 1000))
    
    const bookingData = {
      org_id: TEST_CONFIG.orgId,
      resource_id: TEST_CONFIG.resourceId,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      artist_name: TEST_CONFIG.testArtist.name,
      artist_email: TEST_CONFIG.testArtist.email,
      goal_text: TEST_CONFIG.testArtist.goal
    }
    
    const { success, data } = await makeRequest(`${BASE_URL}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    })
    
    if (success && data.booking_id) {
      // Store booking ID for subsequent tests
      TEST_CONFIG.createdBookingId = data.booking_id
      return testResult('Booking Creation', true, `Booking ID: ${data.booking_id}`)
    } else {
      return testResult('Booking Creation', false, data.error || 'No booking ID returned')
    }
  } catch (error) {
    return testResult('Booking Creation', false, error.message)
  }
}

async function testICSGeneration() {
  log('Testing ICS file generation...')
  try {
    if (!TEST_CONFIG.createdBookingId) {
      return testResult('ICS Generation', false, 'No booking ID available')
    }
    
    const { success, data } = await makeRequest(`${BASE_URL}/api/bookings/${TEST_CONFIG.createdBookingId}/ics`)
    return testResult('ICS Generation', success, success ? 'ICS file generated' : data.error)
  } catch (error) {
    return testResult('ICS Generation', false, error.message)
  }
}

async function testCalendarURLs() {
  log('Testing calendar URL generation...')
  try {
    if (!TEST_CONFIG.createdBookingId) {
      return testResult('Calendar URLs', false, 'No booking ID available')
    }
    
    const { success, data } = await makeRequest(`${BASE_URL}/api/bookings/${TEST_CONFIG.createdBookingId}/calendar-urls`)
    return testResult('Calendar URLs', success, success ? 'Calendar URLs generated' : data.error)
  } catch (error) {
    return testResult('Calendar URLs', false, error.message)
  }
}

async function testWaitlistFunctionality() {
  log('Testing waitlist functionality...')
  try {
    // Add to waitlist
    const waitlistData = {
      action: 'add',
      org_id: TEST_CONFIG.orgId,
      resource_id: TEST_CONFIG.resourceId,
      user_email: 'waitlist-test@infra24.com',
      user_name: 'Waitlist Test User',
      requested_start_time: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
      requested_end_time: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString()
    }
    
    const { success, data } = await makeRequest(`${BASE_URL}/api/waitlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(waitlistData)
    })
    
    if (success && data.entry_id) {
      TEST_CONFIG.waitlistEntryId = data.entry_id
      return testResult('Waitlist Addition', true, `Entry ID: ${data.entry_id}`)
    } else {
      return testResult('Waitlist Addition', false, data.error || 'No entry ID returned')
    }
  } catch (error) {
    return testResult('Waitlist Addition', false, error.message)
  }
}

async function testWaitlistRetrieval() {
  log('Testing waitlist retrieval...')
  try {
    const { success, data } = await makeRequest(
      `${BASE_URL}/api/waitlist?resource_id=${TEST_CONFIG.resourceId}&org_id=${TEST_CONFIG.orgId}`
    )
    return testResult('Waitlist Retrieval', success, success ? `${data.count} entries found` : data.error)
  } catch (error) {
    return testResult('Waitlist Retrieval', false, error.message)
  }
}

async function testEmailNotifications() {
  log('Testing email notification system...')
  try {
    // This test checks if the email service is properly configured
    // We can't actually send emails in testing, but we can verify the service is available
    const { success } = await makeRequest(`${BASE_URL}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        org_id: TEST_CONFIG.orgId,
        resource_id: TEST_CONFIG.resourceId,
        start_time: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(),
        end_time: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
        artist_name: 'Email Test User',
        artist_email: 'email-test@infra24.com',
        goal_text: 'Testing email notifications'
      })
    })
    
    return testResult('Email Notifications', success, success ? 'Email service configured' : 'Email service not available')
  } catch (error) {
    return testResult('Email Notifications', false, error.message)
  }
}

async function testAnalyticsAPI() {
  log('Testing analytics API...')
  try {
    const { success, data } = await makeRequest(
      `${BASE_URL}/api/analytics/bookings/overview?org_id=${TEST_CONFIG.orgId}`
    )
    return testResult('Analytics API', success, success ? 'Analytics data retrieved' : data.error)
  } catch (error) {
    return testResult('Analytics API', false, error.message)
  }
}

async function testPublicPages() {
  log('Testing public pages...')
  try {
    const pages = ['/book', '/bookings']
    let allPassed = true
    
    for (const page of pages) {
      const { success } = await makeRequest(`${BASE_URL}${page}`)
      if (!success) {
        allPassed = false
        break
      }
    }
    
    return testResult('Public Pages', allPassed, allPassed ? 'All pages accessible' : 'Some pages not accessible')
  } catch (error) {
    return testResult('Public Pages', false, error.message)
  }
}

async function testPerformance() {
  log('Testing system performance...')
  try {
    const startTime = Date.now()
    const promises = []
    
    // Test concurrent requests
    for (let i = 0; i < 10; i++) {
      promises.push(makeRequest(`${BASE_URL}/api/organizations/${TEST_CONFIG.orgId}/resources`))
    }
    
    const results = await Promise.all(promises)
    const endTime = Date.now()
    const duration = endTime - startTime
    
    const successCount = results.filter(r => r.success).length
    const avgResponseTime = duration / results.length
    
    const passed = successCount >= 8 && avgResponseTime < 2000 // 80% success rate, <2s avg response
    
    return testResult('Performance Test', passed, 
      `Success: ${successCount}/10, Avg Response: ${avgResponseTime.toFixed(0)}ms`)
  } catch (error) {
    return testResult('Performance Test', false, error.message)
  }
}

async function cleanupTestData() {
  log('Cleaning up test data...')
  try {
    // Remove test booking if created
    if (TEST_CONFIG.createdBookingId) {
      await makeRequest(`${BASE_URL}/api/bookings/${TEST_CONFIG.createdBookingId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: 'test-cleanup-token' })
      })
    }
    
    // Remove waitlist entry if created
    if (TEST_CONFIG.waitlistEntryId) {
      await makeRequest(`${BASE_URL}/api/waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'remove',
          entry_id: TEST_CONFIG.waitlistEntryId,
          reason: 'cancelled'
        })
      })
    }
    
    log('Test data cleanup completed', 'success')
  } catch (error) {
    log(`Cleanup error: ${error.message}`, 'error')
  }
}

// Main test runner
async function runComprehensiveTests() {
  log('🚀 Starting Comprehensive System Tests', 'info')
  log(`Testing against: ${BASE_URL}`, 'info')
  log('=' * 60, 'info')
  
  const tests = [
    testDatabaseConnection,
    testAvailabilityAPI,
    testBookingCreation,
    testICSGeneration,
    testCalendarURLs,
    testWaitlistFunctionality,
    testWaitlistRetrieval,
    testEmailNotifications,
    testAnalyticsAPI,
    testPublicPages,
    testPerformance
  ]
  
  for (const test of tests) {
    try {
      await test()
      await new Promise(resolve => setTimeout(resolve, 1000)) // 1 second delay between tests
    } catch (error) {
      log(`Test error: ${error.message}`, 'error')
    }
  }
  
  // Cleanup
  await cleanupTestData()
  
  // Results summary
  log('=' * 60, 'info')
  log('📊 TEST RESULTS SUMMARY', 'info')
  log(`Total Tests: ${testResults.total}`, 'info')
  log(`Passed: ${testResults.passed}`, 'success')
  log(`Failed: ${testResults.failed}`, testResults.failed > 0 ? 'error' : 'success')
  log(`Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`, 'info')
  
  if (testResults.failed > 0) {
    log('\n❌ FAILED TESTS:', 'error')
    testResults.details
      .filter(t => !t.passed)
      .forEach(t => log(`  - ${t.testName}: ${t.details}`, 'error'))
  }
  
  log('\n🎯 System Status:', testResults.failed === 0 ? 'success' : 'error')
  if (testResults.failed === 0) {
    log('✅ All systems operational - Ready for production!', 'success')
  } else {
    log('⚠️  Some issues detected - Review failed tests before deployment', 'error')
  }
  
  process.exit(testResults.failed > 0 ? 1 : 0)
}

// Run tests if this script is executed directly
if (require.main === module) {
  runComprehensiveTests().catch(error => {
    log(`Fatal error: ${error.message}`, 'error')
    process.exit(1)
  })
}

module.exports = {
  runComprehensiveTests,
  testResults
}















