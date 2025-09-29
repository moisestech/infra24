-- Add new fields to workshops table
ALTER TABLE workshops ADD COLUMN IF NOT EXISTS start_date timestamp with time zone;
ALTER TABLE workshops ADD COLUMN IF NOT EXISTS interest_count integer DEFAULT 0;
ALTER TABLE workshops ADD COLUMN IF NOT EXISTS course_available boolean DEFAULT false;

-- Update SEO Workshop with start date and course availability
UPDATE workshops 
SET 
  start_date = '2024-10-27 10:00:00+00',
  course_available = true,
  image_url = 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=1200&h=600&fit=crop'
WHERE id = '11195c3d-37c2-4994-a8ce-615c68f45126';

-- Update Digital Presence Workshop with banner image
UPDATE workshops 
SET 
  image_url = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop',
  course_available = false
WHERE id = '4ce54928-1d6d-4710-917a-bbaf9586704b';

-- Update Own Your Digital Presence Workshop with banner image
UPDATE workshops 
SET 
  image_url = 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=600&fit=crop',
  course_available = false
WHERE id = '6ec503ab-7292-4459-95d1-7cf45ce95748';

-- Create workshop_interest table to track user interest
CREATE TABLE IF NOT EXISTS workshop_interest (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  workshop_id uuid REFERENCES workshops(id) ON DELETE CASCADE,
  user_id text NOT NULL,
  interested_at timestamp with time zone DEFAULT now(),
  UNIQUE(workshop_id, user_id)
);

-- Create RLS policy for workshop_interest
ALTER TABLE workshop_interest ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own workshop interest" ON workshop_interest
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own workshop interest" ON workshop_interest
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own workshop interest" ON workshop_interest
  FOR DELETE USING (auth.uid()::text = user_id);
