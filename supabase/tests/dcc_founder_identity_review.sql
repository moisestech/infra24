begin;
do $test$
declare
  b uuid := gen_random_uuid(); other_id uuid := gen_random_uuid();
  owner_id text := 'user_'||b; founder text := 'user_synthetic_founder';
  other_owner text := 'user_'||other_id;
  pid text := 'rec'||left(replace(b::text,'-',''),14);
  challenge text := repeat('a',64); primary_stamp text := repeat('b',64);
begin
  if current_database()<>'dcc_test' then raise exception 'Requires disposable dcc_test'; end if;
  if has_function_privilege('authenticated','public.dcc_identity_review_step(text,uuid,text,text,integer,text,text,text,text,boolean)','execute')
    or has_table_privilege('anon','public.dcc_identity_review_audit','select')
    or has_table_privilege('service_role','public.dcc_identity_review_audit','update') then raise exception 'Unexpected client/audit grants'; end if;
  insert into public.dcc_platform_member_bindings(id,clerk_instance,clerk_user_id,state,verified_at)
    values (b,'test-ci',owner_id,'review_required',now()),(other_id,'test-ci',other_owner,'review_required',now());
  insert into public.dcc_member_reconcile_jobs(binding_id,lease_token,status,audit_reason)
    values (b,gen_random_uuid(),'review_required','legacy_people_email_collision'),
           (other_id,gen_random_uuid(),'review_required','legacy_people_email_collision');
  perform public.dcc_identity_review_step('test-ci',b,founder,'challenge',0,pid,'in_person',challenge,primary_stamp);
  begin
    perform public.dcc_identity_review_step('test-ci',other_id,founder,'challenge',0,pid,'in_person',challenge,primary_stamp);
    raise exception 'one CRM person reserved twice';
  exception when unique_violation then null; end;
  begin
    perform public.dcc_identity_review_step('test-ci',b,founder,'approve',1,pid,p_primary=>primary_stamp);
    raise exception 'approved without proof';
  exception when check_violation then null; end;
  begin
    perform public.dcc_identity_review_step('test-ci',b,other_owner,'prove',1,p_digest=>challenge,p_primary=>primary_stamp);
    raise exception 'cross-owner proof accepted';
  exception when check_violation then null; end;
  begin
    perform public.dcc_identity_review_step('other-instance',b,owner_id,'prove',1,p_digest=>challenge,p_primary=>primary_stamp);
    raise exception 'cross-instance proof accepted';
  exception when check_violation then null; end;
  update public.dcc_identity_reviews set expires_at=now()-interval '1 minute' where binding_id=b;
  begin
    perform public.dcc_identity_review_step('test-ci',b,owner_id,'prove',1,p_digest=>challenge,p_primary=>primary_stamp);
    raise exception 'expired code accepted';
  exception when check_violation then null; end;
  perform public.dcc_identity_review_step('test-ci',b,founder,'challenge',1,pid,'in_person',repeat('c',64),primary_stamp);
  begin
    perform public.dcc_identity_review_step('test-ci',b,owner_id,'prove',2,p_digest=>challenge,p_primary=>primary_stamp);
    raise exception 'replaced code accepted';
  exception when check_violation then null; end;
  perform public.dcc_identity_review_step('test-ci',b,owner_id,'prove',2,p_digest=>repeat('c',64),p_primary=>primary_stamp);
  begin
    perform public.dcc_identity_review_step('test-ci',b,founder,'approve',2,pid,p_primary=>primary_stamp);
    raise exception 'stale decision accepted';
  exception when serialization_failure then null; end;
  perform public.dcc_identity_review_step('test-ci',b,founder,'approve',3,pid,p_primary=>primary_stamp);
  perform public.dcc_identity_review_step('test-ci',b,founder,'uncertain',4);
  begin
    perform public.dcc_identity_review_step('test-ci',b,founder,'reject',5);
    raise exception 'released an uncertain reservation';
  exception when check_violation then null; end;
  if exists(select 1 from public.dcc_platform_member_bindings where id=b and state='active') then
    raise exception 'activated before positive provider confirmation'; end if;
  perform public.dcc_identity_review_step('test-ci',b,founder,'confirm',5,pid,p_primary=>primary_stamp,p_existing=>true);
  if not exists(select 1 from public.dcc_platform_member_bindings where id=b and state='active' and airtable_person_id=pid)
    or (select count(*) from public.dcc_identity_review_audit where binding_id=b)<>6
    or exists(select 1 from public.dcc_member_publication_grants where binding_id=b)
    then raise exception 'identity finalization, audit or privacy invariant failed'; end if;
  perform public.dcc_identity_review_step('test-ci',other_id,founder,'return',0);
  perform public.dcc_identity_review_step('test-ci',other_id,founder,'hold',1);
  perform public.dcc_identity_review_step('test-ci',other_id,founder,'reject',2);
  if (select stage from public.dcc_identity_reviews where binding_id=other_id)<>'rejected' then raise exception 'reject not persisted'; end if;
end $test$;
rollback;
