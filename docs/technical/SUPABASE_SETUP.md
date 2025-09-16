# Supabase Setup Guide for Infra24

This guide covers the complete setup of Supabase for the Infra24 multi-tenant platform, including database schema, authentication, and deployment configuration.

## Table of Contents

1. [Project Setup](#project-setup)
2. [Database Schema](#database-schema)
3. [Row Level Security (RLS)](#row-level-security-rls)
4. [Authentication Setup](#authentication-setup)
5. [API Configuration](#api-configuration)
6. [Environment Variables](#environment-variables)
7. [Deployment](#deployment)
8. [Monitoring & Maintenance](#monitoring--maintenance)

## Project Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Fill in project details:
   - **Name**: `infra24-platform`
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users (e.g., `us-east-1`)
   - **Pricing Plan**: Start with Free tier, upgrade as needed

### 2. Project Configuration

```bash
# Install Supabase CLI
npm install -g supabase

# Initialize Supabase in your project
supabase init

# Link to your remote project
supabase link --project-ref YOUR_PROJECT_REF
```

## Database Schema

### Core Tables

```sql
-- Organizations (Tenants)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  domain VARCHAR(255),
  subdomain VARCHAR(100),
  logo_url TEXT,
  primary_color VARCHAR(7) DEFAULT '#3B82F6',
  secondary_color VARCHAR(7) DEFAULT '#1E40AF',
  accent_color VARCHAR(7) DEFAULT '#60A5FA',
  settings JSONB DEFAULT '{}',
  features JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  avatar_url TEXT,
  role VARCHAR(50) DEFAULT 'user',
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Organization Memberships
CREATE TABLE organization_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member',
  status VARCHAR(20) DEFAULT 'active',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, organization_id)
);

-- Announcements
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT,
  type VARCHAR(50) DEFAULT 'announcement',
  priority VARCHAR(20) DEFAULT 'normal',
  visibility VARCHAR(20) DEFAULT 'internal',
  status VARCHAR(20) DEFAULT 'draft',
  scheduled_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  key_people JSONB DEFAULT '[]',
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(20) DEFAULT 'confirmed',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resources
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  description TEXT,
  capacity INTEGER DEFAULT 1,
  location VARCHAR(255),
  settings JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Submissions
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  form_id UUID REFERENCES forms(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Forms
CREATE TABLE forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  fields JSONB NOT NULL,
  settings JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workshops
CREATE TABLE workshops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT,
  type VARCHAR(50) DEFAULT 'workshop',
  level VARCHAR(20) DEFAULT 'beginner',
  duration_minutes INTEGER,
  max_participants INTEGER,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics Events
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  event_type VARCHAR(100) NOT NULL,
  event_data JSONB DEFAULT '{}',
  session_id VARCHAR(255),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Indexes for Performance

```sql
-- Organization indexes
CREATE INDEX idx_organizations_slug ON organizations(slug);
CREATE INDEX idx_organizations_domain ON organizations(domain);
CREATE INDEX idx_organizations_subdomain ON organizations(subdomain);

-- User indexes
CREATE INDEX idx_users_clerk_id ON users(clerk_user_id);
CREATE INDEX idx_users_organization ON users(organization_id);
CREATE INDEX idx_users_email ON users(email);

-- Membership indexes
CREATE INDEX idx_memberships_user ON organization_memberships(user_id);
CREATE INDEX idx_memberships_org ON organization_memberships(organization_id);
CREATE INDEX idx_memberships_status ON organization_memberships(status);

-- Announcement indexes
CREATE INDEX idx_announcements_org ON announcements(organization_id);
CREATE INDEX idx_announcements_status ON announcements(status);
CREATE INDEX idx_announcements_visibility ON announcements(visibility);
CREATE INDEX idx_announcements_scheduled ON announcements(scheduled_at);
CREATE INDEX idx_announcements_expires ON announcements(expires_at);

-- Booking indexes
CREATE INDEX idx_bookings_org ON bookings(organization_id);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_resource ON bookings(resource_id);
CREATE INDEX idx_bookings_time ON bookings(start_time, end_time);
CREATE INDEX idx_bookings_status ON bookings(status);

-- Resource indexes
CREATE INDEX idx_resources_org ON resources(organization_id);
CREATE INDEX idx_resources_type ON resources(type);
CREATE INDEX idx_resources_active ON resources(is_active);

-- Submission indexes
CREATE INDEX idx_submissions_org ON submissions(organization_id);
CREATE INDEX idx_submissions_form ON submissions(form_id);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_created ON submissions(created_at);

-- Analytics indexes
CREATE INDEX idx_analytics_org ON analytics_events(organization_id);
CREATE INDEX idx_analytics_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_created ON analytics_events(created_at);
CREATE INDEX idx_analytics_session ON analytics_events(session_id);
```

## Row Level Security (RLS)

### Enable RLS on All Tables

```sql
-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
```

### RLS Policies

```sql
-- Organizations: Users can only see their own organization
CREATE POLICY "Users can view their organization" ON organizations
  FOR SELECT USING (
    id IN (
      SELECT organization_id 
      FROM organization_memberships 
      WHERE user_id = auth.uid()
    )
  );

-- Users: Users can see other users in their organization
CREATE POLICY "Users can view organization members" ON users
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id 
      FROM organization_memberships 
      WHERE user_id = auth.uid()
    )
  );

-- Announcements: Users can see announcements from their organization
CREATE POLICY "Users can view organization announcements" ON announcements
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id 
      FROM organization_memberships 
      WHERE user_id = auth.uid()
    )
  );

-- Bookings: Users can manage their own bookings
CREATE POLICY "Users can manage their bookings" ON bookings
  FOR ALL USING (
    user_id = auth.uid() OR
    organization_id IN (
      SELECT organization_id 
      FROM organization_memberships 
      WHERE user_id = auth.uid() AND role IN ('admin', 'staff')
    )
  );

-- Resources: Users can view resources in their organization
CREATE POLICY "Users can view organization resources" ON resources
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id 
      FROM organization_memberships 
      WHERE user_id = auth.uid()
    )
  );

-- Submissions: Users can manage submissions in their organization
CREATE POLICY "Users can manage organization submissions" ON submissions
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id 
      FROM organization_memberships 
      WHERE user_id = auth.uid()
    )
  );

