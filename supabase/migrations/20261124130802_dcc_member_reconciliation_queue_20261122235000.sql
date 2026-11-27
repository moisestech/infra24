-- DCC verified identity → Airtable People provisioning queue.
-- STAGED ONLY. Single global claim serializes all external record creations.
-- Never automatically retry an UNCERTAIN Airtable write: manual review by binding ID.
create table if not exists public.dcc_member_reconcile_mutex (
  singleton boolean primary key default true check (singleton = true),
  lease_token uuid,
  leased_until timestamptz
);
insert into public.dcc_member_reconcile_mutex(singleton)
values(true) on conflict do nothing;

create table if not exists public.dcc_member_reconcile_jobs (
  binding_id uuid primary key references public.dcc_platform_member_bindings(id),
  lease_token uuid not null,
  status text not null check(status in ('processing','active','review_required')),
  started_at timestamptz not null default now(),
  finalized_at timestamptz,
  audit_reason text
);
alter table public.dcc_member_reconcile_mutex enable row level security;
alter table public.dcc_member_reconcile_jobs enable row level security;
revoke all on public.dcc_member_reconcile_mutex from public,anon,authenticated;
revoke all on public.dcc_member_reconcile_jobs from public,anon,authenticated;
grant select,insert,update on public.dcc_member_reconcile_mutex to service_role;
grant select,insert,update on public.dcc_member_reconcile_jobs to service_role;

create or replace function public.dcc_claim_member_reconcile()
returns table(binding_id uuid, clerk_subject text, claim_token uuid)
language plpgsql security definer set search_path = ''
as $$
declare
  v_lock uuid := gen_random_uuid();
  v_subject text;
  v_binding uuid;
begin
  -- If a previous job is stuck after a cross-provider timeout, its job row
  -- remains in 'processing' and is NEVER reissued automatically.
  update public.dcc_member_reconcile_mutex
     set lease_token=v_lock, leased_until=now()+interval '10 minutes'
   where singleton = true
     and (lease_token is null or leased_until < now());
  if not found then return; end if;

  select b.id,b.clerk_user_id into v_binding,v_subject
  from public.dcc_platform_member_bindings b
  left join public.dcc_member_reconcile_jobs j on j.binding_id=b.id
  where b.state='pending_reconciliation' and b.verified_at is not null
    and b.airtable_person_id is null and j.binding_id is null
  order by b.created_at,b.id
  for update of b skip locked
  limit 1;

  if v_binding is null then
    update public.dcc_member_reconcile_mutex
       set lease_token=null, leased_until=null
     where singleton=true and lease_token=v_lock;
    return;
  end if;

  insert into public.dcc_member_reconcile_jobs(binding_id,lease_token,status)
    values(v_binding,v_lock,'processing');
  binding_id:=v_binding; clerk_subject:=v_subject; claim_token:=v_lock;
  return next;
end
$$;

create or replace function public.dcc_finalize_member_reconcile(
  p_binding uuid, p_token uuid, p_action text,
  p_airtable_person_id text default null,
  p_audit_reason text default null
) returns text language plpgsql security definer set search_path = ''
as $$
declare
  v_job public.dcc_member_reconcile_jobs%rowtype;
  v_member public.dcc_platform_member_bindings%rowtype;
begin
  select * into v_job from public.dcc_member_reconcile_jobs
   where binding_id=p_binding for update;
  select * into v_member from public.dcc_platform_member_bindings
   where id=p_binding for update;
  if v_job.binding_id is null or v_job.lease_token is distinct from p_token
    or v_job.status <> 'processing'
    or v_member.id is null or v_member.state <> 'pending_reconciliation'
    then raise exception 'invalid_reconciliation_claim' using errcode='22023';
  end if;

  if p_action = 'active' then
    if v_member.verified_at is null or p_airtable_person_id is null
       or p_airtable_person_id !~ '^rec[A-Za-z0-9]{14}$'
       then raise exception 'verification_or_person_missing' using errcode='22023';
    end if;
    update public.dcc_platform_member_bindings
      set airtable_person_id=p_airtable_person_id,state='active',
          activated_at=now(),updated_at=now()
      where id=p_binding;
    update public.dcc_member_reconcile_jobs set status='active',finalized_at=now()
      where binding_id=p_binding;
  elsif p_action = 'review_required' then
    update public.dcc_platform_member_bindings set state='review_required',updated_at=now()
      where id=p_binding;
    update public.dcc_member_reconcile_jobs
      set status='review_required',finalized_at=now(),audit_reason=left(coalesce(p_audit_reason,'review'),100)
      where binding_id=p_binding;
  else
    raise exception 'invalid_reconciliation_action' using errcode='22023';
  end if;
  update public.dcc_member_reconcile_mutex
    set lease_token=null,leased_until=null
    where singleton=true and lease_token=p_token;
  return p_action;
end
$$;

revoke all on function public.dcc_claim_member_reconcile() from public,anon,authenticated;
revoke all on function public.dcc_finalize_member_reconcile(uuid,uuid,text,text,text)
 from public,anon,authenticated;
grant execute on function public.dcc_claim_member_reconcile() to service_role;
grant execute on function public.dcc_finalize_member_reconcile(uuid,uuid,text,text,text) to service_role;

comment on table public.dcc_member_reconcile_jobs is
 'Human-auditable, at-most-once automatic People creation attempt. Stuck processing jobs require deliberate manual review; never blindly reissue.';
