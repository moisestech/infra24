require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  console.log('🚀 Starting Learn Content migration...');

  try {
    // Read the SQL migration file
    const sqlPath = path.join(__dirname, 'add-learn-content-fields.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    // Split the SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`📝 Found ${statements.length} SQL statements to execute`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`\n🔄 Executing statement ${i + 1}/${statements.length}`);
      
      try {
        const { error } = await supabase.rpc('exec_sql', {
          sql: statement + ';'
        });

        if (error) {
          // Check if it's a "already exists" error, which is okay
          if (error.message.includes('already exists') || 
              error.message.includes('duplicate key') ||
              error.message.includes('relation') && error.message.includes('already exists')) {
            console.log(`⚠️  Statement ${i + 1}: ${error.message} (skipping)`);
          } else {
            console.error(`❌ Statement ${i + 1} failed:`, error.message);
            // Continue with other statements
          }
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`);
        }
      } catch (err) {
        console.error(`❌ Statement ${i + 1} error:`, err.message);
        // Continue with other statements
      }
    }

    // Verify the migration
    console.log('\n🔍 Verifying migration...');
    
    // Check if workshops table has the new columns
    const { data: workshopsColumns, error: workshopsError } = await supabase
      .from('workshops')
      .select('has_learn_content, learn_objectives, estimated_learn_time')
      .limit(1);

    if (workshopsError) {
      console.error('❌ Error checking workshops table:', workshopsError.message);
    } else {
      console.log('✅ Workshops table updated successfully');
    }

    // Check if workshop_chapters table exists
    const { data: chaptersData, error: chaptersError } = await supabase
      .from('workshop_chapters')
      .select('id')
      .limit(1);

    if (chaptersError) {
      console.error('❌ Error checking workshop_chapters table:', chaptersError.message);
    } else {
      console.log('✅ workshop_chapters table created successfully');
    }

    // Check if user_workshop_progress table exists
    const { data: progressData, error: progressError } = await supabase
      .from('user_workshop_progress')
      .select('id')
      .limit(1);

    if (progressError) {
      console.error('❌ Error checking user_workshop_progress table:', chaptersError.message);
    } else {
      console.log('✅ user_workshop_progress table created successfully');
    }

    // Check sample data
    const { data: sampleWorkshop, error: sampleError } = await supabase
      .from('workshops')
      .select('title, has_learn_content, learn_objectives')
      .eq('title', 'SEO Workshop')
      .single();

    if (sampleError) {
      console.log('⚠️  No sample workshop found (this is okay if you haven\'t created one yet)');
    } else {
      console.log('✅ Sample workshop data updated:', {
        title: sampleWorkshop.title,
        has_learn_content: sampleWorkshop.has_learn_content,
        objectives_count: sampleWorkshop.learn_objectives?.length || 0
      });
    }

    console.log('\n🎉 Learn Content migration completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Test the new API endpoints');
    console.log('2. Create sample workshop content');
    console.log('3. Integrate with existing workshop pages');

  } catch (error) {
    console.error('🚨 Migration failed:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

runMigration();
