-- Film-poster and other marketing rows use type = 'promotion'; legacy check only allowed
-- general | event | workshop | exhibition | fun_fact | news.
ALTER TABLE announcements DROP CONSTRAINT IF EXISTS announcements_type_check;

ALTER TABLE announcements ADD CONSTRAINT announcements_type_check CHECK (
  type IN (
    'general',
    'event',
    'workshop',
    'exhibition',
    'fun_fact',
    'news',
    'promotion',
    'urgent',
    'opportunity',
    'facility',
    'administrative',
    'attention_artists',
    'attention_public',
    'gala_announcement'
  )
);
