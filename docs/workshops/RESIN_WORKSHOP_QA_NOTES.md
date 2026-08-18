# Resin workshop QA notes (Batch D)

Date: 2026-08-10

## Automated results

- Unit: `__tests__/lib/workshop-engine-resin.test.ts` — 9 passed
- Playwright chromium: `__tests__/integration/resin-workshop.spec.ts` — 7 passed
- Screenshots: `docs/workshops/qa-screenshots/`

## Viewports exercised

390×844, 768×1024, 1280×800, 1440×900, 1920×1080 (plus live facilitate/present/session)

## Fixes during QA

- Clerk `ignoredRoutes` for `/api/workshop-live-sessions(.*)` so unauthenticated session create works in Playwright and kiosk flows.

## Remaining gaps

- Logical-page JPG previews (`guide-pages/page-NN.jpg`) not yet dropped — cards fall back without thumbnails.
- Cover page 1 still avoided until independent-use wording is corrected in Canva.
- Real photography still TBD for PPE, stations, failures, slicer UI, room.
- Playwright does not yet cover 1024×768 landscape or 2560×1440 (manual / extend later).
