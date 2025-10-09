-- Fix announcement table constraints
-- This script addresses the NOT NULL constraints that are causing booking announcement creation to fail

-- Check current constraints
SELECT 
    column_name, 
    is_nullable, 
    data_type, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'announcements' 
AND column_name IN ('created_by', 'updated_by', 'organization_id')
ORDER BY column_name;

-- Update existing announcements that have NULL values
UPDATE announcements 
SET 
    created_by = COALESCE(created_by, 'system'),
    updated_by = COALESCE(updated_by, 'system'),
    organization_id = COALESCE(organization_id, org_id)
WHERE 
    created_by IS NULL 
    OR updated_by IS NULL 
    OR organization_id IS NULL;

-- Add default values to prevent future NULL issues
ALTER TABLE announcements 
ALTER COLUMN created_by SET DEFAULT 'system';

ALTER TABLE announcements 
ALTER COLUMN updated_by SET DEFAULT 'system';

-- Verify the fixes
SELECT 
    COUNT(*) as total_announcements,
    COUNT(CASE WHEN created_by IS NULL THEN 1 END) as null_created_by,
    COUNT(CASE WHEN updated_by IS NULL THEN 1 END) as null_updated_by,
    COUNT(CASE WHEN organization_id IS NULL THEN 1 END) as null_organization_id
FROM announcements;





