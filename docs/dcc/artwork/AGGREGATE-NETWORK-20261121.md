# The Network Makes Itself — privacy-reviewed aggregate field

Snapshot: **2026-11-21**  
Public route: **/network/artwork**  
Source: internal DCC Airtable CRM, manually reviewed for a *coarse category study*.  
Code: \`lib/dcc/artwork/network-patterns.ts\`, \`components/dcc/artwork/AggregateNetworkField.tsx\`, \`components/dcc/artwork/CollectiveNetworkArtwork.tsx\`.

## Why the artwork changed

The previous demo used six fictional character nodes and simulated a friend-to-friend edge. That correctly prevented accidental publication but did not express the existing DCC network. This revision moves the public artwork from **fictional people** to **real, non-identifying aggregate tendencies**. The original group-oriented proposition remains: a future edition could allow members to coauthor or decline inclusion, with separately obtained consent.

The new page is deliberately minimal. One large Three.js field, two study modes, keyboard-accessible category inspection, one local node experiment, and an exported SVG study. The full curatorial statement remains at \`/network/artwork/proposal\`.

## Evidence reviewed

Airtable DCC CRM, inspected November 21, 2026:

- **People:** 52 CRM rows; 45 have status Active or Joined; 22 of those contain skill annotations. This is **not** a complete population survey. Source fields: \`Community Status\`, \`Public Skills\`; no names, row IDs, handles or bios were exported into the artwork.
- **Atlas:** no submitted Atlas intake records or approved public Atlas profiles at this review. \`Atlas Interests\` is empty in People. This is **not** an opt-in interest map.
- **Network Signals:** 48 internally categorized records across Show, Need, Offer, Visit and Opportunity. No text of individual messages, authors, record references, or repost permissions is included in the artwork.
- **Community poll:** The November 15 interest poll is referenced in the Community Atlas, but its votes are not connected to the app. Neither the artwork nor its metadata should call these derived groupings “poll preferences.”

All actual counts are kept in this internal research note and are **not exported as precise public category values**.

## Public grouping rule

**Practice categories:** seven? No: exactly six categories:

- Fabrication: combined 3D printing, CAD, scanning, file preparation, and modeling annotations.
- Creative code: creative coding, frontend/web, AI, generative media, automation, and data/real-time code.
- Moving image: film/video, imaging, animation, rendering, and projection.
- Performance + sound: sound, music, performance, and movement.
- Spatial systems: XR/immersive, physical computing, interaction, electronics, and lighting.
- Learning + culture: curation/education, workshops, critical research, community production.

Each person contributes at most one presence per group. Broad *relative tiers* replace exact values:

- Tier 1 = 5–6 annotated active/joined profiles in a category.
- Tier 2 = 7–8.
- Tier 3 = 9 or more.

Current reviewed category presence: fabrication 7, creative code 10, moving image 10, performance/sound 7, spatial systems 6, learning/culture 8. These numbers are not embedded in the public graph's dataset.

**Activity categories:** Show, Need, Opportunity and combined Offer + Visit. Combining the smallest categories avoids tiny cells. Categories are represented by **ordinal artistic tiers**, not comparable quantitative units across modes. Activity observations are not tied to public people.

**Edges:**

1. Thin category-to-DCC edges are a classification index. They are NOT evidence of any relationship between two people, and their thickness is NOT evidence of a particular collaboration.
2. One thicker practice overlap, **Creative code ↔ Moving image**, is supported by at least five distinct annotated person rows. It represents co-occurrence of broad categories only; do not display people or exact counts.
3. An added visitor node is a browser-local performance of a proposed link. It is not a real membership request, and carries no identifier, name or contact information. Shared URLs include only broad category and signal codes.
4. No edges are generated between real member identities or from private introductions. A verified real-person edge, if ever offered later, requires both endpoints' separate, explicit publication permission.

## Review gates for updates

1. Pull the latest **approved fields only** in a server-side or editorial process; do not fetch private Airtable tables from the browser.
2. Confirm current permission semantics, source populations, source dates, duplicates, and whether category annotations remain accurate.
3. Suppress categories and pair intersections with support under five. If the cohort is very small or patterns could identify people, combine or omit additional categories even above five.
4. Round or tier the remaining signal. Show unknown/missing data as unknown. **Do not interpret a blank response as a negative preference.**
5. Manually review for indirect disclosure, e.g., a rare practice known to belong to one member, or a publicly discussed pair which the adjacency might imply.
6. Publish only a minimal, new timestamped **aggregate file** with no names, Airtable IDs, message text, handles, or private CRM API route. Never publish a member-level pseudonymous adjacency list.
7. Test the graph, URL serialization, and SVG. Update the provenance disclosure and revision history. Keep previous editions reproducible.

## Member-led next phase

To make this a true **collectively authored artwork** instead of only a private dataset visualization, provide a dedicated, understandable choice to submit *a public artistic signal* independently of the general directory. Consent to a public profile, a public signal, an explicitly coapproved relationship, and a permanent physical edition should remain **separate decisions**. Reuse the existing consent-gated Atlas intake infrastructure where suitable; avoid a new identity system. Withdrawal must be honored for digital representations. Physical editions require a fresh versioned agreement because they cannot be instantly withdrawn.

Current participation via “Try a node” is local and unsaved. Do **not** mislabel it as a submitted public contribution, membership signup, or vote.

## QA checklist

- [ ] Graph shows exactly six broad practice themes, not individuals.
- [ ] Activity view shows four aggregate groups; Offer + Visit are combined.
- [ ] Only the reviewed Creative code / Moving image non-personal overlap edge is drawn.
- [ ] Keyboard inspector and node click work; orbit control does not make a person-to-person claim.
- [ ] Browser-local node preview and shareable URL never contain personal info or save to Airtable.
- [ ] Vector export is a **2D study**, not a fabricated edition or accurate 3D geometry.
- [ ] Reduced-motion and WebGL fallback work.
- [ ] Home, artwork, Atlas and proposal descriptions all match the new public model.
