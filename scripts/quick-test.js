#!/usr/bin/env node

/**
 * Quick Database Test
 * Simple test to check if database is working
 * Run with: node scripts/quick-test.js
 */

console.log('🚀 Quick Database Test Starting...');

// Test 1: Check if we can require Supabase
let createClient;
try {
  const supabaseModule = require('@supabase/supabase-js');
  createClient = supabaseModule.createClient;
  console.log('✅ Supabase client loaded successfully');
} catch (error) {
  console.log('❌ Failed to load Supabase client:', error.message);
  process.exit(1);
}

// Test 2: Create client
const supabase = createClient(
  'http://127.0.0.1:54321',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'
);

console.log('✅ Supabase client created');

// Test 3: Try to connect with timeout
async function testConnection() {
  console.log('🔍 Testing database connection...');
  
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Connection timeout after 5 seconds')), 5000);
  });
  
  const connectionPromise = supabase
    .from('organizations')
    .select('count')
    .limit(1);
  
  try {
    const result = await Promise.race([connectionPromise, timeoutPromise]);
    console.log('✅ Database connection successful');
    return result;
  } catch (error) {
    console.log('❌ Database connection failed:', error.message);
    return null;
  }
}

// Test 4: Check data
async function checkData() {
  console.log('📊 Checking existing data...');
  
  const tables = ['organizations', 'workshops', 'artists', 'announcements'];
  const results = {};
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('count')
        .limit(1);
      
      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
        results[table] = 0;
      } else {
        results[table] = data.length;
        console.log(`✅ ${table}: ${data.length} records`);
      }
    } catch (err) {
      console.log(`❌ ${table}: ${err.message}`);
      results[table] = 0;
    }
  }
  
  return results;
}

// Main test
async function runTest() {
  const connection = await testConnection();
  
  if (!connection) {
    console.log('\n❌ Cannot proceed - database connection failed');
    console.log('💡 Make sure Supabase is running: supabase start');
    process.exit(1);
  }
  
  const data = await checkData();
  
  console.log('\n📋 SUMMARY:');
  console.log('============');
  Object.entries(data).forEach(([table, count]) => {
    console.log(`${table}: ${count} records`);
  });
  
  if (data.organizations === 0) {
    console.log('\n💡 No organizations found. Run: node scripts/populate-organizations.js');
  }
  
  if (data.workshops === 0) {
    console.log('💡 No workshops found. Run: node scripts/populate-sample-workshops.js');
  }
  
  if (data.artists === 0) {
    console.log('💡 No artists found. Run: node scripts/populate-oolite-artists.js');
  }
  
  console.log('\n🎉 Test complete!');
}

// Run the test
runTest().catch(error => {
  console.error('💥 Test failed:', error);
  process.exit(1);
});