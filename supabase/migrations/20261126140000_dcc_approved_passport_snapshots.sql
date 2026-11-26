-- Staged, additive migration: independent, immutable reviewed public projection.
-- Do not backfill previous grants from mutable Airtable or current drafts.
-- A current snapshot can only be replaced or removed by the locked review RPCs.
create table public.dcc_approved_passport_snapshots (
  binding_id uuid primary key references public.dcc_platform_member_bindings(id) on delete restrict,
  airtable_person_id text not null unique,
  approved_revision integer not null check(approved_revision>0),
  consent_version text not null,
  slug text not null unique check(length(slug)<=100 and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  display_name text not null check(length(trim(display_name)) between 2 and 80),
  summary text not null check(length(trim(summary)) between 10 and 280),
  practices jsonb not null check(jsonb_typeof(practices)='array'),
  interests jsonb not null check(jsonb_typeof(interests)='array'),
  public_links jsonb not null check(jsonb_typeof(public_links)='array'),
  approved_at timestamptz not null
);
alter table public.dcc_approved_passport_snapshots enable row level security;
revoke all on public.dcc_approved_passport_snapshots from public,anon,authenticated,service_role;
grant select on public.dcc_approved_passport_snapshots to service_role;

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
 -- The prior published slug remains reserved during replacement.
 if exists(select 1 from public.dcc_approved_passport_snapshots s
   where s.slug=p_slug and s.binding_id<>p_binding)
 then raise exception 'public_slug_reserved' using errcode='23505'; end if;
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
 -- Acquire binding lock FIRST: same lock order as claim and withdrawal,
 -- so a concurrent owner withdrawal cannot deadlock against finalization.
 select * into v_binding from public.dcc_platform_member_bindings
 where id=p_binding for update;
 select * into v_grant from public.dcc_member_publication_grants
 where binding_id=p_binding for update;
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
   -- Snapshot the exact locked, consented draft; never copy mutable provider data.
   -- The claim increments the draft revision once. Record the consent revision.
   begin
     delete from public.dcc_approved_passport_snapshots where binding_id=p_binding;
     insert into public.dcc_approved_passport_snapshots
       (binding_id,airtable_person_id,approved_revision,consent_version,slug,
        display_name,summary,practices,interests,public_links,approved_at)
     values(p_binding,v_binding.airtable_person_id,v_grant.claim_revision-1,
        v_grant.consent_version,v_grant.slug,v_draft.display_name,v_draft.summary,
        coalesce((select jsonb_agg(choice order by ordinal)
          from (select choice,ordinal from jsonb_array_elements_text(v_draft.practices)
                with ordinality as p(choice,ordinal)
                where choice=any(array['FDM Printing','Resin Printing','3D File Prep','AI Image → 3D','CAD / Modeling','Frontend / Web','AI / Automation','Projection / Exhibition Media','Workshop Facilitation','XR / Immersive','Games / Real-Time','Film / Video','Rendering / Visualization','AI / Generative Media','LED / Lighting Systems','Creative Coding','Electronics / Physical Computing','Interactive Installation','Photography / Imaging','3D Scanning','Data Visualization','Critical Media / Research','Community / Producing','Performance / Movement','Curating / Education','Sound / Music Tech','Animation / Motion'])
                order by ordinal limit 10) selected),'[]'::jsonb),
        v_draft.interests,v_draft.public_links,now());
     v_result:='approved';
     update public.dcc_member_profile_drafts set public_request_state='private',
       request_disclosure_version=null,public_requested_at=null,updated_at=now()
       where binding_id=p_binding;
   exception when unique_violation then
     -- Roll back the attempted replacement, retaining the previously approved row.
     v_result:='uncertain';
   end;
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

create or replace function public.dcc_withdraw_member_publication(p_binding uuid)
returns text language plpgsql security definer set search_path=''
as $body$
declare v_binding public.dcc_platform_member_bindings%rowtype;
begin
 select * into v_binding from public.dcc_platform_member_bindings
 where id=p_binding for update;
 if not found then raise exception 'binding_missing' using errcode='23514'; end if;
 delete from public.dcc_approved_passport_snapshots where binding_id=p_binding;
 insert into public.dcc_member_publication_grants(binding_id,airtable_person_id,state,updated_at)
 values(p_binding,v_binding.airtable_person_id,'withdrawn',now())
 on conflict (binding_id) do update
 set state='withdrawn',slug=null,claim_token=null,approved_at=null,updated_at=now();
 update public.dcc_member_profile_drafts
 set public_request_state='withdrawal_requested',request_disclosure_version=null,
 public_requested_at=null,updated_at=now() where binding_id=p_binding;
 insert into public.dcc_member_publication_audit(binding_id,action)
 values(p_binding,'withdrawn');
 return 'withdrawn';
end
$body$;


-- One statement checks active identity and reads only the approved public fields.
-- No Clerk subjects, binding identifiers, CRM identifiers or private draft fields.
create function public.dcc_list_approved_passports()
returns table(slug text,display_name text,summary text,practices jsonb,interests jsonb,public_links jsonb)
language sql stable security invoker set search_path='' as $$
  select s.slug,s.display_name,s.summary,s.practices,s.interests,s.public_links
  from public.dcc_approved_passport_snapshots s
  join public.dcc_platform_member_bindings b on b.id=s.binding_id
  where b.state='active' and b.verified_at is not null
    and b.airtable_person_id=s.airtable_person_id
  order by s.slug
$$;
revoke all on function public.dcc_list_approved_passports() from public,anon,authenticated;
grant execute on function public.dcc_list_approved_passports() to service_role;
-- Reassert the existing privileged mutation RPC boundaries.
revoke all on function public.dcc_claim_steward_publication(uuid,integer,text,text) from public,anon,authenticated;
revoke all on function public.dcc_finalize_steward_publication(uuid,uuid,boolean) from public,anon,authenticated;
revoke all on function public.dcc_return_steward_publication(uuid,integer,text,text) from public,anon,authenticated;
revoke all on function public.dcc_withdraw_member_publication(uuid) from public,anon,authenticated;
grant execute on function public.dcc_claim_steward_publication(uuid,integer,text,text) to service_role;
grant execute on function public.dcc_finalize_steward_publication(uuid,uuid,boolean) to service_role;
grant execute on function public.dcc_return_steward_publication(uuid,integer,text,text) to service_role;
grant execute on function public.dcc_withdraw_member_publication(uuid) to service_role;

