const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
  console.log('❌ SUPABASE_SERVICE_ROLE_KEY not found');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkWorkshopChapters() {
  console.log('🔍 Checking workshop chapters...');
  
  // Check if chapters table exists and get its structure
  const { data: chapters, error: chaptersError } = await supabase
    .from('chapters')
    .select('*')
    .limit(5);
    
  if (chaptersError) {
    console.error('❌ Error fetching chapters:', chaptersError);
    console.log('📋 Chapters table might not exist or have different structure');
    return;
  }
  
  console.log('📚 Chapters found:', chapters?.length || 0);
  
  if (chapters && chapters.length > 0) {
    console.log('📋 Sample chapter structure:');
    console.log(JSON.stringify(chapters[0], null, 2));
  }
  
  // Check for any learn-related tables
  console.log('\n🔍 Checking for learn-related tables...');
  
  // Try to get table names (this might not work depending on permissions)
  try {
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .like('table_name', '%learn%');
      
    if (!tablesError && tables) {
      console.log('📋 Learn-related tables:', tables.map(t => t.table_name));
    }
  } catch (e) {
    console.log('📋 Could not check table names (permission issue)');
  }
}

checkWorkshopChapters().catch(console.error);
