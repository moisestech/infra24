# Events, announcements & Memory Agent merge

**Product name (external):** Public Signal Agent  
**Internal codename:** Memory Agent — multi-source institutional memory (people + programming)

## Current split (problem)

| Surface | Data | Good at | Memory Agent reads? |
|---------|------|---------|-------------------|
| Announcements / display / carousel | Supabase `announcements` | Editorial programming, exhibitions, films, signage month | **No** |
| Workshops catalog | Supabase `workshops` + `workshop_sessions` | Bookable programs | **No** |
| Memory Agent | Airtable alumni | People, themes, disciplines | **Yes (only)** |

Soho House adds `lib/sohohouse/knowledge-domain.ts` (`SohoKnowledgeRecord`) — **spec only**; pilot still uses Oolite alumni Airtable.

**Voice pipeline (fixed):** record → Whisper transcribe → auto-ask → optional TTS. No manual review in public kiosk. Safety = governance on records + prompts, not kiosk approval.

## Strategic path

Merge **people memory** + **programming memory** into one governed conversational agent.

### Decisions (defaults)

| Question | Decision |
|----------|----------|
| First technical proof | **Oolite** (Supabase announcements/workshops exist) |
| First sales wrapper | **Soho House** (member route, bookable vs editorial) |
| Hero question (Oolite) | “What’s happening this week?” |
| Hero question (Soho) | “What should members experience this week?” |
| Programming source of truth (phase 1) | **Supabase** announcements + workshops |
| Retrieval architecture (phase 1) | **Two retrievers + intent routing** → unified `KnowledgeRecord` context |
| Public kiosk | Auto-ask; only public-approved / visible records |
| First sales proof | Working demo + 90s video → Soho PDF + pitch page |

## Unified `KnowledgeRecord`

Federated sources; unified model context.

```ts
type KnowledgeRecordSource =
  | 'airtable_alumni'
  | 'announcement'
  | 'workshop'
  | 'cms_story'
  | 'soho_record'

type KnowledgeRecordKind =
  | 'person'
  | 'exhibition'
  | 'event'
  | 'workshop'
  | 'opportunity'
  | 'screening'
  | 'house_story'
  | 'bookable_event'
  | 'editorial_story'
  | 'space'
  | 'partner'

// See lib/memory-agent/knowledge-record.ts
```

## Intent routing

| Intent | Example | Retriever | Time filter |
|--------|---------|-----------|-------------|
| `people` | “Which alumni are photographers?” | Airtable alumni | — |
| `programming` | “What should go on the smart sign?” | Announcements + workshops | Optional |
| `time_bound` | “What’s happening this week?” | Programming | **SQL/date first**, then semantic |
| `upcoming` | “What exhibitions are coming up?” | Programming | `startsAt >= now` |
| `latest` | “Latest exhibition?” | Programming | Sort `publishedAt` / `startsAt` |
| `recommendation` | “What should visitors see?” | Programming | This week + rank |
| `mixed` | “Who is connected to this exhibition?” | Both | — |

**Rule:** Never treat editorial stories as ticketed events without grounded `recordKind`, dates, and CTA (Soho governance).

## Response shape (roadmap)

Today: `answer`, `artists[]`, `followUps`, `dataGaps`, `outputs`, `signageDraft`.

Next: `events[]` (`MemoryAgentEventCard`), richer `dataGaps` with `suggestedAction` (create/edit announcement, edit Airtable row).

## Phases

### Phase 0 — Freeze what works
Do not rewrite voice, assets, QR handoff, triple outputs, or staff dev panel.

### Phase 1 — Oolite programming retrieval ✅ (Sprint 1)
- `fetchProgrammingForMemoryAgent(orgSlug)`
- Map announcements + workshops → `KnowledgeRecord`
- Governance: public visibility, no canceled, no expired (with recent window)
- Intent detection → programming context in `ask.ts`
- Clear `dataGaps` when programming intent but no records

### Phase 2 — Intent routing hardening (Sprint 2)
- Time-bound filters before embeddings
- Mixed retrieval tuning

### Phase 3 — Event cards + UI (Sprint 3)
- `events[]` in JSON + programming cards under answer

### Phase 4 — Staff feedback loop (Sprint 4)
- `dataGaps` → deep links (create/edit announcement, Airtable row)

### Phase 5 — Soho demo layer (Sprint 5)
- `SohoKnowledgeRecord` seed data
- Member route, staff brief, leadership, signage, QR pitch page

## Institutional event data today (Oolite / Bakehouse / Soho)

