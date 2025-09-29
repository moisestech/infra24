-- =============================================
-- CREATE EQUIPMENT VOTING SYSTEM
-- =============================================
-- This migration creates tables for voting on desired digital lab equipment
-- Date: December 28, 2024
-- Purpose: Allow users to vote on what equipment they want in the digital lab

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- CREATE EQUIPMENT VOTING TABLES
-- =============================================

-- Create equipment_options table for voting options
CREATE TABLE IF NOT EXISTS equipment_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    estimated_cost NUMERIC,
    priority_level TEXT DEFAULT 'medium' CHECK (priority_level IN ('low', 'medium', 'high', 'critical')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by TEXT NOT NULL DEFAULT 'system',
    updated_by TEXT NOT NULL DEFAULT 'system'
);

-- Create equipment_votes table for user votes
CREATE TABLE IF NOT EXISTS equipment_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id),
    equipment_option_id UUID NOT NULL REFERENCES equipment_options(id),
    user_id TEXT NOT NULL, -- Clerk user ID
    vote_type TEXT NOT NULL DEFAULT 'want' CHECK (vote_type IN ('want', 'need', 'priority')),
    vote_weight INTEGER DEFAULT 1,
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(equipment_option_id, user_id) -- One vote per user per equipment option
);

-- =============================================
-- CREATE INDEXES
-- =============================================

-- Equipment options indexes
CREATE INDEX IF NOT EXISTS idx_equipment_options_org_id ON equipment_options(org_id);
CREATE INDEX IF NOT EXISTS idx_equipment_options_category ON equipment_options(category);
CREATE INDEX IF NOT EXISTS idx_equipment_options_is_active ON equipment_options(is_active);

-- Equipment votes indexes
CREATE INDEX IF NOT EXISTS idx_equipment_votes_org_id ON equipment_votes(org_id);
CREATE INDEX IF NOT EXISTS idx_equipment_votes_equipment_option_id ON equipment_votes(equipment_option_id);
CREATE INDEX IF NOT EXISTS idx_equipment_votes_user_id ON equipment_votes(user_id);
CREATE INDEX IF NOT EXISTS idx_equipment_votes_vote_type ON equipment_votes(vote_type);

-- =============================================
-- CREATE VIEWS FOR VOTING ANALYTICS
-- =============================================

-- Create view for equipment voting results
CREATE OR REPLACE VIEW equipment_voting_results AS
SELECT 
    eo.id as equipment_option_id,
    eo.org_id,
    eo.name,
    eo.description,
    eo.category,
    eo.estimated_cost,
    eo.priority_level,
    COUNT(ev.id) as total_votes,
    COUNT(CASE WHEN ev.vote_type = 'want' THEN 1 END) as want_votes,
    COUNT(CASE WHEN ev.vote_type = 'need' THEN 1 END) as need_votes,
    COUNT(CASE WHEN ev.vote_type = 'priority' THEN 1 END) as priority_votes,
    SUM(ev.vote_weight) as total_weight,
    AVG(ev.vote_weight) as average_weight,
    eo.created_at,
    eo.updated_at
FROM equipment_options eo
LEFT JOIN equipment_votes ev ON eo.id = ev.equipment_option_id
WHERE eo.is_active = true
GROUP BY eo.id, eo.org_id, eo.name, eo.description, eo.category, eo.estimated_cost, eo.priority_level, eo.created_at, eo.updated_at
ORDER BY total_weight DESC, total_votes DESC;

-- =============================================
-- INSERT SAMPLE EQUIPMENT OPTIONS FOR OOLITE
-- =============================================

-- Insert sample equipment options for voting
INSERT INTO equipment_options (org_id, name, description, category, estimated_cost, priority_level) VALUES
-- VR/AR Equipment
('e5c13761-bb53-4b74-94ef-aa08de38bdaf', 'VR/AR Workstation', 'High-end VR development and content creation station with RTX 4080 GPU', 'VR/AR', 5000.00, 'high'),
('e5c13761-bb53-4b74-94ef-aa08de38bdaf', 'Meta Quest 3 VR Headset', 'Latest VR headset for immersive art experiences', 'VR/AR', 500.00, 'medium'),
('e5c13761-bb53-4b74-94ef-aa08de38bdaf', 'Apple Vision Pro', 'Professional mixed reality headset for creative work', 'VR/AR', 3500.00, 'high'),

