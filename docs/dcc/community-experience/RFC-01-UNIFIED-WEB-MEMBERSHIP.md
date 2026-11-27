# RFC 01 — One Website Membership, One Node, One Editable Profile

Status: **Q1 A and Q2 automatic new-account enrollment LOCKED; implementation security gates open; not released**
Date: 2026-11-22
Owner: Moises Sanabria + Fabiola Larios
Changes the interpretation of: [V1 Product Specification](./PROFILE-PASSPORT-V1-SPEC.md) §3–6 and §8; [execution issue #68](https://github.com/moisestech/infra24/issues/68).

## 1. Revised premise

DCC website **Join, Sign up, Sign in, Add profile, and Passport must be entry points to one underlying membership system**, not different opportunities to become multiple people or submit repeated questionnaires. Once someone *successfully joins DCC through the website* they have one canonical internal **member identity / person node**. Their public profile and disclosed practice connections develop from that member over time.

Important clarification: **logging in is not another join**. It restores an existing verified identity, and must never create a duplicate graph node. Generic authentication elsewhere in infra24 (Clerk's existing Smart Sign routes, organization profiles, dashboards) is currently distinct from DCC membership; Q2 is now decided: all newly created platform accounts after the policy cutover enter DCC automatically, including Smart Sign; earlier accounts do not auto-backfill.

WhatsApp membership is independent. The historic 101 minimum-count positions are *reported community scale*, not a verified unique website-membership roster; do not simply add website registrations to 101 or silently subtract anonymous dots. A website DCC member might also belong to WhatsApp; identity intersection is not currently known.

## 2. Audit of current divergent implementation

| Entry | Current action | Problem |
|---|---|---|
| `/join` | Redirect to `/network/signup` | Starts older DCC CRM quick/full forms; no durable member-facing profile account. |
| `POST /api/dcc/signup` | Look up/upsert Airtable People by supplied email; send welcome email; returns recordId and "You're in" | Does not prove email ownership, exposes internal record ID, and should not be used as authenticated self-service edit. |
| `/sign-up`, `/sign-in` | Clerk auth UI for **Smart Sign**, redirects to `/dashboard` | An auth account alone is not currently mapped to canonical DCC People. UI/style/product context also mismatched with DCC. |
| `/network/community` → Add Public Profile | Separate Atlas form posts staged profile to `POST /api/dcc/atlas/intake` | Another set of required fields and a public-only consent checkbox. Pending intake is NOT member enrollment. |
| Atlas → Passport | `sessionStorage` draft | Not durable/verified; distinct form from Join/profile; can be lost. |
| `/network/artwork` | 101 reported person-position marks + three hard-coded featured artists; 72 unattributed poll selections | Website joins do not add live person nodes; named Atlas-approved profiles are not yet the sole graph source. |
| `/api/users/me` | Clerk + Supabase org-membership lookup | Authenticated organization account is not proof of joining DCC. |

## 3. Proposed product semantics: one member, many states

`Person` (canonical DCC People ID, private) has orthogonal facts, NOT separate registrations:

- `auth_identity`: unverified email request / verified session identity / identity binding conflict.
- `dcc_membership`: none / pending verification / active web member / withdrawn or suspended. **A successful verified DCC website join** creates or resolves this membership exactly once.
- `profile_completion`: basic / enriched. Required just to join: very few fields; a long bio, portfolio and photo must never be prerequisites.
- `profile_visibility`: private (default), member-only (only when permissioned member auth really exists), public (explicit opt-in), hidden/withdrawn.
- `profile_review`: draft / pending / approved / requires changes; PUBLIC named discovery requires permission, validation and approved fields. A confirmed membership is not blocked on editorial publication.
- `graph_projection`: one internal person node for each verified DCC website member. **Decision A approved, November 22:** an anonymous, non-identifying public presence mark may represent a website member without making their name, interests, profile or interpersonal edges public. Named nodes still require effective reviewed public consent. Public anonymous rendering is **snapshot-derived**, not a one-to-one client-readable identifier and not necessarily real-time.
- `interests`: optional **self-declared**, multiple of the six canonical topics, editable over time; never inferred from WhatsApp ballots. Only publish profile→practice edges when those interests have an effective authorized public scope.
- `network_joins`: documented interpersonal links require their own evidence and appropriate permissions.

**State transition** (proposed):

1. Any DCC Join / Create profile / Passport CTA → one **Join DCC** journey.
2. Anonymous entry → minimal name + email; identity proof / session establishment handled once. Existing verified identity → prefill and resume. New Smart Sign/platform account creation after cutover initiates DCC enrollment; existing accounts are not imported on sign-in.
3. On confirmed server-side *DCC enrollment* → reconcile to existing People once; write a durable membership transition with idempotency key; create the **internal person node** once. If not yet verified, hold pending rather than claiming active verified membership. Re-entries and sign-ins reuse this node.
4. Ask about optional practice interests / public website / photo (progressive, skippable), then visibility. A private member remains a member and keeps the internal node.
5. Public-facing directory + artwork receive only approved public projection; public status/interest edges can update when review succeeds, not when someone merely clicks a local preview.
6. Passport is the **same person's authenticated profile editor**, not a parallel account or another form. It can record optional future activity and consent-scoped relationship events.
7. Revocation or withdrawal updates profile, public graph and cache immediately; internal audit remains appropriately restricted.

## 4. Minimal mobile UI — no redundant forms

**One screen series**, not three signup products.

- **Entry**: "Join DCC" if new, "Your profile" if recognized, and "Sign in" as a small text link. The same design language, no Smart Sign dashboard branding in a DCC join experience. Existing /join and campaign QR aliases can resolve to the same flow without dropping attribution.
- **Essentials**: name, email / session verification; a **Continue** button. Join itself should not require a public website, detailed skills or six interest selections.
- **Make it yours**: select interests, say what you do, add a site/image, or **Skip for now**. All fields write to the same verified member draft. Give immediate clarity: "You're part of the network; your public profile is private until you choose otherwise" only when membership creation is confirmed.
- **Visibility preview**: one short clear disclosure, private default. Named public listing requires explicit approval/review. Member-only only if access control is deployed.
- **My profile**: one place to edit, hide, resume, add a portfolio, offer help, and see meaningful associations. Never ask for name and email a second time.

Directory and graph remain browseable without joining. No emoji, giant repeated headings, lengthy onboarding exposition, intrusive opt-ins or overlapping fixed controls. 44px touch targets, 16px input text, dark/light contrast, reduced motion and actual phone QA.

## 5. API/domain reconciliation (NOT yet deployed)

Define server-owned `resolveDccPerson(authIdentity)`: authenticated user id → verified binding → existing People reference. No blind name/email upsert from an unsigned form, no exposing People/Airtable record IDs.

- `POST /api/dcc/membership/join`: idempotent enrolled-member creation/resolution after verification, with source/attribution; always returns a safe public `memberStatus` and `nextStep`, never CRM IDs.
- `GET /api/dcc/me`: authenticated member state + own editable fields + effective publication.
- `PATCH /api/dcc/me`: update owned private profile draft (including interests, links), versioned and server-validated.
- `POST /api/dcc/me/publish`: independent explicit public disclosure + content review request, not automatic publication.
- `POST /api/dcc/me/visibility`: revoke/hide; effective withdrawal hides immediately from public projection.
- `GET /api/dcc/network/public`: only safe projection of approved public people and authorized practice links, with separately labeled aggregate counts and anonymous poll-selection marks.

**Compatibility plan**: keep /join, /network/signup and historical campaign links functional; route new DCC joins to the single editor once it is built, but do not repurpose Research Suggestion, Workshop, generic /sign-up or Smart Sign without an explicit decision. Existing CRM signup submissions must be reconciled with verified identity, never mass-inserted again. Keep Atlas intake staging until migration tests and provider quota pass. No duplicate storage for "Passport members".

## 6. Graph correctness and privacy

- **Internal graph**: one canonical member node per joined website member (subject to verified identity/appropriate lifecycle), independently of public listing preference. Multiple visits, QR sources, sign-ins and submissions do not create additional nodes.
- **Public graph**: **DECIDED A** — verified active DCC website members may contribute anonymous presence marks to a separate *verified website community* cohort. Public named profiles and person→practice edges appear only when separately approved; no automatic interest edges. Never reveal private member identifiers, exact join times, verified emails, or a stable anonymous fingerprint. Publication must follow the privacy guardrails in §6.1.
- **Edges**: declared practice after permission; two-person links after documented agreement. A WhatsApp poll response is never transferred to a named member without evidence and permission.
- **Three denominators must never be summed as if disjoint**: (A) WhatsApp reported minimum membership positions; (B) distinct verified DCC website members; (C) aggregate poll *selections* (multi-select 72).
- **Website cohort vs WhatsApp**: show the verified website cohort as a separately named layer (not added to the reported 101 WhatsApp lower-bound positions); the two populations may overlap. Never present their sum as unique membership. Suppress or coarsen sparse counts and do not publish event-by-event updates.


### 6.1 Decision A — anonymous public website cohort, privacy-preserving contract

The internal model contains **one canonical node for each verified, active DCC website membership**. An opaque, server-only person ID is used for deduplication and authorization. A graph viewer must **never** receive or reverse-map that ID.

**Public snapshot projection** (proposed, not implemented):
- A server-approved, **delayed snapshot** derives the active verified DCC website member population and a count of public presence marks; never emit a live "someone just joined" event, new-user timestamp, hashed email, account slug, or stable pseudonymous member key.
- Generate decorative per-snapshot marks from an aggregate count, **not directly from serialized People records**. Marks may be re-laid out on each snapshot; a mark carries no identity, practice, membership event, or attached person-specific link.
- **Minimum-cohort and cadence gate required** before enabling this endpoint: propose at least five verified website members for an initial public cohort, then publish in batched periodic snapshots (e.g., weekly), with small changes held/coarsened until safe. The five-member threshold and cadence are **initial engineering guardrails for review**, not yet approved site policy or guarantees of anonymity.
- Named, reviewed public people may appear separately in the exact same artwork **without an implicit one-to-one crosswalk** to anonymous marks. Do not subtract or deterministically join named profiles to mark slots unless safe deduplication can be proven without leaking identities.
- Keep **three labeled quantities** in both API and presentation: `reportedWhatsAppLowerBound` (101 from prior report, uncertain overlap), `verifiedWebsiteMemberPresence` (published, possibly suppressed/coarsened cohort), and `pollSelections` (72 historical multi-select choices, not people). Do not sum these as unique humans.
- Privacy controls must remain transparent: membership onboarding copy should disclose the anonymous **aggregate** participation mark; public profile publication remains a separate unselected choice, with a hide/withdraw option backed by a tested authorization path.
- Server must return **no raw web-member list**, no individual join dates, no "last member added" metadata and no per-user interest edges on this cohort. Ordinary unauthenticated API inspection, cache freshness and timing tests must enforce this.

**Examples**:
1. First verified web DCC join creates one internal node. With the website cohort below the publication threshold the public graph does **not** instantly display a new distinguishable dot.
2. Five or more verified members exist and a reviewed batch publishes: the graph may render a coarsened count of anonymous website-presence marks; these do not link to member profiles, polls, or interest hubs.
3. Member edits Passport, uses a QR link, signs back in, or submits an optional public-profile revision: **zero extra internal nodes**. Approved public profile representation changes separately; anonymous aggregate snapshots must not permit tracing the person.
4. Website member also belongs to WhatsApp: **one website identity**, but do not assume the WhatsApp aggregate and website cohort can be added into a unique total.

## 7. Acceptance tests before live release

1. New DCC join from /join or /network/signup creates **exactly one** canonical DCC Person after successful identity verification/enrollment.
2. Signing in repeatedly, coming from a second device or using a different campaign URL produces **zero additional person nodes**; same /me profile prefilled.
3. A user with an existing CRM email but no verified owner binding cannot take over or publish that record.
4. An existing Clerk Smart Sign login is not automatically a DCC member unless the founder explicitly chooses that rule.
5. A member who stays private remains a valid internal member; their private email, identity, fields and interest graph edges are **absent** from anonymous public JSON.
6. On voluntary public profile approval, **exactly one** named node and its authorized practice edges appear in directory and artwork; withdrawal removes both.
7. The 101 reported WhatsApp count and 72 poll selections remain separately labeled; site registration cannot inflate them or imply verified voter identities.
8. Functional error paths: identity collision, duplicate simultaneous submissions, provider timeout/capacity, logout, revocation, disabled member-only, and empty or partially filled profile.
9. Browser QA 390×844 iPhone, Android, desktop, keyboard/screen reader, both themes; no speculative node changes on a failed write.
10. Only after actual verified production end-to-end tests should the WhatsApp group receive a public onboarding CTA.

## 8. Founder decisions (answer in conversation, in order)

**Q1 — DECIDED A (founder, November 22, 2026).** Every successful, verified **DCC website** enrollment creates or resolves exactly one internal person node. An anonymous public presence mark **may** appear for that member, but only through a privacy-safe published snapshot; their identity, interests, join time and relationship edges remain private until separately authorized. It is **not** a claim that the historic WhatsApp roster was reconciled or that a 1:1 viewer-addressable anonymous account ID is safe. No public-update behavior is live yet.

**Q2 — LOCKED:** every NEW platform account after the policy cutover enters DCC enrollment automatically, including Smart Sign. Identity verification and safe People reconciliation are required before active membership.

**Q3 — What makes a website join official?** Verified email/account in a live session (recommended), or immediate submission before email proof? A quick unverified form could still produce a **pending private** node, but should not claim a verified person.

**Q4 — Who sees member-only profiles?** Public and private at first (recommended), or immediate authenticated DCC-member directory requiring eligibility checks?

**Q5 — The first WhatsApp CTA**. Direct people to "Join DCC" (including existing WhatsApp members), or "Create your network profile" (same experience behind the CTA)? These may be differing entry copy with a shared implementation.

Founder Q1 is answered with **A** and Q2 is automatic new-account enrollment. Q3–Q5 remain open, and none of the proposed membership/account/publication APIs or the anonymous website cohort is in production. This RFC remains a decision draft until account scope and identity-verification semantics are agreed.

## 9. Shape Up + BDD implementation checkpoint (2026-11-22)

Engineering slice S0 committed on draft PR #72 at a9bb4c1ee765f951770a6e887771611c0b5efc9b. See [Shape Up plan](./SHAPEUP-MEMBERSHIP-ONBOARDING.md) for product appetite, boundaries, no-gos, user journeys, Gherkin-style acceptance criteria, risks and release gates.

- lib/dcc/membership/enrollment.ts: server-session-driven membership contract aligned to verified new-platform-account creation evidence; verified legacy email collisions require review; store contract requires atomic uniqueness.
- lib/dcc/membership/public-snapshot.ts: delayed and coarsened weekly website-member cohort projection; counts remain separate from WhatsApp and poll selections; no member payload.
- __tests__/lib/dcc-membership-lifecycle.test.ts: BDD regression coverage for identity reuse, duplicate joins, unverified identities, collisions, withdrawal, provider error, snapshot suppression and repeat publishing.

This is a domain and test contract, NOT a wired Clerk/Airtable/Supabase implementation. Current /api/dcc/signup still stages CRM data by self-entered email and must not be interpreted as a verified membership writer. The test suite has not been run in the full repository environment in this session; CI is pending. No real member data, schema migrations, snapshots, consent grants or deployments were made.

**Superseded by locked Q2:** newly created Smart Sign and other platform accounts enroll automatically when verified and safely reconciled. Existing pre-cutover accounts do not auto-enroll upon sign-in, but may explicitly Join. Keep this RFC draft and do not enable live enrollment until verified Clerk binding, transactional uniqueness, reviewer reconciliation, privacy review and mobile release gates are established.


## 10. Locked Decision 2 — automatic NEW platform account enrollment; implementation safeguards

**Approved November 22, 2026.** Every newly created platform account, including Smart Sign and non-DCC app entry, enters the DCC membership lifecycle after a configured production cutover. The account is NOT a verified member merely because a Clerk user object exists. Verified ownership plus a durable atomic binding to one canonical People record is required before ACTIVE membership and one internal graph node. Pre-cutover accounts do not retroactively enroll on sign-in; they can explicitly Join and reconcile. Account creation never grants a named public profile, interests, practice connections, newsletter marketing, WhatsApp membership, or privileged/member-only discovery.

### Code/security audit — confirmed from current repository
- app/sign-up/[[...rest]]/page.tsx creates a Smart Sign account without explaining automatic DCC membership. Show plain-language membership disclosure before every supported signup/OAuth path, plus a private-by-default explanation and withdrawal path.
- app/api/webhooks/clerk/route.ts verifies Svix signatures but creates org_memberships(role=resident, org_id=null) on user.created. This is not DCC People membership and must not be reused as directory authorization. Existing org role semantics need review.
- The same handler logs the full webhook payload; remove/redact personal data from logs. It has no visible persisted processed-event ledger, DCC identity binding or idempotent DCC creation. A missing primary email returns the generic successful response without a DCC member transition.
- The user.deleted webhook deletes org_memberships. Model DCC withdrawal, account deletion, tombstones and late-event handling separately; a late user.created must never resurrect a deleted or withdrawn membership.
- /api/dcc/signup currently upserts People by self-entered email, returns internal recordId and acknowledges as joined. It is CRM lead intake, NOT verified platform account membership. Remove misleading responses and record-ID exposure before live migration.
- Airtable DCC People currently has 52 rows, 11 with populated email, 41 without, zero Atlas Identity Verified checkboxes checked. These schema observations do not rule out independent identity evidence. Do not auto-match the historical 41 by name, WhatsApp or social handle.

### Legacy reconciliation matrix
| Condition | Required behavior |
| --- | --- |
| New post-cutover verified Clerk account, no collision | Atomic create-or-get one People member binding; private profile; one active internal node |
| New account unverified or lacking durable creation evidence | Pending enrollment, no verified node or public count; repair/retry, not false success |
| New account verified email overlaps unbound legacy People | Hold for ownership review; never overwrite old People or create a duplicate |
| New account collides with People bound to different Clerk subject | Security conflict; block claim; escalation; no second node |
| Pre-cutover Clerk account signs in | Reuse existing binding if present, otherwise no automatic enrollment |
| Pre-cutover account explicitly chooses Join | Verified, safe reconciliation into same membership lifecycle |
| Legacy CRM contact without email, WhatsApp-only, or /network/signup form | No automatic binding or publication; needs independently verified evidence |
| Deleted, suspended, or withdrawn account, or delayed webhook replay | Tombstone-aware no resurrection; intentional restoration process only |

### Transaction and event boundary (not implemented)
- Use one private transactional provider-instance + Clerk subject -> DCC People binding ledger, with unique subject and canonical person constraints, event/audit records and an idempotent retry/outbox. This is a private identity link, not a second public directory. Airtable email read-then-create is not an atomic uniqueness mechanism.
- Verify every incoming Svix signature, event ID, instance, provider-created timestamp, policy cutover eligibility and email ownership from trusted server/provider evidence. Handle duplicate and out-of-order user.created, updated, deleted and merged events, primary email changes, and conflicting accounts. Never accept a browser-provided new-account flag.
- Keep an explicit feature flag OFF until cutover, and run a dry-run legacy collision report, quota check and provider end-to-end test. Do not replay historical Clerk accounts as new members.
- The existing blanket Smart Sign role resident must not authorize private DCC views. Automatic DCC membership expands the audience of member-only content dramatically; keep member-only profile visibility disabled until separate, proven authorization.
- Automatic account membership must be disclosed, provide a withdrawal path distinct from account deletion, and must not imply newsletter opt-in, data sharing, contact disclosure, intro consent or Atlas publication.
- The public website-member cohort is a delayed, privacy-reviewed, coarsened aggregate of verified active DCC members (now potentially acquired through ALL platform account funnels). Keep it separate from WhatsApp-reported figures and historical poll selections and do not sum as distinct humans.

### BDD release-blocking cases
1. Trusted new platform account creation, including Smart Sign, activates exactly one private DCC membership after verification without requiring Join.
2. Pre-cutover account login cannot activate a new DCC membership without explicit join intent; already-bound member sign-ins only restore identity.
3. Webhook duplicate delivery, out-of-order updates, same-account concurrent requests, new email and merged-account histories never create multiple People bindings.
4. Forged, unsigned, wrong-instance or stale creation events and unverified email cannot activate membership.
5. Legacy People collision or second-subject claimant cannot overwrite a record or create a second node.
6. Deleted/withdrawn users remain inactive despite late user.created retries; suspension or reactivation requires explicit review.
7. Private active members have no public name, practice edge, member-only directory privilege, newsletter opt-in or immediate anonymous signup dot.
8. Provider outage, storage capacity, latency, withdrawal and cache invalidation do not return false success or leak internal Airtable identifiers.

**Status:** Q2 product rule is final; policy cutover, eligible Clerk instances, creation event ledger, verified session binding, privacy disclosure, migration review and release gates are engineering prerequisites. Existing S0 domain functions/tests are unwired. No live enrollment, schema migration, member-row mutation or production deployment has been performed.
