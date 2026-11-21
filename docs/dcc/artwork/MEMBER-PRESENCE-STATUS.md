# DCC — reported member presence / public artwork

**Artwork route:** \`/network/artwork\`  
**Data status:** founder-reported **more than 100** WhatsApp Commons members, November 21, 2026.  
**Minimum mathematically supported count:** **101**.

## Verified source reconciliation

| Evidence | Date | Count | What it really verifies |
|---|---|---:|---|
| WhatsApp screenshot audit | Oct 24–29, 2026 | 50 roster rows | A historical screenshot-based count, not a current API feed |
| DCC Community Weekly Pulse | Week of Oct 25, 2026 | 50 | Visually reconciled baseline including founder |
| DCC People | Nov 21, 2026 | 45 Active or Joined | Partial internal CRM coverage, not the WhatsApp participant list |
| Founder report in conversation | Nov 21, 2026 | **100+** | Current scale reported by an authorized organizer; exact count not independently reconciled |

### Why the graph doesn't publish raw membership or connection records

The current public 3D sculpture contains **101 anonymous membership-presence marks**, corresponding to the *minimum* implied by the founder's 100+ statement. This does not assert that there are exactly 101 people. It does not attach any mark to a specific person's name, chat account, hashed contact, Airtable record ID, message, practice, or friendship.

**No actual interpersonal connections are published** because a social graph is identifying even when names are suppressed. A WhatsApp group is a container for possible interaction; common group membership does not mean that every pair has a meaningful interpersonal edge.

The **Connections study** is strictly labeled hypothetical; it displays a separate fictional diagram. Its lines do not derive from private DCC messages or Introductions. Visitor-added marks and edges are local simulations.

## How to replace the lower bound with an exact count

1. Obtain a new screenshot or export of the current WhatsApp group participant count from an authorized group admin.
2. Record its time, scope, and any counting ambiguity. Reconcile duplicate accounts and whether the founder's account is included. Never expose the screenshot, phone numbers or raw member list through the site.
3. Update \`lib/dcc/artwork/member-presence.ts\` with the exact verified value and a precise data-source label. Add the relevant date and audit note here.
4. Re-run the tests, inspect whether the count could identify anyone within a sensitive subpopulation, and verify the number on the actual deployed page.

Longer term, a private backend may read a verified membership summary, but no public client should query the full WhatsApp roster or CRM.

## How to add *real* public edges

Public real connections require not merely two people in the group, but a meaningful connection type and permission to make that connection public. Recommended types: collaboration, confirmed introduction, co-production, project participation, mutual exchange. Do not equate a shared interest or recommendation with a confirmed relationship.

**Separate consent gates**: person-public-artwork participation, person display rules, edge-type publication, consent from both endpoints for that edge, and additional permission for an enduring physical edition. A participant must be able to withdraw from future digital displays and know the limitations of removing a fabricated object.

A future protected curator interface can inspect actual connected-app records. A public snapshot must contain only approved nodes and approved edges; it should never expose stable pseudonyms that allow matching the private roster back to public positions. See \`PEOPLE-GRAPH-MODEL.md\` and \`projectApprovedPersonGraph\` in \`people-graph.ts\`.

## Artistic distinction

- **Presence**: what can be said now—an existing Commons with **100+ reported members**. The spatial field contains one mark for every member in the supported *minimum*. The geometry is an artistic arrangement, not a reconstruction of interactions.
- **Connections study**: a separately labeled speculative illustration of the institutional relationships the network may choose to make public in the future.
- **Future edition**: a coauthored network in which the geometry of actual agreed connections becomes fabrication data.

Keeping these states distinct makes the work a credible institutional experiment rather than a falsely exact visualization of a private group.
