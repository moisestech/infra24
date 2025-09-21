-- Email Analytics and Monitoring System
-- This migration creates tables for comprehensive email tracking, analytics, and performance monitoring

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Email Analytics Table
-- Tracks all email events for analytics and reporting
CREATE TABLE IF NOT EXISTS email_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(50) NOT NULL,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    template VARCHAR(100) NOT NULL,
    recipient VARCHAR(255) NOT NULL,
    message_id VARCHAR(255),
    success BOOLEAN NOT NULL DEFAULT false,
    error_message TEXT,
    duration_ms INTEGER,
    metadata JSONB DEFAULT '{}',
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Email Monitoring Table
-- Tracks email performance and operational metrics
CREATE TABLE IF NOT EXISTS email_monitoring (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id VARCHAR(255) UNIQUE NOT NULL,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    template VARCHAR(100) NOT NULL,
    recipient VARCHAR(255) NOT NULL,
    start_time BIGINT NOT NULL,
    end_time BIGINT,
    duration INTEGER,
    success BOOLEAN NOT NULL DEFAULT false,
    error TEXT,
    performance JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Email Alerts Table
-- Stores performance alerts and notifications
CREATE TABLE IF NOT EXISTS email_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(50) NOT NULL, -- 'performance', 'error', 'delivery', 'bounce'
    severity VARCHAR(20) NOT NULL, -- 'low', 'medium', 'high', 'critical'
    message TEXT NOT NULL,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    metadata JSONB DEFAULT '{}',
    resolved BOOLEAN DEFAULT false,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Email Templates Table
-- Stores email template configurations and metadata
CREATE TABLE IF NOT EXISTS email_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    display_name VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL, -- 'survey', 'onboarding', 'announcement', 'workshop', etc.
    subject_template TEXT NOT NULL,
    html_template TEXT NOT NULL,
    text_template TEXT NOT NULL,
    variables JSONB DEFAULT '[]', -- Array of required variables
    is_active BOOLEAN DEFAULT true,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE, -- NULL for global templates
    created_by UUID, -- Clerk user ID
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Email Campaigns Table
-- Tracks email campaigns and their performance
CREATE TABLE IF NOT EXISTS email_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    template_id UUID REFERENCES email_templates(id) ON DELETE SET NULL,
    template_name VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'draft', -- 'draft', 'scheduled', 'sending', 'sent', 'cancelled'
    scheduled_at TIMESTAMPTZ,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    total_recipients INTEGER DEFAULT 0,
    successful_sends INTEGER DEFAULT 0,
    failed_sends INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_by UUID, -- Clerk user ID
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Email Recipients Table
-- Tracks individual recipients for campaigns
CREATE TABLE IF NOT EXISTS email_campaign_recipients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID NOT NULL REFERENCES email_campaigns(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(100),
    department VARCHAR(100),
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed'
    message_id VARCHAR(255),
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    opened_at TIMESTAMPTZ,
    clicked_at TIMESTAMPTZ,
    bounced_at TIMESTAMPTZ,
    error_message TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_email_analytics_organization_id ON email_analytics(organization_id);
CREATE INDEX IF NOT EXISTS idx_email_analytics_event_type ON email_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_email_analytics_timestamp ON email_analytics(timestamp);
CREATE INDEX IF NOT EXISTS idx_email_analytics_template ON email_analytics(template);
CREATE INDEX IF NOT EXISTS idx_email_analytics_recipient ON email_analytics(recipient);

CREATE INDEX IF NOT EXISTS idx_email_monitoring_organization_id ON email_monitoring(organization_id);
CREATE INDEX IF NOT EXISTS idx_email_monitoring_message_id ON email_monitoring(message_id);
CREATE INDEX IF NOT EXISTS idx_email_monitoring_template ON email_monitoring(template);
CREATE INDEX IF NOT EXISTS idx_email_monitoring_created_at ON email_monitoring(created_at);

CREATE INDEX IF NOT EXISTS idx_email_alerts_organization_id ON email_alerts(organization_id);
CREATE INDEX IF NOT EXISTS idx_email_alerts_type ON email_alerts(type);
CREATE INDEX IF NOT EXISTS idx_email_alerts_severity ON email_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_email_alerts_created_at ON email_alerts(created_at);
CREATE INDEX IF NOT EXISTS idx_email_alerts_resolved ON email_alerts(resolved);

CREATE INDEX IF NOT EXISTS idx_email_templates_name ON email_templates(name);
CREATE INDEX IF NOT EXISTS idx_email_templates_category ON email_templates(category);
CREATE INDEX IF NOT EXISTS idx_email_templates_organization_id ON email_templates(organization_id);
CREATE INDEX IF NOT EXISTS idx_email_templates_active ON email_templates(is_active);

CREATE INDEX IF NOT EXISTS idx_email_campaigns_organization_id ON email_campaigns(organization_id);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_status ON email_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_scheduled_at ON email_campaigns(scheduled_at);

CREATE INDEX IF NOT EXISTS idx_email_campaign_recipients_campaign_id ON email_campaign_recipients(campaign_id);
CREATE INDEX IF NOT EXISTS idx_email_campaign_recipients_email ON email_campaign_recipients(email);
CREATE INDEX IF NOT EXISTS idx_email_campaign_recipients_status ON email_campaign_recipients(status);
CREATE INDEX IF NOT EXISTS idx_email_campaign_recipients_message_id ON email_campaign_recipients(message_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_email_monitoring_updated_at BEFORE UPDATE ON email_monitoring FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON email_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_email_campaigns_updated_at BEFORE UPDATE ON email_campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_email_campaign_recipients_updated_at BEFORE UPDATE ON email_campaign_recipients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default email templates
INSERT INTO email_templates (name, display_name, description, category, subject_template, html_template, text_template, variables) VALUES
(
    'survey_invitation',
    'Survey Invitation',
    'Email template for inviting users to participate in surveys',
    'survey',
    '[{{organizationName}}] Survey: {{surveyTitle}}',
    '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>{{subject}}</title></head><body><h1>{{surveyTitle}}</h1><p>Hi {{firstName}},</p><p>You are invited to participate in a survey.</p><a href="{{magicLinkUrl}}">Start Survey</a></body></html>',
    '{{surveyTitle}}\n\nHi {{firstName}},\n\nYou are invited to participate in a survey.\n\nStart Survey: {{magicLinkUrl}}',
    '["organizationName", "surveyTitle", "firstName", "magicLinkUrl", "estimatedTime"]'
),
(
    'survey_reminder',
    'Survey Reminder',
    'Email template for reminding users about incomplete surveys',
    'survey',
    '[{{organizationName}}] Reminder: {{surveyTitle}}',
    '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>{{subject}}</title></head><body><h1>Reminder: {{surveyTitle}}</h1><p>Hi {{firstName}},</p><p>This is a reminder to complete the survey.</p><a href="{{magicLinkUrl}}">Complete Survey</a></body></html>',
    'Reminder: {{surveyTitle}}\n\nHi {{firstName}},\n\nThis is a reminder to complete the survey.\n\nComplete Survey: {{magicLinkUrl}}',
    '["organizationName", "surveyTitle", "firstName", "magicLinkUrl", "daysRemaining"]'
),
(
    'survey_completion',
    'Survey Completion',
    'Email template for confirming survey completion',
    'survey',
    '[{{organizationName}}] Thank you for completing {{surveyTitle}}',
    '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>{{subject}}</title></head><body><h1>Thank you!</h1><p>Hi {{firstName}},</p><p>Thank you for completing the survey. Your feedback is valuable to us.</p></body></html>',
    'Thank you!\n\nHi {{firstName}},\n\nThank you for completing the survey. Your feedback is valuable to us.',
    '["organizationName", "surveyTitle", "firstName"]'
),
(
    'welcome',
    'Welcome Email',
    'Email template for welcoming new users',
    'onboarding',
    'Welcome to {{organizationName}}!',
    '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>{{subject}}</title></head><body><h1>Welcome to {{organizationName}}!</h1><p>Hi {{firstName}},</p><p>Welcome to our platform. We are excited to have you on board.</p></body></html>',
    'Welcome to {{organizationName}}!\n\nHi {{firstName}},\n\nWelcome to our platform. We are excited to have you on board.',
    '["organizationName", "firstName", "verificationLink"]'
),
(
    'workshop_invitation',
    'Workshop Invitation',
    'Email template for inviting users to workshops',
    'workshop',
    '[{{organizationName}}] Workshop Invitation: {{workshopTitle}}',
    '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>{{subject}}</title></head><body><h1>Workshop Invitation</h1><p>Hi {{firstName}},</p><p>You are invited to attend: {{workshopTitle}}</p><a href="{{workshopLink}}">View Workshop</a></body></html>',
    'Workshop Invitation\n\nHi {{firstName}},\n\nYou are invited to attend: {{workshopTitle}}\n\nView Workshop: {{workshopLink}}',
    '["organizationName", "workshopTitle", "firstName", "workshopLink", "workshopDate"]'
),
(
    'announcement',
    'Announcement',
    'Email template for general announcements',
    'announcement',
    '[{{organizationName}}] {{announcementTitle}}',
    '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>{{subject}}</title></head><body><h1>{{announcementTitle}}</h1><p>Hi {{firstName}},</p><p>{{announcementContent}}</p></body></html>',
    '{{announcementTitle}}\n\nHi {{firstName}},\n\n{{announcementContent}}',
    '["organizationName", "announcementTitle", "firstName", "announcementContent"]'
),
(
    'magic_link',
    'Magic Link',
    'Email template for magic link authentication',
    'authentication',
    '[{{organizationName}}] Your secure link',
    '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>{{subject}}</title></head><body><h1>Your Secure Link</h1><p>Hi {{firstName}},</p><p>Click the link below to access your secure content:</p><a href="{{magicLinkUrl}}">Access Link</a></body></html>',
    'Your Secure Link\n\nHi {{firstName}},\n\nClick the link below to access your secure content:\n\nAccess Link: {{magicLinkUrl}}',
    '["organizationName", "firstName", "magicLinkUrl", "expiresAt"]'
)
ON CONFLICT (name) DO NOTHING;

-- Create RLS policies for multi-tenant access
ALTER TABLE email_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_monitoring ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaign_recipients ENABLE ROW LEVEL SECURITY;

-- Email Analytics RLS Policies
CREATE POLICY "Users can view email analytics for their organization" ON email_analytics
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM org_memberships 
            WHERE user_id = auth.uid()::text
        )
    );

CREATE POLICY "Service role can manage email analytics" ON email_analytics
    FOR ALL USING (auth.role() = 'service_role');

-- Email Monitoring RLS Policies
CREATE POLICY "Users can view email monitoring for their organization" ON email_monitoring
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM org_memberships 
            WHERE user_id = auth.uid()::text
        )
    );

