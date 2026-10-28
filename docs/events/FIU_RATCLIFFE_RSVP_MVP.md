# FIU Ratcliffe RSVP MVP — implementation contract

Parent issue: #32. Event: 2026-11-10 18:00–19:30 America/New_York. Current branch implements **event-information slice A**, not live registration.

## Single ownership / boundaries

- Static event facts live in `lib/dcc/events/fiu-ratcliffe.ts`. Event discovery lives at `/events`.
- Guest RSVP must **not** call `/api/dcc/signup` or upsert the People CRM. RSVP is separate from community membership, newsletter consent, and optional public profiles.
- Proposed primary RSVP store: Supabase (existing app integration), with a **database-level** unique constraint on `(event_id, normalized_email)`. Do not introduce an Airtable duplicate-write path until separately mapped and reconciled.
- No public attendee list, per-guest lookup by email, public exact count, or raw email/confirmation token in analytics/logs.
- Host attendance/export must use existing authorized admin authentication and explicit authorization checks. Do not protect it only with a hidden URL.

## Proposed database entities (migration required before enabling RSVP)

`dcc_event_rsvps`: `id uuid`, `event_id text`, `normalized_email text`, `full_name text`, `status text CHECK (status IN ('going', 'maybe', 'cancelled'))`, `created_at`, `updated_at`, `email_verified_at`; unique `(event_id, normalized_email)`.

`dcc_event_rsvp_tokens`: hashed one-time/expiring confirmation or management tokens, RSVP foreign key, purpose, expiry and consumed timestamp. Never return tokens through public attendee lookups.

`dcc_event_mail_outbox`: idempotent delivery jobs with event/RSVP id, message type, attempts, next attempt, sent timestamp and last safe error. The RSVP save transaction and delivery enqueue must be durable; a mail failure must not undo a committed RSVP or claim email was sent.

Do not deploy/apply migrations without verifying remote schema, RLS and current database owner.

## Public flow

1. Guest enters name, email and Going/Maybe; use a honeypot, request size cap and rate limiting.
2. Server validates event open status and canonical inputs and inserts/upserts under the unique constraint **without modifying an existing, unverified RSVP**. For repeat email, return a generic response and send verification to the owner instead of revealing an existing record.
3. Email via verified provider. Verification proves ownership; signed/hashed expiring link allows showing, changing, or cancelling only that guest's RSVP for this specific event.
4. After delivery acknowledgement, send calendar attachment or link. `calendar.ics` is public event metadata; it contains no attendee details.
5. Host view is private and permits attendance marking/export. Consent to share asks/offers is distinct and off by default.

## Go / no-go before invitation blast

- [x] Event details have a canonical public code path.
- [x] Calendar URL and UTC instants encoded from Nov 10 Miami EST (23:00Z–00:30Z next day).
- [x] Event listed ahead of stale 2026 earlier listings.
- [ ] Confirm arrival instructions and FIU attendance/registration policy with host.
- [ ] Verify a database schema and add migration plus RLS / permission tests.
- [ ] Implement secure RSVP API, email verification, idempotency, spam protections, durable outbox, change/cancel and host view.
- [ ] Verify configured email sender and outbox processing.
- [ ] Focused tests, type-check, build, Vercel preview QA; no attendee data in logs or public endpoints.
- [ ] Confirm WhatsApp crawler gets public `www.dcc.miami` (review PR #31, separately).
- [ ] Founder approves final copy and sharing link before public invitation.

No RSVP form, fake confirmation or automated mailing is enabled by this docs-only schema proposal.
