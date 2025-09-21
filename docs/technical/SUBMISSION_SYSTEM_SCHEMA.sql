-- Submission System Database Schema for Infra24 Multi-tenant Platform
-- This schema supports submissions for applications, proposals, and content per organization

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Submission forms table (templates for different types of submissions)
CREATE TABLE submission_forms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('application', 'proposal', 'content', 'feedback', 'survey', 'custom')),
    category TEXT,
    form_schema JSONB NOT NULL DEFAULT '{}', -- JSON schema defining form fields
    validation_rules JSONB DEFAULT '{}', -- Validation rules for form fields
    submission_settings JSONB DEFAULT '{}', -- Settings like max submissions, deadlines, etc.
    is_active BOOLEAN DEFAULT true,
    is_public BOOLEAN DEFAULT false, -- Whether external users can submit
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

-- Submissions table
CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    form_id UUID NOT NULL REFERENCES submission_forms(id) ON DELETE CASCADE,
    user_id TEXT, -- Clerk user ID (nullable for anonymous submissions)
    submitter_name TEXT,
    submitter_email TEXT,
    submitter_phone TEXT,
    title TEXT NOT NULL,
    content JSONB NOT NULL DEFAULT '{}', -- The actual submission data
    status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'needs_revision', 'withdrawn')),
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    review_notes TEXT,
    reviewer_id TEXT, -- Clerk user ID of reviewer
    reviewed_at TIMESTAMP WITH TIME ZONE,
    score DECIMAL(5,2), -- Optional scoring system
    tags TEXT[],
    attachments JSONB DEFAULT '[]', -- Array of file attachments
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    submitted_at TIMESTAMP WITH TIME ZONE,
    reviewed_at TIMESTAMP WITH TIME ZONE
);

-- Submission reviews table (for multi-stage review processes)
CREATE TABLE submission_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    reviewer_id TEXT NOT NULL, -- Clerk user ID
    review_stage TEXT NOT NULL, -- e.g., 'initial', 'technical', 'final'
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped')),
    score DECIMAL(5,2),
    comments TEXT,
    recommendations TEXT,
    criteria_scores JSONB DEFAULT '{}', -- Scores for different criteria
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Submission comments table (for discussion and feedback)
CREATE TABLE submission_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL, -- Clerk user ID
    comment TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT true, -- Whether comment is visible to submitter
    parent_comment_id UUID REFERENCES submission_comments(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Submission notifications table
CREATE TABLE submission_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL, -- Clerk user ID
    type TEXT NOT NULL CHECK (type IN ('submitted', 'status_change', 'comment_added', 'deadline_reminder', 'review_assigned')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE
);

-- Submission analytics table
CREATE TABLE submission_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    form_id UUID REFERENCES submission_forms(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    metric_name TEXT NOT NULL,
    metric_value DECIMAL(15,4) NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(organization_id, form_id, date, metric_name)
);

-- Indexes for performance
CREATE INDEX idx_submission_forms_organization_id ON submission_forms(organization_id);
CREATE INDEX idx_submission_forms_type ON submission_forms(type);
CREATE INDEX idx_submission_forms_category ON submission_forms(category);
CREATE INDEX idx_submission_forms_is_active ON submission_forms(is_active);
CREATE INDEX idx_submission_forms_is_public ON submission_forms(is_public);
CREATE INDEX idx_submission_forms_deadline ON submission_forms(submission_deadline);

CREATE INDEX idx_submissions_organization_id ON submissions(organization_id);
CREATE INDEX idx_submissions_form_id ON submissions(form_id);
CREATE INDEX idx_submissions_user_id ON submissions(user_id);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_priority ON submissions(priority);
CREATE INDEX idx_submissions_created_at ON submissions(created_at);
CREATE INDEX idx_submissions_submitted_at ON submissions(submitted_at);
CREATE INDEX idx_submissions_reviewer_id ON submissions(reviewer_id);

CREATE INDEX idx_submission_reviews_submission_id ON submission_reviews(submission_id);
CREATE INDEX idx_submission_reviews_reviewer_id ON submission_reviews(reviewer_id);
CREATE INDEX idx_submission_reviews_stage ON submission_reviews(review_stage);
CREATE INDEX idx_submission_reviews_status ON submission_reviews(status);

CREATE INDEX idx_submission_comments_submission_id ON submission_comments(submission_id);
CREATE INDEX idx_submission_comments_user_id ON submission_comments(user_id);
CREATE INDEX idx_submission_comments_parent_id ON submission_comments(parent_comment_id);
CREATE INDEX idx_submission_comments_created_at ON submission_comments(created_at);

CREATE INDEX idx_submission_notifications_submission_id ON submission_notifications(submission_id);
CREATE INDEX idx_submission_notifications_user_id ON submission_notifications(user_id);
CREATE INDEX idx_submission_notifications_type ON submission_notifications(type);
CREATE INDEX idx_submission_notifications_is_read ON submission_notifications(is_read);

CREATE INDEX idx_submission_analytics_organization_id ON submission_analytics(organization_id);
CREATE INDEX idx_submission_analytics_form_id ON submission_analytics(form_id);
CREATE INDEX idx_submission_analytics_date ON submission_analytics(date);
CREATE INDEX idx_submission_analytics_metric_name ON submission_analytics(metric_name);

-- Row Level Security (RLS) policies
ALTER TABLE submission_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE submission_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE submission_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE submission_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE submission_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for submission_forms
CREATE POLICY "Users can view forms for their organization" ON submission_forms
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM org_memberships 
            WHERE user_id = auth.uid()::text
        ) OR is_public = true
    );

