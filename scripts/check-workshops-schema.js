const { createClient } = require('@supabase/supabase-js');

// Local Supabase configuration
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function checkWorkshopsSchema() {
  console.log('🔍 Checking workshops table schema...');

  try {
    // Try to get one workshop to see the schema
    const { data: workshops, error } = await supabase
      .from('workshops')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Error fetching workshops:', error);
      return;
    }

    if (workshops && workshops.length > 0) {
      console.log('📋 Workshops table columns:');
      Object.keys(workshops[0]).forEach(key => {
        console.log(`   - ${key}: ${typeof workshops[0][key]}`);
      });
    } else {
      console.log('📋 No workshops found, trying to get table info...');
      
      // Try to insert a minimal workshop to see what columns are required
      const testWorkshop = {
        title: 'Test Workshop',
        organization_id: '01e09cce-83da-4b0f-94ce-b227e949414a'
      };

      const { data: testResult, error: testError } = await supabase
        .from('workshops')
        .insert(testWorkshop)
        .select()
        .single();

      if (testError) {
        console.log('❌ Test insert error (this shows us the schema):', testError.message);
      } else {
        console.log('✅ Test workshop created successfully!');
        console.log('📋 Available columns:', Object.keys(testResult));
        
        // Clean up test workshop
        await supabase
          .from('workshops')
          .delete()
          .eq('id', testResult.id);
        console.log('🧹 Test workshop cleaned up');
      }
    }

  } catch (error) {
    console.error('❌ Failed to check workshops schema:', error.message);
  }
}

// Run the check
checkWorkshopsSchema();
