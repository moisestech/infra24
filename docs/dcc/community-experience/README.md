# DCC Community Experience

Members should find useful people, opportunities and knowledge without following every conversation.

## Implemented prototype

Route: `/network/community`.

- Three.js field with Moises, Fabiola and Angelo editorial pilot previews, as requested by the founder.
- 64 illustrative, unlinked dots. These do not establish a roster or current member count.
- Six interest filters matching the November 15 poll, ANY/OR semantics, combined with text search.
- Profile cards and list alternative; pause/reduced-motion support; mobile layout; WebGL fallback.
- Optional Passport entry with a private-default, editable/removable browser-tab preview.
- Pure publication projector requiring verified identity, explicit public consent, approval and no withdrawal. This projector is tested but is **not wired to a live API**.

Pilot profile interests are editorial examples, not votes or consent grants. Passport preview uses sessionStorage only; it does not enroll, publish, subscribe, authenticate or call Airtable. Clearing it removes the local draft. No production merge or deployment is part of this change.

## Stable discovery labels

| ID | Posted poll label |
|---|---|
| making | Fabrication, materials & objects |
| image-sound | Film, animation & sound |
| interactive | Games, XR & interactive installations |
| code-ai | Creative coding, AI & automation |
| culture | Art, exhibitions & creative practice |
| exploring | Still exploring / across disciplines |

These overlap existing Network Verticals and Public Skills. Interest is not expertise or professional availability. Aggregate poll counts guide programming; named profile tags require a separate self-declaration and visibility choice. The export establishes the poll was sent, not its results. Missing totals stay unknown.

## Data boundary

The member-facing implementation uses an explicit public field allowlist. Anonymous dots derive from an aggregate quantity, never from hidden person rows. Future live profile data requires identity verification, granular permissions, server authorization and withdrawal handling. The prototype intentionally does not call a CRM graph endpoint.

## Delivery sequence

1. Start Here + two short Signal editions + approved resource index.
2. Review poll aggregates; keep profile permissions separate.
3. Review the visual and Passport preview.
4. Implement verified staged intake and safe projections.
5. Test ten volunteers, two search requests and one confirmed useful connection.
6. Enable real Passport enrollment on that identity; optional journey records come later.

Suggested recurring editorial cap: 90 minutes/week; scope development separately. No subgroup until there is a shared task and willing steward.

## Backlog

| Build ID | Priority | State | Implementation |
|---|---|---|---|
| CX-01 | P0 | Review | [Create the Start Here and low-attention onboarding experience](https://github.com/moisestech/infra24/issues/38) |
| CX-02 | P0 | Blocked | [Capture interest poll results without treating votes as profile consent](https://github.com/moisestech/infra24/issues/39) |
| CX-03 | P0 | Review | [Run two text-first Signal editions with a durable archive](https://github.com/moisestech/infra24/issues/40) |
| CX-04 | P1 | Ready | [Build a permissioned searchable resource index](https://github.com/moisestech/infra24/issues/41) |
| CX-05 | P0 | Ready | [Implement staged Atlas intake, granular permissions and identity verification](https://github.com/moisestech/infra24/issues/42) |
| CX-06 | P0 | Blocked | [Enforce the public graph data boundary before live CRM integration](https://github.com/moisestech/infra24/issues/43) |
| CX-07 | P0 | Review | [Build the Three.js community graph pilot](https://github.com/moisestech/infra24/issues/44) |
| CX-08 | P1 | Review | [Connect poll-aligned interest filters to consented profile data](https://github.com/moisestech/infra24/issues/45) |
| CX-09 | P1 | Review | [Prototype the optional Passport entry and personal preview](https://github.com/moisestech/infra24/issues/46) |
| CX-10 | P1 | Backlog | [Implement verified Passport enrollment on the Atlas identity](https://github.com/moisestech/infra24/issues/47) |
| CX-11 | P1 | Backlog | [Pilot introductions and member-reported useful outcomes](https://github.com/moisestech/infra24/issues/48) |
| CX-12 | P2 | Backlog | [Validate gatherings and working circles from practical demand](https://github.com/moisestech/infra24/issues/49) |
| CX-13 | P1 | Ready | [Measure discovery usefulness, attention burden and maintenance effort](https://github.com/moisestech/infra24/issues/50) |

## Validation

Run `npx jest __tests__/lib/dcc-community-atlas.test.ts --runInBand` for the publication boundary, filtering, anonymous nodes and Passport draft parsing. Verify the page at desktop and phone widths, interest + name filtering, profile selection, native Passport dialog, reload/edit/remove, reduced motion, no-WebGL fallback and absence of enrollment network calls.

A repository-wide type check exceeded the current Node heap. A focused strict TypeScript check of the new route, components and model completed successfully. Browser verification details are added in VERIFICATION.md.

