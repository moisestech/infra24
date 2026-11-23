# DCC Member → Passport → Atlas → Network Sculpture

**Implementation checkpoint:** November 22, 2026. Draft PR #72 only. Not merged, deployed, or enabled.
**Product contract:** [Mobile Join/Discover](./MOBILE-JOIN-DISCOVER-SHAPE-UP-V1.md), [Identity RFC](./RFC-01-UNIFIED-WEB-MEMBERSHIP.md).

## User-facing promise and copy
**Account creation:** “Your DCC account gives you a private place in the community. Once verified, your membership may contribute to the public network artwork as part of a delayed, anonymous group—not as an identifiable dot. Complete your Profile / Passport whenever you like. If you choose to make your work discoverable, your approved display name and selected practices can appear in the Atlas and connect to practice areas in the sculpture. Nothing identifying becomes public automatically.”

**Member editor:** “Your selections change the private sculpture preview now. Only information you explicitly request to share—and that DCC reviews—can become a public profile and practice connections.”

**Approved profile:** “Your profile may appear in public search and the artwork. Your email, private notes and individual account ID stay private. You can withdraw your public listing without leaving DCC.”

## State transition and data provenance
| Moment | Trusted data source | Durable result | Sculpture effect |
| --- | --- | --- | --- |
| Account created (any new Clerk account after cutover) | Verified Svix webhook, provider-created timestamp and instance | Private pending identity/event receipt | None |
| Email verified | Clerk provider re-read, safely serialized reconciliation | Pending reconciliation | None |
| Legacy CRM People candidate conflicts | Private People lookup against verified email | Review required, no blind claim | None |
| New verified, conflict-free account | Single-worker transactional claim, Airtable People record with private binding ID, idempotent verification | Exactly one active People identity with private node | No immediate public dot |
| Save private Passport | Authenticated owner, server validated profile schema | One draft tied to same binding | Only private on-device constellation preview changes |
| Request public listing | Separate consent version, member active, completed profile | Pending review | None |
| Steward reviews selected fields | Manual reviewer validates request, identity, scope and selected public profile fields | Explicit approved People projection, separate public consent and verified flags | One named public profile + declared practice-category edges at next public read |
| Steward publishes delayed cohort | Controlled aggregate cutoff at least 7 days after active membership; 5-member buckets and suppression; batch approval | Private approved weekly aggregate snapshot | Unlinked decorative website marks only; no member IDs, individual join time or interest edges |
| Member withdraws public listing | Authenticated owner bound to canonical People ID | Airtable public approval/consent turned off, draft marked withdrawn | Public search/graph no longer returns named profile on next fetch; live browser refresh needed |
| Member deletes account | Verified provider event | Deletion tombstone; no resurrection | No future public listing or cohort contribution; prior historical aggregates not individually reversible |

### Storage
- `dcc_platform_member_bindings`, `dcc_clerk_event_receipts`: private SQL migration (staged only). Active requires verification, Airtable People reference and activation timestamp; uniqueness is DB-enforced.
- `dcc_member_reconcile_mutex` and `dcc_member_reconcile_jobs`: one external create claim at a time. A provider result that may have succeeded but did not confirm is moved to review, **not blindly retried**. Owner linkage conflicts require human reconciliation.
- Airtable People: created `DCC Website Member Binding ID` (private field) on November 22. This is a reference to one identity, not a public ID. Existing People not mutated by this feature. Legacy unbound candidates cannot be acquired by email alone.
- `dcc_member_profile_drafts`: private editable draft, separate public request consent.
- `dcc_member_entry_attribution`: private first/last-touch source allowlist, non-authoritative marketing metadata; no individual referral graph.
- `dcc_public_sculpture_snapshots`: previously approved weekly aggregate counts, no names or account IDs.
- Airtable Atlas approved public fields: Display Name, Short Bio, Public Skills, Atlas Interests, Atlas Public Links, Profile Slug. Public projection additionally requires `Atlas Publication State=Approved`, `Atlas Public Consent=true`, `Atlas Identity Verified=true`, `Public Profile?=true`. A portfolio link is optional. NEVER set those approval flags from the owner save or signup webhook.

### Actual branch modules
- `/join` and `/network/signup` feature-gated Join handoff to `/network/your-profile`; historical CRM intake remains an explicitly labeled contact request while membership is off.
- `/sign-up` has accurate server-gated copy and safe internal return navigation; includes explicit directory/sculpture choice copy.
- `/api/webhooks/clerk` verifies raw signed events and captures pending identity behind feature gate.
- `/api/dcc/membership/reconcile` is an authenticated, feature-gated worker; must be scheduled/operated independently after providers are restored and tested.
- `/api/dcc/me`, `/api/dcc/me/publish`, `/api/dcc/me/visibility`, `/api/dcc/me/entry`: private owner draft, review request, withdrawal and limited attribution.
- `/network/your-profile`: mobile editor with six existing categories, optional practices/summary/links, explicit public review consent, private constellation preview and withdraw action.
- `/api/dcc/sculpture/public`: same allowlisted approved profile projection used by Atlas and the sculpture, plus delayed aggregate website presence. No raw CRM, private drafts, emails or Clerk subjects.
- `/api/dcc/sculpture/publish-snapshot`: guarded manual/scheduled publisher, OFF by default; no signup hook runs it.
- `PeopleNetworkField`, `PeopleNetwork2D`, `CollectiveNetworkArtwork`, `CommunityAtlas`: 2D/3D rendering of approved people and category connections plus independently labeled historical WhatsApp backdrop, multi-select poll marks and delayed website cohort.

