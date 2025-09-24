# Survey Analytics Database Schema

This document outlines the database schema for the survey system, which is essential for building admin analytics functionality.

## Core Tables

### 1. `surveys` - Main Survey Instances
```sql
CREATE TABLE surveys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    template_id UUID REFERENCES survey_templates(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'closed', 'archived')),
    
    -- Survey configuration
    is_anonymous BOOLEAN DEFAULT true,
    language_default TEXT DEFAULT 'en' CHECK (language_default IN ('en', 'es')),
    languages_supported TEXT[] DEFAULT ARRAY['en'],
    
    -- Access control
    requires_authentication BOOLEAN DEFAULT false,
    allowed_roles TEXT[] DEFAULT ARRAY['staff', 'resident', 'public'],
    
    -- Scheduling
    opens_at TIMESTAMP WITH TIME ZONE,
    closes_at TIMESTAMP WITH TIME ZONE,
    
    -- Response limits
    max_responses INTEGER,
    max_responses_per_user INTEGER DEFAULT 1,
    
    -- Survey structure (JSON schema)
    survey_schema JSONB NOT NULL DEFAULT '{}',
    
    -- Settings
    settings JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by TEXT NOT NULL, -- Clerk user ID
    updated_by TEXT NOT NULL -- Clerk user ID
);
```

### 2. `survey_responses` - Individual Survey Responses
```sql
CREATE TABLE survey_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
    invitation_id UUID REFERENCES survey_invitations(id) ON DELETE SET NULL,
    
    -- Respondent information (nullable for anonymous surveys)
    respondent_email TEXT,
    respondent_name TEXT,
    respondent_role TEXT,
    user_id TEXT, -- Clerk user ID (nullable for anonymous)
    
    -- Response data
    responses JSONB NOT NULL DEFAULT '{}', -- The actual survey responses
    language_used TEXT DEFAULT 'en',
    
    -- Metadata
    ip_address INET,
    user_agent TEXT,
    completion_time_seconds INTEGER,
    
    -- Status
    status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);
```

### 3. `survey_invitations` - Targeted Survey Invitations
```sql
CREATE TABLE survey_invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    name TEXT,
    role TEXT, -- staff, resident, public, etc.
    magic_token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'opened', 'completed', 'expired')),
    sent_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. `survey_analytics` - Aggregated Metrics
```sql
CREATE TABLE survey_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    metric_name TEXT NOT NULL,
    metric_value DECIMAL(15,4) NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(survey_id, date, metric_name)
);
```

### 5. `survey_templates` - Reusable Survey Definitions
```sql
CREATE TABLE survey_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('staff', 'resident', 'public', 'feedback', 'assessment', 'custom')),
    template_schema JSONB NOT NULL DEFAULT '{}', -- JSON schema defining survey structure
    is_public BOOLEAN DEFAULT false, -- Whether template can be used by other orgs
    created_by TEXT NOT NULL, -- Clerk user ID
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 6. `survey_comments` - Internal Notes
```sql
CREATE TABLE survey_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL, -- Clerk user ID
    comment TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Key Analytics Queries

### Survey Response Rates
```sql
SELECT 
    s.id,
    s.title,
    s.status,
    COUNT(si.id) as total_invitations,
    COUNT(sr.id) as total_responses,
    COUNT(CASE WHEN sr.status = 'completed' THEN 1 END) as completed_responses,
    ROUND(
        COUNT(CASE WHEN sr.status = 'completed' THEN 1 END)::DECIMAL / 
        NULLIF(COUNT(si.id), 0) * 100, 2
    ) as response_rate_percent
FROM surveys s
LEFT JOIN survey_invitations si ON s.id = si.survey_id
LEFT JOIN survey_responses sr ON s.id = sr.survey_id
WHERE s.organization_id = $1
GROUP BY s.id, s.title, s.status
ORDER BY s.created_at DESC;
```

### Response Completion Times
```sql
SELECT 
    s.title,
    AVG(sr.completion_time_seconds) as avg_completion_time_seconds,
    MIN(sr.completion_time_seconds) as min_completion_time_seconds,
    MAX(sr.completion_time_seconds) as max_completion_time_seconds,
    COUNT(sr.id) as total_responses
FROM surveys s
JOIN survey_responses sr ON s.id = sr.survey_id
WHERE s.organization_id = $1 
  AND sr.status = 'completed'
  AND sr.completion_time_seconds IS NOT NULL
GROUP BY s.id, s.title
ORDER BY avg_completion_time_seconds DESC;
```

### Survey Status Distribution
```sql
SELECT 
    status,
    COUNT(*) as count,
    ROUND(COUNT(*)::DECIMAL / (SELECT COUNT(*) FROM surveys WHERE organization_id = $1) * 100, 2) as percentage
FROM surveys 
WHERE organization_id = $1
GROUP BY status
ORDER BY count DESC;
```

### Response Trends Over Time
```sql
SELECT 
    DATE(sr.created_at) as response_date,
    COUNT(*) as responses_count,
    COUNT(CASE WHEN sr.status = 'completed' THEN 1 END) as completed_count
FROM surveys s
JOIN survey_responses sr ON s.id = sr.survey_id
WHERE s.organization_id = $1
  AND sr.created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(sr.created_at)
ORDER BY response_date DESC;
```

## Admin Analytics Dashboard Metrics

### Key Performance Indicators (KPIs)
1. **Total Surveys**: Count of surveys by organization
2. **Active Surveys**: Count of surveys with status 'active'
3. **Response Rate**: Percentage of invitations that resulted in completed responses
4. **Average Completion Time**: Mean time to complete surveys
5. **Survey Categories**: Distribution of surveys by category
6. **Response Trends**: Daily/weekly response patterns

### Detailed Analytics
1. **Survey Performance**: Individual survey metrics and comparisons
2. **User Engagement**: Response patterns by user role and demographics
3. **Completion Funnel**: Track users from invitation → opened → completed
4. **Geographic Analytics**: Response patterns by location (if available)
5. **Device Analytics**: Response patterns by device type and browser

### Export Capabilities
- Raw response data export (CSV/JSON)
- Aggregated analytics export
- Survey template exports
- Response summaries by date range

## Implementation Notes

- All timestamps use `TIMESTAMP WITH TIME ZONE` for proper timezone handling
- JSONB fields store flexible survey schemas and response data
- Indexes are created on frequently queried columns for performance
- Soft deletes are not implemented - use status fields for archiving
- Magic tokens in invitations provide secure, anonymous access
- Analytics table allows for pre-computed metrics to improve dashboard performance
