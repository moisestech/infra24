-- STAGED ONLY: never apply to shared Supabase until the legacy feature has a separate release approval.
-- Requires public.bookings (id uuid, status text, start_time timestamptz, capacity integer,
-- current_participants integer). This is a server-only compatibility migration.
BEGIN;
SET LOCAL lock_timeout = '5s';
DO $$
BEGIN
 IF to_regclass('public.bookings') IS NULL
    OR NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='bookings' AND column_name='start_time')
    OR NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='bookings' AND column_name='capacity')
 THEN RAISE EXCEPTION 'Group booking schema requires the verified bookings contract'; END IF;
END $$;
ALTER TABLE public.bookings
 ADD COLUMN IF NOT EXISTS is_group_booking boolean NOT NULL DEFAULT false,
 ADD COLUMN IF NOT EXISTS group_size integer NOT NULL DEFAULT 1,
 ADD COLUMN IF NOT EXISTS available_spots integer NOT NULL DEFAULT 1,
 ADD COLUMN IF NOT EXISTS waitlist_enabled boolean NOT NULL DEFAULT false,
 ADD COLUMN IF NOT EXISTS group_booking_type text NOT NULL DEFAULT 'public',
 ADD COLUMN IF NOT EXISTS group_organizer_id text,
 ADD COLUMN IF NOT EXISTS group_booking_metadata jsonb NOT NULL DEFAULT '{}'::jsonb;
DO $$ BEGIN
 IF EXISTS (SELECT 1 FROM public.bookings WHERE group_booking_type NOT IN ('public','private','invite_only'))
 THEN RAISE EXCEPTION 'Invalid historical group booking type'; END IF;
