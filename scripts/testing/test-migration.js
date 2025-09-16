/**
 * Test Migration Script
 * This script tests if the migration file works correctly
 * Run with: node scripts/testing/test-migration.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testMigration() {
  console.log('🧪 Testing migration file compatibility...');

  try {
    // Test 1: Check if organizations table exists and is accessible
    console.log('\n1. Testing organizations table...');
    const { data: orgs, error: orgError } = await supabase
      .from('organizations')
      .select('id, name, slug')
      .limit(1);

    if (orgError) {
      console.error('❌ Organizations table error:', orgError.message);
      return;
    }
    console.log('✅ Organizations table accessible');
    console.log('📊 Sample organizations:', orgs);

    // Test 2: Check if artist_profiles table exists
    console.log('\n2. Testing artist_profiles table...');
    const { data: artists, error: artistError } = await supabase
      .from('artist_profiles')
      .select('id, name, organization_id')
      .limit(1);

    if (artistError) {
      console.error('❌ Artist profiles table error:', artistError.message);
      return;
    }
    console.log('✅ Artist profiles table accessible');
    console.log('📊 Sample artists:', artists);

    // Test 3: Check if org_memberships table exists
    console.log('\n3. Testing org_memberships table...');
    const { data: memberships, error: membershipError } = await supabase
      .from('org_memberships')
      .select('id, org_id, clerk_user_id')
      .limit(1);

    if (membershipError) {
      console.error('❌ Org memberships table error:', membershipError.message);
      return;
    }
    console.log('✅ Org memberships table accessible');
    console.log('📊 Sample memberships:', memberships);

    // Test 4: Try to create a test tip (will fail if table doesn't exist)
    console.log('\n4. Testing artist_tips table...');
    const { data: tip, error: tipError } = await supabase
      .from('artist_tips')
      .insert({
        org_id: orgs[0]?.id || '00000000-0000-0000-0000-000000000000',
        artist_profile_id: artists[0]?.id || '00000000-0000-0000-0000-000000000000',
        amount: 10.00,
        message: 'Test tip',
        is_anonymous: false,
        status: 'pending'
      })
      .select()
      .single();

    if (tipError) {
      console.log('⚠️  Artist tips table not found - migration needed');
      console.log('   Error:', tipError.message);
    } else {
      console.log('✅ Artist tips table exists and working');
      console.log('📊 Created test tip:', tip);
      
      // Clean up test tip
      await supabase.from('artist_tips').delete().eq('id', tip.id);
      console.log('🧹 Cleaned up test tip');
    }

    // Test 5: Try to create a test donation
    console.log('\n5. Testing organization_donations table...');
    const { data: donation, error: donationError } = await supabase
      .from('organization_donations')
      .insert({
        org_id: orgs[0]?.id || '00000000-0000-0000-0000-000000000000',
        amount: 50.00,
        message: 'Test donation',
        is_anonymous: false,
        is_recurring: false,
        status: 'pending'
      })
      .select()
      .single();

    if (donationError) {
      console.log('⚠️  Organization donations table not found - migration needed');
      console.log('   Error:', donationError.message);
    } else {
      console.log('✅ Organization donations table exists and working');
      console.log('📊 Created test donation:', donation);
      
      // Clean up test donation
      await supabase.from('organization_donations').delete().eq('id', donation.id);
      console.log('🧹 Cleaned up test donation');
    }

    console.log('\n🎉 Migration test completed!');
    console.log('\n📋 Next Steps:');
    console.log('1. If any tables are missing, run the migration file in Supabase');
    console.log('2. The migration file is located at: scripts/database/migrations/20241220000001_create_infra24_tables.sql');
    console.log('3. Copy the file content and run it in your Supabase SQL Editor');

  } catch (error) {
    console.error('❌ Migration test failed:', error);
    process.exit(1);
  }
}

// Run the test
testMigration();
