const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Initialize Supabase client for local instance
const supabase = createClient(
  'http://127.0.0.1:54321',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'
);

async function runDatabaseSetup() {
  console.log('🚀 Starting local database setup...');
  
  try {
    // Step 1: Create organizations table
    console.log('1️⃣ Creating organizations table...');
    const { error: orgError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS organizations (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          slug VARCHAR(100) UNIQUE NOT NULL,
          description TEXT,
          logo_url VARCHAR(500),
          favicon_url VARCHAR(500),
          theme_colors JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (orgError) {
      console.log('❌ Organizations table error:', orgError.message);
    } else {
      console.log('✅ Organizations table created');
    }
    
    // Step 2: Create workshops table
    console.log('2️⃣ Creating workshops table...');
    const { error: workshopError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS workshops (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          content TEXT,
          category VARCHAR(100),
          type VARCHAR(50),
          level VARCHAR(50),
          duration_minutes INTEGER,
          max_participants INTEGER,
          price DECIMAL(10,2),
          instructor VARCHAR(255),
          prerequisites TEXT[],
          materials TEXT[],
          outcomes TEXT[],
          is_active BOOLEAN DEFAULT TRUE,
          is_public BOOLEAN DEFAULT TRUE,
          is_shared BOOLEAN DEFAULT FALSE,
          metadata JSONB,
          created_by UUID,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          status VARCHAR(50) DEFAULT 'draft',
          image_url VARCHAR(500),
          featured BOOLEAN DEFAULT FALSE,
          syllabus TEXT,
          syllabus_sections JSONB,
          learning_objectives TEXT[],
          materials_needed TEXT[],
          what_youll_learn TEXT[],
          workshop_outline TEXT,
          has_learn_content BOOLEAN DEFAULT FALSE,
          learn_syllabus JSONB,
          learn_objectives TEXT[],
          estimated_learn_time INTEGER,
          learn_difficulty VARCHAR(20),
          learn_prerequisites TEXT[],
          learn_materials TEXT[]
        );
      `
    });
    
    if (workshopError) {
      console.log('❌ Workshops table error:', workshopError.message);
    } else {
      console.log('✅ Workshops table created');
    }
    
    // Step 3: Create workshop_chapters table
    console.log('3️⃣ Creating workshop_chapters table...');
    const { error: chapterError } = await supabase.rpc('exec_sql', {
      sql: `
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
      `
    });
    
    if (chapterError) {
      console.log('❌ Workshop chapters table error:', chapterError.message);
    } else {
      console.log('✅ Workshop chapters table created');
    }
    
    // Step 4: Create user_workshop_progress table
    console.log('4️⃣ Creating user_workshop_progress table...');
    const { error: progressError } = await supabase.rpc('exec_sql', {
      sql: `
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
      `
    });
    
    if (progressError) {
      console.log('❌ User progress table error:', progressError.message);
    } else {
      console.log('✅ User progress table created');
    }
    
    // Step 5: Insert sample organization
    console.log('5️⃣ Inserting sample organization...');
    const { error: insertOrgError } = await supabase.rpc('exec_sql', {
      sql: `
        INSERT INTO organizations (name, slug, description, logo_url, theme_colors) VALUES (
          'Oolite Arts',
          'oolite',
          'A cultural infrastructure platform supporting artists and creative communities.',
          '/oolite-logo.png',
          '{
            "primary": "#47abc4",
            "primaryLight": "#6bb8d1", 
            "primaryDark": "#3a8ba3",
            "primaryAlpha": "rgba(71, 171, 196, 0.1)",
            "primaryAlphaLight": "rgba(71, 171, 196, 0.05)",
            "primaryAlphaDark": "rgba(71, 171, 196, 0.15)"
          }'
        ) ON CONFLICT (slug) DO NOTHING;
      `
    });
    
    if (insertOrgError) {
      console.log('❌ Insert organization error:', insertOrgError.message);
    } else {
      console.log('✅ Sample organization inserted');
    }
    
    console.log('🎉 Database setup completed!');
    
  } catch (error) {
    console.log('❌ Unexpected error:', error.message);
  }
}

// Run the setup
runDatabaseSetup();
