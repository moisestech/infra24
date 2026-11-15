# Community Atlas preview — verification

Date: November 15, 2026.

## Story

A visitor explores overlapping interests, selects a pilot profile, and optionally creates, reloads, edits or removes a local Passport preview. This preview does not call the legacy CRM graph API and does not enroll members.

## Results

| Boundary | Result | Evidence |
|---|---|---|
| Pure data contract | Pass | Eight Jest cases cover required public grants, withdrawal, field stripping, unsafe links, anonymous dots, discovery and saved-draft parsing. |
| TypeScript | Pass for changed feature | Strict focused check includes the new route, model and components; no diagnostics. |
| Lint | Pass | ESLint on new TS/TSX files returned no diagnostics. |
| Graph rendering | Pass | Headless Chromium rendered the Three.js canvas with reduced motion enabled. |
| Discovery | Pass | Three pilot cards; interactive filter narrows to Angelo; name search narrows to Fabiola; reset restores all. |
| Passport preview | Pass | Native dialog accepts a display name and interests, saves in sessionStorage, survives reload, and removes the draft on request. |
| Enrollment boundary | Pass | No POST request during the full tested flow. The UI explicitly states local preview and not enrolled. |
| Mobile | Pass | 390 × 844 viewport; no horizontal overflow; full-page visual inspection. Desktop checked at 1440 × 1100. |
| Browser errors | Pass | No uncaught page errors during tested flow. |
| Full application integration | Not established | UI exercised in an isolated Next.js harness importing the actual feature files, without production Clerk/CRM configuration or the marketing shell. |
| Repository-wide type check | Resource limit | Existing repository-wide TypeScript run exceeded the default 2 GiB Node heap. Focused strict feature check then passed. |
| Live enrollment / CRM projection | Not implemented | Fixture-only preview; no real poll totals, identity verification, consent ledger, live roster or persisted member registration. |

The first browser pass found that a filter could leave a selected profile outside the result set. The detail panel now falls back to the first matching profile. The complete flow was rerun successfully after this correction.

The WebGL-unavailable explanatory fallback is implemented; forced no-WebGL runtime verification is not included in the completed browser run. Eight unit tests are focused checks of the new contract; they do not establish correctness of the legacy CRM endpoint.

## Commands

```sh
npx jest __tests__/lib/dcc-community-atlas.test.ts --runInBand
npx eslint components/dcc/community/CommunityAtlas.tsx components/dcc/community/CommunityField.tsx 'app/(marketing)/network/community/page.tsx' lib/dcc/community/atlas.ts
git diff --check
```

Production release still requires pilot profile wording/permissions review, complete-app checks, server-side publication authorization and the separate live-enrollment work packages. A review branch is not a release.
