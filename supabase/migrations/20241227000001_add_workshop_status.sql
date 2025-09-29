-- Migration: Add workshop status column for published/unpublished functionality
-- This migration adds a status column to the workshops table to support
-- published/unpublished workshop states

-- Add status column to workshops table
ALTER TABLE workshops ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'draft' 
  CHECK (status IN ('draft', 'published', 'archived'));

-- Add image_url column for Unsplash images
ALTER TABLE workshops ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add featured column for featured workshops
ALTER TABLE workshops ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;

-- Add workshop_category_votes table for voting system
CREATE TABLE IF NOT EXISTS workshop_category_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL, -- Clerk user ID
  category VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(organization_id, user_id) -- One vote per user per organization
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_workshops_status ON workshops(status);
CREATE INDEX IF NOT EXISTS idx_workshops_featured ON workshops(featured);
CREATE INDEX IF NOT EXISTS idx_workshop_category_votes_org_id ON workshop_category_votes(organization_id);
CREATE INDEX IF NOT EXISTS idx_workshop_category_votes_user_id ON workshop_category_votes(user_id);

-- Update existing workshops to have 'published' status if they are active and public
UPDATE workshops 
SET status = 'published' 
WHERE is_active = true AND is_public = true;

-- Update existing workshops to have 'draft' status if they are not active or not public
UPDATE workshops 
SET status = 'draft' 
WHERE is_active = false OR is_public = false;
