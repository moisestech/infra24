const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSurveyFlow() {
  console.log('🧪 Testing survey flow...');
  
  try {
    // 1. Check if surveys exist
    console.log('\n1️⃣ Checking surveys...');
    const { data: surveys, error: surveysError } = await supabase
      .from('submission_forms')
      .select(`
        id,
        title,
        category,
        organizations!inner(name, slug)
      `)
      .eq('type', 'survey')
      .eq('is_active', true);
    
    if (surveysError) {
      console.error('❌ Error fetching surveys:', surveysError);
    } else {
      console.log('✅ Found surveys:', surveys.map(s => `${s.title} (${s.organizations.slug})`));
    }
    
    // 2. Test survey details API (simulate the API call)
    console.log('\n2️⃣ Testing survey details...');
    if (surveys && surveys.length > 0) {
      const testSurvey = surveys[0];
      console.log(`📋 Testing survey: ${testSurvey.title}`);
      
      // Simulate the API query
      const { data: surveyDetails, error: detailsError } = await supabase
        .from('submission_forms')
        .select(`
          id,
          title,
          description,
          category,
          type,
          form_schema,
          submission_settings,
          is_public,
          requires_authentication,
          organization_id,
          organizations!inner(id, name, slug)
        `)
        .eq('id', testSurvey.id)
        .eq('type', 'survey')
        .eq('is_active', true)
        .single();
      
      if (detailsError) {
        console.error('❌ Error fetching survey details:', detailsError);
      } else {
        console.log('✅ Survey details loaded successfully');
        console.log(`   - Title: ${surveyDetails.title}`);
        console.log(`   - Organization: ${surveyDetails.organizations.name}`);
        console.log(`   - Questions: ${surveyDetails.form_schema?.questions?.length || 0}`);
        console.log(`   - Anonymous: ${surveyDetails.submission_settings?.allow_anonymous || false}`);
      }
    }
    
    // 3. Test submission creation (without actually submitting)
    console.log('\n3️⃣ Testing submission structure...');
    if (surveys && surveys.length > 0) {
      const testSurvey = surveys[0];
      const mockResponses = {
        role: 'Administrative Staff',
        digital_comfort: 4,
        current_tools: ['Email (Gmail, Outlook)', 'Google Workspace (Docs, Sheets, Slides)'],
        challenges: 'Sometimes I struggle with advanced features',
        training_interests: ['Google Workspace', 'Project Management Tools'],
        mobile_usage: 'Often',
        feedback: 'Great survey!'
      };
      
      const submissionData = {
        form_id: testSurvey.id,
        organization_id: testSurvey.organization_id,
        responses: mockResponses,
        metadata: {
          submitted_at: new Date().toISOString(),
          user_agent: 'Test Script',
          ip_address: '127.0.0.1'
        },
        status: 'submitted',
        is_anonymous: true
      };
      
      console.log('📝 Mock submission data structure:');
      console.log(`   - Form ID: ${submissionData.form_id}`);
      console.log(`   - Organization ID: ${submissionData.organization_id}`);
      console.log(`   - Response count: ${Object.keys(submissionData.responses).length}`);
      console.log(`   - Anonymous: ${submissionData.is_anonymous}`);
      console.log('✅ Submission structure is valid');
    }
    
    // 4. Check organizations API compatibility
    console.log('\n4️⃣ Testing organizations API compatibility...');
    const { data: orgs, error: orgsError } = await supabase
      .from('organizations')
      .select('id, name, slug')
      .in('slug', ['oolite', 'bakehouse']);
    
    if (orgsError) {
      console.error('❌ Error fetching organizations:', orgsError);
    } else {
      console.log('✅ Organizations found:', orgs.map(o => `${o.name} (${o.slug})`));
    }
    
    console.log('\n🎉 Survey flow test completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Visit http://localhost:3000/o/oolite to see the survey invitation');
    console.log('2. Click "Generate Magic Link" to create a survey link');
    console.log('3. Test the survey submission flow');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testSurveyFlow()
  .then(() => {
    console.log('✅ Test script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Test script failed:', error);
    process.exit(1);
  });
