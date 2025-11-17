// Simple script to create chapters table using direct SQL execution

async function createChaptersTable() {
  console.log('🔧 Creating chapters table directly...');
  
  try {
    // Use the API to execute SQL
    const response = await fetch('http://localhost:3000/api/test-supabase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sql: `
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
          
          CREATE INDEX IF NOT EXISTS idx_chapters_workshop_id ON chapters(workshop_id);
          CREATE INDEX IF NOT EXISTS idx_chapters_order ON chapters(workshop_id, order_index);
          
          ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
          
          CREATE POLICY "Chapters are viewable by everyone" ON chapters
            FOR SELECT USING (true);
            
          CREATE POLICY "Chapters are manageable by service role" ON chapters
            FOR ALL USING (true);
        `
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create table: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('✅ Chapters table created:', result);
    
  } catch (error) {
    console.error('❌ Error creating chapters table:', error);
  }
}

createChaptersTable();
