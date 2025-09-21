-- Add clerk_user_id column to org_memberships table
-- This migration adds the missing clerk_user_id column that the API expects

-- Add the clerk_user_id column
ALTER TABLE org_memberships 
ADD COLUMN IF NOT EXISTS clerk_user_id TEXT;

-- Create an index on the new column for performance
CREATE INDEX IF NOT EXISTS idx_org_memberships_clerk_user_id ON org_memberships(clerk_user_id);

-- Update existing records to copy user_id to clerk_user_id
-- This assumes that existing user_id values are actually Clerk user IDs
UPDATE org_memberships 
SET clerk_user_id = user_id 
WHERE clerk_user_id IS NULL;

-- Make the column NOT NULL after populating it
-- Note: This will fail if there are any NULL values, so we handle that above
ALTER TABLE org_memberships 
ALTER COLUMN clerk_user_id SET NOT NULL;

-- Add a unique constraint to prevent duplicate Clerk user memberships
-- This ensures one Clerk user can only have one membership per organization
ALTER TABLE org_memberships 
ADD CONSTRAINT unique_org_clerk_user UNIQUE (organization_id, clerk_user_id);

-- Drop the old unique constraint if it exists
-- (This might fail if the constraint doesn't exist, but that's okay)
DO $$ 
BEGIN
    ALTER TABLE org_memberships DROP CONSTRAINT IF EXISTS org_memberships_organization_id_user_id_key;
EXCEPTION
    WHEN undefined_object THEN
        -- Constraint doesn't exist, which is fine
        NULL;
END $$;

-- Update the foreign key reference in artist_profiles if it exists
-- Check if the column exists first
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'artist_profiles' 
        AND column_name = 'claimed_by_clerk_user_id'
    ) THEN
        -- Column exists, update the foreign key constraint
        ALTER TABLE artist_profiles 
        DROP CONSTRAINT IF EXISTS artist_profiles_claimed_by_clerk_user_id_fkey;
        
        ALTER TABLE artist_profiles 
        ADD CONSTRAINT artist_profiles_claimed_by_clerk_user_id_fkey 
        FOREIGN KEY (claimed_by_clerk_user_id) REFERENCES org_memberships(clerk_user_id);
    END IF;
END $$;
