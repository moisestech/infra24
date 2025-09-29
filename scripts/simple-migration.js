require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function simpleMigration() {
  console.log('🚀 Starting simple migration...');

  try {
    // First, let's check what we can do with the current setup
    console.log('\n🔍 Checking current database structure...');
    
    // Test basic connection
    const { data: testData, error: testError } = await supabase
      .from('workshops')
      .select('id, title, organization_id')
      .limit(1);

    if (testError) {
      console.error('❌ Database connection error:', testError.message);
      return;
    }

    console.log('✅ Database connection successful');
    console.log('📊 Current workshops count:', testData?.length || 0);

    // Let's try to add columns one by one using a different approach
    console.log('\n📝 Attempting to add columns to workshops table...');
    
    // Try to update a workshop with new fields to see if they exist
    const { data: seoWorkshop, error: seoError } = await supabase
      .from('workshops')
      .select('id, title')
      .ilike('title', '%SEO%')
      .eq('organization_id', '2133fe94-fb12-41f8-ab37-ea4acd4589f6')
      .single();

    if (seoWorkshop && !seoError) {
      console.log(`✅ Found SEO workshop: ${seoWorkshop.title}`);
      
      // Try to update with new fields
      const updateData = {
        // Try to add these fields - if they don't exist, we'll get an error
        has_learn_content: true,
        learn_objectives: [
          'Understand the fundamentals of SEO',
          'Learn keyword research techniques',
          'Master on-page optimization',
          'Analyze website performance with analytics'
        ],
        estimated_learn_time: 120,
        learn_difficulty: 'beginner',
        learn_prerequisites: [
          'Basic understanding of websites',
          'Access to a website or blog'
        ],
        learn_materials: [
          'Computer with internet access',
          'Google Analytics account (free)',
          'Google Search Console account (free)'
        ]
      };

      const { error: updateError } = await supabase
        .from('workshops')
        .update(updateData)
        .eq('id', seoWorkshop.id);

      if (updateError) {
        console.log('⚠️  Columns don\'t exist yet. Need to add them manually.');
        console.log('📋 Please run this SQL in your Supabase dashboard:');
        console.log(`
-- Add learn content fields to workshops table
ALTER TABLE workshops ADD COLUMN IF NOT EXISTS has_learn_content BOOLEAN DEFAULT FALSE;
ALTER TABLE workshops ADD COLUMN IF NOT EXISTS learn_syllabus JSONB;
ALTER TABLE workshops ADD COLUMN IF NOT EXISTS learn_objectives TEXT[];
ALTER TABLE workshops ADD COLUMN IF NOT EXISTS estimated_learn_time INTEGER;
ALTER TABLE workshops ADD COLUMN IF NOT EXISTS learn_difficulty VARCHAR(20);
ALTER TABLE workshops ADD COLUMN IF NOT EXISTS learn_prerequisites TEXT[];
ALTER TABLE workshops ADD COLUMN IF NOT EXISTS learn_materials TEXT[];

-- Create workshop_chapters table
CREATE TABLE IF NOT EXISTS workshop_chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  chapter_slug VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  estimated_time INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(workshop_id, chapter_slug)
);

-- Create user_workshop_progress table
CREATE TABLE IF NOT EXISTS user_workshop_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  chapter_id UUID NOT NULL REFERENCES workshop_chapters(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE,
  progress_percentage DECIMAL(5,2) DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  time_spent INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, chapter_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_workshop_chapters_workshop_id ON workshop_chapters(workshop_id);
CREATE INDEX IF NOT EXISTS idx_workshop_chapters_order ON workshop_chapters(workshop_id, order_index);
CREATE INDEX IF NOT EXISTS idx_user_workshop_progress_user_id ON user_workshop_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_workshop_progress_workshop_id ON user_workshop_progress(workshop_id);
CREATE INDEX IF NOT EXISTS idx_user_workshop_progress_chapter_id ON user_workshop_progress(chapter_id);

-- Enable RLS
ALTER TABLE workshop_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_workshop_progress ENABLE ROW LEVEL SECURITY;
        `);
      } else {
        console.log('✅ Successfully updated workshop with learn content fields!');
        console.log('🎉 Database migration completed successfully!');
      }
    } else {
      console.log('⚠️  No SEO workshop found');
    }

    console.log('\n📋 Next steps:');
    console.log('1. Run the SQL above in your Supabase dashboard');
    console.log('2. Test the build');
    console.log('3. Test the API endpoints');

  } catch (error) {
    console.error('🚨 Migration failed:', error);
  } finally {
    process.exit(0);
  }
}

simpleMigration();
