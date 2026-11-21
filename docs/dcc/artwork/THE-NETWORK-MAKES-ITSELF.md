# The Network Makes Itself — interactive artwork study

Route: /network/artwork (noindex).

This is an **isolated, fictional** artistic proof of concept for the Rhizome CO-OP / DCC Miami direction. It does not modify the existing Community Atlas, reads no CRM data, writes no member information, and does not assert that sample nodes represent real DCC people.

## What can be tried

- Change the fictional guest's **SHOW / NEED / OFFER** signal. Its position moves according to the selected interest hubs.
- Add or remove declared interests. The guest node and its interest edges change.
- Toggle a **proposed** or **hypothetical mutually accepted** connection to the fictional BRIDGE node. No actual relationships or consent are inferred.
- Click nodes to inspect the selected fictional position.
- **Freeze edition 001** and download an SVG generated from the same deterministic graph state.
- **Copy interactive study URL**. Shareable URL parameters encode only the fictional selections: i, s, r. They are not identity, membership, or public consent.

The SVG is a *vector study*, not fabrication-ready toolpaths. Any physical realization requires material, joint, line-width, kerf, structure, typography, and safety review by a fabricator. Existing DCC equipment/operator capacity is not presumed.

## Relation to the existing code

Reuses INTERESTS and isInterestId from lib/dcc/community/atlas.ts. Uses a directly inspectable SVG artwork and deterministic coordinate projection rather than creating another account system or client-side CRM read. This 2D art/edition route complements the existing 3d-force-graph Atlas; it does not replace its immersive community discovery interface.

### Future, not included in this study

1. Verified member-initiated edits under the existing DCC identity and consent model.
2. Two-party approval before making person-to-person edges public.
3. A separate permission for permanent physical edition inclusion, since a printed object cannot be instantly withdrawn.
4. Versioned snapshots/edition IDs and a reproducible maker-reviewed fabrication pipeline.
5. Peer-run stewardship, moderation and revocation.

## QA checklist

- Visit /network/artwork on desktop and phone.
- Toggle each interest, including deselecting all six; the graph must not crash.
- Change SHOW, NEED, OFFER; guest node moves.
- Toggle None/Proposed/Hypothetically Mutual; dashed vs solid line.
- Freeze the edition; change the living state; return to the frozen edition and confirm it remains unchanged.
- Download SVG; inspect in a vector editor; do not treat as a machine-ready cut file.
- Copy the URL, reload; ensure selected fictional interests, signal and relationship simulation reconstruct.
- Verify that the existing /network/community remains unchanged.
- Confirm no requests to Airtable or public graph endpoints are triggered by this artwork route.

Do not merge solely on the existence of this document; production build, rendering and accessibility should be verified.
