#!/usr/bin/env node

/**
 * Setup Super Admin Script
 * 
 * This script helps set up a super admin account for the organization.
 * Run this after you've signed up/logged in through Clerk.
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

async function setupSuperAdmin() {
  console.log('🔧 Setting up Super Admin account...\n');

  try {
    // First, let's check what organizations exist
    console.log('📋 Checking existing organizations...');
    const { data: orgs, error: orgError } = await supabase
      .from('organizations')
      .select('id, name, slug')
      .order('name');

    if (orgError) {
      console.error('❌ Error fetching organizations:', orgError);
      return;
    }

    console.log('📋 Available organizations:');
    orgs.forEach((org, index) => {
      console.log(`  ${index + 1}. ${org.name} (${org.slug}) - ID: ${org.id}`);
    });

    // Get user input for Clerk User ID
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const clerkUserId = await new Promise((resolve) => {
      rl.question('\n🔑 Enter your Clerk User ID (you can find this in Clerk dashboard or browser dev tools): ', resolve);
    });

    if (!clerkUserId) {
      console.log('❌ Clerk User ID is required');
      rl.close();
      return;
    }

    // Get organization selection
    const orgSelection = await new Promise((resolve) => {
      rl.question('\n🏢 Enter the number of the organization you want to be admin for (or press Enter for first one): ', resolve);
    });

    const selectedOrgIndex = orgSelection ? parseInt(orgSelection) - 1 : 0;
    const selectedOrg = orgs[selectedOrgIndex];

    if (!selectedOrg) {
      console.log('❌ Invalid organization selection');
      rl.close();
      return;
    }

    console.log(`\n✅ Selected organization: ${selectedOrg.name} (${selectedOrg.slug})`);

    // Check if user already has a membership
    console.log('\n🔍 Checking existing membership...');
    const { data: existingMembership, error: membershipError } = await supabase
      .from('org_memberships')
      .select('*')
      .eq('clerk_user_id', clerkUserId)
      .eq('organization_id', selectedOrg.id)
      .single();

    if (membershipError && membershipError.code !== 'PGRST116') {
      console.error('❌ Error checking membership:', membershipError);
      rl.close();
      return;
    }

    if (existingMembership) {
      console.log('👤 User already has membership. Updating to super_admin...');
      
      const { error: updateError } = await supabase
        .from('org_memberships')
        .update({ 
          role: 'super_admin',
          is_active: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingMembership.id);

      if (updateError) {
        console.error('❌ Error updating membership:', updateError);
        rl.close();
        return;
      }

      console.log('✅ Successfully updated user to super_admin role!');
    } else {
      console.log('👤 Creating new super_admin membership...');
      
      const { error: insertError } = await supabase
        .from('org_memberships')
        .insert({
          clerk_user_id: clerkUserId,
          organization_id: selectedOrg.id,
          role: 'super_admin',
          is_active: true,
          joined_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (insertError) {
        console.error('❌ Error creating membership:', insertError);
        rl.close();
        return;
      }

      console.log('✅ Successfully created super_admin membership!');
    }

    console.log('\n🎉 Setup complete! You should now have super_admin access.');
    console.log('\n📝 Next steps:');
    console.log('1. Make sure you\'re logged in to the application');
    console.log('2. Visit the announcements page to see edit buttons');
    console.log('3. You should now see admin controls and edit functionality');

    rl.close();

  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

// Run the setup
setupSuperAdmin();
