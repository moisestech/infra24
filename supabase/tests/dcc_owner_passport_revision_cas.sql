-- Run against an isolated migrated database, never against real member records.
-- All fixture writes are inside a transaction that is rolled back.
begin;
do $test$
declare
 b uuid:=gen_random_uuid();
 p uuid:=gen_random_uuid();
 v integer;
 t uuid;
 disclosure constant text:='dcc-public-profile-request-v1-2026-11-22';
begin
 if has_function_privilege('anon','public.dcc_request_owner_publication(uuid,integer,text)','EXECUTE')
 or has_function_privilege('authenticated','public.dcc_save_owner_passport(uuid,integer,text,text,jsonb,jsonb,jsonb)','EXECUTE')
 then raise exception 'browser role can execute owner mutation RPC'; end if;
 insert into public.dcc_platform_member_bindings(id,clerk_instance,clerk_user_id,state,verified_at,activated_at,airtable_person_id)
 values(b,'test-isolated','user_'||b::text,'active',now(),now(),'rec'||left(replace(b::text,'-',''),14));
 insert into public.dcc_platform_member_bindings(id,clerk_instance,clerk_user_id,state,verified_at)
 values(p,'test-isolated','user_'||p::text,'pending_reconciliation',now());
 v:=public.dcc_save_owner_passport(b,0,'Synthetic artist','Synthetic profile biography','["fabrication"]','[]','[]');
 if v is distinct from 1 then raise exception 'initial save failed'; end if;
 if public.dcc_save_owner_passport(b,0,'Stale tab','Synthetic profile biography','["fabrication"]','[]','[]') is not null then raise exception 'stale initial save accepted'; end if;
 v:=public.dcc_save_owner_passport(p,0,'Pending artist','Synthetic profile biography','["fabrication"]','[]','[]');
 if v is distinct from 1 or public.dcc_request_owner_publication(p,1,disclosure) is not null then raise exception 'pending member publication allowed'; end if;
 if public.dcc_request_owner_publication(b,1,'obsolete') is not null then raise exception 'old disclosure accepted'; end if;
 v:=public.dcc_request_owner_publication(b,1,disclosure);
 if v is distinct from 2 then raise exception 'request did not advance revision'; end if;
 perform public.dcc_withdraw_member_publication(b);
 if public.dcc_request_owner_publication(b,1,disclosure) is not null
 or public.dcc_request_owner_publication(b,3,disclosure) is not null
 or public.dcc_save_owner_passport(b,2,'Stale','Synthetic profile biography','["fabrication"]','[]','[]') is not null
 then raise exception 'stale request or withdrawal overwritten'; end if;
 v:=public.dcc_save_owner_passport(b,3,'Fresh consent','Synthetic profile biography','["fabrication"]','[]','[]');
 if v is distinct from 4 then raise exception 'fresh private save failed'; end if;
 v:=public.dcc_request_owner_publication(b,4,disclosure);
 if v is distinct from 5 then raise exception 'fresh explicit consent rejected'; end if;
 t:=public.dcc_claim_steward_publication(b,5,'test-'||left(replace(b::text,'-',''),12),'test-reviewer');
 perform public.dcc_withdraw_member_publication(b);
 begin
   perform public.dcc_finalize_steward_publication(b,t,true);
   raise exception 'withdrawn claim finalized';
 exception when check_violation then null;
 end;
 if not exists(select 1 from public.dcc_member_publication_grants where binding_id=b and state='withdrawn' and approved_at is null)
 then raise exception 'withdrawal failed to revoke grant'; end if;
 if not exists(select 1 from public.dcc_member_profile_drafts where binding_id=b and public_request_state='withdrawal_requested' and revision=7)
 then raise exception 'withdrawal revision/state incorrect'; end if;
end
$test$;
rollback;
