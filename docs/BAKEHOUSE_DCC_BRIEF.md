# Bakehouse + Digital Culture Center Miami — Activation Brief

> Paste-ready brief for a second AI conversation (or human collaborator). It
> tells them everything they need to know about DCC and the Born-Digital Era
> framing, then specifies how to activate the Bakehouse studio inside and
> outside, including the May event. Source of truth lives in this repo.

---

## 1. Who DCC is, in one paragraph

**Digital Culture Center Miami (DCC.miami)** is a public-facing platform for
artist-centered digital culture in Miami. We support artists and small
cultural organizations with practical infrastructure: clinics, workshops,
public programs, and updateable public interfaces (signs, kiosks, maps).
Implementation methodology is **Infra24**. Mission line on the hero is
"Building Cultural Infrastructure for Miami’s Artists." We treat digital and
technical support as cultural infrastructure — not consulting.

## 2. The Born-Digital Era frame

We organize all programming under one banner: **the Born-Digital Era**. The
thesis: as money goes down and information becomes free, the network — humans
in real connection — becomes the most valuable layer. DCC's job is to grow
that network and broadcast it in public space.

The frame replaces "AI Era" framing because no single technology captures
what we serve (artists work across code, screens, networks, hardware, AI,
and online culture).

## 3. The seven priority channels

Each channel is a public program with its own roadmap, KPI ladder, and a
bespoke design surface on the website. The network is the spine; every channel
writes back into it.

| Channel | What it is | KPI ladder | Site |
| --- | --- | --- | --- |
| **Network / CRM** | The graph of people, institutions, opportunities. | 50 → 250 → 1,000 profiles | `/network`, `/era/network` |
| **IRL Events** | Place-based gatherings, talks, mixers. | 100 → 1k → 5k cumulative attendees | `/events`, `/era/irl-events` |
| **Workshops** | Hands-on public learning. | 50 → 200 → 1k cumulative enrollments | `/workshops`, `/era/workshops` |
| **Clinics & 1:1** | Direct support that ships a deliverable each session. | 12 → 50 → 150 sessions | `/era/clinics` |
| **Open Lab** | Drop-in studio days at Bakehouse. | 10 → 40 → 120 visitors per open day | `/era/open-lab` |
| **Public Corridor** | Smart signs, kiosks, maps in physical space. | 1 → 3 → 8 active sites | `/era/public-corridor` |
| **Newsletter** | Weekly digest pulling from every channel. | 250 → 1k → 5k subs | `/newsletter`, `/era/newsletter` |

YouTube long-form, podcast, and social are deliberately Phase 2 — they slot
in cleanly once the seven have rhythm.

## 4. Bakehouse activation — overall goal

Use my **studio at Bakehouse Art Complex** to physically broadcast Open Lab,
IRL Events, and Public Corridor. The Network spine is the ask: every visitor
should leave as a node.

The studio is the first **Public Corridor active site (T1)** and the first
**Open Lab venue**. The May event is the first **IRL Events convergence**.

## 5. Inside the studio

Goal: anyone who walks in understands what DCC is in 30 seconds and has a
frictionless way to "join."

