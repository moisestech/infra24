const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Survey templates for different organizations
const surveyTemplates = [
  {
    name: 'Oolite Arts - Staff Digital Skills Assessment',
    description: 'Comprehensive survey to assess staff digital skills and identify training needs for Oolite Arts team members.',
    category: 'staff_onboarding',
    is_public: true,
    template_schema: {
      title: 'Staff Digital Skills Assessment',
      description: 'Help us understand your current digital tools and identify areas where we can better support your work.',
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
    }
  },
  {
    name: 'Bakehouse Art Complex - App Feedback Survey',
    description: 'Gather feedback from Bakehouse community about the new app features and user experience.',
    category: 'app_feedback',
    is_public: true,
    template_schema: {
      title: 'Bakehouse App Feedback Survey',
      description: 'Help us improve the Bakehouse app by sharing your experience and suggestions.',
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
    }
  },
  {
    name: 'Locust Projects - Community Engagement Survey',
    description: 'Survey to understand community needs and engagement preferences for Locust Projects programming.',
    category: 'community_engagement',
    is_public: true,
    template_schema: {
      title: 'Community Engagement Survey',
      description: 'Help us understand how to better serve our community and improve our programming.',
      questions: [
        {
          id: 'community_role',
          type: 'single_choice',
          question: 'How do you primarily engage with Locust Projects?',
          required: true,
          choices: [
            'Artist/Exhibitor',
            'Visitor/Attendee',
            'Volunteer',
            'Staff Member',
            'Donor/Supporter',
            'Community Partner',
            'Other'
          ]
        },
        {
          id: 'programming_interests',
          type: 'multiple_choice',
          question: 'What types of programming are you most interested in? (Select all that apply)',
          required: false,
          choices: [
            'Contemporary Art Exhibitions',
            'Artist Talks/Lectures',
            'Workshops/Classes',
            'Community Events',
            'Film Screenings',
            'Music Performances',
            'Educational Programs',
            'Collaborative Projects',
            'Other'
          ]
        },
        {
          id: 'engagement_frequency',
          type: 'single_choice',
          question: 'How often do you participate in Locust Projects activities?',
          required: true,
          choices: [
            'Daily',
            'Weekly',
            'Monthly',
            'Quarterly',
            'Annually',
            'This is my first time'
          ]
        },
        {
          id: 'communication_preferences',
          type: 'multiple_choice',
          question: 'How do you prefer to receive updates about Locust Projects? (Select all that apply)',
          required: false,
          choices: [
            'Email Newsletter',
            'Social Media',
            'Website',
            'Mobile App',
            'Text Messages',
            'Phone Calls',
            'In-Person',
            'Other'
          ]
        },
        {
          id: 'accessibility_needs',
          type: 'open',
          question: 'Do you have any accessibility needs or suggestions for making our programs more inclusive?',
          required: false,
          placeholder: 'Please share any accessibility considerations...'
        },
        {
          id: 'suggestions',
          type: 'open',
          question: 'What suggestions do you have for improving Locust Projects?',
          required: false,
          placeholder: 'Share your ideas and suggestions...'
        }
      ]
    }
  }
];

async function createSurveyTemplates() {
  console.log('🚀 Creating survey templates...');
  
  // Get a user ID to use as created_by (we'll use the first admin user)
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
  
  for (const template of surveyTemplates) {
    console.log(`📝 Creating template: ${template.name}`);
    
    const { data, error } = await supabase
      .from('survey_templates')
      .insert({
        ...template,
        created_by: createdBy
      })
      .select()
      .single();
    
    if (error) {
      console.error(`❌ Error creating template ${template.name}:`, error);
    } else {
      console.log(`✅ Created template: ${data.name} (ID: ${data.id})`);
    }
  }
  
  console.log('🎉 Survey templates creation complete!');
}

// Run the script
createSurveyTemplates()
  .then(() => {
    console.log('✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
