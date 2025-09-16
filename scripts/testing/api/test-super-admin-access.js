// Test Super Admin Access Script
// Run this with: node scripts/test-super-admin-access.js

const API_BASE = 'http://localhost:3002/api';

async function testSuperAdminAccess() {
  console.log('🧪 Testing Super Admin Access to Announcements...\n');
  
  const announcementId = '8edfa56a-7c52-47b3-ae53-6860a3c1bffa';
  
  try {
    // Test 1: Direct API access
    console.log('1. Testing direct API access...');
    const response = await fetch(`${API_BASE}/announcements/${announcementId}`);
    const data = await response.json();
    
    console.log('Response status:', response.status);
    if (response.ok) {
      console.log('✅ API access successful');
      console.log('Announcement title:', data.announcement?.title);
      console.log('Announcement status:', data.announcement?.status);
      console.log('Organization ID:', data.announcement?.org_id);
    } else {
      console.log('❌ API access failed');
      console.log('Error:', data.error);
    }
    
    console.log('\n2. Testing organization announcements API...');
    const orgResponse = await fetch(`${API_BASE}/organizations/bakehouse/announcements`);
    const orgData = await orgResponse.json();
    
    console.log('Response status:', orgResponse.status);
    if (orgResponse.ok) {
      console.log('✅ Organization API access successful');
      console.log('Number of announcements:', orgData.announcements?.length || 0);
      
      // Find the specific announcement
      const targetAnnouncement = orgData.announcements?.find(a => a.id === announcementId);
      if (targetAnnouncement) {
        console.log('✅ Target announcement found in organization list');
        console.log('Status:', targetAnnouncement.status);
      } else {
        console.log('❌ Target announcement not found in organization list');
      }
    } else {
      console.log('❌ Organization API access failed');
      console.log('Error:', orgData.error);
    }
    
  } catch (error) {
    console.error('❌ Error testing super admin access:', error.message);
  }
}

// Run the test
testSuperAdminAccess().catch(console.error);
