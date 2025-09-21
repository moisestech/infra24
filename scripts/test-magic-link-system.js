const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'http://localhost:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testMagicLinkSystem() {
  console.log('🧪 Testing Magic Link System...\n');

  try {
    // 1. Get the oolite organization
    console.log('1. Getting organization...');
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('id, name, slug')
      .eq('slug', 'oolite')
      .single();

    if (orgError || !org) {
      console.error('❌ Organization not found:', orgError);
      return;
    }
    console.log('✅ Found organization:', org.name, '(ID:', org.id, ')');

    // 2. Get a survey template
    console.log('\n2. Getting survey template...');
    const { data: template, error: templateError } = await supabase
      .from('survey_templates')
      .select('id, name, category')
      .eq('is_public', true)
      .limit(1)
      .single();

    if (templateError || !template) {
      console.error('❌ Template not found:', templateError);
      return;
    }
    console.log('✅ Found template:', template.name, '(ID:', template.id, ')');

    // 3. Create a test survey
    console.log('\n3. Creating test survey...');
    const { data: survey, error: surveyError } = await supabase
      .from('surveys')
      .insert({
        title: 'Test Magic Link Survey',
        description: 'Testing the magic link system',
        organization_id: org.id,
        template_id: template.id,
        status: 'active',
        is_anonymous: false,
        language_default: 'en',
        languages_supported: ['en', 'es'],
        opens_at: new Date().toISOString(),
        closes_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        max_responses: 100,
        max_responses_per_user: 1,
        survey_schema: template.template_schema || {},
        created_by: 'test-user',
        updated_by: 'test-user'
      })
      .select()
      .single();

    if (surveyError || !survey) {
      console.error('❌ Failed to create survey:', surveyError);
      return;
    }
    console.log('✅ Created survey:', survey.title, '(ID:', survey.id, ')');

    // 4. Generate a magic link
    console.log('\n4. Generating magic link...');
    const { data: magicLink, error: magicLinkError } = await supabase
      .from('magic_links')
      .insert({
        token: 'test-token-' + Date.now(),
        email: 'test@example.com',
        survey_id: survey.id,
        organization_id: org.id,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        metadata: {
          firstName: 'Test',
          lastName: 'User',
          role: 'staff',
          department: 'IT'
        }
      })
      .select()
      .single();

    if (magicLinkError || !magicLink) {
      console.error('❌ Failed to create magic link:', magicLinkError);
      return;
    }
    console.log('✅ Created magic link:', magicLink.token);

    // 5. Test magic link validation
    console.log('\n5. Testing magic link validation...');
    const { data: validation, error: validationError } = await supabase
      .from('magic_links')
      .select('*')
      .eq('token', magicLink.token)
      .eq('used', false)
      .single();

    if (validationError || !validation) {
      console.error('❌ Magic link validation failed:', validationError);
      return;
    }
    console.log('✅ Magic link is valid and unused');

    // 6. Generate the magic link URL
    const magicLinkUrl = `http://localhost:3000/survey/${survey.id}?token=${magicLink.token}`;
    console.log('\n6. Magic Link URL:');
    console.log('🔗', magicLinkUrl);

    // 7. Test tracking
    console.log('\n7. Testing magic link tracking...');
    const { data: tracking, error: trackingError } = await supabase
      .from('magic_link_analytics')
      .insert({
        token: magicLink.token,
        action: 'opened',
        user_agent: 'test-script',
        ip_address: '127.0.0.1'
      })
      .select()
      .single();

    if (trackingError || !tracking) {
      console.error('❌ Failed to track magic link usage:', trackingError);
      return;
    }
    console.log('✅ Magic link tracking successful');

    console.log('\n🎉 Magic Link System Test Complete!');
    console.log('\n📋 Summary:');
    console.log('- Organization:', org.name);
    console.log('- Survey:', survey.title);
    console.log('- Magic Link Token:', magicLink.token);
    console.log('- Magic Link URL:', magicLinkUrl);
    console.log('- Test Email:', 'test@example.com');

    console.log('\n🚀 Next Steps:');
    console.log('1. Open the magic link URL in your browser');
    console.log('2. Test the survey landing page');
    console.log('3. Verify the magic link validation works');
    console.log('4. Check the analytics tracking');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testMagicLinkSystem();