CREATE POLICY "Service role can manage email monitoring" ON email_monitoring
    FOR ALL USING (auth.role() = 'service_role');

-- Email Alerts RLS Policies
CREATE POLICY "Users can view email alerts for their organization" ON email_alerts
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM org_memberships 
            WHERE user_id = auth.uid()::text
        )
    );

CREATE POLICY "Users can update email alerts for their organization" ON email_alerts
    FOR UPDATE USING (
        organization_id IN (
            SELECT organization_id FROM org_memberships 
            WHERE user_id = auth.uid()::text
        )
    );

CREATE POLICY "Service role can manage email alerts" ON email_alerts
    FOR ALL USING (auth.role() = 'service_role');

-- Email Templates RLS Policies
CREATE POLICY "Users can view global and organization email templates" ON email_templates
    FOR SELECT USING (
        organization_id IS NULL OR 
        organization_id IN (
            SELECT organization_id FROM org_memberships 
            WHERE user_id = auth.uid()::text
        )
    );

CREATE POLICY "Users can manage email templates for their organization" ON email_templates
    FOR ALL USING (
        organization_id IN (
            SELECT organization_id FROM org_memberships 
            WHERE user_id = auth.uid()::text AND role IN ('admin', 'manager')
        )
    );

CREATE POLICY "Service role can manage email templates" ON email_templates
    FOR ALL USING (auth.role() = 'service_role');

