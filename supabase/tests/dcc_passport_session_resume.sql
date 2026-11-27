-- Synthetic two-session Passport persistence regression. CI database only.
\set ON_ERROR_STOP on
do $$ begin
 if current_database() <> 'dcc_test' or inet_server_addr() is null
 then raise exception 'Requires isolated TCP dcc_test'; end if;
end $$;
select gen_random_uuid() as binding_id \gset
insert into public.dcc_platform_member_bindings(id,clerk_instance,clerk_user_id,state,verified_at)
values (:'binding_id','synthetic-ci-resume','user_'||:'binding_id','pending_reconciliation',now());
select set_config('dcc.test_binding', :'binding_id', false);
set role service_role;
do $$ begin
 if public.dcc_save_owner_passport(current_setting('dcc.test_binding')::uuid,0,'Synthetic maker','A private synthetic biography','[]','[]','[]') is distinct from 1
 then raise exception 'First private save failed'; end if;
end $$;
reset role;
\connect dcc_test
select set_config('dcc.test_binding', :'binding_id', false);
set role service_role;
do $$ declare b uuid := current_setting('dcc.test_binding')::uuid;
begin
 if not exists(select 1 from public.dcc_member_profile_drafts where binding_id=b and display_name='Synthetic maker' and revision=1 and public_request_state='private')
 then raise exception 'Draft did not persist across connections'; end if;
 if public.dcc_save_owner_passport(b,1,'Synthetic maker revised','A revised private biography','[]','[]','[]') is distinct from 2
 then raise exception 'Resumed edit failed'; end if;
 if public.dcc_save_owner_passport(b,1,'Stale edit','Stale private biography','[]','[]','[]') is not null
 then raise exception 'Stale revision accepted'; end if;
 if public.dcc_request_owner_publication(b,2,'dcc-public-profile-request-v1-2026-11-22') is not null
 then raise exception 'Pending identity requested publication'; end if;
end $$;
reset role;
delete from public.dcc_member_profile_drafts where binding_id=:'binding_id';
delete from public.dcc_platform_member_bindings where id=:'binding_id';
