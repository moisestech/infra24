-- Workshop digest playlist item: resolves to today's sessions for the org (player + resolver)

ALTER TABLE playlist_items DROP CONSTRAINT IF EXISTS playlist_items_item_kind_check;

ALTER TABLE playlist_items ADD CONSTRAINT playlist_items_item_kind_check CHECK (
  item_kind IN (
    'announcement',
    'media',
    'dynamic_announcements',
    'workshop_promo',
    'artist_spotlight',
    'workshop_digest'
  )
);
