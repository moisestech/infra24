const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
  console.log('❌ SUPABASE_SERVICE_ROLE_KEY not found');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createChaptersTable() {
  console.log('🔧 Creating chapters table...');
  
  try {
    // Check if chapters table exists
    const { data: existingTables, error: checkError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'chapters');
    
    if (checkError) {
      console.log('📋 Could not check existing tables (this is normal)');
    }
    
    if (existingTables && existingTables.length > 0) {
      console.log('✅ Chapters table already exists');
      return;
    }
    
    // Create chapters table
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS chapters (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
        slug VARCHAR(255) NOT NULL,
        title VARCHAR(500) NOT NULL,
        content TEXT NOT NULL,
        order_index INTEGER NOT NULL DEFAULT 0,
        estimated_duration INTEGER,
        is_premium BOOLEAN DEFAULT false,
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(workshop_id, slug)
      );
      
      -- Create index for better performance
      CREATE INDEX IF NOT EXISTS idx_chapters_workshop_id ON chapters(workshop_id);
      CREATE INDEX IF NOT EXISTS idx_chapters_order ON chapters(workshop_id, order_index);
      
      -- Enable RLS
      ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
      
      -- Create RLS policies
      CREATE POLICY "Chapters are viewable by everyone" ON chapters
        FOR SELECT USING (true);
        
      CREATE POLICY "Chapters are manageable by service role" ON chapters
        FOR ALL USING (true);
    `;
    
    const { error: createError } = await supabase.rpc('exec_sql', { sql: createTableSQL });
    
    if (createError) {
      console.error('❌ Error creating chapters table:', createError);
      return;
    }
    
    console.log('✅ Chapters table created successfully');
    
    // Test inserting a sample chapter
    console.log('🧪 Testing chapter insertion...');
    const { data: testChapter, error: testError } = await supabase
      .from('chapters')
      .insert({
        workshop_id: '6ec503ab-7292-4459-95d1-7cf45ce95748',
        slug: 'test-chapter',
        title: 'Test Chapter',
        content: 'This is a test chapter to verify the table works.',
        order_index: 1,
        estimated_duration: 30,
        is_premium: false,
        metadata: { type: 'test' }
      })
      .select()
      .single();
    
    if (testError) {
      console.error('❌ Error testing chapter insertion:', testError);
      return;
    }
    
    console.log('✅ Test chapter inserted successfully:', testChapter.id);
    
    // Clean up test chapter
    await supabase
      .from('chapters')
      .delete()
      .eq('id', testChapter.id);
    
    console.log('✅ Test chapter cleaned up');
    console.log('🎉 Chapters table is ready for use!');
    
  } catch (error) {
    console.error('❌ Error in createChaptersTable:', error);
  }
}

createChaptersTable();
