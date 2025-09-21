const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Survey forms using the existing submission_forms table
const surveyForms = [
  {
    title: 'Oolite Arts - Staff Digital Skills Assessment',
    description: 'Help us understand your current digital tools and identify areas where we can better support your work.',
    type: 'survey',
    category: 'staff_onboarding',
    form_schema: {
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
          question: 'Which digital tools do you currently use for work? (Select all that apply)',
          required: false,
          choices: [
            'Email (Gmail, Outlook)',
            'Google Workspace (Docs, Sheets, Slides)',
            'Microsoft Office',
            'Project Management (Asana, Trello, Monday)',
            'Social Media Management',
            'CRM/Database Systems',
            'Video Conferencing (Zoom, Teams)',
            'Design Software (Photoshop, Canva)',
            'Website Management',
            'Financial Software',
            'Other'
          ]
        },
        {
          id: 'challenges',
          type: 'open',
          question: 'What are your biggest challenges with digital tools or technology?',
          required: false,
          placeholder: 'Describe any specific challenges or frustrations...'
        },
        {
          id: 'training_interests',
          type: 'multiple_choice',
          question: 'What type of digital training would be most helpful for you?',
          required: false,
          choices: [
            'Basic Computer Skills',
            'Google Workspace',
            'Social Media Management',
            'Project Management Tools',
            'Design and Graphics',
            'Data Analysis',
            'Website Management',
            'Video/Photo Editing',
            'Online Security',
            'Other'
          ]
        },
        {
          id: 'mobile_usage',
          type: 'single_choice',
          question: 'How often do you use mobile devices (phone/tablet) for work?',
          required: true,
          choices: [
            'Never',
            'Rarely',
            'Sometimes',
            'Often',
            'Always'
          ]
        },
        {
          id: 'feedback',
          type: 'open',
          question: 'Any additional comments or suggestions about digital tools and training?',
          required: false,
          placeholder: 'Share any thoughts or suggestions...'
        }
      ]
    },
    submission_settings: {
      allow_anonymous: true,
      require_authentication: false,
      max_submissions_per_user: 1,
      auto_approve: true
    },
    is_public: true,
    requires_authentication: false
  },
  {
    title: 'Bakehouse Art Complex - App Feedback Survey',
    description: 'Help us improve the Bakehouse app by sharing your experience and suggestions.',
    type: 'survey',
    category: 'app_feedback',
    form_schema: {
      title: 'Bakehouse App Feedback Survey',
      description: 'Your feedback helps us improve the app experience for everyone.',
      questions: [
        {
          id: 'user_type',
          type: 'single_choice',
          question: 'How do you primarily use the Bakehouse app?',
          required: true,
          choices: [
            'Artist/Resident',
            'Staff Member',
            'Visitor/Community Member',
            'Event Attendee',
            'Other'
          ]
        },
        {
          id: 'app_rating',
          type: 'rating',
          question: 'How would you rate your overall experience with the Bakehouse app?',
          required: true,
          scale: 5,
          labels: {
            low: 'Poor',
            high: 'Excellent'
          }
        },
        {
          id: 'favorite_features',
          type: 'multiple_choice',
          question: 'Which app features do you find most useful? (Select all that apply)',
          required: false,
          choices: [
            'Event Calendar',
            'Artist Directory',
            'Announcements',
            'Workshop Booking',
            'Community Forum',
            'Resource Library',
            'Notifications',
            'Profile Management',
            'Other'
          ]
        },
        {
          id: 'improvement_areas',
          type: 'multiple_choice',
          question: 'What areas would you like to see improved? (Select all that apply)',
          required: false,
          choices: [
            'User Interface Design',
            'Navigation/Ease of Use',
            'Loading Speed',
            'Mobile Experience',
            'Search Functionality',
            'Notification System',
            'Content Organization',
            'Accessibility',
            'Other'
          ]
        },
        {
          id: 'missing_features',
          type: 'open',
          question: 'What features would you like to see added to the app?',
          required: false,
          placeholder: 'Describe any features you think would be helpful...'
        },
        {
          id: 'technical_issues',
          type: 'open',
          question: 'Have you experienced any technical issues or bugs?',
          required: false,
          placeholder: 'Please describe any problems you\'ve encountered...'
        },
        {
          id: 'recommendation',
          type: 'rating',
          question: 'How likely are you to recommend the Bakehouse app to others?',
          required: true,
          scale: 10,
          labels: {
            low: 'Not likely',
            high: 'Very likely'
          }
        }
      ]
    },
    submission_settings: {
      allow_anonymous: true,
      require_authentication: false,
      max_submissions_per_user: 1,
      auto_approve: true
    },
    is_public: true,
    requires_authentication: false
  }
];

async function createSurveyForms() {
  console.log('🚀 Creating survey forms...');
  
  // Get organization IDs
  const { data: organizations, error: orgError } = await supabase
    .from('organizations')
    .select('id, slug, name');
  
  if (orgError) {
    console.error('❌ Error fetching organizations:', orgError);
    return;
  }
  
  console.log('📋 Found organizations:', organizations.map(o => `${o.name} (${o.slug})`));
  
  // Get a user ID to use as created_by
  const { data: users, error: userError } = await supabase
    .from('org_memberships')
    .select('clerk_user_id')
    .eq('role', 'admin')
    .limit(1);
  
  if (userError || !users || users.length === 0) {
    console.error('❌ No admin users found to use as created_by');
    return;
  }
  
  const createdBy = users[0].clerk_user_id;
  console.log(`👤 Using user ${createdBy} as created_by`);
  
  // Create survey forms for each organization
  for (const org of organizations) {
    console.log(`\n📝 Creating survey forms for ${org.name}...`);
    
    for (const form of surveyForms) {
      // Skip app feedback survey for non-Bakehouse orgs
      if (form.category === 'app_feedback' && org.slug !== 'bakehouse') {
        continue;
      }
      
      // Skip staff onboarding survey for non-Oolite orgs
      if (form.category === 'staff_onboarding' && org.slug !== 'oolite') {
        continue;
      }
      
      console.log(`  📋 Creating: ${form.title}`);
      
      const { data, error } = await supabase
        .from('submission_forms')
        .insert({
          organization_id: org.id,
          title: form.title,
          description: form.description,
          type: form.type,
          category: form.category,
          form_schema: form.form_schema,
          submission_settings: form.submission_settings,
          is_public: form.is_public,
          requires_authentication: form.requires_authentication,
          created_by: createdBy,
          updated_by: createdBy
        })
        .select()
        .single();
      
      if (error) {
        console.error(`    ❌ Error:`, error.message);
      } else {
        console.log(`    ✅ Created: ${data.title} (ID: ${data.id})`);
      }
    }
  }
  
  console.log('\n🎉 Survey forms creation complete!');
}

// Run the script
createSurveyForms()
  .then(() => {
    console.log('✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
