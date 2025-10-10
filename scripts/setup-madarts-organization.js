#!/usr/bin/env node

/**
 * Setup MadArts Organization
 * Creates the MadArts organization with proper logo configuration
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

console.log('🎨 Setting up MadArts Organization...');

// Supabase configuration
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupMadArtsOrganization() {
  try {
    console.log('📋 Creating MadArts organization...');
    
    // Check if organization already exists
    const { data: existingOrg, error: checkError } = await supabase
      .from('organizations')
      .select('id, name, slug')
      .eq('slug', 'madarts')
      .single();

    if (existingOrg) {
      console.log('✅ MadArts organization already exists:', existingOrg.name);
      console.log('🔄 Updating with new logo configuration...');
    }

    // Create/update the organization
    const organizationData = {
      name: 'MadArts',
      slug: 'madarts',
      description: 'MadArts is a creative organization focused on video performance, digital storytelling, and multimedia arts education. We provide comprehensive workshops and training programs for artists, content creators, and performers looking to master their craft in the digital age.',
      logo_url: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1760055343/smart-sign/orgs/madarts/madarts-logo-pink_nb5pgx.png',
      website: 'https://madarts.org',
      email: 'hello@madarts.org',
      phone: '+1 (555) 123-4567',
      address: '123 Creative District',
      city: 'Los Angeles',
      state: 'CA',
      zip_code: '90210',
      country: 'US',
      settings: {
        features: {
          workshops: true,
          learn_canvas: true,
          bookings: true,
          resources: true,
          artist_profiles: true,
          announcements: true,
          surveys: true
        },
        subscription: {
          tier: 'professional',
          status: 'active'
        },
        logos: {
          light_mode: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1760055343/smart-sign/orgs/madarts/madarts-logo-pink_nb5pgx.png',
          dark_mode: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1760055342/smart-sign/orgs/madarts/madarts-logo-white_cy1tt9.png'
        }
      },
      theme: {
        primary_color: '#E91E63',
        secondary_color: '#F48FB1',
        accent_color: '#FCE4EC',
        background_color: '#FFFFFF',
        text_color: '#1F2937',
        border_color: '#E5E7EB',
        dark_mode: {
          primary_color: '#F48FB1',
          secondary_color: '#E91E63',
          accent_color: '#1F2937',
          background_color: '#111827',
          text_color: '#F9FAFB',
          border_color: '#374151'
        }
      },
      is_active: true
    };

    let result;
    if (existingOrg) {
      // Update existing organization
      result = await supabase
        .from('organizations')
        .update(organizationData)
        .eq('slug', 'madarts')
        .select();
    } else {
      // Create new organization
      result = await supabase
        .from('organizations')
        .insert(organizationData)
        .select();
    }

    if (result.error) {
      throw result.error;
    }

    const org = result.data[0];
    console.log('✅ MadArts organization created/updated successfully!');
    console.log('📊 Organization Details:');
    console.log(`   ID: ${org.id}`);
    console.log(`   Name: ${org.name}`);
    console.log(`   Slug: ${org.slug}`);
    console.log(`   Website: ${org.website}`);
    console.log('🎨 Logo Configuration:');
    console.log(`   Light Mode: ${org.settings.logos.light_mode}`);
    console.log(`   Dark Mode: ${org.settings.logos.dark_mode}`);
    
    console.log('\n🌐 Organization URL:');
    console.log(`   http://localhost:3000/o/madarts`);
    
    console.log('\n🎯 Next Steps:');
    console.log('   1. Visit http://localhost:3000/o/madarts to see the organization');
    console.log('   2. Test light/dark mode logo switching');
    console.log('   3. Configure additional organization settings if needed');

    return org;

  } catch (error) {
    console.error('❌ Error setting up MadArts organization:', error.message);
    throw error;
  }
}

// Run the setup
setupMadArtsOrganization()
  .then(() => {
    console.log('\n🎉 MadArts organization setup completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Setup failed:', error.message);
    process.exit(1);
  });
