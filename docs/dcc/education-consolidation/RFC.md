# AI24 → Infra24 education and commerce consolidation RFC

Status: proposed, planning only | 2026-11-26 | Tracking: #85
Source: [ai24-live pinned commit](https://github.com/moisestech/ai24-live/tree/a1e5fac92ebea4d960e9b09cf275083dcf102ca6)
Target: [infra24 planning baseline](https://github.com/moisestech/infra24/tree/6ea68a31d0a57b66319fcc2b22a29482c064aaf1)
Dependency: Passport #72 / #75; observed head 70358e1a997cfeebbd83bb920ea0895da802870d, still open when planning began. Recheck before implementation.

## Decision record
D1. Infra24 is the canonical shared platform; DCC and AI24 remain distinct brands. Existing organization boundaries and human-reviewed Passport publication remain intact.
D2. Founder reports no historical students or transactions. Treat migration as IP/schema reconciliation, not customer ETL; independently verify source data and storage before retirement. No historical identity import.
D3. Prefer existing workshop engine, organization routes and MDX renderer. One source of curriculum truth in Git, database for runtime catalog/registration/progress; stable course/chapter IDs and versions. Do not copy an entire app or automatically publish imported content.
D4. Keep Clerk/Passport as identity authority. A paid workshop does not confer DCC membership or public profile permission. Learning history private by default.
D5. Use one commerce service with trusted server prices, explicit organization and member binding, signed idempotent webhooks, unique event/order IDs, replay handling and refund reconciliation. Stripe test mode only until approval; no live charges, subscriptions, Connect onboarding or tipping.
D6. Avoid new paid services; local disposable Postgres/Supabase and fixtures for destructive tests. No production writes or deployments in planning. No deletion of AI24.

## Evidence and first-pass triage
The companion reconciliation-manifest.json inventories all 2,116 source blobs with pinned SHA, byte size, candidate target and provisional classification. Counts: IMPORT 182, ADAPT 62, DEDUPLICATE 137, REVIEW 232, ARCHIVE 1,503. ARCHIVE means leave in source, not delete. Matching paths do not prove equivalence. Rights, licensing, content quality, duplicate slugs, MDX imports and media dependencies require human/technical review. Source has 23 workshop directories and 168 Markdown/MDX chapter files; target has 8 workshop directories, including overlapping AI filmmaking slug. Start with a single AI Art Fundamentals chapter set rather than bulk copying 50 numbered chapters and older parallel material. No actual content copied in this PR.

Code references (source paths at pinned SHA):
- src/features/learn-canvas/services/enrollmentService.ts versus target features/learn-canvas/services/enrollmentService.ts: both use localStorage mock enrollment; target Passport audit also found mock Pro entitlement. Do not use for authorization.
- src/app/api/stripe/create-checkout-session/route.ts accepts caller-supplied user identity; webhook logs part of signing secret. Preserve patterns only, never copy trust/logging behavior. Rotate any exposed secret if confirmed in use.
- target lib/stripe/service.ts and disabled webhook/payment routes: existing service is a candidate for repair, not a working payment guarantee.
- target lib/workshops/public-markdown-chapters.ts and lib/workshop-engine: reuse and test.

## Database reconciliation
Earlier read-only check: connected Infra24 DB had 9 organizations, 4 workshops, 8 chapters, 0 progress rows, 3 bookings, 1 membership; source AI24 DB not accessible in that audit. Missing public workshop_registrations, workshop_sessions, courses, enrollments, user_subscriptions, payment_transactions. Recheck live schema before proposing additive migrations; avoid parallel course/enrollment representations if existing workshop model suffices.
Seven legacy tables (resources, bookings, booking_participants, submission_forms, submissions, artist_tips, organization_donations) had RLS disabled and broad anon/authenticated grants. Coordinate remediation with Passport consumer audit, define least-privilege policies, test authorized and unauthorized paths before enabling RLS, do not blindly execute SQL. No production data or secrets in public repository.

## Delivery gates
| Stage | Output | Acceptance |
| --- | --- | --- |
| P0 planning | RFC, machine-readable manifest, issue #85 | pinned inventory complete; decisions and blockers explicit; review required |
| P1 vertical slice | one approved workshop + linked assets + catalog | existing renderer, stable slugs, valid MDX, no broken references, mobile review, build/type/lint/tests; no new dependencies without justification |
| P1 schema | migration plan and local schema tests | canonical member/org/workshop IDs, FK/unique constraints, tenant isolation, RLS and rollback/recovery tested |
| P1 enrollment | one authenticated learner journey | register, resume progress across sessions; wrong user/org denied; no mock entitlements |
| P2 commerce | one test-mode paid workshop | checkout server-bound identity/price, verified webhook, duplicate/reordered event tests, cancellation/refund; no live keys |
| P2 Passport | instructor-verified completion | learner consent, private default, review/audit, revocable publication; no automatic membership |
| P3 distribution | shared brand routes, institution portability | validate redirects, SEO, branding, tenant isolation, backup and explicit retirement approval |

## First implementation handoff
Re-read #72 and #85, verify exact main/release SHA and green CI, then create a separate implementation branch from approved baseline. Read repository instructions. Select a single rights-cleared chapter set and inspect its frontmatter, links, embeds and assets; generate an explicit allowlist. Adapt into the existing renderer without auth or database changes. Add catalog/render regression tests, run standard and security CI, report SHA and outcomes. Stop before any release or schema change. If Passport is not approved, continue read-only manifest review instead.
Future maintainers: update the issue and this RFC with evidence, decisions, tests and outstanding risks. Do not infer release approval from this planning document.

## Sprint 1 checkpoint — 2026-11-26
See [reconciliation evidence](SPRINT-1-RECONCILIATION.md) and [conditional import allowlist](ai-art-fundamentals-allowlist.json). All 53 chapter blobs inspected; six source-published, two conditional plain-Markdown adaptation candidates, 51 held. Zero authorized imports until editorial/rights approval and verified Passport release baseline. Existing public reader is Markdown-only, ignores chapter publication flag, and catalog tenant defaults to Oolite; address these explicitly before implementation. No application code or runtime changes.

## Sprint 2 checkpoint — 2026-11-26
See [editorial drafts, catalog reconciliation and ranked backlog](SPRINT-2-EDITORIAL-CATALOG-TAXONOMY.md) and [23-course taxonomy crosswalk](curriculum-taxonomy-crosswalk.json). Two revised lesson drafts for review, old source links omitted, no assets selected. Read-only DB inspection found no DCC/AI24 org row and only Oolite's two published workshop rows; do not reassign partner tenancy. Use synthetic isolated fixture pending owner and release approval. Passport acd368b exact-head CI green, draft still gated. Taxonomy maps offerings to aggregate discovery categories, never members or verified skills. No imports or runtime changes.

## Sprint 3 checkpoint — 2026-11-26
See [architecture and security audit](SPRINT-3-ARCHITECTURE.md) and [synthetic fixture contract](education-pilot-fixture-contract.json). Vercel project now accessible; no catalog org override listed, provider isolation unverified. Live workshop/chapter public SELECT policies and privileged unfiltered API reads require a consumer and authorization audit before importing. Legacy sharing depends on absent relations. Reuse existing workshop/metadata/Markdown shapes for isolated static pilot; no new tables needed for that slice. Twelve acceptance scenarios, five grant states. Prioritize P0 access contract and catalog route/tenant verification while Passport remains draft. No runtime changes or production writes.

## Sprint 4 checkpoint — 2026-11-26
See [access control and consumer reconciliation](SPRINT-4-ACCESS-CONTROL.md) and [31-route matrix](education-consumer-matrix.json). Static filename-scoped inventory: 18 P0, 13 P1; 19 referenced legacy relations absent in public schema. Middleware public API prefixes require per-handler authorization. Prioritize shared access/DTO contract, direct SDK and indirect consumers, public catalog route reconciliation and isolated negative regressions before any new content. Passport dae0ca9 draft, exact-head checks in progress when inspected. No runtime changes, migrations or application tests executed.

## Sprint 5 checkpoint — 2026-11-26
See [shared authorization specification](SPRINT-5-AUTHORIZATION-CONTRACT.md) and [machine-readable contract](education-authorization-contract.json). Catalog consumers and chapter alias mismatch reconciled statically; unknown status/price defaults must fail closed. 31 route files / 48 method entries mapped, 54 synthetic reference decisions matched (15 allow, 39 deny); not actual application tests. Passport dae0ca9 exact-head standard/security CI now green but draft approval and runtime gates outstanding. Stop speculative architecture; proceed to actual isolated implementation only on approved baseline, with full consumer/build verification and explicit rights approval before importing content. No production or runtime changes.
