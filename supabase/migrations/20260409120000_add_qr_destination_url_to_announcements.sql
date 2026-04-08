-- Optional URL smart-sign QR redirects resolve to (stable /scan route → this or primary_link).
ALTER TABLE announcements
  ADD COLUMN IF NOT EXISTS qr_destination_url TEXT;

COMMENT ON COLUMN announcements.qr_destination_url IS 'HTTPS destination for smart-sign QR /o/{slug}/announcements/{id}/scan; falls back to primary_link if null';
