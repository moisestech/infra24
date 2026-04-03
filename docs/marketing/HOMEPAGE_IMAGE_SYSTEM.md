# Homepage Image System

## Purpose

This document defines the image and layout system for the Infra24 marketing homepage.

The homepage already has a strong funnel structure:

1. Hero
2. Problem
3. Difference
4. What Infra24 builds
5. Process
6. Fit / Outcomes
7. Proof
8. CTA

The missing layer is not more copy or more sections. It is a clearer, more compelling **image system**.

This doc exists to help implementation stay aligned with Infra24’s positioning:

> Infra24 builds updateable public communication systems for nonprofits and cultural organizations.

This homepage should **not** feel like:

- a hardware catalog
- a trade show display vendor
- a generic SaaS landing page
- an over-animated startup site

It should feel like:

- a systems studio
- institutionally legible
- editorial but functional
- public-facing
- modular
- quietly premium
- grounded in real-world deployment

---

## Repo context

Current stack and relevant implementation details:

- **Next.js 14** with app router
- **Tailwind**
- **shadcn-style components** under `components/ui`
- **Magic UI** added via shadcn CLI
  - `components/ui/shimmer-button.tsx`
  - `components/ui/border-beam.tsx`
- **react-wrap-balancer** used in the hero headline
- **framer-motion** available
- **motion** available
- Homepage file: `app/(marketing)/page.tsx`
- Content source: `lib/marketing/content.ts`
- Remote image URLs (single swap point for org assets): `lib/marketing/image-assets.ts`
- Bento layout and visual kinds: `lib/marketing/homepage-visuals.ts`

Reusable marketing primitives:

- `MarketingSection`
- `CtaBand`
- `OfferLadder`
- `CaseStudyCard`
- `SiteHeader`
- `SiteFooter`

Homepage-specific visuals:

- `components/marketing/HeroCollage.tsx`
- `components/marketing/ProblemSplitVisual.tsx`
- `components/marketing/BentoSystemsGrid.tsx`
- `components/marketing/ProofStrip.tsx`

---

## Strategic rule

The homepage should never look like a smaller version of Displays2go.

Infra24 builds public communication systems for institutions—not a broad catalog of display products.

The image system must reinforce:

- institutional fit
- workflow clarity
- public usefulness
- updateability
- measurable outcomes
- physical + digital continuity

Not:

- product breadth
- isolated object shopping
- category browsing
- transactional retail energy

---

## Core image principle

Images must have a job.

Every homepage visual should do one of four things:

1. **Atmosphere** — institutional, cultural, or public-facing environment where the system lives.
2. **System evidence** — how physical and digital surfaces connect.
3. **Explanation** — clarifies a concept (especially fragmented vs connected communication).
4. **Proof** — work can be piloted, deployed, maintained, or measured.

If a visual does not do one of these jobs, it is decoration.

---

## Visual language goals

Editorial, modular, spatial, restrained, system-oriented, calm, ownable.

Surfaces to communicate across: signs, screens, maps, kiosks, portals, dashboards, QR-linked touchpoints, workflows, reporting layers.

---

## Visual anti-patterns

Avoid product-grid energy, equal-card repetition, generic SaaS mockup overload, stock-photo dependence (generic office people, fake teams), and excessive Magic UI / motion (neon glow everywhere, multiple animated borders per section).

---

## Section-by-section image system (summary)

| Section | Primary component / approach |
|--------|------------------------------|
| Hero | `HeroCollage` — asymmetric collage, one BorderBeam on frame, minimal motion |
| Problem | `ProblemSplitVisual` — fragmented vs connected |
| Difference | Copy-led; optional light diagram only |
| What Infra24 builds | `BentoSystemsGrid` — non-uniform grid, mixed photo / UI / diagram / metrics / handoff |
| Process | `OfferLadder` — mostly copy; optional minimal step line |
| Fit / Outcomes | Lightweight optional metrics motif |
| Proof | `ProofStrip` — contextual images + narrative |
| Final CTA | `CtaBand` — minimal, decisive |

---

## Magic UI usage rules

At most **one focal accent per section**. Good: hero collage frame, one standout bento cell, one proof lead treatment. Bad: shimmer on every button, border beams everywhere.

Typography, hierarchy, and image composition lead; effects support.

---

## Motion rules

Calm, intentional, premium, secondary. Prefer subtle entrance and restrained hover. Avoid looping animations everywhere and competing motion rhythms.

---

## Photography and UI direction

**Photography:** cultural interiors, lobbies, exhibitions, signage in context, kiosks in use, mission-driven spaces—clean framing. Avoid generic office stock and retail merchandising imagery.

**UI mockups:** portals, maps, admin layers, event systems, workflows, reporting, QR/mobile—always as part of a larger system, not the only visual language.

**Diagrams:** simple, elegant, lightly technical; show relationships (sign ↔ QR ↔ portal, public ↔ admin ↔ reporting) without whitepaper density.

---

## Asset ownership (operations)

Placeholder imagery uses curated remote URLs in `lib/marketing/image-assets.ts` (hero collage, bento photos, case study covers). `lib/marketing/content.ts` references those via `caseStudyCoverImages`. Replace URLs in `image-assets.ts` when organization-owned or licensed assets are ready; keep `alt` text accurate and institutional in tone. Add new hosts to `next.config.js` `images.remotePatterns` if needed.

---

## Final rule

The homepage should make a visitor feel:

> Infra24 does not just supply communication objects. It designs communication systems that live across space, interface, workflow, and public use.

If a new visual does not reinforce that idea, it should not be added.
