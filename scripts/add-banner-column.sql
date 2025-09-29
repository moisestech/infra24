-- Add banner_image column to artist_profiles table
ALTER TABLE artist_profiles ADD COLUMN IF NOT EXISTS banner_image TEXT;
