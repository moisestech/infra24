-- Create survey_distributions table to track bulk email distributions
CREATE TABLE IF NOT EXISTS survey_distributions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  survey_id UUID NOT NULL REFERENCES submission_forms(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  distributed_by TEXT NOT NULL, -- Clerk user ID
  email_count INTEGER NOT NULL DEFAULT 0,
  successful_count INTEGER NOT NULL DEFAULT 0,
  failed_count INTEGER NOT NULL DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_survey_distributions_survey_id ON survey_distributions(survey_id);
CREATE INDEX IF NOT EXISTS idx_survey_distributions_organization_id ON survey_distributions(organization_id);
CREATE INDEX IF NOT EXISTS idx_survey_distributions_distributed_by ON survey_distributions(distributed_by);
CREATE INDEX IF NOT EXISTS idx_survey_distributions_created_at ON survey_distributions(created_at);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_survey_distributions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_survey_distributions_updated_at
  BEFORE UPDATE ON survey_distributions
  FOR EACH ROW
  EXECUTE FUNCTION update_survey_distributions_updated_at();

-- Enable RLS
ALTER TABLE survey_distributions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow organization members to view distributions" ON survey_distributions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM org_memberships 
      WHERE org_memberships.organization_id = survey_distributions.organization_id 
      AND org_memberships.clerk_user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Allow organization admins to create distributions" ON survey_distributions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM org_memberships 
      WHERE org_memberships.organization_id = survey_distributions.organization_id 
      AND org_memberships.clerk_user_id::text = auth.uid()::text
      AND org_memberships.role IN ('org_admin', 'super_admin', 'moderator')
    )
  );

CREATE POLICY "Allow organization admins to update distributions" ON survey_distributions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM org_memberships 
      WHERE org_memberships.organization_id = survey_distributions.organization_id 
      AND org_memberships.clerk_user_id::text = auth.uid()::text
      AND org_memberships.role IN ('org_admin', 'super_admin', 'moderator')
    )
  );
