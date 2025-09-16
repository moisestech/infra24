-- Infra24 Multi-Tenant Database Schema
-- Supports bookings, screens, submissions, learn, and dashboards

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- CORE TENANT MANAGEMENT
-- =============================================

-- Organizations (tenants)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    domain_primary VARCHAR(255),
    theme JSONB DEFAULT '{}',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users (global, can belong to multiple orgs)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Organization memberships with roles
CREATE TABLE memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'staff', 'resident', 'public')),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(organization_id, user_id)
);

-- =============================================
-- BOOKINGS SYSTEM
-- =============================================

-- Resources (equipment, rooms, etc.)
CREATE TABLE resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL, -- 'equipment', 'room', 'workshop', 'event'
    capacity INTEGER DEFAULT 1,
    description TEXT,
    rules JSONB DEFAULT '{}', -- booking rules, restrictions, etc.
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resource schedules (availability windows)
CREATE TABLE resource_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
    day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6), -- 0 = Sunday
    start_time TIME,
    end_time TIME,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    description TEXT,
    starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')),
    checked_in_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- EVENTS & WORKSHOPS
-- =============================================

-- Events (workshops, talks, exhibitions)
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL, -- 'workshop', 'talk', 'exhibition', 'open_lab'
    title VARCHAR(255) NOT NULL,
    description TEXT,
    starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
    location VARCHAR(255),
    capacity INTEGER,
    price DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'cancelled', 'completed')),
    livestream_url TEXT,
    recording_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event registrations
CREATE TABLE event_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'no_show', 'cancelled')),
    checked_in_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

-- =============================================
-- SCREENS & SIGNAGE
-- =============================================

-- Screens (physical displays)
CREATE TABLE screens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    device_key VARCHAR(255) UNIQUE NOT NULL,
    device_type VARCHAR(100) DEFAULT 'raspberry_pi', -- 'raspberry_pi', 'chromebox', 'android'
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'offline', 'maintenance')),
    last_heartbeat_at TIMESTAMP WITH TIME ZONE,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Playlists (content rotation)
CREATE TABLE playlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    rotation_config JSONB DEFAULT '{}', -- timing, transitions, etc.
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Screen assignments to playlists
CREATE TABLE screen_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    screen_id UUID REFERENCES screens(id) ON DELETE CASCADE,
    playlist_id UUID REFERENCES playlists(id) ON DELETE CASCADE,
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(screen_id, playlist_id)
);

-- Content items (announcements, events, etc.)
CREATE TABLE content_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    kind VARCHAR(100) NOT NULL, -- 'announcement', 'event', 'image', 'video', 'qr_code'
    title VARCHAR(255),
    body JSONB NOT NULL, -- flexible content structure
    media_url TEXT,
    media_alt_text TEXT,
    publish_at TIMESTAMP WITH TIME ZONE,
    expire_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Playlist items (content in playlists)
CREATE TABLE playlist_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    playlist_id UUID REFERENCES playlists(id) ON DELETE CASCADE,
    content_item_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL,
    duration_seconds INTEGER DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- SUBMISSIONS & MODERATION
-- =============================================

-- Submissions (community content)
CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    submitter_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL, -- 'announcement', 'event', 'artwork', 'feedback'
    title VARCHAR(255),
    content JSONB NOT NULL,
    media_urls TEXT[],
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'published')),
    reviewer_id UUID REFERENCES users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    review_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- LEARNING SYSTEM
-- =============================================

-- Courses (educational content)
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE, -- NULL for global courses
    title VARCHAR(255) NOT NULL,
    description TEXT,
    level VARCHAR(50) DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    category VARCHAR(100),
    thumbnail_url TEXT,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lessons (individual course content)
CREATE TABLE lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content JSONB NOT NULL, -- MDX content, videos, etc.
    order_index INTEGER NOT NULL,
    duration_minutes INTEGER,
    video_url TEXT,
    resources JSONB DEFAULT '[]', -- links, files, etc.
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Course enrollments
CREATE TABLE course_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'completed', 'dropped')),
    progress JSONB DEFAULT '{}', -- lesson completion, scores, etc.
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(course_id, user_id)
);

