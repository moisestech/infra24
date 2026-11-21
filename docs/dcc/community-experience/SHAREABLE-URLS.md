# Shareable Atlas, Passport entry and artwork URLs

Atlas `/network/community` now restores:

- `interests`: comma-separated allowed discovery IDs, canonical taxonomy order.
- `q`: public profile search, bounded to 120 characters.
- `profile`: selected public profile slug. The existing profile link remains supported.
- `motion=paused`: paused graph; device reduced-motion preference wins on load.
- `panel=passport`: opens the optional local Passport preview, without sharing its contents.

Use **Copy Atlas view link**, **Copy profile link**, or **Copy Passport preview link**. A profile-only link clears discovery filters so the profile is not accidentally hidden by another search.

Artwork `/network/artwork` retains the existing `i`, `s`, `r` parameters for fictional interests, signal and relationship simulation. It also supports `node` for inspected fictional position, `view=edition`, and `fi`, `fs`, `fr` for an independent frozen composition. Empty interests survive a round trip. A frozen state stays downloadable after reopening; editing the living composition does not replace that snapshot. Reset clears both states and inspected position.

The address changes as people interact. Discrete changes create history entries, search typing replaces the current entry, and Back/Forward restores state. Copy builds a new allowlisted query string and strips unrelated parameters and hashes. Old artwork/profile URLs remain supported. Unknown values fall back to valid defaults.

No Passport name, private draft interests, visibility preference, email, account identifier or intake data is serialized. Public Atlas discovery interests and search text are included. URLs reproduce fictional demo settings, not member consent or real relationships. Graph camera position and layout simulation are not serialized.

## Validation

17 focused tests pass, including existing Atlas publication tests, parser/hook tests and rendered component tests. Coverage includes restoring an independent frozen edition, live/edition switching, selected node, Atlas filters/profile, Passport entry and no private form values in copied links, malformed input, old links, simulated popstate and history metadata. Focused TypeScript and ESLint checks cover modified production modules. Component tests mock the renderer/provider and clipboard; they are not a full-app browser or live-provider check.

Before production rollout: open both routes in the deployed preview on desktop and phone; copy into a fresh tab, use actual Back/Forward, exercise clipboard fallback and inspect the downloaded SVG. Reduced-motion devices must remain paused on shared-view load.
