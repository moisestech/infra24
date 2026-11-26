-- Private identity proof, founder decision and at-most-once provider write.
create table public.dcc_identity_reviews (
  binding_id uuid primary key references public.dcc_platform_member_bindings(id),
  version integer not null default 0,
  stage text not null default 'held' check (stage in
    ('held','returned','rejected','awaiting_proof','proven','confirming','uncertain','resolved')),
  person_id text unique check (person_id ~ '^rec[A-Za-z0-9]{14}$'),
  method text check (method in ('in_person','established_channel')),
  challenge_digest text,
  primary_stamp text,
  expires_at timestamptz
);
create table public.dcc_identity_review_audit (
  id bigint generated always as identity primary key,
  binding_id uuid not null references public.dcc_identity_reviews(binding_id),
  version integer not null,
  actor_subject text not null,
  action text not null,
  person_id text,
  method text,
  created_at timestamptz not null default now(),
  unique(binding_id,version)
);
alter table public.dcc_identity_reviews enable row level security;
alter table public.dcc_identity_review_audit enable row level security;
revoke all on public.dcc_identity_reviews, public.dcc_identity_review_audit from public,anon,authenticated,service_role;
revoke all on sequence public.dcc_identity_review_audit_id_seq from public,anon,authenticated,service_role;
grant select on public.dcc_identity_reviews, public.dcc_identity_review_audit to service_role;

-- Provider credentials and the actor come only from server-side authenticated handlers.
-- Reconciliation worker also locks job before binding. One-to-one reservation is
-- enforced in both the review ledger and the canonical unique airtable_person_id.
create function public.dcc_identity_review_step(
  p_instance text, p_binding uuid, p_actor text, p_action text, p_version integer,
  p_person text default null, p_method text default null, p_digest text default null,
  p_primary text default null, p_existing boolean default false
) returns integer language plpgsql security definer set search_path='' as $$
declare
  b public.dcc_platform_member_bindings%rowtype;
  j public.dcc_member_reconcile_jobs%rowtype;
  r public.dcc_identity_reviews%rowtype;
  next_stage text;
