-- Private first/last-touch DCC entry context. This is marketing provenance,
-- NEVER membership proof, public sculpture identity, or relationship evidence.
create table if not exists public.dcc_member_entry_attribution (
  binding_id uuid primary key references public.dcc_platform_member_bindings(id) on delete restrict,
  first_source text not null,
  first_campaign text,
  first_seen_at timestamptz not null default now(),
  last_source text not null,
  last_campaign text,
  last_seen_at timestamptz not null default now(),
  constraint dcc_source_allowlist check(
    first_source in ('join','network-signup','atlas-add','passport','smart-sign','app-sign-up','event-qr','other')
    and last_source in ('join','network-signup','atlas-add','passport','smart-sign','app-sign-up','event-qr','other')
  )
);
alter table public.dcc_member_entry_attribution enable row level security;
revoke all on public.dcc_member_entry_attribution from public,anon,authenticated;
grant select,insert,update on public.dcc_member_entry_attribution to service_role;

create or replace function public.dcc_capture_member_entry(
  p_binding uuid, p_source text, p_campaign text default null
) returns void language plpgsql security definer set search_path=''
as $$
begin
  if p_source not in ('join','network-signup','atlas-add','passport','smart-sign','app-sign-up','event-qr','other')
     or (p_campaign is not null and (length(p_campaign)>64 or p_campaign !~ '^[a-zA-Z0-9_-]+$'))
     or not exists (
       select 1 from public.dcc_platform_member_bindings
       where id=p_binding and state in ('active','pending_reconciliation')
     )
  then raise exception 'invalid_entry_context' using errcode='22023';
  end if;
  insert into public.dcc_member_entry_attribution (
    binding_id,first_source,first_campaign,last_source,last_campaign
  ) values(p_binding,p_source,p_campaign,p_source,p_campaign)
  on conflict(binding_id) do update set
    last_source=excluded.last_source,
    last_campaign=excluded.last_campaign,
    last_seen_at=now();
end
$$;
revoke all on function public.dcc_capture_member_entry(uuid,text,text) from public,anon,authenticated;
grant execute on function public.dcc_capture_member_entry(uuid,text,text) to service_role;
