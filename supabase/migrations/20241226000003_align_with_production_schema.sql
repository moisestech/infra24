-- =============================================
-- ALIGN LOCAL SCHEMA WITH PRODUCTION
-- =============================================
-- This migration aligns our local schema with the production database
-- Date: December 26, 2024
-- Purpose: Ensure local and production schemas match exactly

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- =============================================
-- CREATE MISSING ENUMS
-- =============================================

-- Create announcement_status enum if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'announcement_status') THEN
        CREATE TYPE announcement_status AS ENUM ('draft', 'pending', 'approved', 'published', 'archived');
    END IF;
END $$;

-- Create role_type enum if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role_type') THEN
        CREATE TYPE role_type AS ENUM ('resident', 'staff', 'admin', 'super_admin');
    END IF;
END $$;

-- =============================================
-- CREATE MISSING TABLES FIRST
-- =============================================

-- Create org_member_types table
CREATE TABLE IF NOT EXISTS org_member_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id),
    type_key TEXT NOT NULL,
    label TEXT NOT NULL,
    description TEXT,
    is_staff BOOLEAN DEFAULT false,
    default_role_on_claim role_type DEFAULT 'resident',
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create org_taxonomies table
CREATE TABLE IF NOT EXISTS org_taxonomies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id),
    key TEXT NOT NULL,
    label TEXT NOT NULL,
    description TEXT
);

-- Create org_terms table
CREATE TABLE IF NOT EXISTS org_terms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    taxonomy_id UUID NOT NULL REFERENCES org_taxonomies(id),
    parent_id UUID REFERENCES org_terms(id),
    key TEXT NOT NULL,
    label TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0
);

-- =============================================
-- UPDATE ORGANIZATIONS TABLE
-- =============================================

-- Add missing columns to organizations table
DO $$ 
BEGIN
    -- Add missing columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'organizations' AND column_name = 'artist_icon') THEN
        ALTER TABLE organizations ADD COLUMN artist_icon VARCHAR DEFAULT 'Palette';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'organizations' AND column_name = 'banner_image') THEN
        ALTER TABLE organizations ADD COLUMN banner_image VARCHAR;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'organizations' AND column_name = 'horizontal_logo_url') THEN
        ALTER TABLE organizations ADD COLUMN horizontal_logo_url TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'organizations' AND column_name = 'description') THEN
        ALTER TABLE organizations ADD COLUMN description TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'organizations' AND column_name = 'website') THEN
        ALTER TABLE organizations ADD COLUMN website TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'organizations' AND column_name = 'email') THEN
        ALTER TABLE organizations ADD COLUMN email TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'organizations' AND column_name = 'phone') THEN
        ALTER TABLE organizations ADD COLUMN phone TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'organizations' AND column_name = 'address') THEN
        ALTER TABLE organizations ADD COLUMN address TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'organizations' AND column_name = 'city') THEN
        ALTER TABLE organizations ADD COLUMN city TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'organizations' AND column_name = 'state') THEN
        ALTER TABLE organizations ADD COLUMN state TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'organizations' AND column_name = 'zip_code') THEN
        ALTER TABLE organizations ADD COLUMN zip_code TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'organizations' AND column_name = 'country') THEN
        ALTER TABLE organizations ADD COLUMN country TEXT DEFAULT 'US';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'organizations' AND column_name = 'favicon_url') THEN
        ALTER TABLE organizations ADD COLUMN favicon_url TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'organizations' AND column_name = 'theme') THEN
        ALTER TABLE organizations ADD COLUMN theme JSONB DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'organizations' AND column_name = 'is_active') THEN
        ALTER TABLE organizations ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;
END $$;

-- =============================================
-- UPDATE ANNOUNCEMENTS TABLE
-- =============================================