## Remaining launch blockers — DO NOT enable
1. **Database inactive / migrations unapplied:** connected Supabase `infra24` was INACTIVE at latest check. Need restore test access and apply audited migrations in order; review RLS/function security and account instance.
2. **Provider/route runtime tests:** no full Jest, TypeScript, Playwright, signed Clerk or live Airtable concurrency/security test has passed for this draft. Validate on staging accounts first.
3. **Manual reviewer workflow:** a public listing request is recorded privately. Staff must inspect verified consent and identity, choose exact public content, check unique slug and write approved People fields, then confirm revocation semantics. An automatic approval endpoint is intentionally NOT added; owner requests must never publish themselves. Design a reviewer UI with race protection before general rollout.
4. **Stable migration recovery:** inspect existing People legacy matches. Confirm Airtable schema, record limit and recovery for stuck `dcc_member_reconcile_jobs`. A single cross-provider create cannot be perfectly atomic: ambiguous writes remain held for manual review.
5. **Withdrawal speed:** public endpoint has no-store. Existing open browser tabs refresh on their next poll (currently ~60 seconds); immediate in-tab removal would require push/invalidation design. Do not claim instantaneous visual erasure before that gate passes.
6. **Cron operation:** worker and snapshot publisher endpoints are implemented but NO deployment cron schedule has been installed. Choose Vercel plan-compatible cadence, credentials and provider health before enabling.
7. **Member source:** account acquisition `app-sign-up` default and accurate Smart Sign/app-specific first touch need a verified entry-flow mapping; browser-provided attribution is only a hint and cannot change authorization.
8. **Founder-approved editorial examples:** Moises/Fabiola/Angelo are examples in repo, not evidence of live account verification or new directory consent. Keep them labeled editorial when appropriate.

## Flags (all OFF; server only)
`DCC_MEMBER_EVENT_CAPTURE_ENABLED`, `DCC_MEMBER_RECONCILIATION_ENABLED`, `DCC_MEMBER_PROFILE_ENABLED`, `DCC_SCULPTURE_SNAPSHOTS_ENABLED`, `DCC_SCULPTURE_SNAPSHOT_PUBLISH_ENABLED`. A production cutover timestamp, Clerk instance, private Airtable credentials and CRON_SECRET are separate. Never enable the profile/Join UI unless its backend and migrations are confirmed.

## BDD release assertions
- New verified Smart Sign account with no People match: one active internal member after authenticated reconciliation; no public named node and no immediate anonymous mark.
- Legacy People match: pending review without takeover or second People row. Stale webhook/create/delete retry does not resurrect.
- Owner saves chosen categories: one private draft and private preview; zero public practice edges.
- Owner requests publication but no reviewer decision: no named node, no public practice edge.
- Reviewer approves distinct allowed fields and exact consent: Atlas search and both 2D/3D sculpture show one named person and exactly selected practice edges, no private field serialization.
- Owner edits an approved profile draft: published version remains unchanged pending separate approval; no silent public revision.
- Owner withdraws: public API read no longer returns profile and edges; already-open clients remove on next scheduled refresh.
- Delayed website cohort: a single new account cannot cause a detectable immediate count change; a reviewed week can publish coarsened anonymous marks separate from WhatsApp and poll selections.
- No installed DB, missing provider permissions, bad signed event, collision or unavailable review: fails closed with an honest message and no fake success.
- Mobile at 390×844, iOS Safari, Android, keyboard, reduced motion and no WebGL: member can navigate and find approved profiles without using 3D.

**Status:** Staged feature code and Airtable binding FIELD exist. User data migration, live member creation, reviewer approval, snapshot publication, cron scheduling, full CI and deployment are not completed.

## Privacy regression verified in code (test execution pending)
When the public Atlas API is configured and returns a live profile list, that list is authoritative: the three editorial featured profiles do not reappear in the directory or sculpture after withdrawal. The historic founder-reported WhatsApp backdrop remains the same number of marks, but any no-longer-approved previously featured person becomes an unidentifiable reported-position mark and its public edges are removed. Explicit empty live input means zero named nodes. See BDD cases in `__tests__/lib/dcc-sculpture-profiles.test.ts`. Only PREVIEW mode shows the editorial examples as labeled previews. This behavioral contract must be tested in an actual browser before release.
