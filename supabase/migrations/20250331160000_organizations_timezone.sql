-- Used by display resolver for workshop_digest "today" boundaries (IANA zone).
ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS timezone VARCHAR(80) DEFAULT 'UTC';
