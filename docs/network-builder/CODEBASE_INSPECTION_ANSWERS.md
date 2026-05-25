# Network Builder — Codebase Inspection Answers

**Date:** May 24, 2026  
**Operating model:** INFRA24 Airtable = DCC CRM + Agent Approvals · Supabase = durable logs · Next.js = dashboard/reports

---

## A. Airtable integration

### 1. Where are `AIRTABLE_DCC_CRM_*` env vars expected?

| Variable | Used in |
|----------|---------|
| `AIRTABLE_DCC_CRM_API_KEY` | `lib/airtable/crm-graph-service.ts`, `lib/network-builder/org-config.ts` |
| `AIRTABLE_DCC_CRM_BASE_ID` | Same |
| `AIRTABLE_DCC_CRM_TABLE_PEOPLE` | Same (required minimum) |
| `AIRTABLE_DCC_CRM_VIEW_PEOPLE` / `VIEW_ID` | Optional People view scope |
| `AIRTABLE_DCC_CRM_TABLE_INSTITUTIONS` | Optional |
| `AIRTABLE_DCC_CRM_TABLE_OPPORTUNITIES` | Optional |
| `AIRTABLE_DCC_CRM_TABLE_INTERACTIONS` | Optional (enables last-contact derivation) |
| `AIRTABLE_DCC_CRM_TABLE_CAMPAIGNS` | Optional |
| `AIRTABLE_DCC_CRM_TABLE_AGENT_APPROVALS` | **New** — required for `--write-approvals` |

Documented in `.env.example` and `docs/AIRTABLE_MULTI_BASE.md`.

### 2. Exact table/field names expected today

**CRM graph** (`lib/airtable/crm-graph-field-map.ts`):

| Table | Fields |
|-------|--------|
| People | Full Name, Institution, Contact Category, Warmth, Miami Area?, Campaigns, Interactions |
| Institutions | Institution Name, Type, City, Status, Relationship Strength, Miami Area?, links |
| Opportunities | Opportunity Name, Institution / Organization, People Involved, Status, Stage, Opportunity Bucket, Deadline, Campaigns |
| Interactions | Date, Type, Institution, People, Related Opportunity |
| Campaigns | Campaign Name, Campaign Type, Related People/Institutions/Opportunities, Status |

**Network Builder People** (`lib/network-builder/field-map.ts`) extends with:

Email, Practice Tags, Interest Tags, Location, Website, Instagram, Consent Status, Source, Relationship Stage, Last Contacted

Missing columns are skipped gracefully (optional fields do not penalize score).

**Agent Approvals** (`lib/network-builder/approval-field-map.ts`):

Action ID, Goal, Person / Partner (linked), Action Type, Relationship Stage, Agent Recommendation, Reason, Proposed Message, Risk Level, Approval Status, Human Notes, Approved By, Approved At, Execution Status, Execution Result, Outcome, Run ID, Readiness Percent

### 3. Read vs write support

| Operation | Supported |
|-----------|-----------|
| Read (list all records) | ✅ `fetchAllRecords` |
| Patch single record | ✅ `patchAirtableRecord` (used by budget sync) |
| Create records | ✅ **Added** `createAirtableRecords` (batch POST, chunked by 10) |

Alumni/CRM graph paths are **read-only** in the app today except budget Purpose sync.

**Write scope required on PAT:** `data.records:write` (see `docs/AIRTABLE_BUDGET_AUDIT.md`).

### 4. Reuse existing client for Agent Approvals?

**Yes.** `lib/airtable/client.ts` is the shared layer. `writeActionsToAirtable()` in `lib/network-builder/write-approvals.ts` uses `createAirtableRecords`.

### 5. Does `org-config.ts` resolve DCC correctly?

**Yes.** For `orgSlug=dcc`:

```txt
API key:  AIRTABLE_DCC_NETWORK_API_KEY → AIRTABLE_DCC_CRM_API_KEY → AIRTABLE_API_KEY
Base:     AIRTABLE_DCC_NETWORK_BASE_ID → AIRTABLE_DCC_CRM_BASE_ID
People:   AIRTABLE_DCC_NETWORK_TABLE_PEOPLE → AIRTABLE_DCC_CRM_TABLE_PEOPLE
Approvals: AIRTABLE_DCC_NETWORK_TABLE_AGENT_APPROVALS → AIRTABLE_DCC_CRM_TABLE_AGENT_APPROVALS
```

### 6. What breaks if INFRA24 is the DCC CRM base?

**Nothing** — that is the intended configuration. The code uses env vars, not hardcoded base names. Ensure table IDs match INFRA24 base structure.

### 7. Exact `.env.local` for live DCC run

