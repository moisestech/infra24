-- Private member-controlled Passport drafts and reviewed sculpture snapshots.
-- STAGED ONLY: does not auto-publish any record or turn a Clerk row into an active People member.
create table if not exists public.dcc_member_profile_drafts (
  binding_id uuid primary key references public.dcc_platform_member_bindings(id) on delete restrict,
  display_name text not null default '' check(length(display_name)<=80),
  summary text not null default '' check(length(summary)<=280),
  practices jsonb not null default '[]'::jsonb check(jsonb_typeof(practices)='array'),
  interests jsonb not null default '[]'::jsonb check(jsonb_typeof(interests)='array'),
  public_links jsonb not null default '[]'::jsonb check(jsonb_typeof(public_links)='array'),
  revision integer not null default 1 check(revision > 0),
  public_request_state text not null default 'private'
    check(public_request_state in ('private','pending_review','withdrawal_requested')),
  request_disclosure_version text,
  public_requested_at timestamptz,
  updated_at timestamptz not null default now()
);
-- Every submitted change (including a fresh publication request or withdrawal)
-- must advance the revision so a reviewer can reject stale submissions.
create or replace function public.dcc_bump_member_profile_revision()
returns trigger language plpgsql security invoker set search_path = ''
as $
begin
  new.revision := old.revision + 1;
  return new;
end
$;
revoke all on function public.dcc_bump_member_profile_revision() from public, anon, authenticated;
drop trigger if exists dcc_member_profile_revision_bump on public.dcc_member_profile_drafts;
create trigger dcc_member_profile_revision_bump
before update on public.dcc_member_profile_drafts
for each row execute function public.dcc_bump_member_profile_revision();

alter table public.dcc_member_profile_drafts enable row level security;
revoke all on public.dcc_member_profile_drafts from public, anon, authenticated;
grant select,insert,update on public.dcc_member_profile_drafts to service_role;
-- A reviewed aggregate is emitted only through an independent STEWARD batch.
create table if not exists public.dcc_public_sculpture_snapshots (
  snapshot_week text primary key check(snapshot_week ~ '^[0-9]{4}-W[0-9]{2}$'),
  cohort_state text not null check(cohort_state in ('suppressed','coarsened')),
  website_presence_marks integer check(website_presence_marks is null or website_presence_marks between 0 and 1024),
  aggregate_cutoff_at timestamptz not null,
  published_at timestamptz not null,
  approved_by text not null,
  constraint dcc_snapshot_delay check(published_at >= aggregate_cutoff_at + interval '7 days'),
  constraint dcc_snapshot_bucket check(
    (cohort_state='suppressed' and website_presence_marks is null)
    or (cohort_state='coarsened' and website_presence_marks >= 5 and website_presence_marks % 5 = 0)
  )
);
alter table public.dcc_public_sculpture_snapshots enable row level security;
revoke all on public.dcc_public_sculpture_snapshots from public,anon,authenticated;
grant select,insert,update on public.dcc_public_sculpture_snapshots to service_role;
comment on table public.dcc_member_profile_drafts is
  'Authenticated owner draft only, never serialized into public sculpture. Every change requires renewed publication review.';
comment on table public.dcc_public_sculpture_snapshots is
  'Independently reviewed delayed aggregate website-member snapshots; cannot be written by signup webhooks.';
