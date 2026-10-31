# DCC Journal — October 31 Hero Asset QA & Release Manifest

**Status:** four Cloudinary-original generated concepts uploaded, staged in a **draft website PR** for human editorial approval. No public publishing, social posts, or new drafts are made live by this file.

All four originals were independently generated on October 31, 2026 at 1672 × 941 (16:9), RGB PNG, NOT reconstructed from the October 25 contact sheet. Images are AI-generated **conceptual editorial illustrations**, not records of DCC studios, clients, jobs, public installations or named institutions. No writing is baked into the four accepted originals.

| Slug | Change | Original filename | Cloudinary asset ID | Canonical verified media |
|---|---|---|---|---|
| `what-does-it-cost-to-run-digital-culture` | NEW hero for published essay | `the_hidden_infrastructure_of_simplicity.png` | `3c8fe992e2a7eb6294237ede29755ae1` | https://res.cloudinary.com/dck5rzi4h/image/upload/v1793481309/dccmiami/journal/2026-10/v2/what-does-it-cost-to-run-digital-culture-hero-v1.png |
| `when-public-art-becomes-infrastructure` | NEW hero for published essay | `teal_night_plaza_sculpture_cutaway.png` | `234385bb392574178d0d43c1a8e723e1` | https://res.cloudinary.com/dck5rzi4h/image/upload/v1793481349/dccmiami/journal/2026-10/v2/when-public-art-becomes-infrastructure-hero-v1.png |
| `you-cant-buy-digital-culture` | Replacement v2 for previously enlarged crop | `towering_tech_stack_and_glowing_handmade_sculpture.png` | `b7c8b39a2bf0509b509316a2b737e78a` | https://res.cloudinary.com/dck5rzi4h/image/upload/v1793481377/dccmiami/journal/2026-10/v2/you-cant-buy-digital-culture-hero-v2.png |
| `capacity-exists-before-infrastructure-does` | Replacement v2 in UNPUBLISHED draft | `the_missing_coupling_workshop.png` | `36c2a5e69720d50768928f73e56d6fc8` | https://res.cloudinary.com/dck5rzi4h/image/upload/v1793481397/dccmiami/journal/2026-10/v2/capacity-exists-before-infrastructure-does-hero-v2.png |

## Artwork review notes

- **Cost**: Deep blue/amber shelf cross-section makes the hidden operational layer physically visible. Risk: can be read as a generic IT support desk; assess clarity at card size and whether the key/records feel like cultural-institution technology rather than a product ad. An earlier code/vector cover `dccmiami/journal/2026-10/what-does-it-cost-to-run-digital-culture-vector-cover-v01` also exists as a possible competing style direction; it is not currently wired into the editorial registry.
- **Public Art**: Strongest visual thesis: upper luminous conceptual sculpture, lower exposed maintenance equipment. Risk: a visitor could think this depicts a real public art commission. Mandatory AI/concept caption and alt must say imaginary/conceptual; never associate with a specific Miami institution. This image has no title embedded.
- **You Can't Buy**: New independent source sharpness replaces the contact-sheet enlargement. Five/stacked modules and hanging plugs connect directly to essay. Risk: too much dark equipment, and the handmade object may be small at 320 px. Judge after preview.
- **Capacity**: More distinct than the former printer scene: real-world handoff metaphor of two parts that cannot join. Draft article remains `status: 'draft'`. Risk: broken/missing coupling geometry may appear technically fanciful; describe as a conceptual sculpture, not a tested engineering component.
- **REJECTED**: `dcc_journal_art_beneath_the_plaza.png` (earlier Public Art candidate) contains generative title text baked into the image. Do not upload or deploy; the website owns article typography.

## Release / rollback gates

1. Keep production unchanged until PR approval and Vercel preview checks.
2. Confirm all 4 Cloudinary HTTPS URLs load, 1672×941 each, no duplicate IDs, no over-write. Asset IDs above were returned by Cloudinary.
3. Confirm the Next.js `heroImage` field renders on article pages and journal cards, with `heroImageAlt` and `heroImageCaption` in the existing component.
4. Test actual article routes, Open Graph, crop at 375 px and desktop, picture LCP and meaningful 320 px thumbnail. Compare with original September journal covers.
5. Prevent fake documentary claims: all four captions must say `AI-generated conceptual illustration · DCC Miami`.
6. Keep existing old v1 Cloudinary IDs intact for rollback; to revert, change only the four `heroImage` fields in `lib/dcc/culture/editorial.ts`.
7. PR is **image-only**; no article status or dates change; published=8, drafts=2.
8. LinkedIn/native 4:5 art, editable explanatory diagrams, consented Studio 43 photos, journal site navigation PR #26 and prompts PR #29 all remain separate workstreams.

## Next actions after review

- Release the two missing covers first (Cost and Public Art) once actual page layout passes QA.
- Only then decide whether full-source replacements are improvements over the live You Can't Buy cover.
- Retain revised Capacity cover in draft until the essay's CTA, style and factual claims pass human review.
- Photograph Studio 43 on location with permission; do not generate fictional documentary evidence.
- Build code-native LinkedIn document diagrams (Miami, Digital Lab, Artist, Cost, Public Art) and one founder post; do not infer publication from prepared assets.
