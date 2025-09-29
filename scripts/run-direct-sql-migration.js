require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runDirectMigration() {
  console.log('🚀 Starting direct SQL migration...');

  try {
    // Step 1: Add columns to workshops table
    console.log('\n📝 Adding columns to workshops table...');
    
    const addColumnsQueries = [
      'ALTER TABLE workshops ADD COLUMN IF NOT EXISTS has_learn_content BOOLEAN DEFAULT FALSE',
      'ALTER TABLE workshops ADD COLUMN IF NOT EXISTS learn_syllabus JSONB',
      'ALTER TABLE workshops ADD COLUMN IF NOT EXISTS learn_objectives TEXT[]',
      'ALTER TABLE workshops ADD COLUMN IF NOT EXISTS estimated_learn_time INTEGER',
      'ALTER TABLE workshops ADD COLUMN IF NOT EXISTS learn_difficulty VARCHAR(20)',
      'ALTER TABLE workshops ADD COLUMN IF NOT EXISTS learn_prerequisites TEXT[]',
      'ALTER TABLE workshops ADD COLUMN IF NOT EXISTS learn_materials TEXT[]'
    ];

    for (const query of addColumnsQueries) {
      try {
        const { error } = await supabase.rpc('exec', { sql: query });
        if (error && !error.message.includes('already exists')) {
          console.error(`❌ Error: ${error.message}`);
        } else {
          console.log(`✅ ${query}`);
        }
      } catch (err) {
        console.log(`⚠️  ${query} - ${err.message}`);
      }
    }

    // Step 2: Create workshop_chapters table
    console.log('\n📝 Creating workshop_chapters table...');
    
    const createChaptersTable = `
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
      )
    `;

    try {
      const { error } = await supabase.rpc('exec', { sql: createChaptersTable });
      if (error) {
        console.error(`❌ Error creating workshop_chapters: ${error.message}`);
      } else {
        console.log('✅ workshop_chapters table created');
      }
    } catch (err) {
      console.log(`⚠️  workshop_chapters table: ${err.message}`);
    }

    // Step 3: Create user_workshop_progress table
    console.log('\n📝 Creating user_workshop_progress table...');
    
    const createProgressTable = `
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
      )
    `;

    try {
      const { error } = await supabase.rpc('exec', { sql: createProgressTable });
      if (error) {
        console.error(`❌ Error creating user_workshop_progress: ${error.message}`);
      } else {
        console.log('✅ user_workshop_progress table created');
      }
    } catch (err) {
      console.log(`⚠️  user_workshop_progress table: ${err.message}`);
    }

    // Step 4: Create indexes
    console.log('\n📝 Creating indexes...');
    
    const indexQueries = [
      'CREATE INDEX IF NOT EXISTS idx_workshop_chapters_workshop_id ON workshop_chapters(workshop_id)',
      'CREATE INDEX IF NOT EXISTS idx_workshop_chapters_order ON workshop_chapters(workshop_id, order_index)',
      'CREATE INDEX IF NOT EXISTS idx_user_workshop_progress_user_id ON user_workshop_progress(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_user_workshop_progress_workshop_id ON user_workshop_progress(workshop_id)',
      'CREATE INDEX IF NOT EXISTS idx_user_workshop_progress_chapter_id ON user_workshop_progress(chapter_id)'
    ];

    for (const query of indexQueries) {
      try {
        const { error } = await supabase.rpc('exec', { sql: query });
        if (error) {
          console.error(`❌ Error: ${error.message}`);
        } else {
          console.log(`✅ ${query}`);
        }
      } catch (err) {
        console.log(`⚠️  ${query} - ${err.message}`);
      }
    }

    // Step 5: Enable RLS
    console.log('\n📝 Enabling RLS...');
    
    const rlsQueries = [
      'ALTER TABLE workshop_chapters ENABLE ROW LEVEL SECURITY',
      'ALTER TABLE user_workshop_progress ENABLE ROW LEVEL SECURITY'
    ];

    for (const query of rlsQueries) {
      try {
        const { error } = await supabase.rpc('exec', { sql: query });
        if (error) {
          console.error(`❌ Error: ${error.message}`);
        } else {
          console.log(`✅ ${query}`);
        }
      } catch (err) {
        console.log(`⚠️  ${query} - ${err.message}`);
      }
    }

    // Step 6: Add sample data
    console.log('\n📝 Adding sample data...');
    
    // Update SEO Workshop with learn content
    const { data: seoWorkshop, error: seoError } = await supabase
      .from('workshops')
      .select('id, title')
      .ilike('title', '%SEO%')
      .eq('organization_id', '2133fe94-fb12-41f8-ab37-ea4acd4589f6')
      .single();

    if (seoWorkshop && !seoError) {
      console.log(`✅ Found SEO workshop: ${seoWorkshop.title}`);
      
      // Update workshop with learn content
      const { error: updateError } = await supabase
        .from('workshops')
        .update({
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
        })
        .eq('id', seoWorkshop.id);

      if (updateError) {
        console.error(`❌ Error updating SEO workshop: ${updateError.message}`);
      } else {
        console.log('✅ SEO workshop updated with learn content');
      }

      // Add sample chapters
      const chapters = [
        {
          workshop_id: seoWorkshop.id,
          chapter_slug: 'introduction-to-seo',
          title: 'Introduction to SEO',
          description: 'Learn the basics of search engine optimization and why it matters for your business.',
          order_index: 1,
          estimated_time: 30
        },
        {
          workshop_id: seoWorkshop.id,
          chapter_slug: 'keyword-research',
          title: 'Keyword Research',
          description: 'Discover how to find and analyze keywords that your audience is searching for.',
          order_index: 2,
          estimated_time: 45
        },
        {
          workshop_id: seoWorkshop.id,
          chapter_slug: 'on-page-optimization',
          title: 'On-Page Optimization',
          description: 'Learn how to optimize your website content and structure for better search rankings.',
          order_index: 3,
          estimated_time: 30
        },
        {
          workshop_id: seoWorkshop.id,
          chapter_slug: 'analytics-and-tracking',
          title: 'Analytics and Tracking',
          description: 'Set up and use Google Analytics and Search Console to measure your SEO success.',
          order_index: 4,
          estimated_time: 15
        }
      ];

      for (const chapter of chapters) {
        const { error: chapterError } = await supabase
          .from('workshop_chapters')
          .upsert(chapter, { onConflict: 'workshop_id,chapter_slug' });

        if (chapterError) {
          console.error(`❌ Error adding chapter ${chapter.title}: ${chapterError.message}`);
        } else {
          console.log(`✅ Added chapter: ${chapter.title}`);
        }
      }
    } else {
      console.log('⚠️  No SEO workshop found - sample data not added');
    }

    // Step 7: Verify migration
    console.log('\n🔍 Verifying migration...');
    
    // Check workshops table
    const { data: workshopsTest, error: workshopsError } = await supabase
      .from('workshops')
      .select('has_learn_content, learn_objectives')
      .limit(1);

    if (workshopsError) {
      console.error('❌ Error checking workshops table:', workshopsError.message);
    } else {
      console.log('✅ Workshops table updated successfully');
    }

    // Check workshop_chapters table
    const { data: chaptersTest, error: chaptersError } = await supabase
      .from('workshop_chapters')
      .select('id, title')
      .limit(1);

    if (chaptersError) {
      console.error('❌ Error checking workshop_chapters table:', chaptersError.message);
    } else {
      console.log('✅ workshop_chapters table created successfully');
    }

    // Check user_workshop_progress table
    const { data: progressTest, error: progressError } = await supabase
      .from('user_workshop_progress')
      .select('id')
      .limit(1);

    if (progressError) {
      console.error('❌ Error checking user_workshop_progress table:', progressError.message);
    } else {
      console.log('✅ user_workshop_progress table created successfully');
    }

    console.log('\n🎉 Direct SQL migration completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Test the new API endpoints');
    console.log('2. Verify the build works');
    console.log('3. Integrate with existing workshop pages');

  } catch (error) {
    console.error('🚨 Migration failed:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

runDirectMigration();
