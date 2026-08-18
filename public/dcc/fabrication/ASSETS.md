# DCC Fabrication section images — drop + audit

Drop files into this folder using the exact filenames below. Until a file is wired (`ready: true` in `lib/dcc/fabrication/section-media.ts`), `/fabricate` shows a **color-coded placeholder** with the shot brief and filename.

`public/` is gitignored — after drop, force-add:

```bash
git add -f public/dcc/fabrication/*.webp
```

Then set `ready: true` on that slot in `section-media.ts` (or ask the agent to flip it).

## Checklist (EOD delivery)

| Status | File | Aspect | Size target | Route / section | Shot brief |
|---|---|---|---|---|---|
| ☐ | `01-fabricate-hero.webp` | 21:9 | 1920×823 | `/fabricate` hero | Wide Bakehouse / Studio 43 fabrication desk: printer silhouette, cured or FDM samples, no people, no readable UI. |
| ☐ | `02-service-lanes.webp` | 16:9 | 1600×900 | `/fabricate` lanes | Triptych: print-ready USB/file, rough mesh on laptop silhouette, sketch-to-object planning. No text in image. |
| ☐ | `03-pricing-transparency.webp` | 16:9 | 1600×900 | `/fabricate` + `/pricing` | Still life: scale cube, filament/resin spool silhouette, timer form, blank estimate card — cost drivers, no numbers. |
| ☐ | `04-finishes-states.webp` | 16:9 | 1600×900 | `/fabricate/finishes` hero | Same object raw → cleaned → assembly → primed → finished, left-to-right. (Stand-in until then: instructional 113.) |
| ☐ | `05-artist-access.webp` | 16:9 | 1600×900 | `/fabricate` access | Workshop badge / approved checklist / small credit token — no logos or dollar amounts. |
| ☐ | `06-quote-intake.webp` | 16:9 | 1600×900 | `/fabricate/quote` | Labeled USB, closed project box, blank intake form silhouette. No PII. |
| ☐ | `finish-l0-raw.webp` | 4:5 | 1200×1500 | Finishes picker L0 | As-printed part, supports just removed; raking light. |
| ☐ | `finish-l1-clean.webp` | 4:5 | 1200×1500 | Finishes picker L1 | Cleaned part, light sanding evidence, no paint. |
| ☐ | `finish-l2-assembly.webp` | 4:5 | 1200×1500 | Finishes picker L2 | Joined parts with pins/seams planned, unpainted. |
| ☐ | `finish-l3-exhibition.webp` | 4:5 | 1200×1500 | Finishes picker L3 | Primed / filled sculpture ready for paint. |
| ☐ | `finish-l4-finished.webp` | 4:5 | 1200×1500 | Finishes picker L4 | Presentation-ready painted or coated object. |

## Color coding (UI)

| Section | Token | Typical icon cue |
|---|---|---|
| Overview / hero | cyan | Sparkles |
| Service lanes | indigo | Route / file / wrench |
| Pricing | teal | Badge / rates |
| Finishes | violet | Layers |
| Artist Access | emerald | Shield |
| Quote | sky | Clipboard |
| Rate tiers | cyan / emerald / orange | Handshake / badge / building |
| Finish L0–L4 | slate → emerald → indigo → amber → violet | Box → sparkles → puzzle → brush → palette |

## Constraints

- Prefer WebP (PNG masters OK).
- No text, logos, dollar amounts, or readable UI in the frame.
- Illustrative / documentary photography is fine; keep PPE and machine safety honest if people appear (prefer no people for section heroes).
- Color in the product UI is always paired with icons + labels — do not rely on color alone in the photos.
