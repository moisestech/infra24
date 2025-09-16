#!/usr/bin/env node

/**
 * Script to check the actual schema of artist_profiles table
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkSchema() {
  console.log('🔍 Checking artist_profiles table schema...\n');
  
  try {
    // Try to get a sample record to see what columns exist
    const { data, error } = await supabase
      .from('artist_profiles')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Error fetching sample:', error);
      return;
    }

    if (data && data.length > 0) {
      console.log('📋 Available columns in artist_profiles:');
      console.log('=' .repeat(50));
      Object.keys(data[0]).forEach(column => {
        console.log(`- ${column}: ${typeof data[0][column]}`);
      });
      console.log('\n');
      
      console.log('📄 Sample record:');
      console.log(JSON.stringify(data[0], null, 2));
    } else {
      console.log('📭 No records found in artist_profiles table');
    }

    // Try to get all artist profiles with basic info
    console.log('\n🎨 Fetching all artist profiles...');
    const { data: artists, error: artistsError } = await supabase
      .from('artist_profiles')
      .select('*')
      .limit(10);

    if (artistsError) {
      console.error('❌ Error fetching artists:', artistsError);
      return;
    }

    console.log(`📊 Found ${artists.length} artist profiles\n`);
    
    if (artists.length > 0) {
      console.log('👥 Sample artists:');
      artists.forEach((artist, index) => {
        console.log(`${index + 1}. ${artist.name || 'Unnamed'}`);
        console.log(`   - ID: ${artist.id}`);
        console.log(`   - Organization: ${artist.organization_id || 'Not set'}`);
        console.log(`   - Claimed: ${artist.claimed_by_clerk_user_id ? 'Yes' : 'No'}`);
        console.log(`   - Public: ${artist.is_public || false}`);
        console.log('');
      });
    }

  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

// Run the script
checkSchema().catch(console.error);