begin
  select * into j from public.dcc_member_reconcile_jobs where binding_id=p_binding for update;
  select * into b from public.dcc_platform_member_bindings
    where id=p_binding and clerk_instance=p_instance for update;
  if j.binding_id is null or b.id is null or b.verified_at is null or p_actor is null
    or length(p_actor)<6 or b.state not in ('review_required','pending_reconciliation')
    or (p_action='prove') is distinct from (p_actor=b.clerk_user_id)
    then raise exception 'ineligible_identity_review' using errcode='23514'; end if;

  if j.status='processing' and j.started_at < now()-interval '10 minutes'
     and b.state='pending_reconciliation' and p_action='challenge' and p_existing is true then
    -- The founder located exactly one existing provider binding. Fence the expired
    -- automatic attempt before taking ownership of its positive readback.
    update public.dcc_member_reconcile_jobs set status='review_required',
      audit_reason='provider_outcome_uncertain',finalized_at=now() where binding_id=p_binding;
    update public.dcc_platform_member_bindings set state='review_required',updated_at=now()
      where id=p_binding;
  elsif j.status<>'review_required' or b.state<>'review_required' then
    raise exception 'reconciliation_in_progress' using errcode='23514';
  end if;

  insert into public.dcc_identity_reviews(binding_id) values(p_binding) on conflict do nothing;
  select * into strict r from public.dcc_identity_reviews where binding_id=p_binding for update;
  if r.version is distinct from p_version then
    raise exception 'identity_revision_conflict' using errcode='40001'; end if;

  if p_action='challenge' and r.stage in ('held','returned','rejected','awaiting_proof','proven') then
    if p_person is null or p_person !~ '^rec[A-Za-z0-9]{14}$' or p_method is null
      or p_method not in ('in_person','established_channel')
      or p_digest is null or p_digest !~ '^[0-9a-f]{64}$'
      or p_primary is null or p_primary !~ '^[0-9a-f]{64}$'
      or (coalesce(j.audit_reason,'') <> 'legacy_people_email_collision' and p_existing is not true)
      or exists(select 1 from public.dcc_platform_member_bindings where airtable_person_id=p_person and id<>p_binding)
      then raise exception 'identity_candidate_not_confirmed' using errcode='23514'; end if;
    update public.dcc_identity_reviews set person_id=p_person,method=p_method,
      challenge_digest=p_digest,primary_stamp=p_primary,expires_at=now()+interval '30 minutes'
      where binding_id=p_binding;
    next_stage:='awaiting_proof';
  elsif p_action in ('hold','return','reject') and r.stage in ('held','returned','rejected','awaiting_proof','proven') then
    update public.dcc_identity_reviews set person_id=null,method=null,challenge_digest=null,
      primary_stamp=null,expires_at=null where binding_id=p_binding;
    next_stage:=case p_action when 'hold' then 'held' when 'return' then 'returned' else 'rejected' end;
  elsif p_action='prove' and r.stage='awaiting_proof' and r.expires_at>now()
    and r.primary_stamp=p_primary and r.challenge_digest=p_digest then
    update public.dcc_identity_reviews set challenge_digest=null where binding_id=p_binding;
    next_stage:='proven';
  elsif p_action='approve' and r.stage='proven' and r.expires_at>now()
    and r.primary_stamp=p_primary and r.person_id=p_person then
    update public.dcc_platform_member_bindings set airtable_person_id=r.person_id,updated_at=now()
      where id=p_binding and airtable_person_id is null;
    if not found then raise exception 'identity_already_reserved' using errcode='23514'; end if;
    next_stage:='confirming';
  elsif p_action='uncertain' and r.stage='confirming' then
    next_stage:='uncertain';
  elsif p_action='confirm' and r.stage in ('confirming','uncertain')
    and p_existing is true and r.person_id=p_person and b.airtable_person_id=r.person_id
    and r.primary_stamp=p_primary then
    update public.dcc_platform_member_bindings set state='active',activated_at=now(),updated_at=now()
      where id=p_binding and state='review_required';
    update public.dcc_member_reconcile_jobs set status='active',finalized_at=now(),
      audit_reason='founder_identity_confirmed' where binding_id=p_binding;
    next_stage:='resolved';
  else
    raise exception 'invalid_identity_transition' using errcode='23514';
  end if;

  update public.dcc_identity_reviews set version=version+1,stage=next_stage where binding_id=p_binding;
  insert into public.dcc_identity_review_audit(binding_id,version,actor_subject,action,person_id,method)
    values(p_binding,r.version+1,p_actor,p_action,coalesce(p_person,r.person_id),coalesce(p_method,r.method));
  return r.version+1;
end $$;
revoke all on function public.dcc_identity_review_step(text,uuid,text,text,integer,text,text,text,text,boolean)
  from public,anon,authenticated;
grant execute on function public.dcc_identity_review_step(text,uuid,text,text,integer,text,text,text,text,boolean)
  to service_role;

-- Include expired worker claims even when a provider timeout prevented SQL finalization.
create function public.dcc_founder_identity_queue(p_instance text)
returns table(binding_id uuid,verified boolean,updated_at timestamptz,audit_reason text,
  job_status text,stage text,version integer,expires_at timestamptz)
language sql stable security invoker set search_path='' as $$
  select b.id,b.verified_at is not null,b.updated_at,j.audit_reason,j.status,
    coalesce(r.stage,'held'),coalesce(r.version,0),r.expires_at
  from public.dcc_platform_member_bindings b join public.dcc_member_reconcile_jobs j on j.binding_id=b.id
  left join public.dcc_identity_reviews r on r.binding_id=b.id
  where b.clerk_instance=p_instance and (b.state='review_required' or
    (b.state='pending_reconciliation' and j.status='processing' and j.started_at<now()-interval '10 minutes'))
  order by b.updated_at,b.id limit 50
$$;
revoke all on function public.dcc_founder_identity_queue(text) from public,anon,authenticated;
grant execute on function public.dcc_founder_identity_queue(text) to service_role;
