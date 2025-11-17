# Database Schema Analysis & Extension Plan 🗄️

> **Comprehensive analysis of current database schema and extensions needed for MASTER flow integration**

## 📊 Current Schema Overview

### Core Tables Status
| Table | Status | Records | Purpose |
|-------|--------|---------|---------|
| `organizations` | ✅ Complete | 3 | Multi-tenant organization data |
| `resources` | ✅ Complete | 33 | Bookable items (equipment, spaces, people, workshops) |
| `bookings` | ✅ Complete | 0 | Booking records with status tracking |
| `surveys` | ✅ Complete | 0 | Survey instances and responses |
| `workshops` | ✅ Complete | 0 | Workshop content and metadata |
| `announcements` | ✅ Complete | 0 | Organization announcements |

### Current Schema Strengths
- ✅ **Multi-tenant Architecture**: Proper organization isolation
- ✅ **Resource Management**: Comprehensive resource types
- ✅ **Booking System**: Full booking lifecycle support
- ✅ **Row Level Security**: Proper data access controls
- ✅ **Audit Fields**: Created/updated tracking
- ✅ **JSONB Support**: Flexible metadata storage

## 🔍 Gap Analysis for MASTER Flow

### Missing Tables
| Table | Priority | Purpose | Status |
|-------|----------|---------|---------|
| `calendar_integrations` | P0 | Google Calendar sync | ❌ Missing |
| `external_requests` | P0 | AppSheet integration | ❌ Missing |
| `conflict_logs` | P0 | Conflict tracking | ❌ Missing |
| `ai_digests` | P1 | AI-generated summaries | ❌ Missing |
| `analytics_events` | P1 | User behavior tracking | ❌ Missing |
| `notification_templates` | P2 | Email/SMS templates | ❌ Missing |

### Missing Columns
| Table | Column | Purpose | Priority |
|-------|--------|---------|----------|
| `bookings` | `external_calendar_event_id` | Google Calendar sync | P0 |
| `bookings` | `source` | Track booking origin | P0 |
| `bookings` | `conflict_resolution_notes` | Conflict handling | P0 |
| `resources` | `external_calendar_id` | Calendar integration | P0 |
| `resources` | `auto_approval_enabled` | Workflow automation | P1 |
| `organizations` | `calendar_settings` | Calendar configuration | P0 |

## 🗄️ Required Schema Extensions

### 1. Calendar Integration Tables

#### `calendar_integrations`
```sql
CREATE TABLE calendar_integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    provider TEXT NOT NULL CHECK (provider IN ('google', 'outlook', 'apple')),
    external_calendar_id TEXT NOT NULL,
    calendar_name TEXT NOT NULL,
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    token_expires_at TIMESTAMP WITH TIME ZONE,
    webhook_url TEXT,
    webhook_secret TEXT,
    sync_enabled BOOLEAN DEFAULT true,
    last_sync_at TIMESTAMP WITH TIME ZONE,
    sync_status TEXT DEFAULT 'pending' CHECK (sync_status IN ('pending', 'syncing', 'success', 'error')),
    error_message TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by TEXT NOT NULL,
    updated_by TEXT NOT NULL,
    
    UNIQUE(organization_id, provider, external_calendar_id)
);

-- Indexes
CREATE INDEX idx_calendar_integrations_org_id ON calendar_integrations(organization_id);
CREATE INDEX idx_calendar_integrations_provider ON calendar_integrations(provider);
CREATE INDEX idx_calendar_integrations_sync_status ON calendar_integrations(sync_status);
```

#### `calendar_events`
```sql
CREATE TABLE calendar_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    calendar_integration_id UUID NOT NULL REFERENCES calendar_integrations(id) ON DELETE CASCADE,
    external_event_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    location TEXT,
    attendees JSONB DEFAULT '[]',
    event_type TEXT DEFAULT 'meeting' CHECK (event_type IN ('meeting', 'workshop', 'event', 'block')),
    is_all_day BOOLEAN DEFAULT false,
    recurrence_rule TEXT,
    status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'tentative', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(calendar_integration_id, external_event_id)
);

-- Indexes
CREATE INDEX idx_calendar_events_org_id ON calendar_events(organization_id);
CREATE INDEX idx_calendar_events_time_range ON calendar_events(start_time, end_time);
CREATE INDEX idx_calendar_events_external_id ON calendar_events(external_event_id);
```

### 2. External Request Management