-- Email Campaigns RLS Policies
CREATE POLICY "Users can view email campaigns for their organization" ON email_campaigns
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM org_memberships 
            WHERE user_id = auth.uid()::text
        )
    );

CREATE POLICY "Users can manage email campaigns for their organization" ON email_campaigns
    FOR ALL USING (
        organization_id IN (
            SELECT organization_id FROM org_memberships 
            WHERE user_id = auth.uid()::text AND role IN ('admin', 'manager')
        )
    );

CREATE POLICY "Service role can manage email campaigns" ON email_campaigns
    FOR ALL USING (auth.role() = 'service_role');

-- Email Campaign Recipients RLS Policies
CREATE POLICY "Users can view email campaign recipients for their organization" ON email_campaign_recipients
    FOR SELECT USING (
        campaign_id IN (
            SELECT id FROM email_campaigns 
            WHERE organization_id IN (
                SELECT organization_id FROM org_memberships 
                WHERE user_id = auth.uid()::text
            )
        )
    );

CREATE POLICY "Service role can manage email campaign recipients" ON email_campaign_recipients
    FOR ALL USING (auth.role() = 'service_role');

-- Create views for common queries
CREATE OR REPLACE VIEW email_performance_summary AS
SELECT 
    ea.organization_id,
    o.name as organization_name,
    DATE_TRUNC('day', ea.timestamp) as date,
    ea.template,
    COUNT(*) as total_events,
    COUNT(*) FILTER (WHERE ea.event_type = 'email_sent') as emails_sent,
    COUNT(*) FILTER (WHERE ea.event_type = 'email_delivered') as emails_delivered,
    COUNT(*) FILTER (WHERE ea.event_type = 'email_opened') as emails_opened,
    COUNT(*) FILTER (WHERE ea.event_type = 'email_clicked') as emails_clicked,
    COUNT(*) FILTER (WHERE ea.event_type = 'email_bounced') as emails_bounced,
    COUNT(*) FILTER (WHERE ea.event_type = 'email_failed') as emails_failed,
    ROUND(
        (COUNT(*) FILTER (WHERE ea.event_type = 'email_delivered')::DECIMAL / 
         NULLIF(COUNT(*) FILTER (WHERE ea.event_type = 'email_sent'), 0)) * 100, 2
    ) as delivery_rate,
    ROUND(
        (COUNT(*) FILTER (WHERE ea.event_type = 'email_opened')::DECIMAL / 
         NULLIF(COUNT(*) FILTER (WHERE ea.event_type = 'email_delivered'), 0)) * 100, 2
    ) as open_rate,
    ROUND(
        (COUNT(*) FILTER (WHERE ea.event_type = 'email_clicked')::DECIMAL / 
         NULLIF(COUNT(*) FILTER (WHERE ea.event_type = 'email_opened'), 0)) * 100, 2
    ) as click_rate,
    ROUND(
        (COUNT(*) FILTER (WHERE ea.event_type = 'email_bounced')::DECIMAL / 
         NULLIF(COUNT(*) FILTER (WHERE ea.event_type = 'email_sent'), 0)) * 100, 2
    ) as bounce_rate
