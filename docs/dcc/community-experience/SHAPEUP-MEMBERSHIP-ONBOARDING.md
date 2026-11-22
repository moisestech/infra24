# Shape Up — DCC One Membership / One Profile / One Public Boundary

Status: IMPLEMENTATION DRAFT — no live member enrollment, provider binding or graph snapshots enabled
Date: 2026-11-22
Source: RFC #72 and Profile/Passport V1. Decisions A and Q2 are approved. All NEW platform accounts after cutover enter the DCC membership lifecycle, including Smart Sign. Existing accounts are not retroactively imported.

## Problem and appetite
The site has three separate affordances: a CRM email-based Join, a staged Atlas profile request, and a local-only Passport. They feel like multiple enrollments and may mislead people that a submission verifies identity or publishes a profile. The graph currently mixes editorial previews, a WhatsApp-reported backdrop and poll selections. A trustworthy system must make belonging durable while refusing to leak identities, interests or event-level presence.

Two-week product bet: prove the smallest join-and-return journey with a real verified session and one canonical People record, then a separate snapshot/publication pilot. Shape work to verified identity, reusable profile, explicit consent, and measurable usefulness. Cut optional photos, relationships, intro automation, activity history and member-only directory first.

## Boundaries / non-goals
- NEW platform account creation (Smart Sign included) automatically enters the DCC lifecycle after policy cutover. Pre-cutover accounts do NOT auto-enroll just by signing in; explicit Join is supported.
- A verified session is not an identity match to legacy Airtable People by email. Existing unmatched People require ownership review. No silent mass migration or duplicate writes.
- People remains DCC's canonical person/profile projection; a transactional provider-subject ↔ People-ID uniqueness index may be required, but must not be a second public people directory.
- Internal membership node is derived from one verified active People binding. Never create graph nodes on login/profile reads/Passport edits.
- Public named profile, public practice edge, anonymous cohort, WhatsApp minimum and poll selections are distinct data products. They have different evidence, permission and denominators.
- No frontend graph integration until authenticated create-or-get, revocation, publisher and cache tests are green; do not connect private CRM records to client components.
- No automatic WhatsApp import or invitations; no speculative member activity or AI ranking. No automatic public profile when a platform account is created.

## Solution sketch
1. All new platform account signup paths initiate private pending DCC membership with clear pre-signup disclosure. Existing /join and campaign links remain; older accounts can choose Join.
2. Server-verified Clerk principal is checked against a provider/subject binding. If found, reuse; if absent, require verified contact and inspect unbound legacy People candidates. Any collision enters manual review. Only a store with atomic unique constraints may create a verified membership.
3. A server-confirmed verified membership is distinct from a CRM prospect submission. Initial private profile can be empty. Returning users see the same editor; Passport is the edit mode, not a new registration.
4. Member drafts, public scope grants, consent versions and reviewer approvals are separate events. Public directory and artwork share exactly one reviewed allowlisted profile projection. Revocation hides that projection immediately and invalidates cached copies.
5. A scheduled, reviewed publisher gets a COUNT of verified active DCC website members. It outputs a weekly, delayed, five-person bucketed cohort with a five-person minimum. No individual records, IDs, join timestamps, practice links or stable member pseudonyms leave the server. WhatsApp lower bound and poll selections remain separate without a unique sum.
6. A successful receipt is shown only after confirmed persistence. An outage retains input and shows no membership success. Older /api/dcc/signup is a CRM contact/prospect action until replaced, not proof of verified web membership.

## Rabbit holes / risks
- Airtable email upsert is not atomic, so concurrent web joins must NOT call it as a membership uniqueness primitive. Introduce a server-side unique provider-subject + person reference binding and reconcile writes with an idempotent outbox; never read-then-create from the browser.
- Airtable People capacity and reviewer bandwidth can block live pilot; no silent queue promises. A prospective write is not verification.
- Clerk account for Smart Sign is broader than DCC; explicitly map only DCC enrollment intent.
- A five-person minimum and weekly bucket are starting guardrails, not proof against inference. Privacy review must challenge successive snapshots, small changes, source counts and repeated polling.
- Legacy marketing confirmation and welcome email currently say joined even when email verification is absent. Rewrite before release.
- Member-only public access is postponed until independently authorized.
- Supabase auth/role rules and production Vercel config need actual credentials/CI inspection; no fabricated end-to-end claim.

