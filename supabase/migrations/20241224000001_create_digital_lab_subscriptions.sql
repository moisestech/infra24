-- Create digital_lab_subscriptions table
CREATE TABLE IF NOT EXISTS digital_lab_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  source VARCHAR(100) NOT NULL DEFAULT 'digital_lab_page',
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'unsubscribed')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_digital_lab_subscriptions_email ON digital_lab_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_digital_lab_subscriptions_status ON digital_lab_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_digital_lab_subscriptions_organization_id ON digital_lab_subscriptions(organization_id);
CREATE INDEX IF NOT EXISTS idx_digital_lab_subscriptions_created_at ON digital_lab_subscriptions(created_at);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_digital_lab_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_digital_lab_subscriptions_updated_at
  BEFORE UPDATE ON digital_lab_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_digital_lab_subscriptions_updated_at();

-- Add RLS policies
ALTER TABLE digital_lab_subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow public read access for checking subscription status
CREATE POLICY "Allow public read access for subscription status" ON digital_lab_subscriptions
  FOR SELECT USING (true);

-- Allow public insert for new subscriptions
CREATE POLICY "Allow public insert for new subscriptions" ON digital_lab_subscriptions
  FOR INSERT WITH CHECK (true);

-- Allow public update for unsubscribing
CREATE POLICY "Allow public update for unsubscribing" ON digital_lab_subscriptions
  FOR UPDATE USING (true);

-- Allow admins full access (simplified for now)
CREATE POLICY "Allow admins full access" ON digital_lab_subscriptions
  FOR ALL USING (true);
