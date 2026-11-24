-- DCC UX1: private, atomic Clerk event provenance. No Airtable People writes here.
-- NOT applied to production. This stores pending identities only; active requires
-- a separate verified, reviewer-safe Airtable reconciliation process.
-- The project database was inaccessible during authoring; review/test locally before applying.

create table if not exists public.dcc_platform_member_bindings (
  id uuid primary key default gen_random_uuid(),
  clerk_instance text not null check (length(clerk_instance) between 3 and 160),
  clerk_user_id text not null check (length(clerk_user_id) between 6 and 160),
  account_created_at timestamptz,
  state text not null default 'pending_verification'
    check (state in ('pending_verification','pending_reconciliation','review_required','active','withdrawn','suspended','deleted')),
  verified_at timestamptz,
  activated_at timestamptz,
  airtable_person_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (clerk_instance, clerk_user_id),
  constraint dcc_active_requires_person check (
    state <> 'active' or (verified_at is not null and activated_at is not null and airtable_person_id is not null)
  )
);

create table if not exists public.dcc_clerk_event_receipts (
  clerk_instance text not null check (length(clerk_instance) between 3 and 160),
  event_id text not null check (length(event_id) between 6 and 200),
  event_type text not null check (event_type in ('user.created','user.updated','user.deleted')),
  clerk_user_id text not null,
  received_at timestamptz not null default now(),
  primary key (clerk_instance, event_id)
);

-- Identity records are strictly server-owned, including in legacy projects
-- whose default privileges grant API access to new public tables.
alter table public.dcc_platform_member_bindings enable row level security;
alter table public.dcc_clerk_event_receipts enable row level security;
revoke all on public.dcc_platform_member_bindings from public, anon, authenticated;
revoke all on public.dcc_clerk_event_receipts from public, anon, authenticated;
grant select, insert, update, delete on public.dcc_platform_member_bindings to service_role;
grant select, insert on public.dcc_clerk_event_receipts to service_role;
-- There are intentionally NO anon or authenticated RLS policies.

-- One SQL transaction captures event deduplication AND identity state.
-- Only a server that verified the Svix signature may invoke this through the
-- service-role key. Never expose this RPC to browser tokens.
create or replace function public.dcc_capture_clerk_membership_event(
  p_instance text,
  p_event_id text,
  p_subject text,
  p_event_type text,
  p_account_created_at timestamptz,
  p_email_verified boolean,
  p_cutover timestamptz
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_new_event text;
  v_state text;
begin
  if p_instance is null or length(p_instance) not between 3 and 160
     or p_subject is null or length(p_subject) not between 6 and 160
     or p_event_id is null or length(p_event_id) not between 6 and 200
     or p_event_type not in ('user.created','user.updated','user.deleted')
     or p_cutover is null
     then raise exception 'invalid_clerk_event' using errcode = '22023';
  end if;

  insert into public.dcc_clerk_event_receipts (
    clerk_instance, event_id, clerk_user_id, event_type
  ) values (p_instance,p_event_id,p_subject,p_event_type)
  on conflict do nothing returning event_type into v_new_event;

  if v_new_event is null then
    -- A duplicate CREATE delivered after DELETE must not resurrect the
    -- legacy organization membership in the HTTP handler.
    select state into v_state from public.dcc_platform_member_bindings
      where clerk_instance=p_instance and clerk_user_id=p_subject;
    return coalesce(v_state, 'duplicate');
  end if;

  if p_event_type = 'user.deleted' then
    -- A tombstone exists even if DELETE arrived before CREATE.
    insert into public.dcc_platform_member_bindings
      (clerk_instance,clerk_user_id,state)
    values (p_instance,p_subject,'deleted')
    on conflict (clerk_instance,clerk_user_id) do update
      set state = 'deleted', updated_at = now();
    return 'deleted';
  end if;

  if p_event_type = 'user.created' then
    -- No historical backfill; event arrival time never substitutes for account creation.
    if p_account_created_at is null or p_account_created_at < p_cutover
       or p_account_created_at > now() + interval '5 minutes' then
      return 'pre_cutover_or_invalid';
    end if;

    insert into public.dcc_platform_member_bindings (
      clerk_instance,clerk_user_id,account_created_at,state,verified_at
    ) values (
      p_instance,p_subject,p_account_created_at,
      case when p_email_verified is true then 'pending_reconciliation'
           else 'pending_verification' end,
      case when p_email_verified is true then now() else null end
    ) on conflict (clerk_instance,clerk_user_id) do update
      set updated_at = now()
      -- NEVER overwrite a tombstone, owner binding or reviewer hold on replay.
      where public.dcc_platform_member_bindings.state in
        ('pending_verification','pending_reconciliation');
  elsif p_event_type = 'user.updated' and p_email_verified is true then
    -- UPDATE before CREATE does not auto-enroll, but CREATE can be processed later.
    update public.dcc_platform_member_bindings
       set state = 'pending_reconciliation',
           verified_at = coalesce(verified_at, now()),
           updated_at = now()
     where clerk_instance = p_instance and clerk_user_id = p_subject
       and state = 'pending_verification';
  end if;

  select state into v_state from public.dcc_platform_member_bindings
    where clerk_instance=p_instance and clerk_user_id=p_subject;
  return coalesce(v_state,'not_enrolled');
end
$$;

revoke all on function public.dcc_capture_clerk_membership_event(
  text,text,text,text,timestamptz,boolean,timestamptz
) from public,anon,authenticated;
grant execute on function public.dcc_capture_clerk_membership_event(
  text,text,text,text,timestamptz,boolean,timestamptz
) to service_role;

comment on table public.dcc_platform_member_bindings is
  'Private Clerk identity ledger. A pending row is NOT verified active DCC People membership and never enters the graph.';
comment on table public.dcc_clerk_event_receipts is
  'Deduplicated signed Clerk event receipts, no raw payload/email stored.';
