# DCC culture content — open facts

Org status (living report): [`docs/dcc/STATUS.md`](../../../docs/dcc/STATUS.md).

Code-native records live in this folder. Do not invent missing fields.

To add or update a record, fill the packet in [RECORD.md](./RECORD.md) and edit one registry file. One namespace per commit (`culture` / `studios` / `fabricate` / `civic-projects`).

## Published artists (founders / Studio 43 circle)

These three are on `/artists` from existing public copy (Edge Zones index, Knight portraits, studio tours). They are **not** Clandestine participating artists.

| Slug | What is confirmed | Still empty |
|---|---|---|
| `moises-sanabria` | Name, Studio 43 / Bakehouse location, Edge Zones one-liner, Knight portrait, BabyAGI hero, website, Instagram, featured on homepage `#now`, 360 tour | Long bio, practice tags, Clandestine `programIds` |
| `fabiola-larios` | Name, Edge Zones one-liner, Knight portrait, Surveillance Cutie hero, website, Instagram, 360 tour | Location field, long bio, practice tags, Clandestine |
| `angelo-caruso` | Name, Edge Zones one-liner, exhibition portrait, website, Instagram | Location, long bio, hero, 360 (do not invent), Knight founder card, Clandestine |

## Clandestine Art Fair 2026

Still needed before the program page can feel finished:

- names of the three participating artists (not assumed to be the founders above)
- short bios and practice tags
- portraits and selected-work images (drop under `public/dcc/culture/artists/{slug}/` or Cloudinary `dccmiami/artists/{slug}/`)
- exact dates and location
- DCC program statement (beyond the current known-facts copy)
- whether DCC transacts sales or takes any commission (do not encode until disclosed)
- `artistIds` on the program + `programIds: ['clandestine-2026']` on each participating artist — only when the packet is real

## First Journal / Conversations

- guest names
- recording + transcript
- optional video/audio URLs
- newsletter excerpt URL once a provider/workflow is confirmed

## Images

Empty image fields render an honest fallback. Do not generate fake portraits or installation photos.

## What this is not

- `/projects` remains Infra24 civic/systems proof
- `/fabricate/projects` remains fabrication field tests
- Cultural works attach to artist / program / journal records in this phase