-- =============================================
-- ANALYTICS & REPORTING
-- =============================================

-- Analytics events
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL, -- 'booking_created', 'event_attended', 'screen_viewed', etc.
    object_type VARCHAR(100), -- 'booking', 'event', 'screen', 'course', etc.
    object_id UUID,
    user_id UUID REFERENCES users(id),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- AUDIT & SECURITY
-- =============================================

-- Audit log
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    target_table VARCHAR(100),
    target_id UUID,
    changes JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE screens ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE screen_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Organization-based indexes
CREATE INDEX idx_memberships_org_user ON memberships(organization_id, user_id);
CREATE INDEX idx_resources_org ON resources(organization_id);
CREATE INDEX idx_bookings_org_resource ON bookings(organization_id, resource_id);
CREATE INDEX idx_bookings_org_user ON bookings(organization_id, user_id);
CREATE INDEX idx_bookings_starts_at ON bookings(starts_at);
CREATE INDEX idx_events_org ON events(organization_id);
CREATE INDEX idx_events_starts_at ON events(starts_at);
CREATE INDEX idx_screens_org ON screens(organization_id);
CREATE INDEX idx_screens_device_key ON screens(device_key);
CREATE INDEX idx_playlists_org ON playlists(organization_id);
CREATE INDEX idx_content_items_org ON content_items(organization_id);
CREATE INDEX idx_submissions_org ON submissions(organization_id);
CREATE INDEX idx_courses_org ON courses(organization_id);
CREATE INDEX idx_analytics_org_created_at ON analytics_events(organization_id, created_at);

-- =============================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables with updated_at
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_memberships_updated_at BEFORE UPDATE ON memberships FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON resources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_event_registrations_updated_at BEFORE UPDATE ON event_registrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_screens_updated_at BEFORE UPDATE ON screens FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_playlists_updated_at BEFORE UPDATE ON playlists FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_items_updated_at BEFORE UPDATE ON content_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_submissions_updated_at BEFORE UPDATE ON submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_course_enrollments_updated_at BEFORE UPDATE ON course_enrollments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- SAMPLE DATA
-- =============================================

-- Insert sample organizations
INSERT INTO organizations (slug, name, domain_primary, theme) VALUES
('bakehouse', 'Bakehouse Art Complex', 'bakehouse.infra24.digital', '{"primary": "#FF6B35", "secondary": "#004E89"}'),
('oolite', 'Oolite Arts', 'oolite.infra24.digital', '{"primary": "#2E86AB", "secondary": "#A23B72"}'),
('edgezones', 'Edge Zones', 'edgezones.infra24.digital', '{"primary": "#F18F01", "secondary": "#C73E1D"}'),
('locust', 'Locust Projects', 'locust.infra24.digital', '{"primary": "#6A994E", "secondary": "#386641"}');

-- Insert sample resources for Oolite
INSERT INTO resources (organization_id, name, type, capacity, description, rules) 
SELECT 
    o.id,
    r.name,
    r.type,
    r.capacity,
    r.description,
    r.rules
FROM organizations o,
(VALUES 
    ('3D Printer A', 'equipment', 1, 'Prusa i3 MK3S+ with PLA/ABS support', '{"min_booking_hours": 2, "max_booking_hours": 8}'),
    ('Workstation 1', 'equipment', 1, 'High-spec PC for 3D modeling and rendering', '{"min_booking_hours": 1, "max_booking_hours": 4}'),
    ('Workstation 2', 'equipment', 1, 'High-spec PC for video editing and AI work', '{"min_booking_hours": 1, "max_booking_hours": 4}'),
    ('Photo Printer', 'equipment', 1, 'Epson P900 for high-quality photo printing', '{"min_booking_hours": 1, "max_booking_hours": 2}'),
    ('XR Kit', 'equipment', 1, 'VR headset and controllers for immersive experiences', '{"min_booking_hours": 1, "max_booking_hours": 3}'),
    ('Conference Area', 'room', 8, 'Meeting space for workshops and discussions', '{"min_booking_hours": 1, "max_booking_hours": 4}')
) AS r(name, type, capacity, description, rules)
WHERE o.slug = 'oolite';
