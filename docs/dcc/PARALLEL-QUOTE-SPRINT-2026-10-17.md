# DCC Miami — Four Parallel Quote Sprint (2026-10-17)

## Objective

Prepare four clear, private, **unapproved** client project scopes simultaneously, without confusing a website page with an actual quote or paid fabrication. Keep the private beta metrics honest: zero jobs counted as paid until payment is confirmed in accounting, regardless of a URL existing.

## Canonical locations

- Application: \`moisestech/infra24\`
- Review branch / PR: \`feat/dcc-pilot-quote-pages-20261017\`, draft PR #19
- Quote domain records: \`lib/dcc/fabrication/proposals/\`
- Shared client pages: \`app/(marketing)/fabricate/proposals/\`
- Airtable DCC CRM: \`appWj8TFiOqUyQUfM\`, Jobs & Quotes \`tbl91E7hFdhjwaj72\`
- Production access secrets: \`DCC_FABRICATE_PROPOSALS_PASSWORD\` and \`INFRA24_CONTROL_SERVICE_TOKEN\`
- Production private pages are currently **not verified**; PR is not approved for merge.

## Four quote workstreams

| Client | CRM record | Page | Stage | Fixed quote? |
|---|---|---|---|---|
| Carol Haggiag | \`recSejBYq324jEpoq\` | \`/fabricate/proposals/carol-haggiag\` | Scoping | No. $225 limited one-color hollow-shell *planning allowance* |
| Oscar Rieveling | \`recNEiD7GmiUXgaiV\` | \`/fabricate/proposals/oscar-rieveling\` | Needs Info | No. $350 small unpainted desktop model *planning allowance* |
| Sandra Ramos | \`recMxJ2kWFsvreTnq\` | \`/fabricate/proposals/sandra-ramos\` | Needs Info | No dollar amount until actual object and files |
| Frankie Hsu | \`recgNYcTAfSkE8Cwb\` | \`/fabricate/proposals/frankie-hsu\` | Needs Info | No. Diagnose warped precision mold and consider separate coral enlargement; $75 old ring-halves quote is obsolete |

Client pages are assembled from \`ClientProposal\` records. Sandra and Frankie use a shared \`DiscoveryProposalPage\` and pending quote lines; Carol and Oscar have their specialized prototype pages. Do not create made-up slicer estimates, deadlines, client sign-offs, deposits, signed orders or completed prints.

### Technical questions, by client

**Carol**: Physical brass cast inspection; approximately 2-inch target (not 2.5); mirrored pair geometry; hollow-shell thickness, drainage, safe post-cure and skin contact; transparent fuchsia and high-visibility green requested but **only one initial resin material test** covered in $225 scenario. Assess need for outside geometry specialist. Verify Leo's M7 Max access and resin supply. Two-color study and completed wearable earrings require a revised fixed quote.

**Oscar**: No 3D model exists. Reference photos -> Meshy/Tripo or direct modeling -> manual mesh cleanup -> slicer feasibility. Confirm overall dimensions, level of architectural fidelity, quantity, intended display use, finish, filament inventory and machine slot. Never imply structural, full-scale or architecturally exact reproduction from photos. $350 is conditional.

**Sandra**: The exact object, model, size, material, print process, finish, quantity and deadline are unknown. Request files or clear references first. Keep proposal as a discovery invitation. No made-up price or machine allocation.

**Frankie**: Two lanes, not one bundle. Lane A: inspect deformed resin mold, photos, CAD/slicer file, interior barrier, fit tolerances and resin/process conditions; offer a tightly bounded *paid diagnostic* before new molds. Lane B: review source coral geometry, intended enlargement size, tiling/segmentation, detail and surface finish before quoting physical work. Do not assume the prior failure mechanism without evidence.

## Quote template / technical work

For each client:
1. Distinguish confirmed client inputs, working hypotheses, unknowns, fabrication constraints and client approvals.
2. Define the smallest phase that can be separately approved and paid, its useful outcome and what it proves.
3. List scope layers: reference preflight, optional CAD/capture, machine/material allocation, post-processing/finish, QA, handoff and contingencies; keep costs internal and client totals provisional until verified.
4. Reserve work and operator capacity *only* after approved quote/deposit policy and available equipment are confirmed.
5. Prepare a machine-specific planning record with process, build-volume fit, materials, slicer estimates, operator hours, expected failure modes and practical safety controls. Unknown fields stay unknown, not zero.
6. Capture documentation rights separately from operational logging. No public case study without artist approval.
7. Link to matching Airtable Jobs & Quotes row. Do not write a client's People→Jobs link until verifying that the reverse field is not mistakenly \`Assigned Operator\`.
8. Provide a single next-action per artist and optional draft email/message; never send without explicit approval.

## Work-in-progress and private-beta discipline

- Four parallel quote/diagnostic workstreams can be open. Concurrent production remains capped at 3 until extra operators and repeatable handoffs are proven.
- Show an internal overview listing name, CRM record, quote route, required files, bottleneck, proposed phase, budget confidence, operator/machine availability, next touch and next artifact.
- Count inquiries, scoped, quoted, accepted, **paid**, fabricated and documented separately. Do not label an artist's interest as a paid job or inflate the first-10-paid-jobs metric.
- Keep client quote components out of public route registries / sitemap.
- **Repository is public source**. Private web authentication and noindex do not protect GitHub plaintext. Review and migrate sensitive client-specific content to server-side private storage before client distribution. No STL/CAD/source images or sensitive operational notes in public Git history.

## Adjacent opportunities

**Gianni D'Alerta**: active DCC WhatsApp member, creative coder, printer owner, character creator frustrated by finishing/print times. Track as a **private Network Signal**, not a fifth accepted job. Potential first offer: 60–90 minute hands-on finishing/printability clinic on one character (charge only after he expresses willingness). Valuable community alternative: invite him as a workshop attendee or documented before/after study with consent. Do not assign him paid-operator status on enthusiasm alone.

**Heather Deitch**: old $625 prototype quote closed/lost after self-production. Current product/glass direction is technically and socially promising, but wait for her request before launching an aggressive new proposal.

**Locust Projects**: $3,000 SmartSigns institutional display proposal is a separate institutional track, currently unsent draft; keep out of the 3D print count.

## Airtable read (2026-10-17)

Read-only check of Jobs & Quotes on `appWj8TFiOqUyQUfM` / `tbl91E7hFdhjwaj72`. No records were created or patched.

Confirmed rows:

- Oscar `recNEiD7GmiUXgaiV` — Status Needs Info. No Assigned Operator.
- Carol `recSejBYq324jEpoq` — Status Scoping. No Assigned Operator.
- Frankie `recgNYcTAfSkE8Cwb` — Status Needs Info. No Assigned Operator.
- Sandra `recMxJ2kWFsvreTnq` — Status Needs Info. No Assigned Operator.

People schema: the People field **Jobs & Quotes** is the inverse of Jobs **Assigned Operator**. Jobs has no Client, Requester, or Customer link. Client identity is text (`Contact Name`, `Email`). Do not write the People Jobs & Quotes link to attach a client.

Safe migration, not done in this change: add an empty **Client / Requester** link from Jobs to People, with its own inverse (for example Client jobs), separate from Assigned Operator. Leave it empty. Backfill a row only after a unique Person id is confirmed. A Contact Name text match can attach the wrong person, so this pass does not create or backfill that link.

## Privacy boundary

The public repository already contains client names, planning allowances, and scope text. A password gate does not hide GitHub history, and moving files now does not erase that history. Do not rewrite history in this pass. Do not add emails, tokens, CAD, or message bodies.

Staff pages may read operational Airtable fields server-side (status, blocker, budget text, dates). Those values stay out of git and off the client proposal pages. Client components do not import the sprint cost registry.

History purge happens only after explicit approval, using a private store later if the public narrative itself must leave GitHub.

Staff fabrication routes require the scale-up cookie in production. `DCC_CEO_DASHBOARD_ENABLED` does not grant that access, and a missing `INFRA24_CONTROL_SERVICE_TOKEN` fails closed. The CEO scorecard still uses the feature flag and is a separate follow-up.

There is no Git Proposal Slug field. Notes already holds sprint context, and replacing it would wipe that history. The git `job.id` on each proposal is the link. An Airtable write waits until the Client / Requester field exists.

Other live jobs worth watching, without new proposal pages:

- Heather `rec7kiWSEqEINpcNG` is Closed / Lost at the old $625 prototype. Leave it closed.
- Heather `rec3P0h2VA234UGRq` is a separate lighting and glass scoping row. Wait for a new concrete request.
- Locust Projects SmartSigns stays an institutional track, outside the 3D print count.
- No other open job currently has both a fabrication file link and a fabrication budget.

## Release gate

GitHub reported failed Vercel status for the previous draft head. The connected Vercel team could not access \`moises-sanabrias-projects/infra24\`, so build logs were inaccessible. Identify the correct Vercel scope, inspect CI and run TS typecheck and Jest, verify authentication and source privacy, then obtain review. No production release or shareable client links before these pass.
