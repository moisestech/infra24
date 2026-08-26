# DCC Fabrication section images — drop + audit

What to shoot, types, and alternates (culture + fabricate + workshops): [`docs/dcc/IMAGE_SHOT_LIST.md`](../../../docs/dcc/IMAGE_SHOT_LIST.md).

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
| ☑ conceptual | `02-service-lanes.webp` | 16:9 | local drop | `/fabricate` lanes | Conceptual still — labeled in UI. |
| ☑ conceptual | `03-pricing-transparency.webp` | 16:9 | local drop | `/fabricate` + `/pricing` | Conceptual still — labeled in UI. |
| ☑ CDN 300 | `04-finishes-states.webp` | 21:9 | Cloudinary 300 | `/fabricate/finishes` hero | Conceptual finish ladder L0–L4. |
| ☑ conceptual | `05-artist-access.webp` | 16:9 | local drop | `/fabricate` access | Conceptual still — labeled in UI. |
| ☑ conceptual | `06-quote-intake.webp` | 16:9 | local drop | `/fabricate/quote` | Conceptual still — labeled in UI. |
| ☑ CDN 301–305 | finish L0–L4 | 4:5 | Cloudinary | Finishes picker | Conceptual finish states. |

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