-- Add missing columns to announcements table
DO $$ 
BEGIN
    -- Add missing columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'announcements' AND column_name = 'org_id') THEN
        ALTER TABLE announcements ADD COLUMN org_id UUID REFERENCES organizations(id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'announcements' AND column_name = 'author_clerk_id') THEN
        ALTER TABLE announcements ADD COLUMN author_clerk_id TEXT NOT NULL DEFAULT 'system';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'announcements' AND column_name = 'author_profile_id') THEN
        ALTER TABLE announcements ADD COLUMN author_profile_id UUID REFERENCES artist_profiles(id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'announcements' AND column_name = 'body') THEN
        ALTER TABLE announcements ADD COLUMN body TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'announcements' AND column_name = 'media') THEN
        ALTER TABLE announcements ADD COLUMN media JSONB DEFAULT '[]';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'announcements' AND column_name = 'tags') THEN
        ALTER TABLE announcements ADD COLUMN tags TEXT[] DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'announcements' AND column_name = 'status') THEN
        ALTER TABLE announcements ADD COLUMN status announcement_status NOT NULL DEFAULT 'pending';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'announcements' AND column_name = 'approval_notes') THEN
        ALTER TABLE announcements ADD COLUMN approval_notes TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'announcements' AND column_name = 'approved_by_clerk_id') THEN
        ALTER TABLE announcements ADD COLUMN approved_by_clerk_id TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'announcements' AND column_name = 'approved_at') THEN
        ALTER TABLE announcements ADD COLUMN approved_at TIMESTAMP WITH TIME ZONE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'announcements' AND column_name = 'scheduled_at') THEN
        ALTER TABLE announcements ADD COLUMN scheduled_at TIMESTAMP WITH TIME ZONE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'announcements' AND column_name = 'published_at') THEN
        ALTER TABLE announcements ADD COLUMN published_at TIMESTAMP WITH TIME ZONE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'announcements' AND column_name = 'expires_at') THEN
        ALTER TABLE announcements ADD COLUMN expires_at TIMESTAMP WITH TIME ZONE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'announcements' AND column_name = 'priority') THEN
        ALTER TABLE announcements ADD COLUMN priority SMALLINT DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'announcements' AND column_name = 'deleted_at') THEN
        ALTER TABLE announcements ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'announcements' AND column_name = 'visibility') THEN
        ALTER TABLE announcements ADD COLUMN visibility TEXT DEFAULT 'internal' CHECK (visibility IN ('internal', 'external', 'both'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'announcements' AND column_name = 'starts_at') THEN
        ALTER TABLE announcements ADD COLUMN starts_at TIMESTAMP WITH TIME ZONE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'announcements' AND column_name = 'ends_at') THEN
        ALTER TABLE announcements ADD COLUMN ends_at TIMESTAMP WITH TIME ZONE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'announcements' AND column_name = 'payload') THEN
        ALTER TABLE announcements ADD COLUMN payload JSONB NOT NULL DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'announcements' AND column_name = 'slug') THEN
        ALTER TABLE announcements ADD COLUMN slug TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'announcements' AND column_name = 'type') THEN
        ALTER TABLE announcements ADD COLUMN type TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'announcements' AND column_name = 'sub_type') THEN
        ALTER TABLE announcements ADD COLUMN sub_type TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'announcements' AND column_name = 'template') THEN
        ALTER TABLE announcements ADD COLUMN template TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'announcements' AND column_name = 'primary_link') THEN
        ALTER TABLE announcements ADD COLUMN primary_link TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'announcements' AND column_name = 'additional_info') THEN
        ALTER TABLE announcements ADD COLUMN additional_info TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'announcements' AND column_name = 'image_url') THEN
        ALTER TABLE announcements ADD COLUMN image_url TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'announcements' AND column_name = 'people') THEN
        ALTER TABLE announcements ADD COLUMN people JSONB DEFAULT '[]';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'announcements' AND column_name = 'external_orgs') THEN
        ALTER TABLE announcements ADD COLUMN external_orgs JSONB DEFAULT '[]';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'announcements' AND column_name = 'style') THEN
        ALTER TABLE announcements ADD COLUMN style JSONB DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'announcements' AND column_name = 'timezone') THEN
        ALTER TABLE announcements ADD COLUMN timezone TEXT DEFAULT 'America/New_York';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'announcements' AND column_name = 'is_all_day') THEN
        ALTER TABLE announcements ADD COLUMN is_all_day BOOLEAN;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'announcements' AND column_name = 'is_time_tbd') THEN
        ALTER TABLE announcements ADD COLUMN is_time_tbd BOOLEAN;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'announcements' AND column_name = 'rsvp_label') THEN
        ALTER TABLE announcements ADD COLUMN rsvp_label TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'announcements' AND column_name = 'rsvp_url') THEN
        ALTER TABLE announcements ADD COLUMN rsvp_url TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'announcements' AND column_name = 'event_state') THEN
        ALTER TABLE announcements ADD COLUMN event_state TEXT DEFAULT 'scheduled' CHECK (event_state IN ('scheduled', 'postponed', 'canceled'));
    END IF;
END $$;