| Org | Programming in Supabase | People in Airtable | Memory Agent programming | Notes |
|-----|-------------------------|--------------------|---------------------------|-------|
| **Oolite** | Yes — `announcements` (seeded), `workshops` + sessions | Yes — dedicated base | **Live** via `fetchProgrammingForMemoryAgent` | Demo target tomorrow |
| **Bakehouse** | Yes — same schema, feature flags on | Configurable per `org-alumni-config` | Same code path if org slug + data exist | Less seeded content than Oolite |
| **Soho House** | **No** — nav/features off | Pilot: **Oolite alumni fallback** | Ontology only (`SohoKnowledgeRecord`) | Sprint 5 = demo records → same `KnowledgeRecord` + event cards |

**There is no separate `events` table.** “Event” means:

1. **Editorial** → `announcements` (`type: event`, `sub_type: exhibition`, `cinematic`, …)
2. **Bookable** → `workshops` + `workshop_sessions`
3. **Spaces** → `bookings` (not in Memory Agent yet)

### Compatibility matrix

| Field | Supabase announcement | Supabase workshop session | Airtable alumni | SohoKnowledgeRecord (spec) |
|-------|----------------------|---------------------------|-----------------|----------------------------|
| Stable id | `id` | session `id` | Airtable `id` | `id` |
| Title | `title` | workshop `title` | name | `title` |
| Schedule | `starts_at` / `ends_at` | `session_date` | — | `startsAt` / `endsAt` |
| Location | `location` | session/workshop | location | `locationLabel` |
| CTA | `rsvp_url`, `primary_link` | — | website | `bookingCta` |
| Governance | `visibility`, `status`, `is_active` | `is_public`, `status` | `approvedForPublicAi` | `approvedForPublicAi` |
| Kind | `type` + `sub_type` | `type: workshop` | person | `recordKind` |

**Normalizer:** `KnowledgeRecord` → server merges to `MemoryAgentEventCard` (canonical dates/CTAs from source, not model).

### Pitfalls / setbacks

- **Schema drift** — `org_id` vs `organization_id`, `body` vs `content`, `visibility: public` vs `external`
- **Undated announcements** — time-bound questions return empty week → need `dataGaps`, not hallucination
- **Soho without Supabase programming** — event cards need **seed JSON or Airtable Events** before live House CMS
- **Editorial vs bookable** — wrong CTA on a story is a trust failure; gate CTAs on grounded URLs
- **Dual maintenance** — people in Airtable, programming in Supabase until sync jobs exist
- **Embedding cost** — large announcement lists; time-filter before embed (already in Sprint 1)

### Unifying strategy (compounds per institution)

```
Source of truth (per org config)
  ├─ Airtable: people / members / creators
  ├─ Supabase: announcements + workshops (+ logs, assets)
  └─ Future: CMS sync → KnowledgeRecord

Ingestion adapters (per source)
  → map*ToKnowledgeRecord()
  → filter*ForMemoryAgent(mode)

Retrieval (shared)
  → intent routing
  → time filters (programming)
  → hybrid rank

Response (shared)
  → answer + artists[] + events[] + outputs + signage
```

**Tomorrow (Oolite):** Supabase programming → event cards.  
**Next (Soho):** Same UI; swap adapter to `soho_record` demo data, then live Events base/CMS.

## Sprint acceptance tests

### Sprint 1
- [ ] “What’s happening this week?” → programming context from Supabase (not alumni-only hallucination)
- [ ] “What exhibitions are coming up?” → dated programming context
- [ ] “Which alumni are photographers?” → alumni only
- [ ] “Who is connected to this exhibition?” → both blocks when data exists
- [ ] No invented dates / booking links in public mode

### Sprint 3 ✅
- [ ] “What’s happening this week?” → answer + **event cards** from announcements/workshops
- [ ] “Which alumni are photographers?” → artist cards only, no spurious event cards
- [ ] CTAs only when grounded on source row

### Sprint 4–5
Staff gap actions; Soho demo `KnowledgeRecord` ingest.

## Risks

| Risk | Mitigation |
|------|------------|
| Stale Supabase vs Airtable | Federated sources; `source` + `sourceRecordId` on every record |
| Hallucinated “book now” | `bookingCta.grounded`; prompt rules; no CTA without URL |
| Time queries wrong | Server-side week/upcoming filters before semantic rank |
| Latency | Fetch programming only when intent needs it |
| Schema drift (`org_id` vs `organization_id`) | `.or()` filter like public announcements API |

## Files (implementation)

| Module | Role |
|--------|------|
| `lib/memory-agent/knowledge-record.ts` | Shared types |
| `lib/memory-agent/intent.ts` | `detectMemoryIntent` |
| `lib/memory-agent/programming.ts` | Fetch, map, filter, rank, context block |
| `lib/memory-agent/ask.ts` | Orchestration |
| `lib/sohohouse/knowledge-domain.ts` | Soho ontology (phase 5) |

## Institutional memory loop

```
Ask → Answer → dataGaps → Staff improves source of truth → Agent improves
```

People gaps → Airtable. Programming gaps → Supabase announcements/workshops.