#### `external_requests`
```sql
CREATE TABLE external_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    source TEXT NOT NULL CHECK (source IN ('appsheet', 'google_forms', 'api', 'manual')),
    external_id TEXT NOT NULL,
    request_type TEXT NOT NULL CHECK (request_type IN ('booking', 'inquiry', 'complaint', 'suggestion')),
    request_data JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'approved', 'rejected', 'cancelled')),
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    assigned_to TEXT,
    processed_at TIMESTAMP WITH TIME ZONE,
    processed_by TEXT,
    processing_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(organization_id, source, external_id)
);

-- Indexes
CREATE INDEX idx_external_requests_org_id ON external_requests(organization_id);
CREATE INDEX idx_external_requests_status ON external_requests(status);
CREATE INDEX idx_external_requests_source ON external_requests(source);
CREATE INDEX idx_external_requests_created_at ON external_requests(created_at);
```

#### `request_attachments`
```sql
CREATE TABLE request_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID NOT NULL REFERENCES external_requests(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    file_url TEXT NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    uploaded_by TEXT NOT NULL
);

-- Indexes
CREATE INDEX idx_request_attachments_request_id ON request_attachments(request_id);
```

### 3. Conflict Detection & Resolution

#### `conflict_logs`
```sql
CREATE TABLE conflict_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
    conflict_type TEXT NOT NULL CHECK (conflict_type IN ('double_booking', 'timezone_mismatch', 'resource_unavailable', 'capacity_exceeded')),
    conflict_data JSONB NOT NULL,
    severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'ignored')),
    resolution TEXT,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by TEXT,
    resolution_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_conflict_logs_org_id ON conflict_logs(organization_id);
CREATE INDEX idx_conflict_logs_resource_id ON conflict_logs(resource_id);
CREATE INDEX idx_conflict_logs_status ON conflict_logs(status);
CREATE INDEX idx_conflict_logs_created_at ON conflict_logs(created_at);
```

### 4. AI & Analytics

#### `ai_digests`
```sql
CREATE TABLE ai_digests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    digest_type TEXT NOT NULL CHECK (digest_type IN ('daily', 'weekly', 'monthly', 'custom')),
    period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    content JSONB NOT NULL,
    summary TEXT NOT NULL,
    insights JSONB DEFAULT '[]',
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    generated_by TEXT DEFAULT 'ai_system',
    is_archived BOOLEAN DEFAULT false
);

-- Indexes
CREATE INDEX idx_ai_digests_org_id ON ai_digests(organization_id);
CREATE INDEX idx_ai_digests_type ON ai_digests(digest_type);
CREATE INDEX idx_ai_digests_period ON ai_digests(period_start, period_end);
```

#### `analytics_events`
```sql
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id TEXT,
    session_id TEXT,
    event_type TEXT NOT NULL,
    event_data JSONB DEFAULT '{}',
    page_url TEXT,
    referrer TEXT,
    user_agent TEXT,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_analytics_events_org_id ON analytics_events(organization_id);
CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);
```

### 5. Schema Modifications

#### `bookings` table additions
```sql
-- Add new columns to existing bookings table
ALTER TABLE bookings ADD COLUMN external_calendar_event_id TEXT;
ALTER TABLE bookings ADD COLUMN source TEXT DEFAULT 'infra24' CHECK (source IN ('infra24', 'appsheet', 'google_calendar', 'api', 'manual'));
ALTER TABLE bookings ADD COLUMN conflict_resolution_notes TEXT;
ALTER TABLE bookings ADD COLUMN auto_approved BOOLEAN DEFAULT false;
ALTER TABLE bookings ADD COLUMN approval_workflow_id UUID;

-- Add indexes
CREATE INDEX idx_bookings_external_calendar_event_id ON bookings(external_calendar_event_id);
CREATE INDEX idx_bookings_source ON bookings(source);
CREATE INDEX idx_bookings_auto_approved ON bookings(auto_approved);
```

#### `resources` table additions
```sql
-- Add new columns to existing resources table
ALTER TABLE resources ADD COLUMN external_calendar_id TEXT;
ALTER TABLE resources ADD COLUMN conflict_detection_enabled BOOLEAN DEFAULT true;
ALTER TABLE resources ADD COLUMN auto_approval_enabled BOOLEAN DEFAULT false;
ALTER TABLE resources ADD COLUMN approval_workflow_id UUID;
ALTER TABLE resources ADD COLUMN booking_restrictions JSONB DEFAULT '{}';

-- Add indexes
CREATE INDEX idx_resources_external_calendar_id ON resources(external_calendar_id);
CREATE INDEX idx_resources_auto_approval ON resources(auto_approval_enabled);
```