CREATE POLICY "Admins can manage forms for their organization" ON submission_forms
    FOR ALL USING (
        organization_id IN (
            SELECT organization_id FROM org_memberships 
            WHERE user_id = auth.uid()::text AND role IN ('admin', 'manager')
        )
    );

-- RLS Policies for submissions
CREATE POLICY "Users can view submissions for their organization" ON submissions
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM org_memberships 
            WHERE user_id = auth.uid()::text
        ) OR user_id = auth.uid()::text
    );

CREATE POLICY "Users can create submissions for their organization" ON submissions
    FOR INSERT WITH CHECK (
        organization_id IN (
            SELECT organization_id FROM org_memberships 
            WHERE user_id = auth.uid()::text
        ) OR 
        form_id IN (
            SELECT id FROM submission_forms 
            WHERE is_public = true
        )
    );

CREATE POLICY "Users can update their own submissions" ON submissions
    FOR UPDATE USING (
        user_id = auth.uid()::text OR
        organization_id IN (
            SELECT organization_id FROM org_memberships 
            WHERE user_id = auth.uid()::text AND role IN ('admin', 'manager')
        )
    );

-- RLS Policies for submission_reviews
CREATE POLICY "Users can view reviews for their organization submissions" ON submission_reviews
    FOR SELECT USING (
        submission_id IN (
            SELECT id FROM submissions 
            WHERE organization_id IN (
                SELECT organization_id FROM org_memberships 
                WHERE user_id = auth.uid()::text
            )
        )
    );

CREATE POLICY "Reviewers can manage their reviews" ON submission_reviews
    FOR ALL USING (
        reviewer_id = auth.uid()::text OR
        submission_id IN (
            SELECT id FROM submissions 
            WHERE organization_id IN (
                SELECT organization_id FROM org_memberships 
                WHERE user_id = auth.uid()::text AND role IN ('admin', 'manager')
            )
        )
    );

-- RLS Policies for submission_comments
CREATE POLICY "Users can view comments for their organization submissions" ON submission_comments
    FOR SELECT USING (
        submission_id IN (
            SELECT id FROM submissions 
            WHERE organization_id IN (
                SELECT organization_id FROM org_memberships 
                WHERE user_id = auth.uid()::text
            ) OR user_id = auth.uid()::text
        )
    );

CREATE POLICY "Users can manage comments for their organization submissions" ON submission_comments
    FOR ALL USING (
        user_id = auth.uid()::text OR
        submission_id IN (
            SELECT id FROM submissions 
            WHERE organization_id IN (
                SELECT organization_id FROM org_memberships 
                WHERE user_id = auth.uid()::text AND role IN ('admin', 'manager')
            )
        )
    );

-- RLS Policies for submission_notifications
CREATE POLICY "Users can view their own notifications" ON submission_notifications
    FOR SELECT USING (user_id = auth.uid()::text);

CREATE POLICY "Users can update their own notifications" ON submission_notifications
    FOR UPDATE USING (user_id = auth.uid()::text);

CREATE POLICY "System can insert notifications" ON submission_notifications
    FOR INSERT WITH CHECK (true);

