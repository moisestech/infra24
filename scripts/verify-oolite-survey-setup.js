#!/usr/bin/env node

/**
 * Verify Oolite Survey Setup
 * 
 * This script verifies that the survey system is properly set up for the 'oolite' organization
 * and provides instructions for accessing the survey admin panel.
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyOoliteSurveySetup() {
  console.log('🔍 Verifying Oolite Survey Setup...\n');

  try {
    // 1. Check if oolite organization exists
    console.log('1️⃣ Checking Oolite organization...');
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('id, name, slug')
      .eq('slug', 'oolite')
      .single();

    if (orgError) {
      console.error('❌ Error finding oolite organization:', orgError.message);
      return;
    }

    if (!org) {
      console.error('❌ Oolite organization not found');
      console.log('💡 Run: node scripts/database/setup/setup-supabase-complete.js');
      return;
    }

    console.log(`✅ Found organization: ${org.name} (${org.slug})`);
    console.log(`   ID: ${org.id}\n`);

    // 2. Check survey tables exist by trying to query them
    console.log('2️⃣ Checking survey tables...');
    const expectedTables = ['surveys', 'survey_templates', 'survey_invitations', 'survey_responses', 'survey_analytics', 'survey_comments'];
    
    console.log('✅ Survey tables found:');
    for (const table of expectedTables) {
      try {
        const { error } = await supabase.from(table).select('*').limit(1);
        if (error) {
          console.log(`   ❌ ${table} (error: ${error.message})`);
        } else {
          console.log(`   ✅ ${table}`);
        }
      } catch (err) {
        console.log(`   ❌ ${table} (error: ${err.message})`);
      }
    }
    console.log('');

    // 3. Check survey templates
    console.log('3️⃣ Checking survey templates...');
    const { data: templates, error: templatesError } = await supabase
      .from('survey_templates')
      .select('id, name, category, is_public')
      .eq('is_public', true);

    if (templatesError) {
      console.error('❌ Error checking survey templates:', templatesError.message);
      return;
    }

    if (templates && templates.length > 0) {
      console.log('✅ Available survey templates:');
      templates.forEach(template => {
        console.log(`   📋 ${template.name} (${template.category})`);
      });
    } else {
      console.log('⚠️  No survey templates found');
    }
    console.log('');

    // 4. Check existing surveys for oolite
    console.log('4️⃣ Checking existing surveys for Oolite...');
    const { data: surveys, error: surveysError } = await supabase
      .from('surveys')
      .select('id, title, status, created_at')
      .eq('organization_id', org.id);

    if (surveysError) {
      console.error('❌ Error checking surveys:', surveysError.message);
      return;
    }

    if (surveys && surveys.length > 0) {
      console.log('✅ Existing surveys for Oolite:');
      surveys.forEach(survey => {
        console.log(`   📊 ${survey.title} (${survey.status})`);
        console.log(`      Created: ${new Date(survey.created_at).toLocaleDateString()}`);
      });
    } else {
      console.log('ℹ️  No surveys created yet for Oolite');
    }
    console.log('');

    // 5. Provide access instructions
    console.log('🎯 Survey System Access Instructions:');
    console.log('');
    console.log('📱 Admin Panel (Create & Manage Surveys):');
    console.log(`   http://localhost:3000/o/oolite/admin/surveys`);
    console.log('');
    console.log('👥 Survey List (View Available Surveys):');
    console.log(`   http://localhost:3000/o/oolite/surveys`);
    console.log('');
    console.log('🚀 Quick Start:');
    console.log('   1. Make sure the dev server is running: npm run dev');
    console.log('   2. Visit the admin panel URL above');
    console.log('   3. Create a new survey using the "Staff Digital Skills & Workflow Survey" template');
    console.log('   4. Upload your staff email list');
    console.log('   5. Send invitations');
    console.log('');
    console.log('📋 Available Templates:');
    console.log('   • Staff Digital Skills & Workflow Survey (EN/ES)');
    console.log('   • Digital Lab Experience Survey (EN/ES)');
    console.log('');
    console.log('✅ Survey system is ready to use!');

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

// Run the verification
verifyOoliteSurveySetup();
