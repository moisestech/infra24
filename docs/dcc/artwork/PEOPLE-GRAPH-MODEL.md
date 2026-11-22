# The Network Makes Itself — people-first graph model

**Current model:** Neutral filled circles represent 101 minimum-count membership positions, with three public names. Six colored hexagons represent practice areas. Each practice has one colored spoke per recorded aggregate poll selection (72 spokes total). These spokes connect **anonymous selection marks**, not attributed voter identities; the multi-select poll does not expose person-to-answer mappings or 72 distinct respondents. Separately, dashed connections depict publicly listed artist practices and the documented cofounding link.

**Update, November 21:** The former fictional Connections study was retired. The public field now shows 101 minimum-count human marks (three named public artists and 98 anonymous), one documented cofounder edge, and six category nodes with actual aggregate poll totals. As of Nov 22, eleven public profile-to-practice associations are visually distinct from votes: six self-declared by Moises plus five remaining curated associations for Fabiola and Angelo. See `MEMBER-PRESENCE-STATUS.md` and `discovery-poll.ts`. The illustrative specification below is historical context and not the current user-facing implementation.

Practice hubs, person marks, and anonymous poll-selection marks are three distinct node types. Public editorial profile tags may create practice associations; individual WhatsApp answers cannot be assigned to real people without suitable evidence and publication permission.

This document supersedes the category-hub visual model from \`AGGREGATE-NETWORK-20261121.md\`. That older report remains an internal record of available category vocabulary and consent gaps, **not** the current visual or social-graph specification.

## Historical prototype (superseded; do not implement from this section)

- 30 deliberately fictional **person-positions**, each represented by a dot; this number does not match, estimate, or enumerate DCC's actual roster.
- Fixed illustrative **person-to-person connections** chosen for legible formal composition. They are not inferred from any member's practice, WhatsApp group activity, or Airtable introduction.
- Practice / Activity only changes each illustrated person's color, without changing who they connect to or adding category hubs.
- Choosing a person illuminates that position's illustrative incident edges, which can be inspected by mouse, touch, or a keyboard-accessible selector.
- "Try a node" adds one local illustrated person and one imaginary connection. It does not submit anything, create an Airtable record, or claim participation.
- The public URL can share category and signal settings but neither personal identifiers nor an actual private relationship topology.
- SVG export is a deterministic 2D projection of the same *fictional people and connections*, not a fabrication-ready 3D mesh.

All public graph endpoints and labels are synthetic. **The public visualization is NOT a pseudonymized version of the real DCC graph.** Pseudonyms alone would not protect social-graph privacy, because unique neighborhoods, topology and known outside facts can re-identify nodes and edges.

## Airtable state checked November 21, 2026

- DCC People: 52 records; 45 marked Active or Joined. This is not necessarily the full WhatsApp roster.
- No approved public Atlas publication entries, no Atlas public-consent checks, and no public consent dates in the reviewed People fields.
- Six Introductions records: five Proposed, one Introduced. Approval entries do not represent mutual consent to publicly disclose a relationship in an artwork.
- \`Atlas Intake Submissions\` has no submitted records; the community interest poll is not linked in the Atlas.
- Do not publish one-to-one People records or introduction endpoints. The existing \`Community Atlas\` opt-in profile flow is not equivalent to approval for publication of social ties.

No private member-level Airtable data or actual intro adjacency is included in the frontend bundle.

## Actual relationship options for future coauthoring

**Recommended relationship event model:**

\`person A\` → \`relationship event\` ← \`person B\`

Every relationship event has an explicit *kind*: a documented collaboration, a requested introduction, a coauthored project, a confirmed exchange, etc. A same-interest algorithmic match is a **suggestion**, not a human connection.

A public person node requires verified identity, specific public-artwork publication permission (including representation rules), and a revocation mechanism. A **public edge additionally requires approval from both individuals for the actual relationship and its stated type**. Existing CRM notes, private or group chats, or an introduction record alone do not grant this permission.

**Suggested Airtable additions (not yet created):**
- People / \`Artwork Participation State\`: not asked / opted in / opted out / withdrawn.
- People / \`Artwork Consent Version\`, \`Artwork Consent Updated At\`, \`Artwork Display Alias\`, \`Artwork Public Practices\`.
- Connections / \`Person A\`, \`Person B\`, \`Relationship Kind\`, \`Evidence Type\`, \`A Public Edge Permission\`, \`B Public Edge Permission\`, \`Published Agreement Version\`, \`Withdrawn\`, \`Last Reviewed\`.

These should be independently approved and audited before use; adding them does not imply participation consent. Publishing pseudonymous real member graphs without permission is not a safe shortcut.

## Design priorities

1. The artifact is one **human network field**, not a visualization of departmental categories.
2. Minimal UI: a legible title, two *color lenses*, unobtrusive node inspection, one local interaction and a small honest "illustrative" disclosure.
3. Select a node to reveal its relationships and nearby people, with no invented biographies or actual identity.
4. The future consented network should make the object of the artwork collective agency over relationships—not the institution's possession of its members.
5. For physical sculpture, fabricate only an opt-in, versioned topology; document each participant and relationship's rights before a lasting edition.

## Tests

The \`people-graph.test.ts\` suite asserts that each visible edge has two people endpoints, the demo is self-contained, and actual public graph projection rejects unapproved, withdrawn and unilateral edges.

This stage does not make actual DCC relationships public. It establishes the **correct visual and data contract** for an eventual consented implementation.