FROM email_analytics ea
JOIN organizations o ON ea.organization_id = o.id
GROUP BY ea.organization_id, o.name, DATE_TRUNC('day', ea.timestamp), ea.template
ORDER BY date DESC, ea.organization_id, ea.template;

-- Create function to clean up old data
CREATE OR REPLACE FUNCTION cleanup_old_email_data(days_to_keep INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER := 0;
BEGIN
    -- Clean up old email analytics
    DELETE FROM email_analytics 
    WHERE created_at < NOW() - INTERVAL '1 day' * days_to_keep;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    -- Clean up old email monitoring data
    DELETE FROM email_monitoring 
    WHERE created_at < NOW() - INTERVAL '1 day' * days_to_keep;
    
    -- Clean up old resolved alerts
    DELETE FROM email_alerts 
    WHERE resolved = true AND created_at < NOW() - INTERVAL '1 day' * days_to_keep;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Create function to get email performance metrics
CREATE OR REPLACE FUNCTION get_email_performance_metrics(
    p_organization_id UUID,
    p_days INTEGER DEFAULT 30
)
RETURNS TABLE (
    template VARCHAR(100),
    total_sent BIGINT,
    total_delivered BIGINT,
    total_opened BIGINT,
    total_clicked BIGINT,
    total_bounced BIGINT,
    delivery_rate NUMERIC,
    open_rate NUMERIC,
    click_rate NUMERIC,
    bounce_rate NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ea.template,
        COUNT(*) FILTER (WHERE ea.event_type = 'email_sent') as total_sent,
        COUNT(*) FILTER (WHERE ea.event_type = 'email_delivered') as total_delivered,
        COUNT(*) FILTER (WHERE ea.event_type = 'email_opened') as total_opened,
        COUNT(*) FILTER (WHERE ea.event_type = 'email_clicked') as total_clicked,
        COUNT(*) FILTER (WHERE ea.event_type = 'email_bounced') as total_bounced,
        ROUND(
            (COUNT(*) FILTER (WHERE ea.event_type = 'email_delivered')::DECIMAL / 
             NULLIF(COUNT(*) FILTER (WHERE ea.event_type = 'email_sent'), 0)) * 100, 2
        ) as delivery_rate,
        ROUND(
            (COUNT(*) FILTER (WHERE ea.event_type = 'email_opened')::DECIMAL / 
             NULLIF(COUNT(*) FILTER (WHERE ea.event_type = 'email_delivered'), 0)) * 100, 2
        ) as open_rate,
        ROUND(
            (COUNT(*) FILTER (WHERE ea.event_type = 'email_clicked')::DECIMAL / 
             NULLIF(COUNT(*) FILTER (WHERE ea.event_type = 'email_opened'), 0)) * 100, 2
        ) as click_rate,
        ROUND(
            (COUNT(*) FILTER (WHERE ea.event_type = 'email_bounced')::DECIMAL / 
             NULLIF(COUNT(*) FILTER (WHERE ea.event_type = 'email_sent'), 0)) * 100, 2
        ) as bounce_rate
    FROM email_analytics ea
    WHERE ea.organization_id = p_organization_id
      AND ea.timestamp >= NOW() - INTERVAL '1 day' * p_days
    GROUP BY ea.template
    ORDER BY total_sent DESC;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON email_analytics TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON email_monitoring TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON email_alerts TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON email_templates TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON email_campaigns TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON email_campaign_recipients TO authenticated;

GRANT ALL ON email_analytics TO service_role;
GRANT ALL ON email_monitoring TO service_role;
GRANT ALL ON email_alerts TO service_role;
GRANT ALL ON email_templates TO service_role;
GRANT ALL ON email_campaigns TO service_role;
GRANT ALL ON email_campaign_recipients TO service_role;

GRANT SELECT ON email_performance_summary TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_old_email_data TO service_role;
GRANT EXECUTE ON FUNCTION get_email_performance_metrics TO authenticated;
