# DCC Community Atlas

A public, optional profile-discovery surface for people, practice, interests and links. Route: `/network/community`.

## Implemented

- `3d-force-graph` rendering with orbit, drag, click-to-focus, pause/reduced motion, responsive sizing and cleanup.
- Interest hubs with declared-interest edges. No random relationship claims or inferred social graph.
- Three labeled editorial pilot previews when no approved data source is configured; anonymous dots remain illustrative and unlinked.
- A server-only Airtable adapter returning only explicitly approved public fields. No browser provider token, email, phone, private notes or internal record ID.
- Automatic profile refresh each minute while visible, manual refresh, name/practice search, ANY/OR interest filtering and an accessible list.
- Shareable `?profile=slug` selection and public portfolio/social links.
- An optional profile request form that stages private pending submissions and records the displayed public consent. Identity and content review precede publication.
- The separate Passport local preview remains optional; profile submission does not create a Passport account or subscribe the member.

See [V1 Profile / Passport / Directory specification](PROFILE-PASSPORT-V1-SPEC.md), [Mobile Join → Discover Shape Up pitch and BDD](MOBILE-JOIN-DISCOVER-SHAPE-UP-V1.md), [One Membership RFC](RFC-01-UNIFIED-WEB-MEMBERSHIP.md), [Airtable setup](AIRTABLE-SETUP.md), [library research](FORCE-GRAPH-REFERENCE.md), and [verification](VERIFICATION.md).

## Discovery labels

| ID | Label |
|---|---|
| making | Fabrication, materials & objects |
| image-sound | Film, animation & sound |
| interactive | Games, XR & interactive installations |
| code-ai | Creative coding, AI & automation |
| culture | Art, exhibitions & creative practice |
| exploring | Still exploring / across disciplines |

These are overlapping member-declared interests, not expertise, paid availability or hidden poll-voter profiles. Private aggregate survey observations and coordination resources stay outside the public repository.

## Implementation issues

| Work | Issue |
|---|---|
| Start Here and onboarding | #38 |
| Poll result handling | #39 |
| Signal and archive | #40 |
| Resource retrieval | #41 |
| Staged intake and identity review | #42 |
| Public projection and authorization | #43 |
| Force-directed graph | #44 |
| Interest filters | #45 |
| Optional Passport preview | #46 |
| Verified Passport enrollment | #47 |
| Introductions and outcomes | #48 |
| Gatherings and circles | #49 |
| Usefulness and maintenance measures | #50 |

The existing legacy graph service is not consumed or modified by this feature. Its separate review work remains open. No production deployment, real member consent grant, operator verification or successful external submission is claimed by this branch.

## Validation

```sh
npx jest __tests__/lib/dcc-community-atlas.test.ts __tests__/lib/dcc-atlas-intake.test.ts __tests__/lib/dcc-atlas-routes.test.ts --runInBand '--moduleNameMapper={"^@/(.*)$":"<rootDir>/$1"}'
```

The explicit mapper avoids an unrelated pre-existing Jest configuration typo. Focused TypeScript and ESLint checks cover the new files. Twenty-four focused tests and browser journeys pass; see VERIFICATION.md for the boundaries of that evidence.


## Next journey — not live
All NEW platform accounts (including Smart Sign) after a verified cutover enter private pending DCC membership. Existing pre-cutover accounts are not bulk auto-enrolled by signing in. One real verified People identity underpins all Join, Add Profile and Passport journeys. Membership is NOT a public directory listing; public presence needs deliberate approval. Proposed value-first mobile journey, example profiles, provenance of where a member joined, shared category taxonomy and graph evidence rules: [UX Shape Up pitch](MOBILE-JOIN-DISCOVER-SHAPE-UP-V1.md). Do not treat the current email-based signup or sessionStorage Passport preview as verified official enrollment.
