-- Extend playlist items for artist spotlight slides on displays

ALTER TABLE playlist_items DROP CONSTRAINT IF EXISTS playlist_items_item_kind_check;

ALTER TABLE playlist_items ADD CONSTRAINT playlist_items_item_kind_check CHECK (
  item_kind IN (
    'announcement',
    'media',
    'dynamic_announcements',
    'workshop_promo',
    'artist_spotlight'
  )
);

ALTER TABLE playlist_items
  ADD COLUMN IF NOT EXISTS artist_profile_id UUID REFERENCES artist_profiles(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_playlist_items_artist_profile_id ON playlist_items(artist_profile_id);
