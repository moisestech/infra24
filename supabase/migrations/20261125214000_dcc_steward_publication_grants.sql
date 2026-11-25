-- DCC private steward review, revocation-first public release gate.
-- Unapplied until CI/security review; additive; all paths default fail-closed.
alter table public.dcc_member_profile_drafts
  drop constraint if exists dcc_member_profile_drafts_public_request_state_check;
alter table public.dcc_member_profile_drafts
  add constraint dcc_member_profile_drafts_public_request_state_check
  check (public_request_state in ('private','pending_review','review_processing','withdrawal_requested'));

create table if not exists public.dcc_member_publication_grants (
  binding_id uuid primary key references public.dcc_platform_member_bindings(id) on delete restrict,
  airtable_person_id text,
  slug text unique,
  state text not null check (state in ('pending_external','approved','uncertain','withdrawn')),
  claim_token uuid,
  claim_revision integer,
  consent_version text,
  reviewer_subject text,
  approved_at timestamptz,
  updated_at timestamptz not null default now(),
  constraint dcc_approved_grant_requires_binding check (
    state <> 'approved' or (slug is not null and airtable_person_id is not null
      and claim_revision is not null and consent_version is not null
      and approved_at is not null and claim_token is null)
  )
);
create table if not exists public.dcc_member_publication_audit (
  id bigint generated always as identity primary key,
  binding_id uuid not null references public.dcc_platform_member_bindings(id) on delete restrict,
  action text not null check(action in ('claim','approved','uncertain','rejected','returned','withdrawn')),
  revision integer,
  reviewer_subject text,
  created_at timestamptz not null default now()
);
create index if not exists dcc_publication_audit_binding_date_idx
 on public.dcc_member_publication_audit(binding_id,created_at desc);

alter table public.dcc_member_publication_grants enable row level security;
alter table public.dcc_member_publication_audit enable row level security;
revoke all on public.dcc_member_publication_grants from public,anon,authenticated;
revoke all on public.dcc_member_publication_audit from public,anon,authenticated;
grant select,insert,update on public.dcc_member_publication_grants to service_role;
grant select,insert on public.dcc_member_publication_audit to service_role;
revoke all on sequence public.dcc_member_publication_audit_id_seq from public,anon,authenticated;
grant usage,select on sequence public.dcc_member_publication_audit_id_seq to service_role;

-- Reviewer claims are optimistic CAS against the exact member consent revision.
-- An owner edit/withdrawal during the provider write changes the draft revision
-- or state; finalization then refuses to publish.
create or replace function public.dcc_claim_steward_publication(
 p_binding uuid, p_revision integer, p_slug text, p_reviewer text
) returns uuid language plpgsql security definer set search_path=''
as $body$
declare
 v_draft public.dcc_member_profile_drafts%rowtype;
 v_binding public.dcc_platform_member_bindings%rowtype;
 v_token uuid:=gen_random_uuid();
begin
 if p_slug is null or length(p_slug)>100 or
    p_slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$'
    or p_reviewer is null or length(p_reviewer)<6 then
   raise exception 'invalid_publication_claim' using errcode='22023';
 end if;
 select * into v_binding from public.dcc_platform_member_bindings
 where id=p_binding for update;
 select * into v_draft from public.dcc_member_profile_drafts
 where binding_id=p_binding for update;
 if v_binding.state is distinct from 'active'
   or v_binding.verified_at is null or v_binding.airtable_person_id is null
   or v_draft.public_request_state is distinct from 'pending_review'
   or v_draft.revision is distinct from p_revision
   or v_draft.request_disclosure_version is distinct from 'dcc-public-profile-request-v1-2026-11-22'
   or v_draft.public_requested_at is null
   or length(trim(v_draft.display_name))<2
   or length(trim(v_draft.summary))<10
   or jsonb_array_length(v_draft.practices)=0
 then raise exception 'stale_or_ineligible_publication' using errcode='23514';
 end if;
 update public.dcc_member_profile_drafts
 set public_request_state='review_processing',updated_at=now()
 where binding_id=p_binding and revision=p_revision
 and public_request_state='pending_review';
 if not found then raise exception 'revision_conflict' using errcode='40001'; end if;
 insert into public.dcc_member_publication_grants
 (binding_id,airtable_person_id,slug,state,claim_token,claim_revision,consent_version,reviewer_subject,approved_at,updated_at)
 values (p_binding,v_binding.airtable_person_id,p_slug,'pending_external',v_token,
 p_revision+1,v_draft.request_disclosure_version,p_reviewer,null,now())
 on conflict (binding_id) do update set
 airtable_person_id=excluded.airtable_person_id,slug=excluded.slug,
 state='pending_external',claim_token=excluded.claim_token,
 claim_revision=excluded.claim_revision,consent_version=excluded.consent_version,
 reviewer_subject=excluded.reviewer_subject,approved_at=null,updated_at=now();
 insert into public.dcc_member_publication_audit(binding_id,action,revision,reviewer_subject)
 values(p_binding,'claim',p_revision,p_reviewer);
 return v_token;