-- RLS Policies for submission_analytics
CREATE POLICY "Users can view analytics for their organization" ON submission_analytics
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM org_memberships 
            WHERE user_id = auth.uid()::text
        )
    );

CREATE POLICY "System can insert analytics" ON submission_analytics
    FOR INSERT WITH CHECK (true);

-- Functions for submission management
CREATE OR REPLACE FUNCTION update_submission_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Update submitted_at when status changes to submitted
    IF NEW.status = 'submitted' AND OLD.status != 'submitted' THEN
        NEW.submitted_at = NOW();
    END IF;
    
    -- Update reviewed_at when status changes to reviewed states
    IF NEW.status IN ('approved', 'rejected', 'needs_revision') AND OLD.status NOT IN ('approved', 'rejected', 'needs_revision') THEN
        NEW.reviewed_at = NOW();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update submission timestamps
CREATE TRIGGER trigger_update_submission_status
    BEFORE UPDATE ON submissions
    FOR EACH ROW EXECUTE FUNCTION update_submission_status();

-- Function to generate submission analytics
CREATE OR REPLACE FUNCTION generate_submission_analytics(
    p_organization_id UUID,
    p_form_id UUID DEFAULT NULL,
    p_date DATE DEFAULT CURRENT_DATE
)
RETURNS VOID AS $$
BEGIN
    -- Total submissions for the day
    INSERT INTO submission_analytics (organization_id, form_id, date, metric_name, metric_value)
    SELECT 
        p_organization_id,
        p_form_id,
        p_date,
        'total_submissions',
        COUNT(*)
    FROM submissions
    WHERE organization_id = p_organization_id
    AND (p_form_id IS NULL OR form_id = p_form_id)
    AND DATE(created_at) = p_date
    ON CONFLICT (organization_id, form_id, date, metric_name) 
    DO UPDATE SET metric_value = EXCLUDED.metric_value;
    
    -- Submissions by status
    INSERT INTO submission_analytics (organization_id, form_id, date, metric_name, metric_value)
    SELECT 
        p_organization_id,
        p_form_id,
        p_date,
        'submissions_' || status,
        COUNT(*)
    FROM submissions
    WHERE organization_id = p_organization_id
    AND (p_form_id IS NULL OR form_id = p_form_id)
    AND DATE(created_at) = p_date
    GROUP BY status
    ON CONFLICT (organization_id, form_id, date, metric_name) 
    DO UPDATE SET metric_value = EXCLUDED.metric_value;
    
    -- Average review time
    INSERT INTO submission_analytics (organization_id, form_id, date, metric_name, metric_value)
    SELECT 
        p_organization_id,
        p_form_id,
        p_date,
        'avg_review_time_hours',
        COALESCE(AVG(EXTRACT(EPOCH FROM (reviewed_at - submitted_at)) / 3600), 0)
    FROM submissions
    WHERE organization_id = p_organization_id
    AND (p_form_id IS NULL OR form_id = p_form_id)
    AND DATE(created_at) = p_date
    AND reviewed_at IS NOT NULL
    AND submitted_at IS NOT NULL
    ON CONFLICT (organization_id, form_id, date, metric_name) 
    DO UPDATE SET metric_value = EXCLUDED.metric_value;
    
    -- Approval rate
    INSERT INTO submission_analytics (organization_id, form_id, date, metric_name, metric_value)
    SELECT 
        p_organization_id,
        p_form_id,
        p_date,
        'approval_rate',
        CASE 
            WHEN COUNT(*) = 0 THEN 0
            ELSE (COUNT(*) FILTER (WHERE status = 'approved')::DECIMAL / COUNT(*)) * 100
        END
    FROM submissions
    WHERE organization_id = p_organization_id
    AND (p_form_id IS NULL OR form_id = p_form_id)
    AND DATE(created_at) = p_date
    AND status IN ('approved', 'rejected')
    ON CONFLICT (organization_id, form_id, date, metric_name) 
    DO UPDATE SET metric_value = EXCLUDED.metric_value;
END;
$$ LANGUAGE plpgsql;

-- Function to send submission notifications
CREATE OR REPLACE FUNCTION send_submission_notification(
    p_submission_id UUID,
    p_user_id TEXT,
    p_type TEXT,
    p_title TEXT,
    p_message TEXT
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO submission_notifications (submission_id, user_id, type, title, message)
    VALUES (p_submission_id, p_user_id, p_type, p_title, p_message);
END;
$$ LANGUAGE plpgsql;