-- 3D Printing Equipment
('e5c13761-bb53-4b74-94ef-aa08de38bdaf', 'Prusa i3 MK4 3D Printer', 'High-quality 3D printer for detailed prototyping', '3D Printing', 1200.00, 'medium'),
('e5c13761-bb53-4b74-94ef-aa08de38bdaf', 'Resin 3D Printer', 'High-resolution resin printer for detailed miniatures and jewelry', '3D Printing', 800.00, 'medium'),
('e5c13761-bb53-4b74-94ef-aa08de38bdaf', 'Large Format 3D Printer', '3D printer with 500x500x500mm build volume', '3D Printing', 3000.00, 'low'),

-- Audio Equipment
('e5c13761-bb53-4b74-94ef-aa08de38bdaf', 'Professional Audio Studio', 'Complete audio recording and mixing setup', 'Audio', 8000.00, 'medium'),
('e5c13761-bb53-4b74-94ef-aa08de38bdaf', 'Podcast Recording Booth', 'Sound-isolated booth for podcast and voice recording', 'Audio', 2000.00, 'low'),
('e5c13761-bb53-4b74-94ef-aa08de38bdaf', 'MIDI Controller Station', 'Professional MIDI controllers for music production', 'Audio', 1500.00, 'medium'),

-- Photography Equipment
('e5c13761-bb53-4b74-94ef-aa08de38bdaf', 'Professional Photography Studio', 'Complete photography setup with lighting and backdrops', 'Photography', 10000.00, 'high'),
('e5c13761-bb53-4b74-94ef-aa08de38bdaf', '360° Camera Setup', 'Equipment for creating immersive 360° content', 'Photography', 2000.00, 'low'),
('e5c13761-bb53-4b74-94ef-aa08de38bdaf', 'Drone Photography Kit', 'Professional drone for aerial photography and videography', 'Photography', 3000.00, 'medium'),

-- Digital Art Equipment
('e5c13761-bb53-4b74-94ef-aa08de38bdaf', 'Wacom Cintiq Pro 32', 'Large format drawing tablet for digital art', 'Digital Art', 3500.00, 'high'),
('e5c13761-bb53-4b74-94ef-aa08de38bdaf', 'iPad Pro with Apple Pencil', 'Portable digital art creation device', 'Digital Art', 1200.00, 'medium'),
('e5c13761-bb53-4b74-94ef-aa08de38bdaf', 'Color Calibrated Monitor', 'Professional monitor for accurate color work', 'Digital Art', 800.00, 'medium'),

-- AI/ML Equipment
('e5c13761-bb53-4b74-94ef-aa08de38bdaf', 'AI Art Generation Workstation', 'High-end computer for AI art generation and machine learning', 'AI/ML', 6000.00, 'high'),
('e5c13761-bb53-4b74-94ef-aa08de38bdaf', 'GPU Server for AI Training', 'Dedicated server for training custom AI models', 'AI/ML', 15000.00, 'low'),

-- Fabrication Equipment
('e5c13761-bb53-4b74-94ef-aa08de38bdaf', 'Laser Cutter/Engraver', 'CNC laser for cutting and engraving various materials', 'Fabrication', 8000.00, 'high'),
('e5c13761-bb53-4b74-94ef-aa08de38bdaf', 'CNC Router', 'Computer-controlled router for wood and metal work', 'Fabrication', 12000.00, 'medium'),
('e5c13761-bb53-4b74-94ef-aa08de38bdaf', 'Vinyl Cutter', 'Professional vinyl cutting machine for signage and decals', 'Fabrication', 2000.00, 'medium'),

-- Software and Licenses
('e5c13761-bb53-4b74-94ef-aa08de38bdaf', 'Adobe Creative Cloud Licenses', 'Professional software licenses for creative work', 'Software', 600.00, 'critical'),
('e5c13761-bb53-4b74-94ef-aa08de38bdaf', 'Blender Pro License', 'Professional 3D modeling and animation software', 'Software', 200.00, 'medium'),
('e5c13761-bb53-4b74-94ef-aa08de38bdaf', 'Unity Pro License', 'Game development and interactive media platform', 'Software', 400.00, 'low')

ON CONFLICT DO NOTHING;

-- =============================================
-- MIGRATION COMPLETE
-- =============================================

-- Log successful migration
INSERT INTO migration_log (migration_name, executed_at, status) 
VALUES ('20241228000001_create_equipment_voting', NOW(), 'completed')
ON CONFLICT DO NOTHING;
