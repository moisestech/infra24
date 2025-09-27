#!/usr/bin/env node

/**
 * API Endpoint Testing Script
 * Tests critical API endpoints to identify issues before deployment
 */

const https = require('https');
const http = require('http');

// Configuration
const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';
const TEST_ORG_ID = process.env.TEST_ORG_ID || 'caf2bc8b-8547-4c55-ac9f-5692e93bd831'; // Oolite org ID
const TEST_TOKEN = process.env.TEST_TOKEN || 'test-token';

// Test results tracking
const testResults = {
  passed: 0,
  failed: 0,
  errors: []
};

// Helper function to make HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https://');
    const client = isHttps ? https : http;
    
    const requestOptions = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TEST_TOKEN}`,
        ...options.headers
      }
    };

    const req = client.request(url, requestOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = data ? JSON.parse(data) : {};
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: jsonData
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data
          });
        }
      });
    });

    req.on('error', reject);
    
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    
    req.end();
  });
}

// Test functions
async function testResourcesAPI() {
  console.log('\n🧪 Testing Resources API...');
  
  try {
    // Test GET resources
    console.log('  Testing GET /api/resources...');
    const getResponse = await makeRequest(`${BASE_URL}/api/resources?organizationId=${TEST_ORG_ID}`);
    
    if (getResponse.status === 200) {
      console.log('  ✅ GET /api/resources - PASSED');
      testResults.passed++;
    } else {
      console.log(`  ❌ GET /api/resources - FAILED (Status: ${getResponse.status})`);
      console.log(`     Response: ${JSON.stringify(getResponse.data)}`);
      testResults.failed++;
      testResults.errors.push(`GET /api/resources failed with status ${getResponse.status}`);
    }

    // Test POST resource (create)
    console.log('  Testing POST /api/resources...');
    const postResponse = await makeRequest(`${BASE_URL}/api/resources`, {
      method: 'POST',
      body: {
        organizationId: TEST_ORG_ID,
        title: 'Test Studio',
        type: 'space',
        capacity: 10,
        description: 'Test studio for API testing'
      }
    });

    if (postResponse.status === 201) {
      console.log('  ✅ POST /api/resources - PASSED');
      testResults.passed++;
      return postResponse.data.data?.id; // Return created resource ID
    } else {
      console.log(`  ❌ POST /api/resources - FAILED (Status: ${postResponse.status})`);
      console.log(`     Response: ${JSON.stringify(postResponse.data)}`);
      testResults.failed++;
      testResults.errors.push(`POST /api/resources failed with status ${postResponse.status}`);
      return null;
    }

  } catch (error) {
    console.log(`  ❌ Resources API - ERROR: ${error.message}`);
    testResults.failed++;
    testResults.errors.push(`Resources API error: ${error.message}`);
    return null;
  }
}

async function testBookingsAPI(resourceId) {
  console.log('\n🧪 Testing Bookings API...');
  
  if (!resourceId) {
    console.log('  ⚠️  Skipping bookings test - no resource ID available');
    return;
  }

  try {
    // Test GET bookings
    console.log('  Testing GET /api/bookings...');
    const getResponse = await makeRequest(`${BASE_URL}/api/bookings?organizationId=${TEST_ORG_ID}`);
    
    if (getResponse.status === 200) {
      console.log('  ✅ GET /api/bookings - PASSED');
      testResults.passed++;
    } else {
      console.log(`  ❌ GET /api/bookings - FAILED (Status: ${getResponse.status})`);
      console.log(`     Response: ${JSON.stringify(getResponse.data)}`);
      testResults.failed++;
      testResults.errors.push(`GET /api/bookings failed with status ${getResponse.status}`);
    }

    // Test POST booking (create)
    console.log('  Testing POST /api/bookings...');
    const startTime = new Date();
    startTime.setHours(startTime.getHours() + 1); // 1 hour from now
    const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000); // 2 hours later

    const postResponse = await makeRequest(`${BASE_URL}/api/bookings`, {
      method: 'POST',
      body: {
        organizationId: TEST_ORG_ID,
        resourceId: resourceId,
        title: 'Test Booking',
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        description: 'Test booking for API testing'
      }
    });

    if (postResponse.status === 201) {
      console.log('  ✅ POST /api/bookings - PASSED');
      testResults.passed++;
    } else {
      console.log(`  ❌ POST /api/bookings - FAILED (Status: ${postResponse.status})`);
      console.log(`     Response: ${JSON.stringify(postResponse.data)}`);
      testResults.failed++;
      testResults.errors.push(`POST /api/bookings failed with status ${postResponse.status}`);
    }

  } catch (error) {
    console.log(`  ❌ Bookings API - ERROR: ${error.message}`);
    testResults.failed++;
    testResults.errors.push(`Bookings API error: ${error.message}`);
  }
}

async function testWorkshopsAPI() {
  console.log('\n🧪 Testing Workshops API...');
  
  try {
    // Test GET workshops
    console.log('  Testing GET /api/workshops...');
    const getResponse = await makeRequest(`${BASE_URL}/api/workshops?organizationId=${TEST_ORG_ID}`);
    
    if (getResponse.status === 200) {
      console.log('  ✅ GET /api/workshops - PASSED');
      testResults.passed++;
    } else {
      console.log(`  ❌ GET /api/workshops - FAILED (Status: ${getResponse.status})`);
      console.log(`     Response: ${JSON.stringify(getResponse.data)}`);
      testResults.failed++;
      testResults.errors.push(`GET /api/workshops failed with status ${getResponse.status}`);
    }

  } catch (error) {
    console.log(`  ❌ Workshops API - ERROR: ${error.message}`);
    testResults.failed++;
    testResults.errors.push(`Workshops API error: ${error.message}`);
  }
}

async function testOrganizationsAPI() {
  console.log('\n🧪 Testing Organizations API...');
  
  try {
    // Test GET organizations
    console.log('  Testing GET /api/organizations...');
    const getResponse = await makeRequest(`${BASE_URL}/api/organizations`);
    
    if (getResponse.status === 200) {
      console.log('  ✅ GET /api/organizations - PASSED');
      testResults.passed++;
    } else {
      console.log(`  ❌ GET /api/organizations - FAILED (Status: ${getResponse.status})`);
      console.log(`     Response: ${JSON.stringify(getResponse.data)}`);
      testResults.failed++;
      testResults.errors.push(`GET /api/organizations failed with status ${getResponse.status}`);
    }

  } catch (error) {
    console.log(`  ❌ Organizations API - ERROR: ${error.message}`);
    testResults.failed++;
    testResults.errors.push(`Organizations API error: ${error.message}`);
  }
}

async function testSurveysAPI() {
  console.log('\n🧪 Testing Surveys API...');
  
  try {
    // Test GET surveys
    console.log('  Testing GET /api/surveys...');
    const getResponse = await makeRequest(`${BASE_URL}/api/surveys?organizationId=${TEST_ORG_ID}`);
    
    if (getResponse.status === 200) {
      console.log('  ✅ GET /api/surveys - PASSED');
      testResults.passed++;
    } else {
      console.log(`  ❌ GET /api/surveys - FAILED (Status: ${getResponse.status})`);
      console.log(`     Response: ${JSON.stringify(getResponse.data)}`);
      testResults.failed++;
      testResults.errors.push(`GET /api/surveys failed with status ${getResponse.status}`);
    }

  } catch (error) {
    console.log(`  ❌ Surveys API - ERROR: ${error.message}`);
    testResults.failed++;
    testResults.errors.push(`Surveys API error: ${error.message}`);
  }
}

// Main test execution
async function runTests() {
  console.log('🚀 Starting API Endpoint Tests...');
  console.log(`📍 Base URL: ${BASE_URL}`);
  console.log(`🏢 Test Organization ID: ${TEST_ORG_ID}`);
  console.log(`🔑 Test Token: ${TEST_TOKEN.substring(0, 10)}...`);

  // Run all tests
  const resourceId = await testResourcesAPI();
  await testBookingsAPI(resourceId);
  await testWorkshopsAPI();
  await testOrganizationsAPI();
  await testSurveysAPI();

  // Print results
  console.log('\n📊 Test Results Summary:');
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`📈 Success Rate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`);

  if (testResults.errors.length > 0) {
    console.log('\n🚨 Errors Found:');
    testResults.errors.forEach((error, index) => {
      console.log(`  ${index + 1}. ${error}`);
    });
  }

  // Exit with appropriate code
  if (testResults.failed > 0) {
    console.log('\n❌ Tests completed with failures. Review errors above.');
    process.exit(1);
  } else {
    console.log('\n✅ All tests passed! API endpoints are working correctly.');
    process.exit(0);
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests().catch(error => {
    console.error('💥 Test execution failed:', error);
    process.exit(1);
  });
}

module.exports = { runTests, testResults };