- **Wall-mounted screen** running the Open Lab `LiveLoop` sketch (generative
  loop sketch, the studio's "live face") on a loop. Source of truth:
  `components/era/effects/LiveLoop.tsx`.
- **Secondary screen / tablet** running a kiosk loop of the seven Era
  inflection cards (live from `/era`).
- **Printed Born-Digital Era zine** — a static dump of the seven channels
  + KPI ladders pulled from `data/era-metrics.json`. Print at 8 pages,
  staple, leave a stack on a stool.
- **QR poster** to `/era` (single QR, 30cm x 30cm) and a second QR to
  `/network` so people can join the graph.
- **Clipboard intake form** that becomes a Network node — name, practice,
  contact, what you make, what you'd want from DCC. Each row gets typed
  into `data/era-metrics.json` and (later) the Network CRM.
- **Sticker drop**: 50 stickers with the `PUBLIC DIGITAL MIAMI` lockup +
  `dcc.miami` URL. Free to take.

## 6. Outside the studio (Bakehouse common space)

Goal: passers-by who don't know DCC become curious, then walk in.

- **Vinyl strip** with the `PUBLIC DIGITAL MIAMI` lockup + studio number
  beside the door. Provides an external "I am here" marker.
- **Hallway monitor** (small repurposed display or e-ink) running the
  Public Corridor `CityScan` loop with this week's program — workshops,
  clinics, next IRL event. Updates from the same `data/era-metrics.json`.
- **Sandwich board** on event nights: workshop title, time, QR to RSVP page.
- **Window text** (vinyl): one rotating phrase from
  `dccHeroRotatingHeadlines` ("A Support System for Networked Art", "Built
  for Internet-Native Artists", etc.).

## 7. May event — Born-Digital Era: Open Studio #1

Slug: `born-digital-era-open-studio-may` (lives at
`/events/born-digital-era-open-studio-may`).

### Format (3.5 hours)

- **0:00 – 2:00 — Open studio.** Visitors drop in. LiveLoop on the screen;
  zines on the stool; clipboard for intake; coffee.
- **2:00 – 2:30 — Talk.** "What the Born-Digital Era is and why the
  network is the value." 20 min talk + 10 min Q&A.
- **2:30 – 3:30 — Show and tell.** Four anchor slots, 12 minutes each:
  1. Workshop demo (one workshop facilitator runs a 12-min cut of their
     workshop).
  2. Clinic mini-session (live audit of one volunteer artist's website).
  3. Newsletter live read (host reads the next issue out loud and takes
     notes from the room).
  4. Network walkthrough (host opens `/network` on the screen, walks
     through the live graph, asks the room "who's missing?")

### Targets (T1)

- 40 attendees in the room
- 25 newsletter subscribers added that night
- 15 new network nodes from intake
- 8 follow-up workshop holds
- 1 first-pass photo + audio recording for `/journal`

### Run-of-show roles

- **Host** — me. Keeps time, runs the talk + network walkthrough.
- **Intake** — 1 volunteer at the door with the clipboard.
- **Tech** — 1 person on the screen / monitor / audio. Reset slides between
  segments.
- **Photo / docs** — 1 person making a photo + audio recording for the
  journal post.

### Pre-event checklist

- Confirm Bakehouse common-space access for the hallway monitor.
- Print zines (30 copies).
- Print posters / stickers / window text vinyl.
- Order sandwich board if not on hand.
- Stock coffee + light snacks.
- Test LiveLoop on the wall screen at the actual aspect ratio.
- Send newsletter announcing the date with link to
  `/events/born-digital-era-open-studio-may`.

### Post-event deliverables

- Update `data/era-metrics.json` with new attendee + node counts.
- Publish the journal post under `/journal/field-notes/`.
- Update `/era/irl-events` page with photos.
- Send "thanks for coming" email to attendees.

## 8. Copy blocks (use as-is or remix)

- **Tagline (long).** "Digital Culture Center Miami builds public cultural
  infrastructure for artists in the Born-Digital Era — workshops, clinics,
  open lab, public-facing systems, and a network spine that ties them
  together. Powered by Infra24."
- **Tagline (short).** "Public cultural infrastructure for the Born-Digital
  Era."
- **Bakehouse positioning line.** "Studio [#] at Bakehouse Art Complex is
  DCC's first open lab — drop in on Saturdays, leave as a node in Miami's
  cultural network."
- **CTAs.** "Add yourself to the network → /contact/artist-index" ·
  "Subscribe → /newsletter" · "See upcoming → /events".

## 9. What to ask the second conversation to do

Pick one and run with it; do not try all at once.

1. Draft the printed zine (Born-Digital Era one-pager × 8 pages) using
   `data/era-metrics.json` as the data source.
2. Sketch the QR poster and sandwich-board layouts at print sizes.
3. Write the talk script for the 20-minute opening at the May event.
4. Draft the post-event journal entry shell (sections + prompts).
5. Spec the hallway monitor display loop (durations + content lanes).

Each of these has a single owner, one artifact, and a clear handoff back
into the website (`data/`, `/journal/...`, `/events/...`, or
`docs/...`). Avoid re-litigating the strategy — it lives in
`/era` on the site and the plan in `.cursor/plans/`.

## 10. Source-of-truth files in this repo

- Strategy + copy: `lib/marketing/content.ts` (`bornDigitalEra`,
  `bornDigitalEraChannels`).
- Metrics + ladders: `data/era-metrics.json`, `lib/era/metrics.ts`.
- Tokens + easings: `lib/era/tokens.ts`.
- Cards + effects: `components/era/`.
- Pages: `app/(marketing)/era/page.tsx`,
  `app/(marketing)/era/[channel]/page.tsx`,
  `app/(marketing)/events/born-digital-era-open-studio-may/page.tsx`.