-- =============================================
-- UPDATE ARTIST_PROFILES TABLE
-- =============================================

-- Add missing columns to artist_profiles table
DO $$ 
BEGIN
    -- Add missing columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'artist_profiles' AND column_name = 'organization_id') THEN
        ALTER TABLE artist_profiles ADD COLUMN organization_id UUID REFERENCES organizations(id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'artist_profiles' AND column_name = 'studio_type') THEN
        ALTER TABLE artist_profiles ADD COLUMN studio_type TEXT CHECK (studio_type IN ('Studio', 'Associate', 'Gallery'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'artist_profiles' AND column_name = 'studio_location') THEN
        ALTER TABLE artist_profiles ADD COLUMN studio_location TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'artist_profiles' AND column_name = 'phone') THEN
        ALTER TABLE artist_profiles ADD COLUMN phone TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'artist_profiles' AND column_name = 'bio') THEN
        ALTER TABLE artist_profiles ADD COLUMN bio TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'artist_profiles' AND column_name = 'website_url') THEN
        ALTER TABLE artist_profiles ADD COLUMN website_url TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'artist_profiles' AND column_name = 'instagram_handle') THEN
        ALTER TABLE artist_profiles ADD COLUMN instagram_handle TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'artist_profiles' AND column_name = 'profile_image') THEN
        ALTER TABLE artist_profiles ADD COLUMN profile_image TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'artist_profiles' AND column_name = 'portfolio_images') THEN
        ALTER TABLE artist_profiles ADD COLUMN portfolio_images TEXT[];
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'artist_profiles' AND column_name = 'achievements') THEN
        ALTER TABLE artist_profiles ADD COLUMN achievements TEXT[];
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'artist_profiles' AND column_name = 'awards') THEN
        ALTER TABLE artist_profiles ADD COLUMN awards TEXT[];
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'artist_profiles' AND column_name = 'exhibitions') THEN
        ALTER TABLE artist_profiles ADD COLUMN exhibitions TEXT[];
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'artist_profiles' AND column_name = 'publications') THEN
        ALTER TABLE artist_profiles ADD COLUMN publications TEXT[];
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'artist_profiles' AND column_name = 'education') THEN
        ALTER TABLE artist_profiles ADD COLUMN education TEXT[];
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'artist_profiles' AND column_name = 'specialties') THEN
        ALTER TABLE artist_profiles ADD COLUMN specialties TEXT[];
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'artist_profiles' AND column_name = 'media') THEN
        ALTER TABLE artist_profiles ADD COLUMN media TEXT[];
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'artist_profiles' AND column_name = 'year_started') THEN
        ALTER TABLE artist_profiles ADD COLUMN year_started INTEGER;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'artist_profiles' AND column_name = 'year_ended') THEN
        ALTER TABLE artist_profiles ADD COLUMN year_ended INTEGER;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'artist_profiles' AND column_name = 'is_active') THEN
        ALTER TABLE artist_profiles ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'artist_profiles' AND column_name = 'is_claimed') THEN
        ALTER TABLE artist_profiles ADD COLUMN is_claimed BOOLEAN DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'artist_profiles' AND column_name = 'claimed_by_clerk_user_id') THEN
        ALTER TABLE artist_profiles ADD COLUMN claimed_by_clerk_user_id TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'artist_profiles' AND column_name = 'claimed_by_membership_id') THEN
        ALTER TABLE artist_profiles ADD COLUMN claimed_by_membership_id UUID REFERENCES org_memberships(id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'artist_profiles' AND column_name = 'claimed_at') THEN
        ALTER TABLE artist_profiles ADD COLUMN claimed_at TIMESTAMP WITH TIME ZONE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'artist_profiles' AND column_name = 'profile_type') THEN
        ALTER TABLE artist_profiles ADD COLUMN profile_type TEXT NOT NULL DEFAULT 'artist' CHECK (profile_type IN ('artist', 'staff'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'artist_profiles' AND column_name = 'member_type_id') THEN
        ALTER TABLE artist_profiles ADD COLUMN member_type_id UUID REFERENCES org_member_types(id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'artist_profiles' AND column_name = 'metadata') THEN
        ALTER TABLE artist_profiles ADD COLUMN metadata JSONB NOT NULL DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'artist_profiles' AND column_name = 'deleted_at') THEN
        ALTER TABLE artist_profiles ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'artist_profiles' AND column_name = 'skills') THEN
        ALTER TABLE artist_profiles ADD COLUMN skills TEXT[];
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'artist_profiles' AND column_name = 'mediums') THEN
        ALTER TABLE artist_profiles ADD COLUMN mediums TEXT[];
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'artist_profiles' AND column_name = 'is_public') THEN
        ALTER TABLE artist_profiles ADD COLUMN is_public BOOLEAN DEFAULT true;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'artist_profiles' AND column_name = 'is_featured') THEN
        ALTER TABLE artist_profiles ADD COLUMN is_featured BOOLEAN DEFAULT false;
    END IF;
