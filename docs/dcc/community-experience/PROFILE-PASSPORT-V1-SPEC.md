# DCC People, Profiles & Passport — V1 Product + Engineering Specification

Status: **Proposed / implementation not yet enabled** · 2026-11-22 · Owners: Moises Sanabria + Fabiola Larios

> **Reconciliation update, November 22:** [RFC 01 — One Website Membership, One Node, One Editable Profile](./RFC-01-UNIFIED-WEB-MEMBERSHIP.md) proposes that a successful verified DCC website join creates/resolves one canonical internal member node, regardless of entry route. Join, signup, login, Passport and profile become one stateful experience; repeated login creates no duplicate. Decisions Q1 (delayed anonymous aggregate) and Q2 (new platform accounts, Smart Sign included, automatically enroll after cutover) are approved; old accounts are not automatically backfilled by sign-in. Earlier Join-only assumptions are superseded. **The RFC remains draft for security and implementation; nothing is live.**

This specification supersedes conflicting *prototype* assumptions; it does **not** retroactively grant member consent, merge CRM records, enable new intake, or deploy authenticated accounts. Source contracts: [Atlas product/data contract](https://docs.google.com/document/d/1UBoVdLiYE4DsCBe8jqpyMxZDZpyMad-MHRHNAE6FKEI/edit), [Atlas v0.1 intake/consent spec](https://docs.google.com/document/d/1HsfNFLQZdv4k-oz11gL5qwUrlxytdyy3hiTHL8Doi9A/edit), [community build hub](https://docs.google.com/document/d/1dlA8wCfh8uxkWcQaPdrTHh3tvjH0kzpEdRfWIe8snM0/edit).

## 1. Product thesis

**DCC is a community you can participate in without building a profile.** Its directory helps you find people; its network shows *publicly supported connections*; Passport is your editable record of interests, offers and participation. This should increase member usefulness and shared cultural infrastructure, not create a compulsory social network or extraction funnel.

North star: "In under two minutes, I can add or update my practice and decide what DCC may show." Secondary: "I can find someone useful without reading the entire WhatsApp chat."

**Design**: calm, Apple-like *quality* (not a copy of Apple's brand/UI), restrained typography, ample whitespace, one clear CTA, native controls, familiar navigation, subtle transitions, solid contrast, accessible light/dark. On mobile: one column, 44px+ targets, keyboard and screen-reader usable, reduced-motion safe, real photo only when approved, no emojis, no duplicated DCC logo, no form hidden in a tiny modal, no repeated copy.

## 2. What exists today (code audit, not product promises)

| Existing system | Repository location | Actual behavior / gap |
|---|---|---|
| /join | `app/(marketing)/join/page.tsx` | Redirects to `/network/signup` with campaign params. Not a Passport or verified membership route. |
| Join/Index signup | `components/dcc/signup/DccSignupForm.tsx`, `app/api/dcc/signup/route.ts` | Quick/full forms write to CRM People by email. Different fields/taxonomy from Atlas; confirmation currently says "You're in"; route returns internal record ID. This does not verify membership or grant public Atlas consent. |
| Public Atlas | `components/dcc/community/CommunityAtlas.tsx`, `app/api/marketing/community-atlas/route.ts` | Search, profile cards, images/links, editorial preview + approved public Airtable projection; live reads require dedicated config. |
| Add Public Profile | `AtlasProfileForm.tsx`, `app/api/dcc/atlas/intake/route.ts` | A separate detailed form requiring affirmative **public** consent; stages private pending submission only if configured. No self-service edit, member-only visibility or verified-owner session. |
| Passport | `CommunityAtlas.tsx`, `lib/dcc/community/atlas.ts` | Name, interests, visibility draft in browser `sessionStorage`; not server-backed, not durable across devices, cannot publish, not an account. |
| Artwork | `/network/artwork` + `lib/dcc/artwork/people-practice-graph.ts` | 101 reported count-only person positions (three named pilots), 6 practice hubs, 72 **anonymous selection** spokes. Uses hard-coded `PILOT_PREVIEWS` for named practice edges, **not the full live approved Atlas projection**. |
| Legacy explorer | `app/(marketing)/network/page.tsx` | Has an older CRM network visual whose privacy review is separate; **do not treat it as the public member directory launch path.** |

Current permissioned source: `readPublicAtlas()` requires verified identity + approved publication state + public consent, returns an allowlisted projection. Never bypass this for a new graph.

## 3. One identity, three views, zero duplicate questionnaire

**Canonical private record**: existing DCC People, reconciled with the Life OS reference according to the operating contract. New member submissions are staged; an authenticated account only controls an identity *after* verification and owner binding. No second user directory in Supabase or a new "Passport People" table.

**Views**:
- **Join**: start relationship / verify contact and membership eligibility as applicable, never secretly publish a profile.
- **Profile**: the member-authored, reviewable and permissioned fields discoverable in the Directory.
- **Passport**: *My profile* in editable mode, later optional Needs/Offers, participation and verified connections; not a second registration.

Use "Your profile" in consumer-facing navigation; "Passport" can remain the optional concept/subtitle. Both buttons must open the **same canonical profile editor** rather than separate modal forms. Keep /join and /network/community deep links but route them to a shared stateful journey.

**Member already in WhatsApp**: choose "Add your practice" or "Update my profile"; entering a WhatsApp group is not required; group membership is **not** identity verification.

**Newcomer**: can browse freely, choose "Join DCC", and submit a contact request with no public-profile requirement. They can then *optionally* complete the profile step; do not re-ask name, email or chosen interests.

## 4. Proposed mobile flow (3 states, 1 persistent record)

**A. Explore** (no sign-in): Atlas directory first; search/filter approved people; graph secondary; selecting a category never implies its anonymous voters have profiles. Single primary CTA: **Add your practice**. Secondary: **Explore the network**. No profile wall, forced install or long institutional manifesto.

**B. Add your practice** (progressive draft, one-column, ideally 60–120 seconds):
1. **About you**: display name, **private email** for verified ownership, 1-line practice, optional public HTTPS link; photo optional with separate media-use permission. Existing verified member fields are prefilled, not requested again.
2. **Choose interests**: six multiple-selection chips matching poll topic IDs; zero is allowed (unknown, not disinterested). Optional next question: "Looking for" / "Can offer" (off by default, optional, separately scoped; do not verify paid services through a checkbox).
3. **Preview & visibility**: show exactly the fields a stranger would see. Choices: **Public (searchable)**, **DCC members only** (only after secure member access exists), **DCC stewards only**, **Keep private**. Private by default; public requires a **separate explicit affirmative disclosure**. All selected scopes require corresponding supported server authorization; if member-only is not implemented, disable it honestly rather than treating a URL as access control.
4. **Submit**: server receives immutable staging request and acknowledges **"Received for review"** only after a confirmed provider write. Identity verification, People match, explicit consent, and human approval happen before publication. Offer an accessible edit/withdraw route. Never claim already published or "You're in" from staging alone.

**C. Your profile** (later secure owner view): verified ownership, persistent saved draft, preview, change interests/links/availability, set visibility, request withdrawal; view Pending / Approved / Live / Hidden status. Save changes as revision requests, with prefill and no duplicate identity. Add Passport activity history only after this works.

## 5. Canonical data contract

Private minimum: stable internal People match, verified identity credential, email (never public), display name, practice summary, optional portfolio links, six selected `InterestId` values, visibility scopes, provenance, consent version and events, status, created/updated/reviewed times. Fields like phone, private WhatsApp alias, notes, Airtable ID, raw roster and personal poll ballots are **never** in public JSON. If owner verification is absent, stage only; do not mutate an existing person just because names or emails match.

Public DTO: `{slug, name, summary, practice[], interests[], website?, image?}` and optional approved links (if allowed by the exact reviewed projection). Public route returns **only** `Approved` + identity verified + public consent + not withdrawn. Never return a private record and conceal fields with CSS. Revoke hides public projection and invalidates cache; test both graph and search.

**Exactly three categories of graph relationships, each with evidence**:
- `aggregate-poll-selection`: color-coded spoke between a *ballot-selection mark* and a practice hub. 72 selections are **not** 72 known voters.
- `listed-practice`: public profile ↔ practice hub from a self-declared/reviewed profile interest; not a poll vote. Moises explicitly confirmed **all six** interests Nov 22; initial curated Fabiola/Angelo copy stays editorial pending their own edits.
- `documented-cofounding` / future `mutually-approved-relationship`: two real people only with adequate relationship evidence, explicit approval when required. Do not infer friendship, work, status, endorsement, or interest from WhatsApp co-membership.

**Graph source must converge**: Directory and people nodes should use the same server-approved public profile projection (with a non-live clearly marked fallback). A new approved profile appears in search and graph together. A withdrawn profile disappears from both. Membership aggregate is separate from verified public profile count. Named profiles are not secretly inserted into poll-selection marks. Store no raw voter identities unless provided with appropriate rights and consent.

## 6. Backend requirements / decisions

- Reuse DCC People and current private Atlas Intake Submissions; reconcile with existing `/api/dcc/signup` upsert logic. Do not automatically upsert an Atlas profile submission into People.
- Auth: **choose and configure a server-verified provider before v1 owner self-edit**. Repo includes Clerk and Supabase dependencies, but their existence is not proof that either is configured correctly for DCC member profile authorization. Email magic-link is an acceptable goal, not a verified current capability.
- Separate `membership_state`, `identity_verified`, `profile_visibility`, `review_status`, and `contact/newsletter` permissions. Existing CRM "signed up" is not member verification; existing ambiguous directory consent is not public consent.
- Proposed authenticated endpoints: `GET /api/dcc/me/profile`, `PUT /api/dcc/me/profile/draft`, `POST /api/dcc/me/profile/submit`, `POST /api/dcc/me/profile/visibility`, `POST /api/dcc/me/profile/withdraw`. Only enable after owner-session binding, authorization, audit and abuse controls; these paths are **proposed**, not implemented.
- Public reads: a reviewed server allowlist, unique slugs, caching/invalidation and no arbitrary CRM record IDs. Intro request: steward-mediated relay/mutual approval, never expose private email.
- Rollout of staging writes stays gated by `DCC_ATLAS_INTAKE_ENABLED`, verified provider capacity and a named human reviewer. Current per-instance throttling, retry lookup, and honeypot are insufficient as a production security boundary.
- Fix signup response: remove client-facing raw Airtable `recordId`, separate acknowledgement copy from community membership status, no optimistic "You're in" after an external email fallback, and don't pre-check unrelated marketing opt-ins.

## 7. Apple-like screen rules (design acceptance)

Single-column content width ~440–520px for forms; responsive cards/rows for directory; no horizontal scrolling except clearly controlled filter chips. Fixed or sticky action only if it never overlays graph, content or iPhone browser UI. 44px minimum targets, 16px text inputs (no iOS autozoom), high contrast dark/light, system typography, native focus/validation, minimal motion, accessible errors next to fields. No decorative emojis, category duplication, giant cards with long descriptions, nested forms, or repeated "DCC Miami" branding. Never reveal a long privacy essay in primary flow; present short plain-language visibility copy with a full linked disclosure.

Public card priority: **photo (approved)** → **name** → **what they do** → up to 3 chips → **website** or **Request introduction** (only if enabled). One useful next step per screen. No points, gamified badges, AI match scores or unverifiable availability.

## 8. Spec-driven slices and acceptance criteria

**P0 — Release protection / canonical vocabulary**
Given a PR changes Join/Atlas/Passport, CI must compile TypeScript **without ignoring errors**, run focused unit/schema tests and 390×844 / desktop browser smoke checks before merge. Audit old `/network` CRM route separately; don't route member CTA to it. Canonical six interest mapping and exact source/provenance per edge. Failure keeps production unchanged.

**P1 — One intake, one acknowledgement**
Given an existing member clicks Add your practice, when they fill the minimum short form, they get a private preview and submit once; provider outage leaves inputs intact, not a false confirmation; duplicate by verified identity is staged for reconciliation, not a second public node. From /join and Atlas, existing values can be reused only after server verification. WhatsApp CTA comes here only after end-to-end acceptance.

**P2 — Permissioned approval to directory and graph**
Given a reviewed approved public submission, both directory and graph show exactly one profile with safe fields. Given a public scope revocation, anonymous requests to the list, card, graph and profile URL all exclude it immediately on successful provider refresh/cache purge. Private/steward-only never serializes to public responses. Tests with seeded fixture profiles must assert no leaks.

**P3 — Durable owner Passport**
Given an authenticated verified member, refreshing, another device and signed-out state behave correctly. Only the owner can edit; draft vs published difference is clearly labeled; pending update cannot overwrite approved publication prematurely. "Passport" is not a separate account. Visibility edits and withdrawal logged with consent version.

**P4 — Mutual introductions / utility**
Given an opt-in profile, one useful request for an introduction reaches steward review, then both parties approve before contact exchange. Track successful intros and useful finds, not vanity node count; optional Needs/Offers with explicit expiry.

**Release gate**: 10 volunteer profiles (explicit scopes), 2 successful member searches, 1 mutually confirmed introduction, mobile Safari + Android + desktop pass, tests for anonymous access, collision, withdrawal, caching and keyboard. Measure time to first submitted profile and weekly founder review minutes; prevent load if support capacity insufficient.

## 9. WhatsApp launch hypothesis (DRAFT — DO NOT POST YET)

**Why**: let current members *author their public presence* and find collaborators without keeping up with every message. Not to harvest the chat, silently map ballots to people, or recruit them into a second social network.

**CTA**: **Put your practice on the map.** One link to a verified functioning, mobile-first profile flow; emphasize optional participation, your choice of visibility, and a tangible benefit: be found for the work you actually do.

> We're trying something small for the DCC community: a way to find people by what they make, explore or can share, without having to catch every message. If you'd like, add your practice and choose what you want visible. Your profile will be reviewed before it appears; joining the directory is optional and doesn't change your place in the WhatsApp group. [verified live URL]

Do not send until the full receipt, verification, edit/withdrawal, production and mobile-browser checks pass. Pilot with Moises + Fabiola + eight voluntary contributors first.

## 10. Explicit open decisions

1. **Owner verification**: approved provider and proof that verified email/login binds to the correct existing DCC People person; no takeover from guessed email/slug.
2. **Launch visibility scope**: recommend Public + Private/Staged first; offer member-only **only** after member authorization is actually implemented. No premature "member-only" mode.
3. **Photos**: reuse approved public URLs; image uploads require separate media consent, size limits, safe storage and moderation. Optional for v1; not a blocker for text-first pilot.
4. **Intake capacity and human review**: confirm dedicated Airtable fields/tables, usable quota, reviewer, withdrawal contact and response cadence.
5. **URL**: preserve /join for new prospects; favor /network/community as directory and a clean dedicated `/network/profile` for add/edit when implemented, linked from all surfaces. Do not invent a live route before implementation.

The spec is the product contract. Each issue/PR must cite a numbered section, state acceptance tests, and explicitly say when a backend or consent capability is not yet available.


## November 22 — Founder-approved automatic account membership
Q2 is LOCKED: every newly created platform Clerk account after an audited policy activation cutover initiates DCC enrollment, including Smart Sign, without a second Join click. ACTIVE membership needs verified ownership and a unique persistent binding to the canonical DCC People record. A pre-cutover Clerk sign-in does not automatically migrate legacy users; old People email matches remain unclaimed until independent review. No automatically public name, interests, connections, directory listing, newsletter, or WhatsApp enrollment. Update all account-creation copy; defer member-only until separately authorized. Details, migration matrix, event idempotency, privacy, QA and code evidence: RFC §10. This is not a deployed migration or consent change.