-- Forms: Users can view forms in their organization
CREATE POLICY "Users can view organization forms" ON forms
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id 
      FROM organization_memberships 
      WHERE user_id = auth.uid()
    )
  );

-- Workshops: Users can view workshops in their organization
CREATE POLICY "Users can view organization workshops" ON workshops
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id 
      FROM organization_memberships 
      WHERE user_id = auth.uid()
    )
  );

-- Analytics: Users can view analytics for their organization
CREATE POLICY "Users can view organization analytics" ON analytics_events
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id 
      FROM organization_memberships 
      WHERE user_id = auth.uid()
    )
  );
```

## Authentication Setup

### 1. Configure Clerk Integration

```sql
-- Create function to handle Clerk user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (clerk_user_id, email, first_name, last_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email_addresses->0->>'email_address',
    NEW.first_name,
    NEW.last_name,
    NEW.image_url
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### 2. JWT Configuration

In your Supabase dashboard:
1. Go to Settings > API
2. Copy your JWT secret
3. Configure JWT settings for Clerk integration

## API Configuration

### 1. Create API Functions

```sql
-- Function to get user's organization
CREATE OR REPLACE FUNCTION get_user_organization(user_uuid UUID)
RETURNS TABLE(organization_id UUID, organization_name TEXT, role TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.id,
    o.name,
    om.role
  FROM organizations o
  JOIN organization_memberships om ON o.id = om.organization_id
  WHERE om.user_id = user_uuid AND om.status = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check user permissions
CREATE OR REPLACE FUNCTION check_user_permission(
  user_uuid UUID,
  org_uuid UUID,
  required_role TEXT DEFAULT 'member'
)
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM organization_memberships
  WHERE user_id = user_uuid 
    AND organization_id = org_uuid 
    AND status = 'active';
  
  IF user_role IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Role hierarchy: admin > staff > member
  CASE required_role
    WHEN 'admin' THEN
      RETURN user_role = 'admin';
    WHEN 'staff' THEN
      RETURN user_role IN ('admin', 'staff');
    WHEN 'member' THEN
      RETURN user_role IN ('admin', 'staff', 'member');
    ELSE
      RETURN FALSE;
  END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 2. Create Views for Common Queries

```sql
-- View for user organization details
CREATE VIEW user_organizations AS
SELECT 
  u.id as user_id,
  u.clerk_user_id,
  u.email,
  o.id as organization_id,
  o.name as organization_name,
  o.slug as organization_slug,
  om.role,
  om.status as membership_status
FROM users u
JOIN organization_memberships om ON u.id = om.user_id
JOIN organizations o ON om.organization_id = o.id
WHERE om.status = 'active';

-- View for public announcements
CREATE VIEW public_announcements AS
SELECT 
  a.*,
  o.name as organization_name,
  o.slug as organization_slug
FROM announcements a
JOIN organizations o ON a.organization_id = o.id
WHERE a.visibility = 'public' 
  AND a.status = 'published'
  AND (a.expires_at IS NULL OR a.expires_at > NOW());
```

## Environment Variables

### 1. Create `.env.local`

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Clerk Configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
CLERK_SECRET_KEY=your-clerk-secret-key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Infra24
NEXT_PUBLIC_APP_DESCRIPTION=Multi-tenant Cultural Infrastructure Platform

# Analytics (Optional)
NEXT_PUBLIC_POSTHOG_KEY=your-posthog-key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Email (Optional)
RESEND_API_KEY=your-resend-api-key
```

### 2. Supabase Client Configuration

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Server-side client with service role
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)
```

## Deployment

### 1. Database Migrations

```bash
# Create migration files
supabase migration new create_organizations_table
supabase migration new create_users_table
supabase migration new create_announcements_table
# ... etc for each table

