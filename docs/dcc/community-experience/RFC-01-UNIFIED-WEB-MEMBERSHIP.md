# RFC 01 — One Website Membership, One Node, One Editable Profile

Status: **Decision draft — awaiting founder answers, not implemented or released**
Date: 2026-11-22
Owner: Moises Sanabria + Fabiola Larios
Changes the interpretation of: [V1 Product Specification](./PROFILE-PASSPORT-V1-SPEC.md) §3–6 and §8; [execution issue #68](https://github.com/moisestech/infra24/issues/68).

## 1. Revised premise

DCC website **Join, Sign up, Sign in, Add profile, and Passport must be entry points to one underlying membership system**, not different opportunities to become multiple people or submit repeated questionnaires. Once someone *successfully joins DCC through the website* they have one canonical internal **member identity / person node**. Their public profile and disclosed practice connections develop from that member over time.

Important clarification: **logging in is not another join**. It restores an existing verified identity, and must never create a duplicate graph node. Generic authentication elsewhere in infra24 (Clerk's existing Smart Sign routes, organization profiles, dashboards) is currently distinct from DCC membership; whether all new platform accounts should automatically enter DCC is an explicit founder decision, not a safe assumption.

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
- `graph_projection`: internal member node exists for each active web DCC member; public named node only with effective approved public profile. A *public anonymous mark* for private members is a design/consent decision; no identity, interest, timing or stable pseudonym may leak without an allowed scope.
- `interests`: optional **self-declared**, multiple of the six canonical topics, editable over time; never inferred from WhatsApp ballots. Only publish profile→practice edges when those interests have an effective authorized public scope.
- `network_joins`: documented interpersonal links require their own evidence and appropriate permissions.

**State transition** (proposed):

1. Any DCC Join / Create profile / Passport CTA → one **Join DCC** journey.
2. Anonymous entry → minimal name + email; identity proof / session establishment handled once. Existing verified identity → prefill and resume. Non-DCC platform accounts are not silently imported.
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
- **Public graph**: one named person node only when the participant affirmatively approves public representation and content is approved. Unpublished members remain hidden or aggregate-only **depending on Q1** below.
- **Edges**: declared practice after permission; two-person links after documented agreement. A WhatsApp poll response is never transferred to a named member without evidence and permission.
- **Three denominators must never be summed as if disjoint**: (A) WhatsApp reported minimum membership positions; (B) distinct verified DCC website members; (C) aggregate poll *selections* (multi-select 72).
- If public anonymous web-joined dots are enabled, show a separate *verified website community* group/layer and explain possible overlap with WhatsApp. No publicly stable anonymous identifiers or identifiable timestamp-based changes.

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

**Q1 — Presence default (first decision)**. After a person officially joins the website, should the public network show:
A. An **unlabeled anonymous dot** representing the verified website join immediately, independent of profile-publication consent; or
B. **No additional public dot until they actively allow publication**, while retaining their private canonical node?
Either way, a named public node/profile only appears with explicit public approval. Note that even anonymous dots can reveal recent participation if counts are small or updated in real time.

**Q2 — Scope of account creation**. Does signing up to *any* DCC-hosted platform experience automatically join the DCC community, or only a website action explicitly labeled Join DCC? Existing Smart Sign org accounts are currently separate.

**Q3 — What makes a website join official?** Verified email/account in a live session (recommended), or immediate submission before email proof? A quick unverified form could still produce a **pending private** node, but should not claim a verified person.

**Q4 — Who sees member-only profiles?** Public and private at first (recommended), or immediate authenticated DCC-member directory requiring eligibility checks?

**Q5 — The first WhatsApp CTA**. Direct people to "Join DCC" (including existing WhatsApp members), or "Create your network profile" (same experience behind the CTA)? These may be differing entry copy with a shared implementation.

No founder choices have been answered or silently defaulted as product policy. This RFC is an implementation basis once those decisions are made, not a production release.
