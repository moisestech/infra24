#!/usr/bin/env node

/**
 * Add current user to Oolite organization for testing
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addUserToOolite() {
  console.log('🔧 Adding user to Oolite organization...\n');

  try {
    // Get Oolite organization
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('id, name, slug')
      .eq('slug', 'oolite')
      .single();

    if (orgError || !org) {
      console.error('❌ Error finding oolite organization:', orgError?.message);
      return;
    }

    console.log(`✅ Found organization: ${org.name} (${org.slug})`);
    console.log(`   ID: ${org.id}\n`);

    // Get the user ID from command line argument or use a default
    const userId = process.argv[2] || 'user_31h...'; // You can pass the full user ID as argument
    
    console.log(`👤 Adding user: ${userId}`);

    // Check if user already exists
    const { data: existingMembership } = await supabase
      .from('org_memberships')
      .select('*')
      .eq('organization_id', org.id)
      .eq('user_id', userId)
      .single();

    if (existingMembership) {
      console.log('ℹ️  User already has membership in this organization');
      console.log(`   Role: ${existingMembership.role}`);
      return;
    }

    // Add user to organization as admin
    const { data: membership, error: insertError } = await supabase
      .from('org_memberships')
      .insert({
        organization_id: org.id,
        user_id: userId,
        role: 'admin',
        is_active: true,
        permissions: {}
      })
      .select()
      .single();

    if (insertError) {
      console.error('❌ Error adding user to organization:', insertError.message);
      return;
    }

    console.log('✅ User successfully added to Oolite organization!');
    console.log(`   Role: ${membership.role}`);
    console.log(`   Membership ID: ${membership.id}\n`);

    console.log('🎯 Now you can:');
    console.log('   1. Refresh the survey admin page');
    console.log('   2. Create and manage surveys for Oolite');
    console.log('   3. Access all survey features');

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

// Run the script
addUserToOolite();

