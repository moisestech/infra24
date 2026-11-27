# DCC Miami — Passport, Public Atlas and Authentication MVP readiness

**Date:** 2026-11-24 · **Status:** Audit, not a release · **Owner:** DCC Miami · [MVP issue #75](https://github.com/moisestech/infra24/issues/75)

## One account, three clear permissions
1. DCC **website membership**: Clerk authenticated; signed event journal plus server-side verified Airtable People relationship. Private by default.
2. **Your Passport**: owner-editable, Supabase private draft; save/resume independently of publication.
3. **Public Atlas profile**: explicit and versioned consent, approved selected fields, human steward review, stable public slug. Withdrawal removes public discovery while membership remains.

Public artwork named nodes cannot derive from unsigned contact forms or private People. Delayed website presence cohort aggregates require their separate gate and are **post-MVP**, not proof of individual participation.

## Audit summary
- Repo contains branded Clerk v4 embedded sign-in/sign-up and shared `Your DCC` account home, feature-gated private Passport, reviewed-public API projection and staff **read-only** review queue in [draft PR #72](https://github.com/moisestech/infra24/pull/72).
- Supabase private DCC tables and migration history are installed with RLS and service-only access, but member bindings, Passport drafts, Clerk events and approved artwork snapshots all count zero.
- DCC CRM People has 52 contact records (45 Active/Joined community-status values), **none** with all public-Atlas publication approvals / new member binding. Never import or publish them automatically. Atlas unsigned intake has 0 submissions.
- Connected Vercel cannot enumerate the `infra24` project despite GitHub-reported Vercel successful commit status. No runtime settings, signature/webhooks, deployed preview or browser tests verified.
- Airtable workspace returned **HTTP 422 / record cap** when creating MVP backlog rows; nothing was written. GitHub [issue #75](https://github.com/moisestech/infra24/issues/75) is authoritative backlog until capacity resolved.

## Critical privacy and legacy platform findings
- Existing `public` tables `artist_tips,booking_participants,bookings,organization_donations,resources,submission_forms,submissions`: RLS OFF, no policies, anonymous SELECT/INSERT/UPDATE/DELETE grants. Row counts respectively 0,18,3,0,6,4,0 at audit.
- **RLS alone insufficient.** Service role API routes: `/api/admin/bookings` GET/PATCH/DELETE lacks auth; `/api/donations`, `/api/tips` unauthenticated read of all fields and caller-controlled payment status; `/api/organizations/by-id/submissions` GET needs tenant authorization; `/api/organizations/[orgId]/resources` uses anonymous DB client even on POST and can depend on current permissions. Several older routes query a nonexistent `organization_id` rather than `org_id`, suggesting stale code.
- Internal/research/admin legacy CRM graph was selectable by URL and People no-consent fallback was fail-open. Narrow security correction proposed (NOT deployed) as [draft PR #74](https://github.com/moisestech/infra24/pull/74), requiring Clerk staff allowlist for nonpublic queries and explicit consent on public People. It may change public research UX, so test.
- Full remediation [issue #73](https://github.com/moisestech/infra24/issues/73) contains route-by-table matrix. **Do not apply broad live RLS** until direct anonymous consumers are migrated and server-role routes secured/tested, or bookings and resource functions may break.

## P0 order
1. Restore Vercel project/team permission; verify env **names/presence**, preview build, Clerk signed webhook URL, work queue scheduler, logging, explicit cutover. Do not display secrets.
2. Complete issue #73 data-plane and service-role API access-control protections (tenant role checks, deny anonymous financial/booking reads, validated mutations); test safe migration with synthetic cross-tenant reads and existing app regressions.
3. Clerk test flow from any join source / Smart Sign: new account, email verification, replay webhook, reconcile exactly one Supabase member and one Airtable People record, collision human review, new/delete, private profile unaffected by public review. No existing account silently backfilled.
4. Add **staff APPROVE / REJECT / RETURN-FOR-EDITS** with signed actor, revision check, publication consent, unique slug, only selected approved public fields, durable audit. Existing queue read-only cannot complete directory.
5. Add `/network/community/[slug]` approved public person page and empty state, search/filter/list mobile-first. Verify no private CRM/Clerk field or unconsented research candidate in *any* public graph/page/OG tag.
6. Signed-in owner can modify draft privately; explicit opt-in review; withdraw public listing; ensure public directory, permalink, artwork, caches and index metadata remove withdrawn identity.

## P1 polish, after P0 privacy
- One canonical `/join` public CTA; preserve source campaign but not as identity proof. Founder preference: verified web account = private membership, not mandatory discoverability.
- Remove/hide parallel `sessionStorage` Passport preview and unsigned email-only Atlas request as equivalent alternate routes at official cutover; preserve older contact-lead path as non-member if still needed.
- Mobile-first 60–120 second optional profile fields: display name, summary, practices, interests, external links, preview, save privately and request visibility. Do not force wizard or graph navigation.
- Explicit states: unverified → synchronization → needs staff identity review → active private → draft saved → publication requested → approved visible → withdrawn.
- Invite a small 3–5-person consenting pilot before promotion. Use an accurate real approved-artist count, not WhatsApp seat totals or demo previews.

## Launch acceptance demo (record evidence)
From private Safari and Chrome, create a test Clerk user -> verify -> one canonical private node -> save draft -> sign out/in resume -> review request -> admin approve with exact fields -> share public profile permalink as signed-out visitor -> search by practice -> owner withdraw -> permalink becomes unpublished and graph/search no longer reveal the name -> test invalid token/cross-tenant API attacks with synthetic users. Repeat for an existing DCC CRM contact collision and Smart Sign deep link. Check automated build/test/lint, Supabase advisors and rollback.

**No production flags enabled, migrations applied for legacy tables, public member profiles published or main merges performed by this audit.**


## Controlled pilot decision and next validation checkpoint
- Founders are the two intended stewards; provision their exact verified Clerk subject IDs server-side in the preview environment. Do not use email or user-editable metadata for reviewer authorization.
- Pilot: 3–5 invited, consenting participants; no public enrollment; no automatic historical CRM claim. Airtable capacity is investigated, not upgraded or cleared automatically.
- Owner save and publication are revision CAS operations. Test the new migration in an isolated database using `supabase/tests/dcc_owner_passport_revision_cas.sql`. This is a sequential stale-operation/withdrawal smoke test, not a proof of simultaneous transactions. Also execute a two-connection concurrency test and provider-uncertain recovery before release.
- Founder-only identity queue is read-only. A manual resolution claim, independent recheck of verified Clerk email, reviewer evidence, one-to-one provider reservation/confirmation, and auditable decision remain mandatory. No scheduler configured until Vercel plan and runtime are confirmed.
- P2 browser checklist (preview only): signed-out 401; two separate member sessions with no cross-account access; new and held legacy identity; private draft and reload after conflict; explicit consent; founder approve and signed-out public projection; withdraw and verify directory/search/graph removal; repeated withdrawal; mobile Safari + Android Chrome touch and keyboard controls. Record test environment, commit, expected/actual and pass/fail, without real names or emails. Stop at first privacy leak or uncertain provider state. Production switches remain OFF.

## Revision-bound approved public snapshots (staged)
- Current public snapshot is independent of the editable owner draft and the in-flight provider grant. Finalization snapshots the locked consent revision, with only approved public fields; failed or stale replacement leaves the previous public row. Withdrawal deletes the snapshot under the same binding lock. No mutable Airtable or private draft content is used for website-member public reads. No legacy grant backfill. The public reader verifies active binding and the separate public visibility flag; older CRM People remain a separate legacy projection.
- Migration supabase/migrations/20261126140000_dcc_approved_passport_snapshots.sql and rollback-only SQL fixture are staged for disposable CI; do not apply live until validated and authorized. Public legacy graph excludes bound People; full live runtime/browser and RLS gates remain open.
