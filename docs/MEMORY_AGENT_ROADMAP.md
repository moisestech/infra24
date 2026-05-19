# Memory Agent — roadmap and entry points

This document complements the live **Roadmap** panel on `/o/[slug]/memory-agent`.

## Where to open the UI

| Entry | URL |
|-------|-----|
| Any org tenant | `/o/{slug}/memory-agent` (for example `/o/oolite/memory-agent`) |
| Org hub quick tile | `/o/{slug}` then the **Memory Agent** card (all orgs) |
| Oolite hub | Same plus **Alumni directory** tile (Airtable table-style view) |
| Alumni page CTA | `/o/{slug}/alumni` then **Open Memory Agent** |

Navigation sidebars include **Memory Agent** for Oolite, Bakehouse, and MadArts (use the same pattern when a dedicated Locust nav config is added).

## Oolite and Airtable

Oolite uses the same environment variables as the alumni directory:

- Prefer `AIRTABLE_OOLITE_ALUMNI_*`, or legacy `AIRTABLE_ALUMNI_*` (see `docs/AIRTABLE_MULTI_BASE.md`).

The Memory Agent **ask** API loads rows with `fetchAlumniFromAirtableDetailed(slug)` so there is a single source of truth in Phase 1.

## Phases (summary)

1. **Scaffold and UI** — Route, APIs, chat UI, links from hub, nav, and alumni page.
2. **Governance** — Optional Airtable columns for public or internal AI and row exclusions.
3. **Voice** — ElevenLabs TTS + auto-speak; mic → Whisper transcribe; Web Audio visualization (footer strip + hero frequency canvas) (current).
4. **Scale** — Supabase mirror, pgvector, auth, admin workflows (next).

The structured phase list lives in `lib/memory-agent/roadmap.ts` and is rendered in-app by `MemoryAgentRoadmap`.

## Environment checklist (local or Vercel)

| Variable | Required for |
|----------|----------------|
| `AIRTABLE_*_ALUMNI_*` or Oolite legacy vars | Data and `dataConfigured` on the status API |
| `OPENAI_API_KEY` | Ask flow, embeddings, and `/memory-agent/transcribe` (Whisper) |
| `ELEVENLABS_API_KEY` | Required for TTS |
| `ELEVENLABS_VOICE_ID` | Default voice ID from the ElevenLabs voice library (profile URL or Voice settings); or per-org `ELEVENLABS_VOICE_ID_OOLITE` |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional question logging into `memory_agent_question_logs` |

## Pilot and client materials

- [AI Public Output Governance](memory-agent/AI_PUBLIC_OUTPUT_GOVERNANCE.md) — policy, gates, and client-safe lines.
- [Public Signal Agent — demo script](memory-agent/PUBLIC_SIGNAL_AGENT_DEMO_SCRIPT.md) — five-minute spoken script, 90-second record plan, QA checklist.
- [Public Signal Agent — pilot offer](memory-agent/PUBLIC_SIGNAL_AGENT_PILOT_OFFER.md) — one-page 4–6 week pilot scope and deliverables.
