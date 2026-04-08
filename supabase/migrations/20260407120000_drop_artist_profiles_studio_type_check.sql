-- Allow Oolite-style residency labels (Studio Resident, Staff, etc.) on public directory.
-- Previous CHECK only allowed Studio | Associate | Gallery and blocked catalog seeds.
ALTER TABLE artist_profiles DROP CONSTRAINT IF EXISTS artist_profiles_studio_type_check;
