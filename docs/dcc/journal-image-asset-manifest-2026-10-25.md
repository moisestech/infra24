# DCC Journal — Cloudinary Image Asset Manifest (2026-10-25)

**Status:** Seven verified Cloudinary image assets attached to GitHub PR #24. Three public essays receive new hero covers; two essays remain editorial drafts. These are **AI-generated conceptual illustrations**, not documentary evidence of real projects, participants or Studio 43. The hero artwork is deliberately text-free; the website renders article titles separately.

## Source and derivation

- Main original cover: independently generated 1672×941 PNG, sourced from October 25 editorial studio study; no real-location photographic claim.
- Six additional panels: a text-free 1672×941 concept/contact-sheet master was generated October 25 and hosted as a source asset at https://res.cloudinary.com/dck5rzi4h/image/upload/v1792937522/dccmiami/journal/2026-10/art-direction-contact-sheet-unlabeled.png (asset ID `df50e172d44dd642800924ff7e9e93e6`). Six crops were enlarged to 1672×941 using Cloudinary crop-and-scale transformations, then re-uploaded as **independent**, versioned PNG assets. Effective detail is limited by the original panel resolution; visually review card size and desktop hero before accepting as a permanent final.
- Earlier journal reference covers: September 2026 DCC covers in Cloudinary folder `dccmiami/journal/`; matching near-black petrol blue, teal/cyan and warm clay-orange light.

## Verified production assets

| Article / placement | Cloudinary asset ID | Verified secure URL | Original composition |
| --- | --- | --- | --- |
| The Institution That Can Build Itself (hero) | `78436768edc2959790c167ff80c25e67` | https://res.cloudinary.com/dck5rzi4h/image/upload/v1792937458/dccmiami/journal/2026-10/the-institution-that-can-build-itself-hero.png | Standalone 1672×941 generated image |
| You Can't Buy Digital Culture (hero) | `bff0f24484cdd3cc95c71f00f09b1e2d` | https://res.cloudinary.com/dck5rzi4h/image/upload/v1792937664/dccmiami/journal/2026-10/you-cant-buy-digital-culture-hero.png | Contact-sheet cropped, 580×326 section at x970 y0 |
| Building Node 001: Studio 43 (hero) | `2864e91096c4814d9f6784c906275a3e` | https://res.cloudinary.com/dck5rzi4h/image/upload/v1792937699/dccmiami/journal/2026-10/building-node-001-studio-43-hero.png | Contact-sheet cropped, 507×285 at x42 y335 |
| Capacity Exists Before Infrastructure Does (draft hero) | `6401348ced3fc45503e86b8c66e99b36` | https://res.cloudinary.com/dck5rzi4h/image/upload/v1792937719/dccmiami/journal/2026-10/capacity-exists-before-infrastructure-does-hero.png | Contact-sheet cropped, 508×286 at x912 y334 |
| An Invitation to Build DCC Miami With Us (draft hero) | `e5350695a7d426f6ac02689beda7ae25` | https://res.cloudinary.com/dck5rzi4h/image/upload/v1792937726/dccmiami/journal/2026-10/an-invitation-to-build-dcc-miami-with-us-hero.png | Contact-sheet cropped, 558×311 at x78 y630 |
| The Quote as an Agreement (draft inline) | `2ace0a8b5238c3f33f0b505c2091f062` | https://res.cloudinary.com/dck5rzi4h/image/upload/v1792937735/dccmiami/journal/2026-10/quote-as-an-agreement-inline.png | Contact-sheet cropped, 439×247 at x721 y641 |
| The Unfinished Contribution (draft inline) | `7c52e246eacc63d6cae044bbf9f5f823` | https://res.cloudinary.com/dck5rzi4h/image/upload/v1792937743/dccmiami/journal/2026-10/the-unfinished-contribution-inline.png | Contact-sheet cropped, 507×285 at x1165 y634 |

All assets uploaded as `resource_type=image`, PNG, 1672×941, into `dccmiami/journal/2026-10/`. Individual Cloudinary IDs/URLs were returned by the upload API and are referenced in the public registry or MDX draft image slots.

## Source-to-page map and quality gates

- Code source of truth: `lib/dcc/culture/editorial.ts` `heroImage`, `heroImageAlt`, `heroImageCaption`.
- MDX placements: `content/journal/capacity-exists-before-infrastructure-does.mdx` and `content/journal/an-invitation-to-build-dcc-miami-with-us.mdx`.
- Visible caption used for the five covers: **AI-generated conceptual illustration · DCC Miami**.
- Studio 43 cover is *not* an actual photograph of the studio. Replace with authentic approved field photography once available; do not use this generated image as evidence of site layout, attendance, machine inventory, or a completed paid fabrication case.
- Quality review: crop covers in actual cards and article hero widths, check focal objects are identifiable on mobile, check for any synthetic pseudo-text or implausible print geometry, compare color and compositional density with original covers. Keep drafts unpublished until human copy approval.
- Public images may use `q_auto/f_auto` via Cloudinary in the UI once previewed; full original PNG remains available.
