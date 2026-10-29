-- Atomic email verification + transactional queue. Only service_role may call these RPCs.
alter table public.dcc_event_mail_outbox add column if not exists payload_ciphertext text;
alter table public.dcc_event_mail_outbox add column if not exists lease_id uuid;
alter table public.dcc_event_mail_outbox add column if not exists lease_until timestamptz;
alter table public.dcc_event_mail_outbox add column if not exists provider_message_id text;
create or replace function public.dcc_event_verify_and_queue(p_event_id text,p_verify_hash text,p_manage_hash text,p_ciphertext text)
returns uuid language plpgsql security definer set search_path = ''
as $$
declare v_token record; v_manage uuid; v_outbox uuid;
begin
 if p_event_id <> 'fiu-ratcliffe-2026-11-10' or p_verify_hash !~ '^[a-f0-9]{64}$' or p_manage_hash !~ '^[a-f0-9]{64}$' or length(p_ciphertext) not between 64 and 12000 then raise exception 'invalid input'; end if;
 select t.id,t.rsvp_id into v_token from public.dcc_event_rsvp_tokens t
 join public.dcc_event_rsvps r on r.id=t.rsvp_id
 where t.token_hash=p_verify_hash and t.purpose='verify' and t.consumed_at is null and t.expires_at>now() and r.event_id=p_event_id
 for update of t;
 if not found then return null; end if;
 update public.dcc_event_rsvp_tokens set consumed_at=now() where id=v_token.id;
 update public.dcc_event_rsvps set email_verified_at=coalesce(email_verified_at,now()),updated_at=now() where id=v_token.rsvp_id;
 insert into public.dcc_event_rsvp_tokens(rsvp_id,token_hash,purpose,expires_at)
 values(v_token.rsvp_id,p_manage_hash,'manage',now()+interval '30 days') returning id into v_manage;
 insert into public.dcc_event_mail_outbox(rsvp_id,token_id,message_type,payload_ciphertext)
 values(v_token.rsvp_id,v_manage,'confirmation',p_ciphertext) returning id into v_outbox;
 return v_outbox;
end;
$$;
create or replace function public.dcc_event_claim_mail(p_limit integer default 10)
returns table(id uuid, lease_id uuid, ciphertext text, attempts integer)
language plpgsql security definer set search_path = ''
as $$
begin
 return query with selected as (
 select o.id from public.dcc_event_mail_outbox o
 join public.dcc_event_rsvp_tokens t on t.id=o.token_id
 where o.sent_at is null and o.payload_ciphertext is not null and o.next_attempt_at<=now()
 and (o.lease_until is null or o.lease_until<now()) and o.attempts<8 and t.expires_at>now()
 order by o.created_at for update of o skip locked limit greatest(1,least(p_limit,25))
 ), updated as (
 update public.dcc_event_mail_outbox o set lease_id=gen_random_uuid(),lease_until=now()+interval '2 minutes'
 from selected s where o.id=s.id returning o.id,o.lease_id,o.payload_ciphertext,o.attempts
 ) select u.id,u.lease_id,u.payload_ciphertext,u.attempts from updated u;
end;
$$;
create or replace function public.dcc_event_finish_mail(p_id uuid,p_lease_id uuid,p_success boolean,p_provider_id text default null)
returns boolean language plpgsql security definer set search_path = ''
as $$
declare v_count integer;
begin
 update public.dcc_event_mail_outbox set attempts=attempts+1,
 sent_at=case when p_success then now() else null end,
 provider_message_id=case when p_success then left(p_provider_id,255) else provider_message_id end,
 last_safe_error=case when p_success then null else 'delivery_failed' end,
 next_attempt_at=case when p_success then next_attempt_at else now()+make_interval(secs=>least(14400,300*power(2,least(attempts,6)))::integer) end,
 lease_id=null,lease_until=null
 where id=p_id and lease_id=p_lease_id and sent_at is null;
 get diagnostics v_count=row_count; return v_count=1;
end;
$$;
revoke execute on function public.dcc_event_verify_and_queue(text,text,text,text),public.dcc_event_claim_mail(integer),public.dcc_event_finish_mail(uuid,uuid,boolean,text) from public,anon,authenticated;
grant execute on function public.dcc_event_verify_and_queue(text,text,text,text),public.dcc_event_claim_mail(integer),public.dcc_event_finish_mail(uuid,uuid,boolean,text) to service_role;
