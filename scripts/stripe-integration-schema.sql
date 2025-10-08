-- Stripe Integration Database Schema Updates
-- This script adds payment-related fields to existing booking tables

-- Add payment fields to bookings table
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS payment_required BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS payment_amount DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS payment_currency TEXT DEFAULT 'USD',
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded', 'partially_refunded')),
ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_session_id TEXT,
ADD COLUMN IF NOT EXISTS payment_metadata JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS refund_amount DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS refund_reason TEXT,
ADD COLUMN IF NOT EXISTS refunded_at TIMESTAMP WITH TIME ZONE;

-- Add user role-based pricing fields to resources table
ALTER TABLE resources 
ADD COLUMN IF NOT EXISTS pricing_rules JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS free_for_roles TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS discount_rules JSONB DEFAULT '{}';

-- Create user_roles table for role-based access
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL, -- Clerk user ID
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('public', 'member', 'resident_artist', 'staff', 'admin')),
    granted_by TEXT, -- Clerk user ID who granted the role
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, organization_id, role)
);

-- Create payment_transactions table for detailed payment tracking
CREATE TABLE IF NOT EXISTS payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    stripe_payment_intent_id TEXT NOT NULL,
    stripe_charge_id TEXT,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    status TEXT NOT NULL CHECK (status IN ('requires_payment_method', 'requires_confirmation', 'requires_action', 'processing', 'succeeded', 'canceled')),
    payment_method_types TEXT[],
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create refunds table for refund tracking
CREATE TABLE IF NOT EXISTS refunds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    payment_transaction_id UUID NOT NULL REFERENCES payment_transactions(id) ON DELETE CASCADE,
    stripe_refund_id TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    reason TEXT CHECK (reason IN ('duplicate', 'fraudulent', 'requested_by_customer')),
    status TEXT NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'canceled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX IF NOT EXISTS idx_bookings_stripe_payment_intent ON bookings(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_org ON user_roles(user_id, organization_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_booking ON payment_transactions(booking_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_stripe ON payment_transactions(stripe_payment_intent_id);

-- Add RLS policies for user_roles
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roles" ON user_roles
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Admins can manage all roles" ON user_roles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_roles ur 
            WHERE ur.user_id = auth.uid()::text 
            AND ur.organization_id = user_roles.organization_id 
            AND ur.role = 'admin' 
            AND ur.is_active = true
        )
    );

-- Add RLS policies for payment_transactions
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payment transactions" ON payment_transactions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM bookings b 
            WHERE b.id = payment_transactions.booking_id 
            AND b.user_id = auth.uid()::text
        )
    );

-- Add RLS policies for refunds
ALTER TABLE refunds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own refunds" ON refunds
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM bookings b 
            WHERE b.id = refunds.booking_id 
            AND b.user_id = auth.uid()::text
        )
    );

-- Update existing bookings to have default payment values
UPDATE bookings 
SET payment_required = false, 
    payment_amount = 0.00,
    payment_status = 'paid'
WHERE payment_required IS NULL;

-- Insert sample pricing rules for existing resources
UPDATE resources 
SET pricing_rules = '{
    "public": 50.00,
    "member": 25.00,
    "resident_artist": 0.00,
    "staff": 0.00
}',
free_for_roles = ARRAY['resident_artist', 'staff']
WHERE pricing_rules = '{}' OR pricing_rules IS NULL;

-- Create sample user roles for testing
INSERT INTO user_roles (user_id, organization_id, role, granted_by) VALUES
    ('user_test_artist', (SELECT id FROM organizations WHERE slug = 'oolite'), 'resident_artist', 'system'),
    ('user_test_member', (SELECT id FROM organizations WHERE slug = 'oolite'), 'member', 'system'),
    ('user_test_staff', (SELECT id FROM organizations WHERE slug = 'oolite'), 'staff', 'system')
ON CONFLICT (user_id, organization_id, role) DO NOTHING;
