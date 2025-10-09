#!/usr/bin/env node

/**
 * Database Setup Script
 * Populates the database with initial data if it's empty
 * Run with: node scripts/setup-database-data.js
 */

const { createClient } = require('@supabase/supabase-js');
const { execSync } = require('child_process');
const path = require('path');

const supabase = createClient(
  'http://127.0.0.1:54321',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'
);

async function checkDatabaseStatus() {
  console.log('🔍 Checking database status...');
  
  try {
    // Test connection
    const { data, error } = await supabase
      .from('organizations')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('❌ Database connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Database connection successful');
    return true;
  } catch (err) {
    console.log('❌ Database connection error:', err.message);
    return false;
  }
}

async function checkDataExists() {
  console.log('📊 Checking existing data...');
  
  const checks = {
    organizations: await supabase.from('organizations').select('count'),
    workshops: await supabase.from('workshops').select('count'),
    artists: await supabase.from('artists').select('count'),
    announcements: await supabase.from('announcements').select('count')
  };
  
  const results = {};
  for (const [table, result] of Object.entries(checks)) {
    if (result.error) {
      console.log(`❌ ${table}: ${result.error.message}`);
      results[table] = 0;
    } else {
      results[table] = result.data.length;
      console.log(`✅ ${table}: ${result.data.length} records`);
    }
  }
  
  return results;
}

async function runPopulationScript(scriptName) {
  console.log(`\n🚀 Running ${scriptName}...`);
  try {
    const scriptPath = path.join(__dirname, scriptName);
    execSync(`node "${scriptPath}"`, { stdio: 'inherit' });
    console.log(`✅ ${scriptName} completed successfully`);
    return true;
  } catch (error) {
    console.log(`❌ ${scriptName} failed:`, error.message);
    return false;
  }
}

async function setupDatabase() {
  console.log('🚀 Starting Database Setup');
  console.log('==========================');
  
  // Check if database is running
  const connected = await checkDatabaseStatus();
  if (!connected) {
    console.log('\n❌ Cannot proceed - database is not running');
    console.log('💡 Please run: supabase start');
    return;
  }
  
  // Check existing data
  const dataCounts = await checkDataExists();
  
  // Determine what needs to be populated
  const needsSetup = {
    organizations: dataCounts.organizations === 0,
    workshops: dataCounts.workshops === 0,
    artists: dataCounts.artists === 0,
    announcements: dataCounts.announcements === 0
  };
  
  console.log('\n📋 Setup Plan:');
  Object.entries(needsSetup).forEach(([table, needed]) => {
    console.log(`  ${table}: ${needed ? '❌ Needs setup' : '✅ Already populated'}`);
  });
  
  // Run population scripts as needed
  if (needsSetup.organizations) {
    await runPopulationScript('populate-organizations.js');
  }
  
  if (needsSetup.workshops) {
    await runPopulationScript('populate-sample-workshops.js');
  }
  
  if (needsSetup.artists) {
    await runPopulationScript('populate-oolite-artists.js');
  }
  
  if (needsSetup.announcements) {
    await runPopulationScript('populate-oolite-announcements.js');
  }
  
  // Final check
  console.log('\n🔍 Final data check...');
  const finalCounts = await checkDataExists();
  
  console.log('\n🎉 Setup Complete!');
  console.log('==================');
  console.log(`Organizations: ${finalCounts.organizations}`);
  console.log(`Workshops: ${finalCounts.workshops}`);
  console.log(`Artists: ${finalCounts.artists}`);
  console.log(`Announcements: ${finalCounts.announcements}`);
  
  if (finalCounts.organizations > 0 && finalCounts.workshops > 0) {
    console.log('\n✅ Database is ready for development!');
    console.log('💡 You can now run: npm run dev');
  } else {
    console.log('\n⚠️  Some data may be missing. Check the logs above.');
  }
}

// Main execution
if (require.main === module) {
  setupDatabase().catch(error => {
    console.error('💥 Setup failed:', error);
    process.exit(1);
  });
}

module.exports = { setupDatabase };