## BDD: acceptance contract (Given / When / Then)
- Given a new person with a server-verified identity, when they complete Join DCC, then exactly one canonical active membership exists and their profile stays private.
- Given a NEW Smart Sign account after policy cutover, when verified account creation evidence and owned credentials are confirmed, then a DCC membership is created once, without a separate Join click. A pre-cutover account sign-in does not retroactively enroll.
- Given an unverified email, when Join is requested, then the request remains verification-required and the public and internal verified-member count do not change.
- Given an unbound legacy People email match, when a verified account requests Join, then the person is held for ownership review and neither person is overwritten.
- Given the same verified member using Join, a QR link, two devices, Add profile, and Passport, when requests repeat or race, then the atomic unique binding returns one People member and one internal graph node.
- Given an active private member, when they edit Passport, then no public person fields or practice edges are emitted.
- Given an approved public profile and authorized practice, when the shared projection refreshes, then search and artwork show exactly one named record and only approved links.
- Given a public withdrawal, when it is accepted, then search, card, profile URL and graph cease emitting the profile or edges and caches invalidate.
- Given one new join, when the public graph is fetched before the next approved delayed batch, then it does not gain a new mark.
- Given a cohort below the minimum, when a snapshot publishes, then the website-member mark count is suppressed.
- Given 12 verified members and a safe prior cutoff, when a weekly snapshot is published, then the graph may show 10 unlinked decorative marks; the WhatsApp and poll figures are shown separately and no unique member total is claimed.
- Given repeat publication within the same snapshot week, when the true count changes, then the public snapshot does not change.
- Given provider outage, when membership persistence fails, then no successful receipt is returned and the user retains their inputs.
- Given a signed-out visitor, when they open the directory, then only approved public data is visible; steward-only or member-only requests cannot bypass server authentication.
- Given reduced-motion, screen-reader, iOS Safari at 390×844 and Android, when they use the journey, then they can complete or exit each step with visible focus and 44px targets.

## Vertical slices and gates
S0 — Vocabulary and contract (this PR): membership lifecycle domain interface, verified NEW platform-account automatic eligibility (not pre-cutover account sign-in), BDD regression definitions, delayed snapshot projector; no production wiring. Needs CI run.
S1 — Verified enrollment: server-side Clerk session proof, atomic binding + People reconciliation, idempotent retry/outbox, honest UI receipt; provider/quota and identity-collision test.
S2 — Unified owner editor: /join + Atlas CTA + Passport route use one profile after verified ownership; no duplicate questionnaires, draft/review/visibility event history.
S3 — Publication: one allowlisted profile read for directory/artwork; revocation and cache invalidation; periodic reviewed anonymous snapshot cron; no per-event API.
S4 — Pilot: 10 volunteers, 2 successful searches, 1 mutually approved useful connection; measure median completion time, conflicts, review minutes, suppressed public deltas and withdrawal latency.

## Done means
One verified DCC enrollment resolves to one durable member regardless of entry, an unverified CRM contact never pretends to be a member, public views never expose private data, provider outage and collisions fail closed, and mobile testing plus real-provider end-to-end are documented. Keep production disabled until all S1–S4 gates are proven.


## Q2 founder lock and security correction — November 22
Earlier DCC-specific-only enrollment is SUPERSEDED. New accounts across the platform enter DCC automatically after cutover; verified identity, collision review and atomic persistence precede an active internal node. This must be visible in Smart Sign onboarding copy. Member-only access remains disabled; public profiles, interests and marketing still require separate permission. Before any live integration remove personal webhook payload logging, add signed-event idempotency/out-of-order protection, check existing role=resident semantics, secure a private one-to-one Clerk↔People binding and resolve legacy collisions. See RFC §10. No live behavior changed.


## UX pitch and first-use journey (November 22, 2026)
A detailed mobile-first breadboard, value-first copy, source attribution schema, three editorial pilot example cards, six existing practice lenses, 18 BDD scenarios, and launch scorecard now live in [MOBILE-JOIN-DISCOVER-SHAPE-UP-V1.md](./MOBILE-JOIN-DISCOVER-SHAPE-UP-V1.md). This is the UX companion to the identity/security RFC, not a second signup service. The two-week appetite is for a verified private member + clearly explained one-account entry, optional owner practice editor and accessible browsing. Public profile publication and anonymous population snapshots remain separately gated. Cut AI matching, member-only, intros, photo upload and graph redesign before trading away privacy correctness.