#### `organizations` table additions
```sql
-- Add new columns to existing organizations table
ALTER TABLE organizations ADD COLUMN calendar_settings JSONB DEFAULT '{}';
ALTER TABLE organizations ADD COLUMN ai_settings JSONB DEFAULT '{}';
ALTER TABLE organizations ADD COLUMN notification_settings JSONB DEFAULT '{}';
ALTER TABLE organizations ADD COLUMN integration_settings JSONB DEFAULT '{}';
```

## 🔧 Migration Strategy

### Phase 1: Core Extensions (Week 1)
```sql
-- 1. Create calendar integration tables
-- 2. Add columns to existing tables
-- 3. Create indexes
-- 4. Set up RLS policies
```

### Phase 2: External Integrations (Week 2)
```sql
-- 1. Create external request tables
-- 2. Add request processing workflows
-- 3. Set up webhook endpoints
-- 4. Create data validation rules
```

### Phase 3: AI & Analytics (Week 3)
```sql
-- 1. Create AI digest tables
-- 2. Set up analytics tracking
-- 3. Create reporting views
-- 4. Set up data retention policies
```

## 🔒 Security Considerations

### Row Level Security (RLS)
```sql
-- Enable RLS on all new tables
ALTER TABLE calendar_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE external_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE conflict_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_digests ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for organization isolation
CREATE POLICY "calendar_integrations_org_isolation" ON calendar_integrations
    FOR ALL USING (organization_id IN (
        SELECT org_id FROM org_memberships 
        WHERE clerk_user_id = auth.uid() AND is_active = true
    ));
```

### Data Privacy
- **PII Protection**: Encrypt sensitive data
- **Access Logging**: Track all data access
- **Data Retention**: Implement automatic cleanup
- **GDPR Compliance**: Support data export/deletion

## 📊 Performance Optimization

### Indexing Strategy
- **Composite Indexes**: For common query patterns
- **Partial Indexes**: For filtered queries
- **Covering Indexes**: For read-heavy operations
- **Index Maintenance**: Regular VACUUM and ANALYZE

### Query Optimization
- **Connection Pooling**: Use PgBouncer
- **Query Caching**: Implement Redis caching
- **Read Replicas**: For analytics queries
- **Partitioning**: For large tables (analytics_events)

## 🧪 Testing Strategy

### Schema Testing
```sql
-- Test table creation
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name IN (
    'calendar_integrations', 'external_requests', 'conflict_logs'
);

-- Test column additions
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'bookings' AND column_name IN (
    'external_calendar_event_id', 'source', 'conflict_resolution_notes'
);

-- Test indexes
SELECT indexname FROM pg_indexes 
WHERE tablename IN ('calendar_integrations', 'external_requests');
```

### Data Integrity Testing
```sql
-- Test foreign key constraints
-- Test check constraints
-- Test unique constraints
-- Test RLS policies
```

## 📈 Monitoring & Maintenance

### Health Checks
- **Table Sizes**: Monitor growth
- **Index Usage**: Optimize unused indexes
- **Query Performance**: Track slow queries
- **Connection Counts**: Monitor connections

### Maintenance Tasks
- **Weekly**: VACUUM and ANALYZE
- **Monthly**: Index maintenance
- **Quarterly**: Schema optimization review
- **Annually**: Archive old data

## 🚀 Implementation Plan

### Week 1: Core Schema
- [ ] Create calendar integration tables
- [ ] Add columns to existing tables
- [ ] Set up RLS policies
- [ ] Create basic indexes

### Week 2: External Integrations
- [ ] Create external request tables
- [ ] Set up webhook infrastructure
- [ ] Create data validation rules
- [ ] Test integration endpoints

### Week 3: AI & Analytics
- [ ] Create AI digest tables
- [ ] Set up analytics tracking
- [ ] Create reporting views
- [ ] Implement data retention

### Week 4: Testing & Optimization
- [ ] Comprehensive testing
- [ ] Performance optimization
- [ ] Security audit
- [ ] Documentation updates

---

## 📋 Checklist

### Pre-Implementation
- [ ] Review schema with team
- [ ] Plan migration strategy
- [ ] Set up staging environment
- [ ] Create backup procedures

### Implementation
- [ ] Run migrations in staging
- [ ] Test all functionality
- [ ] Validate data integrity
- [ ] Performance testing

### Post-Implementation
- [ ] Monitor system performance
- [ ] User acceptance testing
- [ ] Documentation updates
- [ ] Team training

---

*Last updated: January 2025*
*Status: Planning Phase*
*Next Review: Weekly*
