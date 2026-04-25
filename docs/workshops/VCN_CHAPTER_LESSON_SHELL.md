# Vibe Coding & Net Art — chapter lesson shell (“robust” vs markdown-only)

Public URLs: `/workshop/vibe-coding-and-net-art/chapters/{slug}` (and org mirror under `/o/.../workshop/.../chapters/...`).

## What “robust” means here

A chapter is **shell-complete** when `getChapterOverlay(slug)` in `lib/course/chapters.ts` returns structured data. That unlocks **`VcnVibeNetArtLesson`**: sticky sidebar (chapter nav, on-page TOC, glossary chips), thesis strip, optional “At a glance,” anchor works, **manuscript card** (`LessonFullReadingCard`) interleaved with concept blocks, vocabulary row, context cards, tool bridge, artifact prompt, reflection, resource index, and next-chapter CTA.

Chapters **without** an overlay still get the **same layout shell** (rail, manuscript typography via `.manuscript-prose`), but the main column is **overview + manuscript only**—no curated concept cards or anchor panel.

**Why overlays feel stronger:** editorial hierarchy is designed twice—once in TypeScript (scannable lesson spine) and once in markdown (longform). Links and lists are styled in `app/globals.css` under `.manuscript-prose`; tenant org pages also set `--tenant-primary` (`TenantLayout` / `TenantProvider`) so manuscript links pick up **org brand color** when present.

## Shell-complete chapters (overlay registered)

These are the **most robust** today (alphabetical by slug):

| Slug | Course # (index) | Notes |
|------|------------------|--------|
| `anti-interface-jodi` | 4 | JODI / Whitney spine |
| `final-project-build-publish-and-frame-your-net-artwork` | 11 | Capstone |
| `getting-started-with-vibecoding` | 0 | Onboarding + official hubs |
| `advanced-vibecoding-pathways` | 10 | Advanced pathways lab (CSS / p5 / three.js chooser) |
| `hypertext-and-nonlinear-narrative` | 3 | Lialina / Rhizome spine |
| `identity-presence-and-networked-selves` | 7 | Cortright, Mattes, Cheang, LaTurbo |
| `net-art-primer` | — (supplement / entry) | Primer sequence label |
| `remix-appropriation-and-internet-vernacular` | 6 | Vernacular + anthology anchors |
| `what-is-net-art` | 1 | Definitions + institutions |

**Programmatic list:** `listVcnLessonOverlaySlugs()` and `vcnChapterHasLessonOverlay(slug)` from `lib/course/chapters.ts`.

## Canonical course spine gaps (high priority for the next overlays)

Rows from `VCN_COURSE_INDEX` that **do not** yet have an overlay—best candidates to match the “robust” chapters above:

| # | Slug | Title (index) |
|---|------|-----------------|
| 2 | `the-browser-is-a-medium` | The Browser as Medium |
| 5 | `interaction-motion-and-responsive-behavior` | Interaction, Motion, and Responsive Behavior |
| 8 | `systems-circulation-and-infrastructure` | Systems, Circulation, and Infrastructure |
| 9 | `publishing-liveness-and-the-artwork-as-website` | Publishing, Liveness, and the Artwork as Website |

Suggested build order: **2 → 5 → 8 → 9** (follows public reader progression). For each: add `lib/course/overlays/{slug}.ts`, register in `OVERLAYS`, add the usual **lesson chrome** blockquote at the top of the markdown file pointing at the overlay source.

## On-disk chapters without a course index row (supplements / deep dives)

Still markdown-backed and reachable by URL; treat as **Tier B** until given an overlay or folded into the index:

- `appropriation-and-remix-cory-arcangel`
- `avatars-and-online-performance-eva-franco-mattes`
- `browser-behavior-as-art-mark-napier`
- `click-and-agency`
- `css-as-mood-rafael-rozendaal`
- `final-micro-site-and-statement`
- `glitch-as-language-jodi`
- `hidden-systems-heath-bunting`
- `homepage-as-self-portrait`
- `html-as-composition`
- `identity-and-surveillance-shu-lea-cheang`
- `motion-and-temporality`
- `platform-aesthetics-self-image-petra-cortright`
- `resource-appendix`
- `single-purpose-websites-rafael-rozendaal`

(Use `listDiskChapters('vibe-coding-and-net-art')` for the live list.)

## Next steps (engineering + content)

1. **Overlays for spine gaps** (table above)—mirror structure of `identity-presence-and-networked-selves.ts` or `anti-interface-jodi.ts`: thesis, 5–6 sections, anchor works + tools URLs, glossary pins, artifact aligned to markdown mini-assignment.
2. **Keep manuscript + overlay in sync**—frontmatter `description` vs overlay `summary`: when they differ, “At a glance” shows; lesson chrome blockquote in markdown points editors to the `.ts` file.
3. **Optional:** workshop handbook page or admin-only table that calls `listVcnLessonOverlaySlugs()` vs disk list for a green/red matrix (not built yet).

## Related code

- Overlays map: `lib/course/chapters.ts`
- Lesson layout: `components/course/VcnVibeNetArtLesson.tsx`
- Manuscript typography + links: `components/course/LessonFullReadingCard.tsx` + `.manuscript-prose` in `app/globals.css`
- Course order: `lib/course/vibe-net-art/course-index.ts`