END $$;

-- =============================================
-- CREATE ADDITIONAL MISSING TABLES
-- =============================================

-- Create announcement_audience_member_types table
CREATE TABLE IF NOT EXISTS announcement_audience_member_types (
    announcement_id UUID NOT NULL REFERENCES announcements(id),
    member_type_id UUID NOT NULL REFERENCES org_member_types(id),
    PRIMARY KEY (announcement_id, member_type_id)
);

-- Create announcement_audience_terms table
CREATE TABLE IF NOT EXISTS announcement_audience_terms (
    announcement_id UUID NOT NULL REFERENCES announcements(id),
    term_id UUID NOT NULL REFERENCES org_terms(id),
    PRIMARY KEY (term_id, announcement_id)
);

-- Create artist_claim_requests table
CREATE TABLE IF NOT EXISTS artist_claim_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artist_profile_id UUID NOT NULL REFERENCES artist_profiles(id),
    requester_clerk_id TEXT NOT NULL,
    requester_email TEXT,
    requester_name TEXT,
    claim_reason TEXT,
    supporting_evidence TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    reviewed_by_clerk_id TEXT,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    review_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create artist_claim_tokens table
CREATE TABLE IF NOT EXISTS artist_claim_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artist_profile_id UUID NOT NULL REFERENCES artist_profiles(id),
    token UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    issued_to_email TEXT,
    role_on_claim role_type DEFAULT 'resident',
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() + INTERVAL '14 days'),
    used_at TIMESTAMP WITH TIME ZONE,
    used_by_clerk_id TEXT,
    created_by_clerk_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create artist_profile_images table
CREATE TABLE IF NOT EXISTS artist_profile_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artist_profile_id UUID NOT NULL REFERENCES artist_profiles(id),
    image_url TEXT NOT NULL,
    alt_text TEXT,
    sort_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create artist_profile_terms table
CREATE TABLE IF NOT EXISTS artist_profile_terms (
    artist_profile_id UUID NOT NULL REFERENCES artist_profiles(id),
    term_id UUID NOT NULL REFERENCES org_terms(id),
    PRIMARY KEY (term_id, artist_profile_id)
);

-- Create artist_tips table
CREATE TABLE IF NOT EXISTS artist_tips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id),
    artist_profile_id UUID NOT NULL REFERENCES artist_profiles(id),
    tipper_id TEXT,
    tipper_name TEXT,
    tipper_email TEXT,
    amount NUMERIC NOT NULL,
    currency TEXT DEFAULT 'USD',
    message TEXT,
    is_anonymous BOOLEAN DEFAULT false,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    payment_intent_id TEXT,
    transaction_id TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create organization_donations table
CREATE TABLE IF NOT EXISTS organization_donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id),
    donor_id TEXT,
    donor_name TEXT,
    donor_email TEXT,
    amount NUMERIC NOT NULL,
    currency TEXT DEFAULT 'USD',
    message TEXT,
    is_anonymous BOOLEAN DEFAULT false,
    is_recurring BOOLEAN DEFAULT false,
    recurring_frequency TEXT CHECK (recurring_frequency IN ('monthly', 'quarterly', 'yearly')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded', 'cancelled')),
    payment_intent_id TEXT,
    subscription_id TEXT,
    transaction_id TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create submission_forms table
CREATE TABLE IF NOT EXISTS submission_forms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id),
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('application', 'proposal', 'content', 'feedback', 'survey', 'custom')),
    category TEXT,
    form_schema JSONB NOT NULL DEFAULT '{}',
    validation_rules JSONB DEFAULT '{}',
    submission_settings JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    is_public BOOLEAN DEFAULT false,
    requires_authentication BOOLEAN DEFAULT true,
    max_submissions_per_user INTEGER,
    submission_deadline TIMESTAMP WITH TIME ZONE,
    review_deadline TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by TEXT NOT NULL,
    updated_by TEXT NOT NULL
);

