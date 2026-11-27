-- Staged only. Owner writes serialize with steward claim/finalize/withdraw
-- on the binding row. NULL means conflict; no zero-row success.
create or replace function public.dcc_save_owner_passport(
 p_binding uuid,p_revision integer,p_display_name text,p_summary text,
 p_practices jsonb,p_interests jsonb,p_links jsonb
) returns integer language plpgsql security definer set search_path=''
as $$
declare
 v_binding public.dcc_platform_member_bindings%rowtype;
 v_revision integer;
begin
 select * into v_binding from public.dcc_platform_member_bindings
 where id=p_binding for update;
 if v_binding.state is null or v_binding.state not in ('active','pending_reconciliation')
 or v_binding.verified_at is null or p_revision is null or p_revision<0 then return null; end if;
 if p_revision=0 then
   insert into public.dcc_member_profile_drafts
     (binding_id,display_name,summary,practices,interests,public_links)
   values(p_binding,p_display_name,p_summary,p_practices,p_interests,p_links)
   on conflict(binding_id) do nothing returning revision into v_revision;
 else
   update public.dcc_member_profile_drafts
   set display_name=p_display_name,summary=p_summary,practices=p_practices,
       interests=p_interests,public_links=p_links,public_request_state='private',
       request_disclosure_version=null,public_requested_at=null,updated_at=now()
   where binding_id=p_binding and revision=p_revision
   returning revision into v_revision;
 end if;
 return v_revision;
end
$$;

create or replace function public.dcc_request_owner_publication(
 p_binding uuid,p_revision integer,p_disclosure text
) returns integer language plpgsql security definer set search_path=''
as $$
declare
 v_binding public.dcc_platform_member_bindings%rowtype;
 v_revision integer;
begin
 select * into v_binding from public.dcc_platform_member_bindings
 where id=p_binding for update;
 if v_binding.state is distinct from 'active' or v_binding.verified_at is null
 or v_binding.airtable_person_id is null
 or p_revision is null or p_revision<1
 or p_disclosure is distinct from 'dcc-public-profile-request-v1-2026-11-22'
 then return null; end if;
 update public.dcc_member_profile_drafts
 set public_request_state='pending_review',request_disclosure_version=p_disclosure,
     public_requested_at=now(),updated_at=now()
 where binding_id=p_binding and revision=p_revision and public_request_state='private'
 and length(trim(display_name))>=2 and length(trim(summary))>=10
 and jsonb_array_length(practices)>0
 returning revision into v_revision;
 return v_revision;
end
$$;
revoke all on function public.dcc_save_owner_passport(uuid,integer,text,text,jsonb,jsonb,jsonb) from public,anon,authenticated;
revoke all on function public.dcc_request_owner_publication(uuid,integer,text) from public,anon,authenticated;
grant execute on function public.dcc_save_owner_passport(uuid,integer,text,text,jsonb,jsonb,jsonb) to service_role;
grant execute on function public.dcc_request_owner_publication(uuid,integer,text) to service_role;
