-- Synthetic fixture only, rolled back. Verifies approved revision isolation.
begin;
do $test$
declare
 b uuid:=gen_random_uuid();
 other uuid:=gen_random_uuid();
 slug text:='test-'||left(replace(b::text,'-',''),12);
 newslug text:='replacement-'||left(replace(b::text,'-',''),12);
 disclosure constant text:='dcc-public-profile-request-v1-2026-11-22';
 t uuid;
 v integer;
begin
 if current_database()<>'dcc_test' then raise exception 'Requires disposable dcc_test'; end if;
 if has_table_privilege('anon','public.dcc_approved_passport_snapshots','SELECT')
 or has_table_privilege('authenticated','public.dcc_approved_passport_snapshots','SELECT')
 or has_table_privilege('service_role','public.dcc_approved_passport_snapshots','UPDATE')
 or has_table_privilege('service_role','public.dcc_approved_passport_snapshots','INSERT')
 or has_table_privilege('service_role','public.dcc_approved_passport_snapshots','DELETE')
 or has_function_privilege('anon','public.dcc_list_approved_passports()','EXECUTE')
 then raise exception 'snapshot grants unsafe'; end if;
 insert into public.dcc_platform_member_bindings(id,clerk_instance,clerk_user_id,state,verified_at,activated_at,airtable_person_id)
 values(b,'test-isolated','user_'||b::text,'active',now(),now(),'rec'||left(replace(b::text,'-',''),14)),
 (other,'test-isolated','user_'||other::text,'active',now(),now(),'rec'||left(replace(other::text,'-',''),14));
 perform public.dcc_save_owner_passport(b,0,'First artist','First approved biography','["Creative Coding","Private free text"]','["making"]','[{"label":"Portfolio","url":"https://example.org"}]');
 v:=public.dcc_request_owner_publication(b,1,disclosure);
 t:=public.dcc_claim_steward_publication(b,v,slug,'test-reviewer');
 if exists(select 1 from public.dcc_list_approved_passports() p where p.slug=slug) then raise exception 'claim published early'; end if;
 if public.dcc_finalize_steward_publication(b,t,true)<>'approved' then raise exception 'approval failed'; end if;
 if not exists(select 1 from public.dcc_approved_passport_snapshots s where s.binding_id=b
   and s.approved_revision=2 and s.practices='["Creative Coding"]'::jsonb and s.display_name='First artist')
 then raise exception 'snapshot is not exact reviewed revision'; end if;
 v:=public.dcc_save_owner_passport(b,4,'Second artist','Second reviewed biography','["Creative Coding"]','[]','[]');
 v:=public.dcc_request_owner_publication(b,v,disclosure);
 t:=public.dcc_claim_steward_publication(b,v,newslug,'test-reviewer');
 if not exists(select 1 from public.dcc_list_approved_passports() p where p.slug=slug and p.display_name='First artist')
 or exists(select 1 from public.dcc_list_approved_passports() p where p.slug=newslug) then raise exception 'replacement changed public snapshot before approval'; end if;
 if public.dcc_finalize_steward_publication(b,t,false)<>'uncertain' then raise exception 'provider failure not held'; end if;
 if not exists(select 1 from public.dcc_list_approved_passports() p where p.slug=slug and p.display_name='First artist')
 then raise exception 'provider failure erased prior approval'; end if;
 perform public.dcc_save_owner_passport(other,0,'Other artist','Other approved biography','["Creative Coding"]','[]','[]');
 perform public.dcc_request_owner_publication(other,1,disclosure);
 begin
   perform public.dcc_claim_steward_publication(other,2,slug,'test-reviewer');
   raise exception 'reserved old slug reused';
 exception when unique_violation then null; end;
 v:=public.dcc_save_owner_passport(b,v+1,'Third artist','Third reviewed biography','["Creative Coding"]','[]','[]');
 v:=public.dcc_request_owner_publication(b,v,disclosure);
 t:=public.dcc_claim_steward_publication(b,v,newslug,'test-reviewer');
 if public.dcc_finalize_steward_publication(b,t,true)<>'approved' then raise exception 'replacement failed'; end if;
 if exists(select 1 from public.dcc_list_approved_passports() p where p.slug=slug)
 or not exists(select 1 from public.dcc_list_approved_passports() p where p.slug=newslug and p.display_name='Third artist')
 then raise exception 'replacement not atomic'; end if;
 update public.dcc_platform_member_bindings set state='suspended' where id=b;
 if exists(select 1 from public.dcc_list_approved_passports() p where p.slug=newslug) then raise exception 'suspended member visible'; end if;
 update public.dcc_platform_member_bindings set state='active' where id=b;
 perform public.dcc_withdraw_member_publication(b);
 if exists(select 1 from public.dcc_approved_passport_snapshots s where s.binding_id=b)
 or exists(select 1 from public.dcc_list_approved_passports() p where p.slug=newslug)
 then raise exception 'withdrawal failed to remove snapshot'; end if;
end $test$;
rollback;
