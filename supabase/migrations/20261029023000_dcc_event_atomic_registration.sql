-- Atomic RSVP intake with bounded duplicate requests and encrypted delivery.
create or replace function public.dcc_event_register_and_queue(
 p_event_id text,p_email text,p_full_name text,p_status text,p_verify_hash text,p_ciphertext text
) returns uuid language plpgsql security definer set search_path = ''
as $$
declare v_rsvp uuid;v_token uuid;v_outbox uuid;v_verified timestamptz;
begin
 if p_event_id <> 'fiu-ratcliffe-2026-11-10' or length(p_email)>254
 or p_email <> lower(btrim(p_email))
 or p_email !~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$'
 or length(p_full_name) not between 2 and 120
 or p_status not in ('going','maybe')
 or p_verify_hash !~ '^[a-f0-9]{64}$'
 or length(p_ciphertext) not between 64 and 12000 then raise exception 'invalid_registration' using errcode='22023';end if;
 insert into public.dcc_event_rsvps(event_id,normalized_email,full_name,status)
 values(p_event_id,p_email,p_full_name,p_status)
 on conflict(event_id,normalized_email) do nothing returning id into v_rsvp;
 if v_rsvp is null then
  select id,email_verified_at into v_rsvp,v_verified from public.dcc_event_rsvps
  where event_id=p_event_id and normalized_email=p_email;
  if v_rsvp is null then return null;end if;
  -- No mutations to verified guest data through the public RSVP endpoint.
  if v_verified is not null then return null;end if;
  -- Prevent rapid repeat submissions from generating unbounded email.
  if exists(select 1 from public.dcc_event_rsvp_tokens
   where rsvp_id=v_rsvp and purpose='verify' and created_at>now()-interval '10 minutes')
   then return null;end if;
 end if;
 insert into public.dcc_event_rsvp_tokens(rsvp_id,token_hash,purpose,expires_at)
 values(v_rsvp,p_verify_hash,'verify',now()+interval '72 hours') returning id into v_token;
 insert into public.dcc_event_mail_outbox(rsvp_id,token_id,message_type,payload_ciphertext)
 values(v_rsvp,v_token,'verify',p_ciphertext) returning id into v_outbox;
 return v_outbox;
end;
$$;
revoke execute on function public.dcc_event_register_and_queue(text,text,text,text,text,text) from public,anon,authenticated;
grant execute on function public.dcc_event_register_and_queue(text,text,text,text,text,text) to service_role;
