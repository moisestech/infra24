#!/usr/bin/env node

/**
 * Setup MadArts Organization and Video Performance Workshop
 * 
 * This script creates the MadArts organization and sets up the complete
 * Video Performance workshop with all chapters and proper organization visibility.
 * 
 * Usage: node scripts/setup-madarts-video-performance.js
 */

const fs = require('fs');
const path = require('path');

console.log('🎬 Setting up MadArts Organization and Video Performance Workshop');
console.log('================================================================\n');

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
    console.error('❌ Please run this script from the project root directory');
    process.exit(1);
}

console.log('✅ Project root directory confirmed');

// Check if SQL files exist
const sqlFiles = [
    'scripts/create-madarts-organization.sql',
    'scripts/create-video-performance-workshop.sql',
    'scripts/create-video-performance-chapters.sql'
];

console.log('\n📋 Checking SQL setup files...');
for (const file of sqlFiles) {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file} exists`);
    } else {
        console.error(`❌ ${file} not found`);
        process.exit(1);
    }
}

// Check if workshop content exists
console.log('\n📚 Checking workshop content files...');
const contentFiles = [
    'content/workshops/video-performance/syllabus.md',
    'content/workshops/video-performance/chapters/01-introduction-to-video-performance.md',
    'content/workshops/video-performance/chapters/02-overcoming-camera-anxiety.md',
    'content/workshops/video-performance/chapters/03-basic-acting-techniques-for-video.md',
    'content/workshops/video-performance/chapters/04-voice-and-diction-for-video.md',
    'content/workshops/video-performance/chapters/05-lighting-and-framing.md',
    'content/workshops/video-performance/chapters/06-movement-and-gesture.md',
    'content/workshops/video-performance/chapters/07-creating-emotional-connection.md'
];

for (const file of contentFiles) {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file} exists`);
    } else {
        console.error(`❌ ${file} not found`);
        process.exit(1);
    }
}

console.log('\n🎯 Setup Summary:');
console.log('================');
console.log('✅ MadArts organization will be created with:');
console.log('   - Slug: madarts');
console.log('   - Purple theme colors');
console.log('   - Professional subscription tier');
console.log('   - Full feature access');
console.log('');
console.log('✅ Video Performance workshop will be created with:');
console.log('   - 7 comprehensive chapters');
console.log('   - 4 hours 15 minutes total content');
console.log('   - Beginner to intermediate difficulty progression');
console.log('   - Tere Garcia as instructor');
console.log('   - Full MDX content integration');
console.log('');
console.log('✅ Organization visibility controls:');
console.log('   - Workshop is marked as shareable (is_shared = true)');
console.log('   - Can be made visible to other organizations');
console.log('   - Proper RLS policies for multi-tenant access');

console.log('\n📝 Next Steps:');
console.log('==============');
console.log('1. Run the SQL scripts in your Supabase SQL editor:');
console.log('   - scripts/create-madarts-organization.sql');
console.log('   - scripts/create-video-performance-workshop.sql');
console.log('   - scripts/create-video-performance-chapters.sql');
console.log('');
console.log('2. Test the workshop in your application:');
console.log('   - Visit /o/madarts/workshops');
console.log('   - Check the Video Performance workshop appears');
console.log('   - Test the Learn tab functionality');
console.log('');
console.log('3. Verify organization visibility:');
console.log('   - Ensure only MadArts org can see this workshop initially');
console.log('   - Test sharing with other organizations if needed');

console.log('\n🔧 Database Schema Notes:');
console.log('========================');
console.log('The setup uses the existing workshop_organization_sharing table');
console.log('to control which workshops are visible to which organizations.');
console.log('This allows for:');
console.log('- Organization-specific workshop catalogs');
console.log('- Selective sharing between organizations');
console.log('- Proper multi-tenant isolation');
console.log('- Flexible workshop distribution');

console.log('\n🎉 Setup files are ready!');
console.log('Run the SQL scripts in your Supabase dashboard to complete the setup.');
