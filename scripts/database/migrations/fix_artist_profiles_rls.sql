-- Fix RLS policies for artist_profiles table to allow public read access
-- This allows the frontend to read artist profiles without authentication

-- Enable RLS if not already enabled
ALTER TABLE artist_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "artist_profiles_public_read" ON artist_profiles;
DROP POLICY IF EXISTS "artist_profiles_select_policy" ON artist_profiles;

-- Create a policy that allows public read access to active artist profiles
CREATE POLICY "artist_profiles_public_read" ON artist_profiles
FOR SELECT
TO public
USING (is_active = true);

-- Also create a policy for authenticated users to read all profiles
CREATE POLICY "artist_profiles_authenticated_read" ON artist_profiles
FOR SELECT
TO authenticated
USING (true);

-- Grant necessary permissions
GRANT SELECT ON artist_profiles TO public;
GRANT SELECT ON artist_profiles TO authenticated;