end
$body$;

create or replace function public.dcc_finalize_steward_publication(
 p_binding uuid, p_token uuid, p_success boolean
) returns text language plpgsql security definer set search_path=''
as $body$
declare
 v_grant public.dcc_member_publication_grants%rowtype;
 v_binding public.dcc_platform_member_bindings%rowtype;
 v_draft public.dcc_member_profile_drafts%rowtype;
 v_result text;
begin
 select * into v_grant from public.dcc_member_publication_grants
 where binding_id=p_binding for update;
 select * into v_binding from public.dcc_platform_member_bindings
 where id=p_binding for update;
 select * into v_draft from public.dcc_member_profile_drafts
 where binding_id=p_binding for update;
 if v_grant.state is distinct from 'pending_external'
 or v_grant.claim_token is distinct from p_token then
   raise exception 'invalid_publication_token' using errcode='23514';
 end if;
 if p_success is true and v_binding.state='active' and v_binding.verified_at is not null
 and v_binding.airtable_person_id=v_grant.airtable_person_id
 and v_draft.revision=v_grant.claim_revision
 and v_draft.public_request_state='review_processing' then
   v_result:='approved';
   update public.dcc_member_profile_drafts set public_request_state='private',
     request_disclosure_version=null,public_requested_at=null,updated_at=now()
     where binding_id=p_binding;
 else
   v_result:='uncertain';
 end if;
 update public.dcc_member_publication_grants
 set state=v_result,claim_token=null,
 approved_at=case when v_result='approved' then now() else null end,
 updated_at=now() where binding_id=p_binding;
 insert into public.dcc_member_publication_audit(binding_id,action,revision,reviewer_subject)
 values(p_binding,v_result,v_grant.claim_revision,v_grant.reviewer_subject);
 return v_result;
end
$body$;

create or replace function public.dcc_return_steward_publication(
 p_binding uuid,p_revision integer,p_reviewer text,p_action text
) returns text language plpgsql security definer set search_path=''
as $body$
declare v_draft public.dcc_member_profile_drafts%rowtype;
begin
 if p_action not in ('rejected','returned') or p_reviewer is null then
   raise exception 'invalid_review_action' using errcode='22023'; end if;
 select * into v_draft from public.dcc_member_profile_drafts
 where binding_id=p_binding for update;
 if v_draft.revision is distinct from p_revision
 or v_draft.public_request_state is distinct from 'pending_review'
 then raise exception 'stale_review_request' using errcode='23514'; end if;
 update public.dcc_member_profile_drafts set public_request_state='private',
 request_disclosure_version=null, public_requested_at=null, updated_at=now()
 where binding_id=p_binding;
 insert into public.dcc_member_publication_audit(binding_id,action,revision,reviewer_subject)
 values(p_binding,p_action,p_revision,p_reviewer);
 return p_action;
end
$body$;

-- Revoke DB visibility FIRST. Airtable revocation is an external second step.
create or replace function public.dcc_withdraw_member_publication(p_binding uuid)
returns text language plpgsql security definer set search_path=''
as $body$
declare v_binding public.dcc_platform_member_bindings%rowtype;
begin
 select * into v_binding from public.dcc_platform_member_bindings
 where id=p_binding for update;
 if not found then raise exception 'binding_missing' using errcode='23514'; end if;
 insert into public.dcc_member_publication_grants(binding_id,airtable_person_id,state,updated_at)
 values(p_binding,v_binding.airtable_person_id,'withdrawn',now())
 on conflict (binding_id) do update
 set state='withdrawn',claim_token=null,approved_at=null,updated_at=now();
 update public.dcc_member_profile_drafts
 set public_request_state='withdrawal_requested',request_disclosure_version=null,
 public_requested_at=null,updated_at=now() where binding_id=p_binding;
 insert into public.dcc_member_publication_audit(binding_id,action)
 values(p_binding,'withdrawn');
 return 'withdrawn';
end
$body$;

revoke all on function public.dcc_claim_steward_publication(uuid,integer,text,text) from public,anon,authenticated;
revoke all on function public.dcc_finalize_steward_publication(uuid,uuid,boolean) from public,anon,authenticated;
revoke all on function public.dcc_return_steward_publication(uuid,integer,text,text) from public,anon,authenticated;
revoke all on function public.dcc_withdraw_member_publication(uuid) from public,anon,authenticated;
grant execute on function public.dcc_claim_steward_publication(uuid,integer,text,text) to service_role;
grant execute on function public.dcc_finalize_steward_publication(uuid,uuid,boolean) to service_role;
grant execute on function public.dcc_return_steward_publication(uuid,integer,text,text) to service_role;
grant execute on function public.dcc_withdraw_member_publication(uuid) to service_role;
