-- DCC event RSVPs are isolated from the People CRM.
-- Server-only access via a service-role client; no public table grants.
create table if not exists public.dcc_event_rsvps (
  id uuid primary key default gen_random_uuid(),
  event_id text not null,
  normalized_email text not null,
  full_name text not null,
  status text not null check (status in ('going','maybe','cancelled')),
  email_verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint dcc_event_rsvps_unique_guest unique (event_id, normalized_email),
  constraint dcc_event_rsvps_email_normalized check (normalized_email = lower(btrim(normalized_email)))
);
create table if not exists public.dcc_event_rsvp_tokens (
  id uuid primary key default gen_random_uuid(),
  rsvp_id uuid not null references public.dcc_event_rsvps(id) on delete cascade,
  token_hash text not null unique,
  purpose text not null check (purpose in ('verify','manage')),
  expires_at timestamptz not null,
  consumed_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists dcc_event_rsvp_tokens_lookup on public.dcc_event_rsvp_tokens (rsvp_id, purpose, expires_at);
create table if not exists public.dcc_event_mail_outbox (
  id uuid primary key default gen_random_uuid(),
  rsvp_id uuid not null references public.dcc_event_rsvps(id) on delete cascade,
  message_type text not null check (message_type in ('verify','confirmation','updated','cancelled')),
  token_id uuid references public.dcc_event_rsvp_tokens(id) on delete set null,
  attempts integer not null default 0 check (attempts >= 0),
  next_attempt_at timestamptz not null default now(),
  sent_at timestamptz,
  last_safe_error text,
  created_at timestamptz not null default now(),
  constraint dcc_event_mail_outbox_once unique (rsvp_id, message_type, token_id)
);
create index if not exists dcc_event_mail_outbox_pending on public.dcc_event_mail_outbox (next_attempt_at) where sent_at is null;
alter table public.dcc_event_rsvps enable row level security;
alter table public.dcc_event_rsvp_tokens enable row level security;
alter table public.dcc_event_mail_outbox enable row level security;
revoke all on public.dcc_event_rsvps, public.dcc_event_rsvp_tokens, public.dcc_event_mail_outbox from anon, authenticated;
-- No public policies: operations must be server-side and explicitly authorized.
