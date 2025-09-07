// Test Announcement API with Organization Data
// Run this with: node scripts/test-announcement-with-org.js

const API_BASE = 'http://localhost:3002/api';

async function testAnnouncementWithOrg() {
  console.log('🧪 Testing Announcement API with Organization Data...\n');
  
  const announcementId = '8edfa56a-7c52-47b3-ae53-6860a3c1bffa';
  
  try {
    const response = await fetch(`${API_BASE}/announcements/${announcementId}`);
    const data = await response.json();
    
    console.log('Response status:', response.status);
    if (response.ok) {
      console.log('✅ API access successful');
      console.log('Announcement title:', data.announcement?.title);
      console.log('Announcement status:', data.announcement?.status);
      console.log('Organization ID:', data.announcement?.org_id);
      
      if (data.announcement?.organizations) {
        console.log('✅ Organization data included in response');
        console.log('Organization name:', data.announcement.organizations.name);
        console.log('Organization slug:', data.announcement.organizations.slug);
      } else {
        console.log('❌ Organization data not included in response');
      }
      
      console.log('\nFull response structure:');
      console.log(JSON.stringify(data, null, 2));
    } else {
      console.log('❌ API access failed');
      console.log('Error:', data.error);
    }
    
  } catch (error) {
    console.error('❌ Error testing announcement API:', error.message);
  }
}

// Run the test
testAnnouncementWithOrg().catch(console.error);
