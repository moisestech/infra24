const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSurveys() {
  console.log('🔍 Checking surveys...');
  
  try {
    // Get surveys for Oolite
    const { data: ooliteSurveys, error: ooliteError } = await supabase
      .from('submission_forms')
      .select(`
        id,
        title,
        category,
        type,
        is_public,
        organizations!inner(name, slug)
      `)
      .eq('type', 'survey')
      .eq('organizations.slug', 'oolite');
    
    if (ooliteError) {
      console.error('❌ Error fetching Oolite surveys:', ooliteError);
    } else {
      console.log('📋 Oolite surveys:', ooliteSurveys);
    }
    
    // Get surveys for Bakehouse
    const { data: bakehouseSurveys, error: bakehouseError } = await supabase
      .from('submission_forms')
      .select(`
        id,
        title,
        category,
        type,
        is_public,
        organizations!inner(name, slug)
      `)
      .eq('type', 'survey')
      .eq('organizations.slug', 'bakehouse');
    
    if (bakehouseError) {
      console.error('❌ Error fetching Bakehouse surveys:', bakehouseError);
    } else {
      console.log('📋 Bakehouse surveys:', bakehouseSurveys);
    }
    
    // Get all surveys
    const { data: allSurveys, error: allError } = await supabase
      .from('submission_forms')
      .select(`
        id,
        title,
        category,
        type,
        is_public,
        organizations!inner(name, slug)
      `)
      .eq('type', 'survey');
    
    if (allError) {
      console.error('❌ Error fetching all surveys:', allError);
    } else {
      console.log('📋 All surveys:', allSurveys);
    }
    
  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

checkSurveys()
  .then(() => {
    console.log('✅ Script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
