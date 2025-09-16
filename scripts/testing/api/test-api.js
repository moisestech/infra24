// Test API Script
// Run this with: node scripts/test-api.js

const API_BASE = 'http://localhost:3002/api';

async function testAnnouncementAPI(announcementId) {
  console.log(`Testing announcement API for ID: ${announcementId}`);
  
  try {
    const response = await fetch(`${API_BASE}/announcements/${announcementId}`);
    const data = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('✅ API is working correctly');
      console.log('Announcement title:', data.announcement?.title);
      console.log('Organization ID:', data.announcement?.org_id);
    } else {
      console.log('❌ API returned an error');
    }
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
  }
}

async function testOrganizationAPI(orgSlug) {
  console.log(`Testing organization API for slug: ${orgSlug}`);
  
  try {
    const response = await fetch(`${API_BASE}/organizations/by-slug/${orgSlug}`);
    const data = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('✅ Organization API is working correctly');
      console.log('Organization name:', data.organization?.name);
      console.log('Organization ID:', data.organization?.id);
    } else {
      console.log('❌ Organization API returned an error');
    }
  } catch (error) {
    console.error('❌ Error testing organization API:', error.message);
  }
}

async function testOrganizationAnnouncementsAPI(orgSlug) {
  console.log(`Testing organization announcements API for slug: ${orgSlug}`);
  
  try {
    const response = await fetch(`${API_BASE}/organizations/${orgSlug}/announcements`);
    const data = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('✅ Organization announcements API is working correctly');
      console.log('Number of announcements:', data.announcements?.length || 0);
      if (data.announcements?.length > 0) {
        console.log('First announcement ID:', data.announcements[0].id);
        console.log('First announcement title:', data.announcements[0].title);
      }
    } else {
      console.log('❌ Organization announcements API returned an error');
    }
  } catch (error) {
    console.error('❌ Error testing organization announcements API:', error.message);
  }
}

// Test the specific announcement that's failing
async function runTests() {
  console.log('🧪 Starting API Tests...\n');
  
  // Test the specific announcement ID that's failing
  await testAnnouncementAPI('8edfa56a-7c52-47b3-ae53-6860a3c1bffa');
  console.log('\n');
  
  // Test organization API
  await testOrganizationAPI('bakehouse');
  console.log('\n');
  
  // Test organization announcements API
  await testOrganizationAnnouncementsAPI('bakehouse');
  console.log('\n');
  
  console.log('🏁 Tests completed');
}

// Run the tests
runTests().catch(console.error);
