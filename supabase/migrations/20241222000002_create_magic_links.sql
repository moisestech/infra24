-- Create magic links table for survey access
CREATE TABLE IF NOT EXISTS magic_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  token TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  survey_id UUID REFERENCES surveys(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  used_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create magic link analytics table
CREATE TABLE IF NOT EXISTS magic_link_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  token TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('opened', 'started', 'completed')),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_magic_links_token ON magic_links(token);
CREATE INDEX IF NOT EXISTS idx_magic_links_email ON magic_links(email);
CREATE INDEX IF NOT EXISTS idx_magic_links_survey_id ON magic_links(survey_id);
CREATE INDEX IF NOT EXISTS idx_magic_links_expires_at ON magic_links(expires_at);
CREATE INDEX IF NOT EXISTS idx_magic_links_used ON magic_links(used);

CREATE INDEX IF NOT EXISTS idx_magic_link_analytics_token ON magic_link_analytics(token);
CREATE INDEX IF NOT EXISTS idx_magic_link_analytics_action ON magic_link_analytics(action);
CREATE INDEX IF NOT EXISTS idx_magic_link_analytics_timestamp ON magic_link_analytics(timestamp);

-- Enable RLS
ALTER TABLE magic_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE magic_link_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for magic_links
CREATE POLICY "Magic links are accessible by organization members" ON magic_links
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id 
      FROM org_memberships 
      WHERE user_id::text = auth.uid()::text
    )
  );

-- RLS Policies for magic_link_analytics
CREATE POLICY "Magic link analytics are accessible by organization members" ON magic_link_analytics
  FOR ALL USING (
    token IN (
      SELECT token 
      FROM magic_links 
      WHERE organization_id IN (
        SELECT organization_id 
        FROM org_memberships 
        WHERE user_id::text = auth.uid()::text
      )
    )
  );

-- Function to clean up expired magic links
CREATE OR REPLACE FUNCTION cleanup_expired_magic_links()
RETURNS void AS $$
BEGIN
  DELETE FROM magic_links 
  WHERE expires_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to clean up expired links (if pg_cron is available)
-- SELECT cron.schedule('cleanup-magic-links', '0 2 * * *', 'SELECT cleanup_expired_magic_links();');

-- Add trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_magic_links_updated_at
  BEFORE UPDATE ON magic_links
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
