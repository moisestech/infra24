# The Network Makes Itself — current member and poll evidence

**Public route:** \`https://dcc.miami/network/artwork\`  
**Code snapshot:** November 21, 2026  
**Scope:** One 3D field; no speculative "Connections study" mode.

## What the field says

- The DCC founder reports **more than 100 WhatsApp Commons members** as of November 21, 2026. Without a current roster export, the public art includes **101 positions as a minimum**, not an audited exact headcount.
- **Three of the 101 are publicly featured artists:** Moises Sanabria, Fabiola Larios, and Angelo Caruso. The first two are public cofounders. They are *included in* the minimum count, not added to it.
- **Exactly one person-to-person connection is shown:** the publicly documented cofounding relationship between them. No other private introduction, friendship, vote, skill, or collaboration is inferred.
- The remaining **98 positions are anonymous count-based marks**, not hash-pseudonymized private CRM people; the marks have no stable mapping to WhatsApp accounts, names or phone numbers.
- The remaining spatial geometry is an artistic distribution, **not a factual social-distance map**.

## Evidence chronology

| Source | As-of date | Count | Qualification |
|---|---|---:|---|
| WhatsApp roster visual audit | Oct 24, 2026 | 50 | Historic group screenshot reconciliation |
| WhatsApp Community info, referenced in Airtable weekly pulse | Oct 29, 2026 | 73 | Later direct screenshot count, not a current feed |
| Airtable People marked Active or Joined | Nov 21, 2026 | 45 | Partial CRM coverage, not complete WhatsApp roster |
| Founder report | Nov 21, 2026 | **100+** | Current reported minimum; precise WhatsApp count unavailable |

## Actual WhatsApp poll counts

The supplied screenshot asks: **"What would you most like to discover through DCC? Select all that interest you."**

| Choice | Selections |
|---|---:|
| Art, exhibitions & creative practice | 21 |
| Fabrication, materials & objects | 16 |
| Film, animation & sound | 11 |
| Creative coding, AI & automation | 10 |
| Games, XR & interactive installations | 7 |
| Still exploring / across disciplines | 7 |
| **TOTAL selections** | **72** |

**The poll is multi-select.** 72 is a tally of selections, *not* 72 distinct respondents. Screenshot shared Nov 21; the actual screenshot capture time isn't visible. Voter identities and their per-person choice combinations are not established by that image. Thumbnail avatars on a screenshot aren't sufficient permission or reliable evidence to attribute a choice to a named person.

Single public editorial data source: \`lib/dcc/artwork/discovery-poll.ts\`. The network now renders **72 anonymous poll-selection spokes**, one per recorded selection, attached to six color-coded practice hubs (21/16/11/10/7/7). These are category-specific selection marks, **not separate verified people, not proof of 72 unique voters, and not linked to the 101 reported membership marks**. Person nodes remain filled circles; practice hubs are hexagons in the mobile 2D view. As of Nov 22 Moises expressly declared all six interest categories for his public profile; those six person-to-practice edges are self-declared, while Fabiola's three and Angelo's two remain curated public Atlas descriptions. None are inferred from individual poll ballots. No poll-to-person edges are inferred.

A new \`DCC Community Poll Results\` table was created in the DCC Airtable base, but **Airtable rejected inserting rows because the base exceeded its record limit**. Until storage capacity is available, verified aggregate totals live in versioned GitHub and in the existing Airtable weekly pulse metadata/notes, not as poll-result records. The table's existence does not imply data was saved to rows.

## The next genuine social layer

To make **specific people** reveal the poll themes they chose, a respondent should explicitly opt in to sharing their own selections. Poll choices are interests in *discovery*, not automatically professional expertise. Valid opt-in person-to-category edges may be a separate visual layer, but cannot be drawn from the six aggregate totals alone.

Real person-to-person connections must have documented relationship semantics and a permission rule. Proposed categories: cofounding, confirmed collaboration, shared project, member-confirmed exchange. For private personal or professional relationships, obtain separate public agreement from each endpoint.

A public graph must never infer an edge from being in the same WhatsApp group, an organizer introduction request, or similar skill tags. Group membership is one common container, not \`100 × 100\` social relationships.

## Implementation / change policy

1. Update minimum membership value only after a dated, authorized current group count is obtained. Do not publish raw contacts or roster exports.
2. Keep named public people included in—not additional to—the reported group minimum.
3. For a new screenshot, write the six counts into the versioned \`discovery-poll.ts\` and update the source date/caveats. Preserve exact wording and multi-select semantics.
4. Only append member-level preferences or public edges after individual permission and independently grounded relationship evidence. Track withdrawals.
5. Run the \`member-presence.test.ts\` and \`discovery-poll.test.ts\` suites and inspect both main artwork and home/proposal embeds.
6. Export SVG as **conceptual fabrication study**, not validated structural or CNC plans.

The artwork is a real community with partial evidence—**not** a complete claim that every person or edge is already known.
