#!/usr/bin/env node

/**
 * Add Banner Images to Artists Script
 * 
 * This script adds banner_image column to artist_profiles table and populates
 * it with appropriate banner images for each artist.
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Oolite organization ID
const OOLITE_ORG_ID = '2133fe94-fb12-41f8-ab37-ea4acd4589f6';

// Banner images organized by residency type
const bannerImages = {
  'Studio Resident': 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=400&fit=crop&crop=center',
  'Live In Art Resident': 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=400&fit=crop&crop=center',
  'Cinematic Resident': 'https://images.unsplash.com/photo-1489599805000-0b2b3b3b3b3b?w=800&h=400&fit=crop&crop=center',
  'Staff': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop&crop=center'
};

// Avatar images organized by residency type
const avatarImages = {
  'Studio Resident': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
  'Live In Art Resident': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
  'Cinematic Resident': 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face',
  'Staff': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face'
};

async function addBannerImagesToArtists() {
  console.log('🎨 Adding banner images to Oolite artists...\n');
  
  try {
    // First, let's get all artists
    const { data: artists, error: fetchError } = await supabase
      .from('artist_profiles')
      .select('id, name, metadata')
      .eq('organization_id', OOLITE_ORG_ID);
    
    if (fetchError) {
      console.error('❌ Error fetching artists:', fetchError);
      return;
    }
    
    if (!artists || artists.length === 0) {
      console.log('❌ No artists found for Oolite organization');
      return;
    }
    
    console.log(`📊 Found ${artists.length} artists to update\n`);
    
    // Update each artist with banner and avatar images
    let updated = 0;
    
    for (const artist of artists) {
      const residencyType = artist.metadata?.residency_type || 'Studio Resident';
      const bannerImage = bannerImages[residencyType] || bannerImages['Studio Resident'];
      const avatarImage = avatarImages[residencyType] || avatarImages['Studio Resident'];
      
      const { error: updateError } = await supabase
        .from('artist_profiles')
        .update({
          banner_image: bannerImage,
          profile_image: avatarImage
        })
        .eq('id', artist.id);
      
      if (updateError) {
        console.error(`❌ Error updating ${artist.name}:`, updateError);
        continue;
      }
      
      updated++;
      console.log(`✅ Updated ${artist.name} (${residencyType})`);
      console.log(`   - Banner: ${bannerImage}`);
      console.log(`   - Avatar: ${avatarImage}`);
    }
    
    console.log(`\n🎉 Successfully updated ${updated} artists with banner and avatar images!`);
    
    // Verify the updates
    const { data: verifyData, error: verifyError } = await supabase
      .from('artist_profiles')
      .select('name, banner_image, profile_image, metadata')
      .eq('organization_id', OOLITE_ORG_ID)
      .limit(5);
    
    if (verifyError) {
      console.error('❌ Error verifying updates:', verifyError);
      return;
    }
    
    console.log('\n📊 Verification - Sample updated artists:');
    verifyData.forEach(artist => {
      console.log(`  - ${artist.name}:`);
      console.log(`    Banner: ${artist.banner_image ? '✅' : '❌'}`);
      console.log(`    Avatar: ${artist.profile_image ? '✅' : '❌'}`);
    });
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the script
if (require.main === module) {
  addBannerImagesToArtists()
    .then(() => {
      console.log('\n✅ Script completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = { addBannerImagesToArtists };
