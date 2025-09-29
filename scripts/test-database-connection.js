#!/usr/bin/env node

/**
 * Database Connection Test Script
 * Tests both local and production database connections
 * Run with: node scripts/test-database-connection.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Database configurations
const configs = {
  local: {
    url: 'http://127.0.0.1:54321',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU',
    name: 'Local Supabase'
  },
  production: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    key: process.env.SUPABASE_SERVICE_ROLE_KEY,
    name: 'Production Supabase'
  }
};

async function testDatabaseConnection(config) {
  console.log(`\n🔍 Testing ${config.name}...`);
  console.log(`📍 URL: ${config.url}`);
  
  if (!config.url || !config.key) {
    console.log(`❌ Missing environment variables for ${config.name}`);
    return false;
  }

  try {
    const supabase = createClient(config.url, config.key);
    
    // Test basic connection
    console.log('🔌 Testing connection...');
    const { data, error } = await supabase
      .from('organizations')
      .select('id, name, slug')
      .limit(1);
    
    if (error) {
      console.log(`❌ Connection failed: ${error.message}`);
      return false;
    }
    
    console.log(`✅ Connection successful!`);
    console.log(`📊 Sample data:`, data);
    
    // Test Oolite organization
    console.log('🏢 Testing Oolite organization...');
    const { data: orgData, error: orgError } = await supabase
      .from('organizations')
      .select('*')
      .eq('slug', 'oolite')
      .single();
    
    if (orgError) {
      console.log(`❌ Oolite organization not found: ${orgError.message}`);
      return false;
    }
    
    console.log(`✅ Oolite organization found:`, {
      id: orgData.id,
      name: orgData.name,
      slug: orgData.slug
    });
    
    // Test workshops
    console.log('📚 Testing workshops...');
    const { data: workshops, error: workshopsError } = await supabase
      .from('workshops')
      .select('id, title, status, featured, has_learn_content')
      .eq('organization_id', orgData.id);
    
    if (workshopsError) {
      console.log(`❌ Workshops query failed: ${workshopsError.message}`);
      return false;
    }
    
    console.log(`✅ Found ${workshops.length} workshops:`, workshops.map(w => ({
      title: w.title,
      has_learn_content: w.has_learn_content,
      status: w.status
    })));
    
    // Test workshop chapters
    console.log('📖 Testing workshop chapters...');
    const { data: chapters, error: chaptersError } = await supabase
      .from('workshop_chapters')
      .select('id, title, chapter_slug, workshop_id')
      .in('workshop_id', workshops.map(w => w.id));
    
    if (chaptersError) {
      console.log(`❌ Workshop chapters query failed: ${chaptersError.message}`);
      return false;
    }
    
    console.log(`✅ Found ${chapters.length} workshop chapters`);
    
    return true;
    
  } catch (err) {
    console.log(`❌ Unexpected error: ${err.message}`);
    return false;
  }
}

async function runDatabaseTests() {
  console.log('🚀 Starting Database Connection Tests');
  console.log('=====================================');
  
  const results = {};
  
  // Test local database
  results.local = await testDatabaseConnection(configs.local);
  
  // Test production database
  results.production = await testDatabaseConnection(configs.production);
  
  // Summary
  console.log('\n📋 TEST SUMMARY');
  console.log('================');
  console.log(`Local Database: ${results.local ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Production Database: ${results.production ? '✅ PASS' : '❌ FAIL'}`);
  
  if (results.local && results.production) {
    console.log('\n🎉 All database connections successful!');
  } else {
    console.log('\n⚠️  Some database connections failed. Check the logs above.');
  }
  
  return results;
}

// Run the tests
if (require.main === module) {
  runDatabaseTests()
    .then((results) => {
      process.exit(results.local && results.production ? 0 : 1);
    })
    .catch((error) => {
      console.error('💥 Test runner failed:', error);
      process.exit(1);
    });
}

module.exports = { testDatabaseConnection, runDatabaseTests };
