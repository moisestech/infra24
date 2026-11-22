# DCC — One account, a useful network, a profile people can discover
## Shape Up pitch + mobile-first UX + BDD acceptance
**Status:** Proposed user-experience and technical specification. **Do not present as a deployed feature.**
**Date:** November 22, 2026
**Links:** [Membership RFC](./RFC-01-UNIFIED-WEB-MEMBERSHIP.md) · [Profile/Passport specification](./PROFILE-PASSPORT-V1-SPEC.md) · [Existing community Atlas](README.md) · [Implementation issue #68](https://github.com/moisestech/infra24/issues/68)

### Founder-approved invariants
1. Q1 = A: a verified active DCC membership maps to **one private canonical People record and one internal graph node**. Anonymous website-member presence appears only in reviewed, delayed, coarse public snapshots. Signing in or editing never creates new nodes.
2. Q2 = Yes: **all new Clerk platform accounts created after the production policy cutover, including Smart Sign**, start DCC enrollment. Be explicit **before** account creation that this includes private community membership. Creating an account is not sufficient for a verified active member; server-verified identity and safe People reconciliation are required.
3. Existing **pre-cutover** Clerk accounts are not silently backfilled on sign-in. Existing people and WhatsApp members are not assumed to have site accounts. A pre-cutover account may explicitly start Join; historical CRM contact submissions remain unverified until proof.
4. Public directory profiles are **optional**, deliberately reviewed, and independent from membership. No automatic name, email, practice or person-to-person edges. Newsletter and public-media consent are separate. A person can belong without being discoverable.
5. Source attribution is **private provenance of a journey**, not the identity of a member in the public graph and not evidence of consent or shared interest.

## Problem
We currently expose /join -> /network/signup (self-entered-email CRM upsert), Smart Sign /sign-up (Clerk org membership but no DCC People binding), /network/community (Atlas with editorial profiles and separate public-profile intake) and Passport (sessionStorage local preview). A visitor can understandably interpret these as different memberships. The directory is not yet experienced as a clear benefit, and Graph/Atlas/Passport use different vocabulary. This invites accidental duplicate identities, false receipt expectations, and confusing privacy.

## Appetite and outcomes
**Fixed appetite: two focused engineering weeks for a verified private membership + one coherent, tappable mobile path; scope is flexible.** Public directory publication and the scheduled cohort publisher are separate gated slices; do not compromise privacy to fit two weeks.
- A new verified member reaches a useful private home after one sign-up, without completing any profile questionnaire.
- In 60–120 seconds, an interested member can optionally describe their practice and preview discoverability choices without redundant email entry.
- Visitors can browse existing *approved/editorial* profile examples before joining and understand the difference between the directory and the artwork.
- The account's entry origin is preserved privately for learning which invitations, DCC experiences and collaborators are creating utility, without making a public referral graph.

## Four plain-language concepts
| Concept | Member-facing copy | Data and permission |
| --- | --- | --- |
| DCC Membership | “You're part of DCC once your account is verified.” | Private, canonical People identity; internal node only when verified and safely bound |
| Your Profile / Passport | “Tell us what you make or want to explore. Edit anytime.” | Member-owned private draft; same identity as membership |
| Directory / Atlas | “Choose what other people can discover about you.” | Explicit selected fields, verification and review, revocable |
| Network artwork | “Explore community practices and permissioned connections.” | Named approved nodes/edges plus separately labeled, delayed aggregate presence; no live signup-triggered dot |

**Naming rule:** Member account, Your Profile, Directory, Network. “Passport” remains an editorial identity for **Your Profile** but is not an enrollment product. Avoid “join the index,” “create Passport,” “Add Profile” as separate account demands.

## Screens and interaction sketch (mobile, no forced wizard)
**Screen 0 — Browse / value first (signed out).**
Headline: “Find people making digital culture in Miami.” Subhead: “Explore artists, makers, educators and creative technologists by what they work on—and share your practice when you're ready.”
Top CTA: **Join DCC**; secondary **Explore the directory**. Below: 2–3 plainly labeled example profile cards + six practice filters. A reduced-motion/list view works without WebGL.
A three-part value strip explains “Find collaborators,” “Share what you make,” and “Ask or offer help.” Avoid promising automated matchmaking or that private members are searchable.

**Screen 1 — Account creation (on ANY DCC-hosted Clerk sign-up, including Smart Sign).**
Before the Clerk form and OAuth buttons, visible copy: “Creating an account also starts your private DCC membership. Your name, email and interests won't appear publicly. You can decide later whether to create a discoverable profile.”
Link to privacy and withdrawal explanation. Preserve the purpose of the source application (e.g. Smart Sign); don't trap someone who came to use a tool inside mandatory profile onboarding.
If a legacy person or existing user is detected, no success until confirmed, and no raw People ID exposed.

**Screen 2 — Verified welcome / “Your DCC” (private member home).**
When server writes succeed: “You're part of DCC.” Show “Membership: private”, “Your profile: not published”, “Explore directory”, and one primary action **Tell us what you make**. Secondary **Not now** goes to the requested app or browse. If verification or legacy match is pending, say “Verify your account” or “We need to confirm an existing record,” not “You're in.”
Show source-contextual next action: workshop -> explore workshops; fabrication inquiry -> find fabrication practitioners; Smart Sign -> continue to Smart Sign. Never change membership count based on route visits.

**Screen 3 — Progressive owner editor (60–120s, optional).**
Ask in this order: (a) public display name, (b) “What do you make, teach or explore?” — free-text practice chips, (c) broad discovery categories (choose any, zero allowed), (d) one short line: “I can help with…” / “I'm looking for…” optional, (e) public link optional. Prefill verified contact privately from account, never ask for email twice. Avoid compulsory photo, full bio, availability, employer, follower accounts or external identity proof beyond secure enrollment.
Auto-save owner draft, server-confirmed. “Skip for now” never removes membership. Distinguish interests from verified equipment capacity, commercial offering or availability.

**Screen 4 — Preview and public choice.**
Show a side-by-side explanation: **Private member** (the default; nobody sees these fields) vs **Request public listing** (explicit checkbox of approved fields, consent version and review). The public preview is LOCAL UNTIL APPROVED; no immediate named graph node or relationship edges.
Show “People could find you through Creative coding + AI, Fabrication…” only if those are approved/self-declared. Offer **Submit for review** and **Keep private**. After publication, provide owner edit/hide, shareable /network/community?profile=slug link and a simple copy/share action. When pending, sharing should point to directory/join page, not a private draft URL.

**Screen 5 — First useful action rather than a completion trophy.**
Find a practice; save a relevant public portfolio link; request a steward-mediated introduction (not direct contact exchange); or post a scoped Needs/Offers request only after explicit permissions and moderation are supported. A graph click must open the exact same approved profile card as directory search, or an informative practice-filter state.

## Example profiles: show concrete value without fabricating consent
Use the *existing editorial preview cards* as examples, marked **Featured example / editorial preview** until the member has authorized a live public listing. Do not label them verified platform members or retroactively infer poll answers.
| Example | One-line value | Discovery lenses | Specific practices |
| --- | --- | --- | --- |
| Moises Sanabria (cofounder) | Interdisciplinary artist / creative technologist connecting art, software and fabrication | Existing pilot preview has all six broad categories; review which should remain publicly claimed | Interdisciplinary art, creative technology, digital fabrication |
| Fabiola Larios (cofounder) | Interdisciplinary artist experimenting with AI and digital art | Film/animation/sound; code/AI; art/exhibitions | Digital art, AI, creative practice |
| Angelo Caruso (existing featured editorial preview) | Artist working with interactive and tactile objects | Fabrication/materials; games/XR/interactive | Interactive art, objects, digital fabrication |
**Proof standard:** these are already coded as preview content, not confirmed live owner consent. Founder-approved copy/photos/URLs and publication grants are required before changing their state to a live member profile. Do not invent Needs/Offers, availability, intro consent, or actual collaborative history.
A joined member may have no public profile and remain completely invisible as a named node.

## Reuse the canonical six discovery categories
The existing `INTERESTS` keys in `lib/dcc/community/atlas.ts` are the stable V1 IDs. Don't invent a second taxonomy.
- `making`: Fabrication, materials & objects
- `image-sound`: Film, animation & sound
- `interactive`: Games, XR & interactive installations
- `code-ai`: Creative coding, AI & automation
- `culture`: Art, exhibitions & creative practice
- `exploring`: Still exploring / across disciplines

**Hierarchy:** discovery categories (broad self-declared navigation) → practice/skill tags (specific things done) → Needs/Offers (voluntary, scoped, expires, may require stewardship) → verified capacity/availability (separate evidence) → relationships (only documented/authorized). People may choose multiple or no categories. The existing WhatsApp poll categories map to **aggregate selection totals**, NEVER per-member interests.

## Network visual evidence and privacy contract
- The current public artwork has 101 founder-reported **WhatsApp member positions** (historical lower bound, not verified site member count), three editorial public examples and their permitted practice edges, six aggregate poll hubs with 72 *selections* and the documented cofounder edge. It does not yet receive verified website member records.
- A verified active account creates **one internal node**. Each app source adds a private journey/source event, not a new node.
- Public approved member with self-declared consented practice: one named node + only selected approved practice edges. Graph and directory use one allowlisted publication projection; public slug is never the private ID.
- Anonymous website-member population: periodic, delayed, coarsened, unlinked decorative marks; no stable per-member dot, registration-time reveal, graph edge, or crosswalk to named cards. Hide sparse cohort; label it distinctly from WhatsApp reported positions and poll selections. Do not sum into one “people in DCC” metric.
- A cofounder relation can appear where documented and authorized. No fabricated friendship, membership-to-membership lines, collaborator claim or similarity edge without explicit evidence and permissions.
- Graph unavailable/mobile reduced-motion: the accessible **directory cards + six category chips** are primary. Treat force graph as another view of the same approved data, not the only navigation.

## Private attribution without surveillance
**Private event model** `member_entry_events` or existing safe attribution ledger: `identity_binding_id`, `entry_route` (fixed allowlist: join, network-signup, atlas-add, passport, smart-sign, app-sign-up, event-qr, other), `source_app` (allowlist), `campaign_id`, `first_touch`, `last_touch`, `occurred_at`, `event_id`, `purpose`. Keep immutable entries and dedupe per event. Do not expose to public profiles/graph.
Campaign/UTM/referrer values are **untrusted marketing metadata**, not authentication/verified provenance. Validate sizes/allowed keys, drop raw URLs with query tokens, secrets and personal emails, avoid collecting WhatsApp phone identifiers. Keep analytics on **entry context** and downstream useful actions (approved publication, a search, voluntary useful connection), not individual browsing trajectories or socially scored nodes.
A creator may independently choose to show “I found DCC through a workshop,” but it is not automatic.

## Behavior-driven acceptance / Given–When–Then
| ID | Given | When | Then |
| --- | --- | --- | --- |
| B01 | New verified Clerk account after cutover via Smart Sign | Creation event is safely processed | One active private membership; returns to Smart Sign; source=smart-sign private |
| B02 | Person visits /join or QR route | They sign up and verify | Same one membership / Your Profile; retained campaign source; no second node |
| B03 | Existing website member clicks Add Profile or Passport | Opens editor | Reuses one owner record, no new signup or email prompt |
| B04 | Member signs in on another phone | Session resolves | Same profile and consent history; zero new nodes |
| B05 | Legacy People email collision | Verified new account is created | Pending identity review; no takeover or duplicate People row |
| B06 | Account created but email unverified | Welcome requested | Pending/verification required, no “You're in”, no verified dot |
| B07 | Member skips profile | Enters requested app | Private membership preserved and no directory listing |
| B08 | Private member chooses broad categories | Saves owner draft | No per-member public edge, no public interest leak |
| B09 | Member consents to selected fields and reviewer approves | Shared publication refreshes | One named card and same approved practice edges in Atlas + artwork |
| B10 | Member revokes public visibility | Public routes requested | Profile, public search and practice edges hidden; cache invalidated |
| B11 | Anonymous cohort just grew by one | Public graph immediately requested | No real-time change; only a delayed reviewed snapshot can alter published marks |
| B12 | Person clicks a practice hub | Graph selection occurs | Same category filter result as directory; no inference about hidden members |
| B13 | Person shares approved profile link | Recipient opens on mobile | Public approved profile loads and is accessible; private draft cannot be shared |
| B14 | Browser has reduced motion or WebGL fails | Directory opened | Cards, text search and category filter still work; no blocking animation |
| B15 | New user comes from workshop vs Smart Sign | Private provenance recorded | Origin differs privately but membership count and public identity representation do not |
| B16 | Same webhook is delivered again or old created event arrives after deletion | Processor runs | No duplicate, resurrection, public leak or false receipt |
| B17 | Signed-out visitor opens member-only/private route | Access checked server-side | Only allowlisted approved public projection; private data absent from serialized response |
| B18 | Mobile user at 390×844 uses keyboard/VoiceOver | Joins, skips, or chooses public review | 16px inputs, 44px targets, focus order, readable steps, recovery from failure |

## Shape Up: pitch, breadboard, circuit, cut line
**Pitch:** Build a single account/membership shell and a first-use path that explains the benefits before demanding information. Tie browsing, optional editor, and reviewed public projection together through one identity and one taxonomy.

**Breadboard (objects + connections):** Public value page → Clerk verified account + DCC disclosure → durable identity binding → private Welcome/Your Profile → optional owner draft → separate publication consent and review → public approved Atlas card → same graph profile node/practice edges → shareable URL. Side channel: private signup source event → private event review/metrics. Independent delayed population snapshot publisher.

**Circuit breakers:** no verified subject, legacy collision, webhook/provider outage, unapproved publication, cached withdrawal, Airtable capacity, private data graph response, or full-screen forced profile after Smart Sign must fail closed with a human understandable next step.

**Must-have within 2-week bet:** source inventory and UX copy; honest disclosure on every account-creation surface; verified membership binding test harness and stateful receipt; private member landing; single lightweight owner editor with save/skip; browse examples and categories; no duplicate membership; mobile accessible list; documentation of failures. **Do not deploy** if identity/privacy gates are not passed.

**May defer / cut:** public named profile publication go-live, steward-mediated introductions, Needs/Offers posting, photo upload, member-only directory, monetization, equipment passport, social graph inference, AI recommendations, full graph physics redesign, international discovery, custom notification preferences. Those are follow-on slices with separate consent/security.

### Build slices (each requires failing BDD first, then code, then verified test evidence)
- **UX0 — Contract + examples (this document):** inventory actual app routes, canonical categories, copy, sample cards, owner/private/public states, source tracking and test scenarios.
- **UX1 — Account disclosure and proven identity (depends S1):** Clerk creation event ledger, verified unique subject↔People binding, legacy review; Smart Sign/signup copy + private accurate receipt; old account compatibility.
- **UX2 — Unified mobile shell:** one /join, /network/community Add Profile and Passport intent map; private /your-profile (route name TBD) with owner draft, skip/revisit and no repeated email.
- **UX3 — Public projection:** permission + review; shareable public card, category filters, public graph evidence links and withdrawal. Anonymous snapshot publisher remains independently gated.
- **UX4 — Pilot and quality:** 10 volunteers (including founders and mixed join sources), at least 2 useful searches and one mutually approved introduction; mobile Safari + Android + keyboard, performance, error retries, accessibility and founder review time.

## Quality scorecard (pilot targets, not claims)
- >= 90% of invited volunteers can explain **membership vs public profile** after the first screen.
- >= 80% complete the optional basic practice editor in <= 2 minutes; skipping is a valid success.
- 100% of authorized repeat logins and cross-device edits reuse one canonical member; zero unverified/public leaks.
- 100% of published practice edges have an attributable approved declaration; zero public edges from WhatsApp poll selections.
- Count 2 completed real useful searches + 1 independently confirmed opt-in introduction; measure organizer minutes to support them.
- Track acquisition origin internally with basic privacy protections, not individual leaderboards.

## Owner decisions to resolve during the slice
1. Confirm final public tone/label: “Join DCC” for account creation, “Make your practice discoverable” for the optional directory request.
2. Confirm which founder example details (portrait, links, specific skills, practice lenses) may be featured as editorial previews while real publication consent is pending.
3. Define which source apps are covered by auto-enrollment cutover and where persistent first-touch attribution is kept. All newly created accounts included per Q2; scope by deployed Clerk instance(s), not arbitrary email.
4. Assign one reviewer and operational withdrawal path before public-profile publication; this does not block building private owner drafts.
5. Confirm timing/visibility of first public website-member snapshot separately from named profile publication.

**Release honesty:** This document is a shaped engineering proposal. Existing prototypes are not a verified member signup, and no project PR, deployment or CRM update should imply that they are.