END $$;
CREATE TABLE IF NOT EXISTS public.group_booking_participants (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
 user_id text NOT NULL,
 participant_name text NOT NULL,
 participant_email text NOT NULL,
 participant_phone text,
 status text NOT NULL DEFAULT 'registered' CHECK (status IN ('registered','confirmed','cancelled','waitlisted','no_show')),
 registered_at timestamptz NOT NULL DEFAULT now(),
 confirmed_at timestamptz,
 cancelled_at timestamptz,
 notes text,
 metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE (booking_id,user_id)
);
CREATE TABLE IF NOT EXISTS public.booking_waitlist (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
 user_id text NOT NULL,
 participant_name text NOT NULL,
 participant_email text NOT NULL,
 participant_phone text,
 position integer NOT NULL,
 notified_at timestamptz,
 responded_at timestamptz,
 expires_at timestamptz,
 status text NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting','notified','expired','converted','cancelled')),
 notes text,
 metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE (booking_id,user_id)
);
CREATE TABLE IF NOT EXISTS public.group_booking_invitations (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
 invited_by_user_id text NOT NULL,
 invited_user_id text,
 invited_email text NOT NULL,
 invited_name text,
 invitation_token uuid NOT NULL DEFAULT gen_random_uuid() UNIQUE,
 status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','declined','expired')),
 sent_at timestamptz NOT NULL DEFAULT now(),
 responded_at timestamptz,
 expires_at timestamptz NOT NULL DEFAULT (now() + interval '7 days'),
 message text,
 metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS group_booking_participants_booking_status_idx ON public.group_booking_participants(booking_id,status);
CREATE INDEX IF NOT EXISTS booking_waitlist_booking_position_idx ON public.booking_waitlist(booking_id,status,position);
CREATE INDEX IF NOT EXISTS group_booking_invitations_booking_idx ON public.group_booking_invitations(booking_id);
ALTER TABLE public.group_booking_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_booking_invitations ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.group_booking_participants,public.booking_waitlist,public.group_booking_invitations FROM PUBLIC,anon,authenticated;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.group_booking_participants,public.booking_waitlist,public.group_booking_invitations TO service_role;

CREATE OR REPLACE FUNCTION public.get_group_booking_available_spots(p_booking_id uuid) RETURNS integer
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = ''
AS $$
 SELECT greatest(0,coalesce(b.capacity,0)-(
   SELECT count(*)::integer FROM public.group_booking_participants p
   WHERE p.booking_id=b.id AND p.status IN ('registered','confirmed')
 )) FROM public.bookings b WHERE b.id=p_booking_id AND b.is_group_booking IS TRUE;
$$;

CREATE OR REPLACE FUNCTION public.add_group_booking_participant(
 p_booking_id uuid,p_user_id text,p_participant_name text,p_participant_email text,
 p_participant_phone text DEFAULT NULL,p_notes text DEFAULT NULL
) RETURNS jsonb
LANGUAGE plpgsql VOLATILE SECURITY INVOKER SET search_path = ''
AS $$
DECLARE b public.bookings%ROWTYPE; spots integer; next_position integer; existing text;
BEGIN
 IF nullif(btrim(p_user_id),'') IS NULL OR nullif(btrim(p_participant_name),'') IS NULL
    OR nullif(btrim(p_participant_email),'') IS NULL THEN
   RETURN jsonb_build_object('success',false,'error','Invalid participant'); END IF;
 SELECT * INTO b FROM public.bookings WHERE id=p_booking_id FOR UPDATE;
 IF NOT FOUND OR b.is_group_booking IS DISTINCT FROM TRUE
    OR b.group_booking_type IS DISTINCT FROM 'public'
    OR b.status IS DISTINCT FROM 'confirmed' OR b.start_time <= now() THEN
   RETURN jsonb_build_object('success',false,'error','Registration unavailable'); END IF;
 SELECT status INTO existing FROM public.group_booking_participants
  WHERE booking_id=p_booking_id AND user_id=p_user_id;
 IF existing IN ('registered','confirmed') THEN
  RETURN jsonb_build_object('success',true,'status','registered','available_spots',public.get_group_booking_available_spots(p_booking_id));
 END IF;
 IF existing IS NOT NULL THEN
  RETURN jsonb_build_object('success',false,'error','Existing registration cannot be reactivated'); END IF;
 spots := public.get_group_booking_available_spots(p_booking_id);
 IF spots <= 0 THEN
  IF NOT b.waitlist_enabled THEN RETURN jsonb_build_object('success',false,'error','No available spots'); END IF;
  SELECT position INTO next_position FROM public.booking_waitlist
   WHERE booking_id=p_booking_id AND user_id=p_user_id AND status='waiting';
  IF next_position IS NULL THEN
   SELECT coalesce(max(position),0)+1 INTO next_position FROM public.booking_waitlist WHERE booking_id=p_booking_id;
   INSERT INTO public.booking_waitlist(booking_id,user_id,participant_name,participant_email,participant_phone,position,expires_at)
    VALUES(p_booking_id,p_user_id,p_participant_name,p_participant_email,p_participant_phone,next_position,now()+interval '24 hours');
  END IF;
  RETURN jsonb_build_object('success',true,'status','waitlisted','position',next_position);
 END IF;
 INSERT INTO public.group_booking_participants(booking_id,user_id,participant_name,participant_email,participant_phone,notes)
 VALUES(p_booking_id,p_user_id,p_participant_name,p_participant_email,p_participant_phone,p_notes);
 UPDATE public.bookings SET current_participants=(SELECT count(*)::integer FROM public.group_booking_participants
 WHERE booking_id=p_booking_id AND status IN ('registered','confirmed')),
 available_spots=public.get_group_booking_available_spots(p_booking_id) WHERE id=p_booking_id;
 RETURN jsonb_build_object('success',true,'status','registered','available_spots',public.get_group_booking_available_spots(p_booking_id));
END $$;

CREATE OR REPLACE FUNCTION public.remove_group_booking_participant(p_booking_id uuid,p_user_id text) RETURNS jsonb
LANGUAGE plpgsql VOLATILE SECURITY INVOKER SET search_path = ''
AS $$
DECLARE b public.bookings%ROWTYPE; next_position integer;
BEGIN
 SELECT * INTO b FROM public.bookings WHERE id=p_booking_id FOR UPDATE;
 IF NOT FOUND OR b.is_group_booking IS DISTINCT FROM TRUE THEN
 RETURN jsonb_build_object('success',false,'error','Group booking not found'); END IF;
 UPDATE public.group_booking_participants SET status='cancelled',cancelled_at=now(),updated_at=now()
 WHERE booking_id=p_booking_id AND user_id=p_user_id AND status IN ('registered','confirmed');
 IF NOT FOUND THEN RETURN jsonb_build_object('success',false,'error','Participant not found'); END IF;
 UPDATE public.bookings SET current_participants=(SELECT count(*)::integer FROM public.group_booking_participants
 WHERE booking_id=p_booking_id AND status IN ('registered','confirmed')),
 available_spots=public.get_group_booking_available_spots(p_booking_id) WHERE id=p_booking_id;
 SELECT position INTO next_position FROM public.booking_waitlist WHERE booking_id=p_booking_id
 AND status='waiting' AND (expires_at IS NULL OR expires_at>now()) ORDER BY position LIMIT 1;
 RETURN jsonb_build_object('success',true,'available_spots',public.get_group_booking_available_spots(p_booking_id),'waitlist_position',next_position);
END $$;

CREATE OR REPLACE FUNCTION public.promote_waitlist_participant(p_booking_id uuid,p_waitlist_id uuid) RETURNS jsonb
LANGUAGE plpgsql VOLATILE SECURITY INVOKER SET search_path = ''
AS $$
DECLARE b public.bookings%ROWTYPE; w public.booking_waitlist%ROWTYPE;
BEGIN
 SELECT * INTO b FROM public.bookings WHERE id=p_booking_id FOR UPDATE;
 IF NOT FOUND OR b.is_group_booking IS DISTINCT FROM TRUE OR b.status IS DISTINCT FROM 'confirmed'
 OR b.start_time <= now() THEN RETURN jsonb_build_object('success',false,'error','Booking unavailable'); END IF;
 SELECT * INTO w FROM public.booking_waitlist WHERE id=p_waitlist_id AND booking_id=p_booking_id
 AND status='waiting' AND (expires_at IS NULL OR expires_at>now()) FOR UPDATE;
 IF NOT FOUND THEN RETURN jsonb_build_object('success',false,'error','Waitlist entry unavailable'); END IF;
 IF public.get_group_booking_available_spots(p_booking_id)<=0 THEN
 RETURN jsonb_build_object('success',false,'error','No available spots'); END IF;
 IF EXISTS(SELECT 1 FROM public.group_booking_participants WHERE booking_id=p_booking_id AND user_id=w.user_id)
 THEN RETURN jsonb_build_object('success',false,'error','Existing participant record'); END IF;
 INSERT INTO public.group_booking_participants(booking_id,user_id,participant_name,participant_email,participant_phone)
 VALUES(p_booking_id,w.user_id,w.participant_name,w.participant_email,w.participant_phone);
 UPDATE public.booking_waitlist SET status='converted',responded_at=now(),updated_at=now() WHERE id=w.id AND status='waiting';
 UPDATE public.bookings SET current_participants=(SELECT count(*)::integer FROM public.group_booking_participants
 WHERE booking_id=p_booking_id AND status IN ('registered','confirmed')),
 available_spots=public.get_group_booking_available_spots(p_booking_id) WHERE id=p_booking_id;
 RETURN jsonb_build_object('success',true,'status','registered');
END $$;
REVOKE ALL ON FUNCTION public.get_group_booking_available_spots(uuid),
 public.add_group_booking_participant(uuid,text,text,text,text,text),
 public.remove_group_booking_participant(uuid,text),
 public.promote_waitlist_participant(uuid,uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.get_group_booking_available_spots(uuid),
 public.add_group_booking_participant(uuid,text,text,text,text,text),
 public.remove_group_booking_participant(uuid,text),
 public.promote_waitlist_participant(uuid,uuid) TO service_role;
COMMIT;
