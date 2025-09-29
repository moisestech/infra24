#!/usr/bin/env node

/**
 * Populate Sample Surveys Script
 * 
 * This script creates sample surveys for organizations using the new surveys table
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Organization IDs
const OOLITE_ORG_ID = '2133fe94-fb12-41f8-ab37-ea4acd4589f6';
const BAKEHOUSE_ORG_ID = 'cadbef4a-cd55-4f47-9fa0-083243273979';

// Sample surveys data - just for Oolite for now
const sampleSurveys = [
  {
    organization_id: OOLITE_ORG_ID,
    title: 'Oolite Arts - Staff Digital Skills Assessment',
    description: 'Help us understand your current digital tools and identify areas where we can better support your work.',
    status: 'active',
    is_anonymous: true,
    opens_at: new Date().toISOString(),
    closes_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    survey_schema: {
      title: 'Staff Digital Skills Assessment',
      description: 'This survey will help us understand your digital skills and training needs.',
      questions: [
        {
          id: 'role',
          type: 'single_choice',
          question: 'What is your primary role at Oolite Arts?',
          required: true,
          choices: [
            'Administrative Staff',
            'Program Coordinator', 
            'Artist Services',
            'Development/Fundraising',
            'Marketing/Communications',
            'Facilities/Operations',
            'Leadership/Management',
            'Other'
          ]
        },
        {
          id: 'digital_comfort',
          type: 'rating',
          question: 'How comfortable are you with digital tools and technology?',
          required: true,
          scale: 5,
          labels: {
            low: 'Not comfortable',
            high: 'Very comfortable'
          }
        },
        {
          id: 'current_tools',
          type: 'multiple_choice',
          question: 'Which digital tools do you currently use for work?',
          required: false,
          choices: [
            'Google Workspace (Gmail, Drive, Docs)',
            'Microsoft Office',
            'Adobe Creative Suite',
            'Social Media Platforms',
            'Project Management Tools (Asana, Trello)',
            'Video Conferencing (Zoom, Teams)',
            'Database/CRM Systems',
            'Other'
          ]
        },
        {
          id: 'training_needs',
          type: 'open',
          question: 'What digital skills would you like to improve or learn?',
          required: false,
          placeholder: 'Please describe any specific training needs...'
        },
        {
          id: 'workflow_challenges',
          type: 'open',
          question: 'What are your biggest workflow challenges with digital tools?',
          required: false,
          placeholder: 'Describe any bottlenecks or frustrations...'
        }
      ]
    },
    settings: {
      allow_multiple_responses: false,
      show_progress: true,
      require_completion: true,
      thank_you_message: 'Thank you for your feedback! We will use this information to improve our digital tools and training programs.'
    },
    created_by: 'system',
    updated_by: 'system'
  },
  {
    organization_id: OOLITE_ORG_ID,
    title: 'Digital Lab Experience Survey',
    description: 'Share your experience with the Digital Lab equipment, staff, and programs.',
    status: 'active',
    is_anonymous: true,
    opens_at: new Date().toISOString(),
    closes_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    survey_schema: {
      title: 'Digital Lab Experience Survey',
      description: 'Help us improve the Digital Lab experience for all users.',
      questions: [
        {
          id: 'usage_frequency',
          type: 'single_choice',
          question: 'How often do you use the Digital Lab?',
          required: true,
          choices: [
            'Daily',
            'Weekly',
            'Monthly',
            'Rarely',
            'First time'
          ]
        },
        {
          id: 'equipment_rating',
          type: 'rating',
          question: 'How would you rate the Digital Lab equipment?',
          required: true,
          scale: 5,
          labels: {
            low: 'Poor',
            high: 'Excellent'
          }
        },
        {
          id: 'staff_rating',
          type: 'rating',
          question: 'How would you rate the Digital Lab staff support?',
          required: true,
          scale: 5,
          labels: {
            low: 'Poor',
            high: 'Excellent'
          }
        },
        {
          id: 'programs_rating',
          type: 'rating',
          question: 'How would you rate the Digital Lab programs and workshops?',
          required: true,
          scale: 5,
          labels: {
            low: 'Poor',
            high: 'Excellent'
          }
        },
        {
          id: 'improvements',
          type: 'open',
          question: 'What improvements would you like to see in the Digital Lab?',
          required: false,
          placeholder: 'Please share your suggestions...'
        }
      ]
    },
    settings: {
      allow_multiple_responses: false,
      show_progress: true,
      require_completion: true,
      thank_you_message: 'Thank you for your feedback! Your input helps us make the Digital Lab better for everyone.'
    },
    created_by: 'system',
    updated_by: 'system'
  }
];

async function populateSampleSurveys() {
  console.log('🎯 Starting Sample Surveys Population...\n');
  
  try {
    // First, let's check if surveys already exist
    const { data: existingSurveys, error: checkError } = await supabase
      .from('surveys')
      .select('id, title, organization_id');
    
    if (checkError) {
      console.error('❌ Error checking existing surveys:', checkError);
      return;
    }
    
    if (existingSurveys && existingSurveys.length > 0) {
      console.log(`📋 Found ${existingSurveys.length} existing surveys. Clearing them first...`);
      
      // Delete existing surveys
      const { error: deleteError } = await supabase
        .from('surveys')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all surveys
      
      if (deleteError) {
        console.error('❌ Error deleting existing surveys:', deleteError);
        return;
      }
      
      console.log('✅ Cleared existing surveys\n');
    }
    
    console.log(`📊 Total surveys to create: ${sampleSurveys.length}`);
    
    // Create surveys
    const { data: createdSurveys, error: insertError } = await supabase
      .from('surveys')
      .insert(sampleSurveys)
      .select('id, title, organization_id, status');
    
    if (insertError) {
      console.error('❌ Error creating surveys:', insertError);
      return;
    }
    
    console.log(`✅ Successfully created ${createdSurveys.length} surveys!`);
    
    // Show created surveys
    createdSurveys.forEach(survey => {
      console.log(`   - ${survey.title} (${survey.status})`);
    });
    
    // Verify the creation
    const { data: verifyData, error: verifyError } = await supabase
      .from('surveys')
      .select('title, status, organization_id, organizations(name)')
      .order('created_at');
    
    if (verifyError) {
      console.error('❌ Error verifying surveys:', verifyError);
      return;
    }
    
    console.log(`\n📊 Verification: Found ${verifyData.length} surveys in database`);
    
    // Group by organization
    const byOrg = verifyData.reduce((acc, survey) => {
      const orgName = survey.organizations?.name || 'Unknown';
      acc[orgName] = (acc[orgName] || 0) + 1;
      return acc;
    }, {});
    
    console.log('\n📈 Surveys by organization:');
    Object.entries(byOrg).forEach(([org, count]) => {
      console.log(`   - ${org}: ${count}`);
    });
    
    console.log('\n🎉 Sample surveys are now available!');
    console.log('Visit: http://localhost:3001/o/oolite/surveys');
    console.log('Visit: http://localhost:3001/o/bakehouse/surveys');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the script
if (require.main === module) {
  populateSampleSurveys()
    .then(() => {
      console.log('\n✅ Script completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = { populateSampleSurveys, sampleSurveys };