-- Create submissions table
CREATE TABLE IF NOT EXISTS submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id),
    form_id UUID NOT NULL REFERENCES submission_forms(id),
    user_id TEXT,
    submitter_name TEXT,
    submitter_email TEXT,
    submitter_phone TEXT,
    title TEXT NOT NULL,
    content JSONB NOT NULL DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'needs_revision', 'withdrawn')),
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    review_notes TEXT,
    reviewer_id TEXT,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    score NUMERIC,
    tags TEXT[],
    attachments JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    submitted_at TIMESTAMP WITH TIME ZONE
);

-- =============================================
-- UPDATE EXISTING TABLES TO MATCH PRODUCTION
-- =============================================

-- Update resources table to match production schema
DO $$ 
BEGIN
    -- Rename organization_id to org_id if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'resources' AND column_name = 'organization_id') THEN
        ALTER TABLE resources RENAME COLUMN organization_id TO org_id;
    END IF;
    
    -- Add missing columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'resources' AND column_name = 'category') THEN
        ALTER TABLE resources ADD COLUMN category TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'resources' AND column_name = 'duration_minutes') THEN
        ALTER TABLE resources ADD COLUMN duration_minutes INTEGER;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'resources' AND column_name = 'price') THEN
        ALTER TABLE resources ADD COLUMN price NUMERIC DEFAULT 0.00;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'resources' AND column_name = 'currency') THEN
        ALTER TABLE resources ADD COLUMN currency TEXT DEFAULT 'USD';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'resources' AND column_name = 'location') THEN
        ALTER TABLE resources ADD COLUMN location TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'resources' AND column_name = 'requirements') THEN
        ALTER TABLE resources ADD COLUMN requirements TEXT[];
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'resources' AND column_name = 'availability_rules') THEN
        ALTER TABLE resources ADD COLUMN availability_rules JSONB DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'resources' AND column_name = 'metadata') THEN
        ALTER TABLE resources ADD COLUMN metadata JSONB DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'resources' AND column_name = 'is_active') THEN
        ALTER TABLE resources ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'resources' AND column_name = 'created_by') THEN
        ALTER TABLE resources ADD COLUMN created_by TEXT NOT NULL DEFAULT 'system';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'resources' AND column_name = 'updated_by') THEN
        ALTER TABLE resources ADD COLUMN updated_by TEXT NOT NULL DEFAULT 'system';
    END IF;
END $$;

-- Update bookings table to match production schema
DO $$ 
BEGIN
    -- Rename organization_id to org_id if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'organization_id') THEN
        ALTER TABLE bookings RENAME COLUMN organization_id TO org_id;
    END IF;
    
    -- Add missing columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'user_id') THEN
        ALTER TABLE bookings ADD COLUMN user_id TEXT NOT NULL DEFAULT 'system';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'resource_type') THEN
        ALTER TABLE bookings ADD COLUMN resource_type TEXT NOT NULL DEFAULT 'workshop' CHECK (resource_type IN ('workshop', 'equipment', 'space', 'event'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'resource_id') THEN
        ALTER TABLE bookings ADD COLUMN resource_id TEXT NOT NULL DEFAULT 'unknown';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'capacity') THEN
        ALTER TABLE bookings ADD COLUMN capacity INTEGER DEFAULT 1;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'current_participants') THEN
        ALTER TABLE bookings ADD COLUMN current_participants INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'price') THEN
        ALTER TABLE bookings ADD COLUMN price NUMERIC DEFAULT 0.00;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'currency') THEN
        ALTER TABLE bookings ADD COLUMN currency TEXT DEFAULT 'USD';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'location') THEN
        ALTER TABLE bookings ADD COLUMN location TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'requirements') THEN
        ALTER TABLE bookings ADD COLUMN requirements TEXT[];
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'notes') THEN
        ALTER TABLE bookings ADD COLUMN notes TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'metadata') THEN
        ALTER TABLE bookings ADD COLUMN metadata JSONB DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'created_by') THEN
        ALTER TABLE bookings ADD COLUMN created_by TEXT NOT NULL DEFAULT 'system';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'updated_by') THEN
        ALTER TABLE bookings ADD COLUMN updated_by TEXT NOT NULL DEFAULT 'system';
    END IF;
END $$;

