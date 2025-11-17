const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
  console.log('❌ SUPABASE_SERVICE_ROLE_KEY not found');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkOoliteWorkshops() {
  console.log('🔍 Checking Oolite workshops...');
  
  // Get Oolite organization
  const { data: org, error: orgError } = await supabase
    .from('organizations')
    .select('id, name, slug')
    .eq('slug', 'oolite')
    .single();
    
  if (orgError) {
    console.error('❌ Error fetching Oolite org:', orgError);
    return;
  }
  
  console.log('🏢 Oolite Organization:', org);
  
  // Get workshops for Oolite
  const { data: workshops, error: workshopsError } = await supabase
    .from('workshops')
    .select('*')
    .eq('organization_id', org.id);
    
  if (workshopsError) {
    console.error('❌ Error fetching workshops:', workshopsError);
    return;
  }
  
  console.log('🎓 Oolite Workshops:', workshops?.length || 0);
  
  if (workshops && workshops.length > 0) {
    workshops.forEach((workshop, index) => {
      console.log(`${index + 1}. ${workshop.title}`);
      console.log(`   ID: ${workshop.id}`);
      console.log(`   Status: ${workshop.status}`);
      console.log(`   Has Learn Content: ${workshop.has_learn_content}`);
      console.log(`   Learn Syllabus: ${workshop.learn_syllabus ? 'Yes' : 'No'}`);
      console.log(`   ---`);
    });
  }
}

checkOoliteWorkshops().catch(console.error);
