-- Create chapters table for learn-canvas feature
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chapters_workshop_id ON chapters(workshop_id);
CREATE INDEX IF NOT EXISTS idx_chapters_order ON chapters(workshop_id, order_index);

-- Enable RLS
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Chapters are viewable by everyone" ON chapters
  FOR SELECT USING (true);
  
CREATE POLICY "Chapters are manageable by service role" ON chapters
  FOR ALL USING (true);