-- Update booking_participants table to match production schema
DO $$ 
BEGIN
    -- Add missing columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'booking_participants' AND column_name = 'status') THEN
        ALTER TABLE booking_participants ADD COLUMN status TEXT NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'confirmed', 'cancelled', 'waitlisted', 'no_show'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'booking_participants' AND column_name = 'registered_at') THEN
        ALTER TABLE booking_participants ADD COLUMN registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'booking_participants' AND column_name = 'confirmed_at') THEN
        ALTER TABLE booking_participants ADD COLUMN confirmed_at TIMESTAMP WITH TIME ZONE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'booking_participants' AND column_name = 'cancelled_at') THEN
        ALTER TABLE booking_participants ADD COLUMN cancelled_at TIMESTAMP WITH TIME ZONE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'booking_participants' AND column_name = 'notes') THEN
        ALTER TABLE booking_participants ADD COLUMN notes TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'booking_participants' AND column_name = 'metadata') THEN
        ALTER TABLE booking_participants ADD COLUMN metadata JSONB DEFAULT '{}';
    END IF;
END $$;

-- Update org_memberships table to match production schema
DO $$ 
BEGIN
    -- Rename organization_id to org_id if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'org_memberships' AND column_name = 'organization_id') THEN
        ALTER TABLE org_memberships RENAME COLUMN organization_id TO org_id;
    END IF;
    
    -- Add missing columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'org_memberships' AND column_name = 'user_id') THEN
        ALTER TABLE org_memberships ADD COLUMN user_id UUID REFERENCES auth.users(id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'org_memberships' AND column_name = 'joined_at') THEN
        ALTER TABLE org_memberships ADD COLUMN joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'org_memberships' AND column_name = 'role') THEN
        ALTER TABLE org_memberships ADD COLUMN role role_type NOT NULL DEFAULT 'resident';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'org_memberships' AND column_name = 'permissions') THEN
        ALTER TABLE org_memberships ADD COLUMN permissions JSONB DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'org_memberships' AND column_name = 'last_active_at') THEN
        ALTER TABLE org_memberships ADD COLUMN last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'org_memberships' AND column_name = 'is_active') THEN
        ALTER TABLE org_memberships ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;
END $$;

-- =============================================
-- CREATE INDEXES
-- =============================================

-- Organizations indexes
CREATE INDEX IF NOT EXISTS idx_organizations_slug ON organizations(slug);
CREATE INDEX IF NOT EXISTS idx_organizations_is_active ON organizations(is_active);

-- Announcements indexes
CREATE INDEX IF NOT EXISTS idx_announcements_org_id ON announcements(org_id);
CREATE INDEX IF NOT EXISTS idx_announcements_status ON announcements(status);
CREATE INDEX IF NOT EXISTS idx_announcements_published_at ON announcements(published_at);
CREATE INDEX IF NOT EXISTS idx_announcements_author_clerk_id ON announcements(author_clerk_id);

-- Artist profiles indexes
CREATE INDEX IF NOT EXISTS idx_artist_profiles_organization_id ON artist_profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_artist_profiles_is_claimed ON artist_profiles(is_claimed);
CREATE INDEX IF NOT EXISTS idx_artist_profiles_claimed_by_clerk_user_id ON artist_profiles(claimed_by_clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_artist_profiles_profile_type ON artist_profiles(profile_type);
CREATE INDEX IF NOT EXISTS idx_artist_profiles_is_active ON artist_profiles(is_active);

-- Resources indexes
CREATE INDEX IF NOT EXISTS idx_resources_org_id ON resources(org_id);
CREATE INDEX IF NOT EXISTS idx_resources_type ON resources(type);
CREATE INDEX IF NOT EXISTS idx_resources_is_active ON resources(is_active);

-- Bookings indexes
CREATE INDEX IF NOT EXISTS idx_bookings_org_id ON bookings(org_id);
CREATE INDEX IF NOT EXISTS idx_bookings_resource_id ON bookings(resource_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_start_time ON bookings(start_time);
CREATE INDEX IF NOT EXISTS idx_bookings_end_time ON bookings(end_time);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- Org memberships indexes
CREATE INDEX IF NOT EXISTS idx_org_memberships_org_id ON org_memberships(org_id);
CREATE INDEX IF NOT EXISTS idx_org_memberships_clerk_user_id ON org_memberships(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_org_memberships_is_active ON org_memberships(is_active);

-- =============================================
-- MIGRATION COMPLETE
-- =============================================

-- Log successful migration
INSERT INTO migration_log (migration_name, executed_at, status) 
VALUES ('20241226000003_align_with_production_schema', NOW(), 'completed')
ON CONFLICT DO NOTHING;
