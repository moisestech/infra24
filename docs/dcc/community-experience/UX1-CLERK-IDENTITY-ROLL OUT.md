# UX1 — Clerk → private DCC membership rollout checklist
Status: DRAFT / NOT RELEASED · 2026-11-22
PR: https://github.com/moisestech/infra24/pull/72
UX contract: [MOBILE-JOIN-DISCOVER-SHAPE-UP-V1.md](./MOBILE-JOIN-DISCOVER-SHAPE-UP-V1.md)
Identity spec: [RFC-01-UNIFIED-WEB-MEMBERSHIP.md](./RFC-01-UNIFIED-WEB-MEMBERSHIP.md)

## Current code checkpoint
- \`lib/dcc/membership/clerk-event.ts\`: pure signed-event normalizer; verified primary Clerk email is represented as boolean only; no raw payload or email stored. The event is only trusted after signature verification in the route. Source/campaign allowlist helpers exist but **authenticated journey attribution is not yet saved**.
- \`app/api/webhooks/clerk/route.ts\`: verifies original raw request body using Svix, removes raw payload logs, and calls private Supabase capture RPC for created/updated/deleted behind \`DCC_MEMBER_EVENT_CAPTURE_ENABLED=true\`. Preserves existing Smart Sign organization membership behavior. No DCC People writes.
- \`supabase/migrations/20261122220000_dcc_platform_member_event_ledger.sql\`: staged schema, **not applied**. Unique private Clerk instance+subject identity and signed-event receipt ledgers; RLS and revoked public grants; service-role-only RPC; deletion tombstones; policy-cutover gating. No member can become ACTIVE until a separately verified People binding is written with the required \`airtable_person_id\`.
- \`app/api/dcc/membership/status/route.ts\`: authenticated, no-store, feature-gated safe statuses; never returns private IDs, email, origin or consent fields. A missing row is pending_sync, not false active.
- \`app/sign-up/[[...rest]]/page.tsx\`: explicit **pre-launch** disclosure and a path to preview community profiles. The go-live wording must be revised once enrollment is actually enabled.
- \`__tests__/lib/dcc-membership-clerk-event.test.ts\`: pure unit tests for feature-off, required cutover, verified/unverified creation, update/delete, no PII and bounded source metadata.

## Prerequisite blockers
1. **Supabase unavailable.** The connected \`infra24\` project \`gpprdwgyllgintrxekzg\` was INACTIVE on Nov 22 and table reads failed. Do not execute migrations, turn on the flag, or claim integration tests passed. The schema was staged in the repository because the Supabase CLI was not installed in the working container; regenerate/review using \`supabase migration new\` and the project version once database access returns.
2. **Migration validation.** Test migration locally against a fresh/Postgres-compatible schema and with production-adjacent permissions. Confirm public/anon/authenticated cannot select or invoke the RPC. Run Supabase advisors and database testing. The private account ledger is NOT the canonical People directory.
3. **Clerk instance and webhook contract.** Match the dedicated \`CLERK_WEBHOOK_SECRET\` to the intended Clerk instance. Configure Clerk webhook to deliver user.created, user.updated, user.deleted; re-check provider metadata semantics. Because delivery is asynchronous, don't block user tasks on a webhook being instantaneous.
4. **Legacy People reconciliation.** Airtable 52 rows / only 11 email fields populated at the last audit; no auto-match by name/WhatsApp/typed email. Before ACTIVE, implement a transactionally claimed People reference, an idempotent Airtable sync mechanism with a durable external key, explicit email collision handling, reviewer workflow, queue/retry/outage recovery and an account-deletion policy. No active membership path exists in this code slice.
5. **Organization roles.** The legacy Clerk handler still inserts \`org_memberships(role=resident,org_id=null)\`. The preexisting table's uniqueness/authorization must be reviewed. Its role must not be used as DCC membership or as authorization for private directory access.
6. **Signed event safety.** The event RPC is service-role-only and must only be called **after** signature verification; message IDs must be deduped, a deleted subject may not be resurrected and a \`user.updated\` without a signed \`user.created\` must not auto-enroll. A previously delivered account-created snapshot with unverified primary email can remain pending when events arrive out of order; implement provider re-read/reconciliation before ACTIVE and test the exact order cases.
7. **Source provenance:** The helper recognizes \`join\`, \`network-signup\`, \`atlas-add\`, \`passport\`, \`smart-sign\`, \`app-sign-up\`, \`event-qr\`, \`other\`, but no journey origin is yet persisted. Origin is a bounded, **untrusted marketing hint**, never identity evidence. Implement an authenticated consent-aware first/last-touch entry context record in a separate slice, then report opt-in aggregate acquisition outcomes. Avoid raw IPs, unbounded referrers or inferred relationships.
8. **Consent + UI:** Automatically joining must be stated *before* account creation, and public listing/marketing/WhatsApp/member-only access must never be automatic. Account deletion and withdrawal remain distinct. Current signup page explicitly says enrollment is **not yet live**; update atomically with tested go-live.
9. **Security reviews:** Webhook request size bounds, event/provider replay, provider outages, rate limit/DoS, email verification recheck, status endpoint auth, cache headers, negative tests, and cache-invalidated publication revocation.

## Flag and environment contract
All disabled by default. Do not set these until migration, security and provider checks pass:
- \`DCC_MEMBER_EVENT_CAPTURE_ENABLED=false\` (must be exactly \`true\` to attempt capture)
- \`DCC_CLERK_INSTANCE_ID=<verified instance identifier>\` (server-only; binds trusted event source)
- \`DCC_MEMBER_CUTOVER_ISO=<approved future UTC ISO timestamp>\` (fixed from deployment, never default to now)
- Existing \`CLERK_WEBHOOK_SECRET\` (do not print or commit), \`NEXT_PUBLIC_SUPABASE_URL\`, \`SUPABASE_SERVICE_ROLE_KEY\` remain server-only except the explicitly public project URL.
- This gate captures **pending provenance only**. A second, independently reviewed gate is needed before People activation and public snapshot projection.

## Release tests / Given-When-Then
1. Given flag OFF, when any valid Clerk webhook arrives, then no DCC event RPC is called and legacy application behavior remains.
2. Given flag ON without a verified cutover/instance, when webhook is processed, then request fails closed (503), not a membership success.
3. Given a valid signed user.created AFTER cutover, when verified primary email is true, then exactly one PENDING_RECONCILIATION identity is persisted; People count and public graph stay unchanged.
4. Given unverified user.created, when processed, then PENDING_VERIFICATION persists; no active node.
5. Given identical Svix message replayed eight times, when processed, then one event receipt exists and at most one identity row.
6. Given signed user.updated before user.created, when processed, then no ACTIVE membership; later created plus fresh provider check can reconcile.
7. Given user.deleted before user.created, when later created arrives or repeats with same ID, then deleted tombstone remains and neither DCC nor Smart Sign member is resurrected.
8. Given historical pre-cutover account creates a new login, when no signed eligible creation exists, then no automatic DCC active membership.
9. Given new verified identity with legacy email collision, when reconciliation is attempted, then reviewer queue holds it, no overwrite/no duplicate People ID.
10. Given an unauthorized anonymous or logged-in request to private ledger/RPC, when executed, then database refuses access; status endpoint sends only an allowlisted state to owning Clerk session.
11. Given provider fails during capture, when signed webhook runs, then 503 is returned for provider retry without logging PII or pretending success.
12. Given account created via Smart Sign, when welcome screen is shown, then source app remains available and optional profile onboarding does not block the requested app.

## Next vertical slice (not implemented here)
Implement atomic, server-only Clerk-subject → one People mapping with idempotent external reference and human-reviewed legacy collision resolution; add an authenticated \`/api/dcc/me\` and account source provenance bound to the canonical identity. Only then attach the single Your Profile/Passport editor. A verified, ACTIVE node is not created by UX1's event ledger by itself.

## Test evidence
- Source and BDD tests are committed on a draft GitHub branch.
- Full Jest suite, TypeScript typecheck, local Postgres migration, live Supabase security checks and real Clerk provider tests have **not** been executed/verified in this session.
- Do not merge this draft or enable live DCC memberships until those checks are complete.