```env
# Minimum for read + score (dry-run) — INFRA24 CRM base
AIRTABLE_DCC_CRM_API_KEY=pat...
AIRTABLE_DCC_CRM_BASE_ID=appWoYBRdklcz2RJH
AIRTABLE_DCC_CRM_TABLE_PEOPLE=tbltHiqscY80ybsGE
AIRTABLE_DCC_CRM_TABLE_INSTITUTIONS=tblu9cIAsNSg5Khhp
AIRTABLE_DCC_CRM_TABLE_OPPORTUNITIES=tblFdv4oI3FUXWtBl
AIRTABLE_DCC_CRM_TABLE_INTERACTIONS=tbl4PSVbNU2G6kLVl
AIRTABLE_DCC_CRM_TABLE_CAMPAIGNS=tblNdjser5MtVbZ4U
AIRTABLE_DCC_CRM_VIEW_PEOPLE=viwoUO9iUFj9ynVUq

# Required for --write-approvals
AIRTABLE_DCC_CRM_TABLE_AGENT_APPROVALS=tbl...

# Required for Supabase persist on write
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

---

## B. Supabase migration

### 1. Does `20260524120000_network_builder.sql` apply cleanly?

**Not verified against production yet** — migration uses `CREATE TABLE IF NOT EXISTS` and standard FK to `organizations(id)`. No destructive DDL. Run locally or via `npm run supabase:push` after review.

### 2. Org-scoped?

**Yes.** All tables include `organization_id UUID NOT NULL REFERENCES organizations(id)`.

### 3. RLS needed for MVP?

**Not required for MVP.** CLI and server routes use `SUPABASE_SERVICE_ROLE_KEY` via `lib/supabase/server.ts`. Add RLS when building in-app approval UI.

### 4. Migration command convention

```bash
npm run supabase:push   # scripts/supabase-push-remote.sh → npx supabase db push
```

### 5. Naming conflicts with Memory Agent?

**None.** Memory Agent uses `memory_agent_*` tables. Network Builder uses `network_*` prefix.

### 6. Link to Airtable records?

**Yes.** `network_proposed_actions.airtable_record_id` stores the Airtable approval row id after write. Also `external_action_id` for agent-generated action id.

### 7. `contact_snapshots` vs `people_snapshots`?

Migration uses **`network_contact_snapshots`** — intentional name to avoid confusion with platform `artist_profiles`. Optional cache layer for future sync; not required for MVP.

---

## C. Agent architecture

### 1. Memory Agent reuse

| Reuse | How |
|-------|-----|
| Data gap UX pattern | Extend for CRM field gaps later |
| Generated assets queue | Weekly reports → `channel: 'report'` |
| Governance columns | Same pattern for consent/visibility on People |
| OpenAI structured JSON | Future: LLM-drafted messages (currently template-based) |

**Do not** route Network Builder through Memory Agent ask flow — different trigger (batch/cron vs conversational).

### 2. Weekly reports storage

**Recommendation:** `memory_agent_generated_assets` with `channel: 'report'` for in-app viewing; optional Resend email later. Dedicated `network_reports` table only if reporting outgrows assets.

### 3. OpenClaw propose → commit reuse

**Yes for pattern, not table.** TTL tokens, preview payload, status workflow in `lib/control-plane/proposals.ts` are the template. CRM actions should **not** use `control_proposals` (display-only domain).

### 4. Agent Approvals vs control_proposals

**Separate.** Display mutations stay in control plane. Network relationship actions stay in Airtable + `network_proposed_actions`.

### 5. Parallel module?

**Correct.** `lib/network-builder/` is independent of `lib/memory-agent/` and `lib/control-plane/`.

---

## D. Execution actions (pre-implementation audit)

| Question | Answer |
|----------|--------|
| Resend configured? | ✅ `lib/email/EmailService.ts`, `RESEND_API_KEY` — transactional email, not drafts |
| Gmail OAuth? | ⚠️ Google Calendar OAuth only (`lib/calendar/google-calendar.ts`) — **no Gmail draft API** |
| Create draft function? | ❌ Not implemented |
| Task table? | Use Airtable Agent Approvals + optional Airtable Tasks table later |
| Create Airtable records now? | ✅ `createAirtableRecords` + `writeActionsToAirtable()` |
| Action types scaffolded? | ✅ 7 types in `lib/network-builder/actions.ts` |
| Strongly typed payloads? | ✅ `ProposedRelationshipAction`, `NetworkContact`, etc. |

**MVP execution (Phase 6):** Airtable draft text only — no Gmail, no send.

---

## E. CLI and testing

| Question | Answer |
|----------|--------|
| Dry-run works? | ✅ Default mode, fixture fallback |
| Fixture data | 3 contacts in `getFixtureNetworkContacts()` |
| Live Airtable when env set | ✅ Reads People + Interactions via `readNetworkContacts()` |
| `--write-approvals` flag | ✅ **Added** — separate from default dry-run |
| Dry-run default | ✅ No writes unless `--write-approvals` |
| Tests | ✅ `__tests__/lib/network-builder.test.ts` |

### Commands

```bash
# Dry-run (default)
npx tsx scripts/tools/run-network-readiness-agent.ts --org=dcc

# Live read, JSON output
npx tsx scripts/tools/run-network-readiness-agent.ts --org=dcc --json

# Write to Agent Approvals + Supabase (after table created + PAT write scope)
npx tsx scripts/tools/run-network-readiness-agent.ts --org=dcc --write-approvals
```

---

## Agreed MVP defaults (from human decisions)

| Setting | Value |
|---------|-------|
| CRM base | INFRA24 Airtable (same base for Agent Approvals) |
| Readiness target | 70% MVP |
| Stale threshold | 60 days |
| Priority | Warm contacts + workshop leads |
| Approval | Moises internal tasks; Moises + Fabiola external drafts |
| First execution | Airtable draft text only (no Gmail yet) |
| Run frequency | On-demand first |

---

## Next human steps before `--write-approvals`

1. Create **Agent Approvals** table in INFRA24 with fields from `approval-field-map.ts`
2. Add minimum People columns (Email, Practice Tags, Interest Tags, etc.)
3. Set `AIRTABLE_DCC_CRM_TABLE_AGENT_APPROVALS` in `.env.local`
4. Ensure PAT has `data.records:write` on INFRA24 base
5. Apply Supabase migration (`npm run supabase:push`)
6. Dry-run live: `npx tsx scripts/tools/run-network-readiness-agent.ts --org=dcc --json`
7. Review output, then: `--write-approvals`