# Apply migrations
supabase db push
```

### 2. Production Configuration

1. **Enable SSL**: Ensure all connections use SSL
2. **Configure CORS**: Set up proper CORS policies
3. **Set up backups**: Enable automatic backups
4. **Monitor performance**: Set up query monitoring
5. **Configure alerts**: Set up alerts for errors and performance issues

### 3. Environment Setup

```bash
# Production environment variables
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key
```

## Monitoring & Maintenance

### 1. Database Monitoring

- Monitor query performance in Supabase dashboard
- Set up alerts for slow queries
- Monitor database size and growth
- Track connection usage

### 2. Security Monitoring

- Review RLS policies regularly
- Monitor failed authentication attempts
- Audit user permissions
- Review API usage patterns

### 3. Backup Strategy

- Enable automatic daily backups
- Test restore procedures regularly
- Keep backup retention policy
- Document recovery procedures

### 4. Performance Optimization

- Monitor and optimize slow queries
- Add indexes as needed
- Review and optimize RLS policies
- Monitor connection pooling

## Troubleshooting

### Common Issues

1. **RLS Policy Errors**: Check policy syntax and user permissions
2. **Connection Issues**: Verify environment variables and network access
3. **Authentication Problems**: Check Clerk integration and JWT configuration
4. **Performance Issues**: Review query performance and add indexes

### Support Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)

## Next Steps

1. Set up the database schema
2. Configure authentication
3. Implement RLS policies
4. Test multi-tenant functionality
5. Deploy to production
6. Monitor and optimize

This setup provides a solid foundation for the Infra24 multi-tenant platform with proper security, scalability, and maintainability.
