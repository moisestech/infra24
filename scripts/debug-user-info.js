#!/usr/bin/env node

/**
 * Debug User Info Script
 * 
 * This script helps you find your Clerk User ID and check your current status.
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function debugUserInfo() {
  console.log('🔍 Debug User Information\n');

  try {
    // Check all memberships
    console.log('📋 All organization memberships:');
    const { data: memberships, error: membershipError } = await supabase
      .from('org_memberships')
      .select(`
        id,
        clerk_user_id,
        role,
        is_active,
        joined_at,
        organizations (
          id,
          name,
          slug
        )
      `)
      .order('created_at', { ascending: false });

    if (membershipError) {
      console.error('❌ Error fetching memberships:', membershipError);
      return;
    }

    if (!memberships || memberships.length === 0) {
      console.log('❌ No memberships found in database');
      console.log('\n💡 This means you need to:');
      console.log('1. Sign up/log in through Clerk first');
      console.log('2. Run the setup-super-admin.js script to create your membership');
      return;
    }

    console.log(`Found ${memberships.length} membership(s):\n`);
    
    memberships.forEach((membership, index) => {
      console.log(`${index + 1}. User ID: ${membership.clerk_user_id}`);
      console.log(`   Role: ${membership.role}`);
      console.log(`   Active: ${membership.is_active}`);
      console.log(`   Organization: ${membership.organizations?.name} (${membership.organizations?.slug})`);
      console.log(`   Joined: ${new Date(membership.joined_at).toLocaleString()}`);
      console.log('');
    });

    // Check organizations
    console.log('🏢 Available organizations:');
    const { data: orgs, error: orgError } = await supabase
      .from('organizations')
      .select('id, name, slug')
      .order('name');

    if (orgError) {
      console.error('❌ Error fetching organizations:', orgError);
      return;
    }

    orgs.forEach((org, index) => {
      console.log(`  ${index + 1}. ${org.name} (${org.slug}) - ID: ${org.id}`);
    });

    console.log('\n💡 To get your Clerk User ID:');
    console.log('1. Open your browser and go to the application');
    console.log('2. Open Developer Tools (F12)');
    console.log('3. Go to Console tab');
    console.log('4. Type: window.Clerk?.user?.id');
    console.log('5. Copy the returned ID and use it in setup-super-admin.js');

  } catch (error) {
    console.error('❌ Debug failed:', error);
  }
}

// Run the debug
debugUserInfo();
