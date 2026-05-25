# DCC Network Builder — Strategy & Implementation Brief

**Product name:** DCC Network Builder  
**Subtitle:** An agentic relationship and program-growth system for Miami's digital culture ecosystem.  
**Repo:** `infra24` (Next.js + Supabase + Airtable)  
**Date:** May 24, 2026  
**Status:** Phase 1 implemented — INFRA24 CRM wired, 100-point readiness model, Agent Approvals scaffold

---

## Confirmed INFRA24 CRM base

| Table | Table ID |
|-------|----------|
| Base (INFRA24 CRM) | `appWoYBRdklcz2RJH` |
| People | `tbltHiqscY80ybsGE` |
| Institutions | `tblu9cIAsNSg5Khhp` |
| Opportunities | `tblFdv4oI3FUXWtBl` |
| Interactions | `tbl4PSVbNU2G6kLVl` |
| Campaigns | `tblNdjser5MtVbZ4U` |
| Agent Approvals | Create manually — see `docs/network-builder/AGENT_APPROVALS_AIRTABLE_SCHEMA.md` |

---

## Phase 1 defaults

| Setting | Value |
|---------|-------|
| Readiness target | 70% (`dcc_network_readiness_mvp`) |
| Artist MVP target | 100 network-ready artists |
| 12-month stretch | 1,000 total contacts |
| Stale cadence fallback | 60 days (per-person Follow-Up Cadence overrides) |
| Approver (Phase 1) | Moises only |
| Execution | Airtable draft text only — no Gmail, no send |

---

## Network-ready definition (MVP)

A contact is **network-ready** at **70+** points when they have:

- Full name and email
- Role or contact category
- One digital/practice signal (Digital Orientation Statement or Practice Tags)
- One interest tag
- One social/professional signifier (Website, Instagram, or LinkedIn)
- Consent: **Permission to Contact** or **Subscribed**

Human language: signed up, shared how their work connects to digital culture, and provided a public signifier.

Schema: [`docs/network-builder/PEOPLE_AIRTABLE_SCHEMA.md`](PEOPLE_AIRTABLE_SCHEMA.md)  
DCC Index form: [`docs/network-builder/DCC_INDEX_FORM.md`](DCC_INDEX_FORM.md)

---

## CLI tools

```bash
# Dry-run (default)
npx tsx scripts/tools/run-network-readiness-agent.ts --org=dcc

# Schema gap report (live Airtable)
npx tsx scripts/tools/network-builder-schema-gap-report.ts --org=dcc

# Agent Approvals schema (print-only)
npx tsx scripts/tools/scaffold-agent-approvals-table.ts

# Write approvals (after table + env configured)
npx tsx scripts/tools/run-network-readiness-agent.ts --org=dcc --write-approvals

# Seed Supabase goal
node scripts/data/seed/seed-dcc-network-goal.js --apply
```

---

## Out of scope (Phase 1)

- Gmail drafts, email send, record delete, bulk update
- Approval sync polling (Phase 2)
- Multi-org config (Bakehouse/Oolite later)

---

## Executive summary

DCC needs a **network-growth agent**, not a generic operations agent. The system should continuously answer:

> Who should be connected, followed up with, invited, documented, activated, or converted into a partner next?

This repo already has ~70% of the **plumbing** needed. What is missing is the **goal-seeking loop**: score network state → detect gaps → propose relationship actions → human approval → execute drafts/tasks → log outcomes → improve memory → repeat.

---

## What the codebase already has

| Layer | Exists today | Location |
|-------|--------------|----------|
| **DCC CRM read path** | People, Institutions, Opportunities, Interactions, Campaigns → graph JSON | `lib/airtable/crm-graph-*`, `/api/marketing/dcc-network-graph` |
| **Public network UI** | Homepage + explorer graph | `app/(marketing)/network/`, `components/marketing/dcc-network/` |
| **Memory Agent** | RAG ask flow, data gaps, generated assets, triple outputs | `lib/memory-agent/` |
| **Propose → commit pattern** | Human-in-the-loop mutations with TTL tokens | `lib/control-plane/proposals.ts`, `control_proposals` table |
| **Multi-org Airtable config** | Per-org env pattern | `lib/airtable/org-alumni-config.ts`, `docs/AIRTABLE_MULTI_BASE.md` |
| **Weekly booking report** | SQL analytics API | `app/api/analytics/reports/weekly/route.ts` |
| **Generated asset queue** | draft → review → approved workflow | `memory_agent_generated_assets` table |

## What is missing (gaps vs spec)

| Spec area | Gap |
|-----------|-----|
| **Network readiness scoring** | Homepage node scoring exists; no per-contact readiness % or activation recommendation |
| **Goal-seeking agent runs** | No `agent_runs`, `goals`, `proposed_actions` for CRM |
| **CRM ↔ Memory Agent** | Memory Agent reads alumni tables, not DCC CRM People |
| **Airtable Agent Approvals table** | Not created yet |
| **Airtable webhooks** | No approve → execute webhook flow |
| **Gmail drafts** | Not implemented (Calendar OAuth exists) |
| **LangGraph** | Not present; custom OpenAI pipeline works for MVP |
| **Multi-org network builder config** | Needs abstraction beyond DCC-only env vars |
| **Weekly DCC network report** | No cross-source digest generator |

---

## Recommended architecture (reuse, don't rebuild)

```txt
┌─────────────────────────────────────────────────────────────┐
│  Airtable (human-facing CRM + approval queue)               │
│  People · Institutions · Programs · Agent Approvals         │
└──────────────────────────┬──────────────────────────────────┘
                           │ read / write proposals
┌──────────────────────────▼──────────────────────────────────┐
│  lib/network-builder/  (NEW — goal-seeking layer)           │
│  readContacts · scoreReadiness · generateActions · runAgent │
└──────────────────────────┬──────────────────────────────────┘
                           │ persist runs + actions
┌──────────────────────────▼──────────────────────────────────┐
│  Supabase (durable system of record)                          │
│  network_goals · network_agent_runs · network_proposed_actions│
│  network_outcomes · network_agent_memory                      │
└──────────────────────────┬──────────────────────────────────┘
                           │ reuse patterns
┌──────────────────────────▼──────────────────────────────────┐
│  Existing infra                                               │
│  control_proposals · memory_agent_generated_assets · Resend   │
└───────────────────────────────────────────────────────────────┘
```

**Key design choice:** Do not fork Memory Agent or OpenClaw. Network Builder is a **parallel module** that shares Airtable client, Supabase, and approval patterns.

---

## DCC data model mapping (current Airtable → spec)

### People table (live in Airtable)

| Spec field | Current Airtable field | Status |
|------------|-------------------------|--------|
| full_name | Full Name | ✅ mapped |
| role_type | Contact Category | ⚠️ partial |
| organization_affiliations | Institution | ✅ linked |
| relationship_status | Warmth | ⚠️ partial |
| location | Miami Area? | ⚠️ boolean only |
| practice_tags | — | ❌ needs column |
| interest_tags | — | ❌ needs column |
| email | — | ❌ needs column |
| website / social | — | ❌ needs column |
| last_contacted_at | — | ⚠️ derive from Interactions |
| consent_status | — | ❌ needs column |
| source | — | ❌ optional |

### Tables to add in Airtable (Sprint 1)

| Table | Purpose |
|-------|---------|
| **Agent Approvals** | Human review queue for proposed actions |
| **Relationship Actions** | History of proposed/executed actions |
| **Programs** | Workshops, clinics, salons (may partially exist elsewhere) |
| **Outcomes** | What happened after each action |

---

## Five goal loops (phased rollout)

| Phase | Agent | Metric | MVP? |
|-------|-------|--------|------|
| 1 | **Network Readiness** | % network-ready contacts | ✅ Yes — build first |
| 2 | Program Activation | RSVP / attendance rate | After Programs table |
| 3 | Partner Pipeline | Active partner stages | Uses Institutions + Opportunities |
| 4 | Public Signal | Published outputs/month | Extends Memory Agent assets |
| 5 | Opportunity Radar | Qualified opportunities reviewed | Uses Opportunities table |

---

## Sprint plan (aligned to repo)

### Sprint 1 — Foundation (current)

- [x] Codebase audit
- [x] `lib/network-builder/` module with readiness scoring
- [x] Supabase migration for network builder tables
- [x] CLI dry-run: `scripts/tools/run-network-readiness-agent.ts`
- [ ] Confirm Airtable field map with Moises
- [ ] Create Agent Approvals table in Airtable
- [ ] Add missing People columns (email, practice tags, etc.)

### Sprint 2 — Approval loop

- `writeActionsToAirtable()` → Agent Approvals table
- Airtable webhook → `syncApprovalStatus()`
- `policyCheck()` before execution
- `createAirtableTask()` after approval
- Persist runs to Supabase

### Sprint 3 — Execution + report

- Gmail draft integration (OAuth scope extension)
- `generateDccNetworkReport()` → `memory_agent_generated_assets` channel `report`
- Weekly cron or manual trigger
- `updateNetworkMemory()` from outcomes

### Sprint 4 — Multi-org

- `getNetworkBuilderConnection(orgSlug)` for any org
- Org-specific field maps in config
- Bakehouse / Oolite pilots with their own Airtable bases

### Sprint 5 — Additional agents

- Program Activation Agent
- Public Signal Agent (extends existing pilot docs)
- Partner Pipeline Agent

---

## MVP behavior (Network Readiness Agent)

1. Read people + interactions from org's Airtable CRM
2. Score each contact for **network readiness** (not just data completeness)
3. Detect missing fields and stale relationships
4. Rank priority contacts
5. Generate 10–25 proposed relationship actions
6. Write to Airtable Agent Approvals (Sprint 2)
7. After approval: create Gmail draft or Airtable task — **never send email in MVP**
8. Log outcome → update network memory
9. Generate weekly DCC Network Growth Report

### Action types (MVP)

- `ask_for_missing_info`
- `invite_to_dcc_index`
- `invite_to_workshop`
- `create_followup_task`
- `draft_partner_followup`
- `draft_program_invite`

---

## Multi-org design

Pattern mirrors `org-alumni-config.ts`:

```txt
AIRTABLE_{ORG}_NETWORK_API_KEY
AIRTABLE_{ORG}_NETWORK_BASE_ID
AIRTABLE_{ORG}_NETWORK_TABLE_PEOPLE
AIRTABLE_{ORG}_NETWORK_TABLE_APPROVALS
...
```

DCC legacy: falls back to `AIRTABLE_DCC_CRM_*` when `{ORG}` = `dcc`.

Each org gets:
- Field map override (which Airtable columns map to readiness fields)
- Goal templates (targets, metrics)
- Policy rules (what actions require approval)

---

## Questions for Moises (need answers to proceed)

### Airtable structure

1. **Can you share a screenshot or export schema** of the current DCC People table? We need to know which columns already exist vs need to be added.
2. **Do you want Agent Approvals as a new table** in the same DCC CRM base, or a separate base?
3. **Which fields are you willing to add to People now?** Recommended minimum: Email, Practice Tags, Interest Tags, Website, Instagram, Consent Status, Source, Last Contacted (or rely on Interactions).
4. **Is there a Programs table** in Airtable today, or do programs live only in Supabase workshops/announcements?

### Operations

5. **Who approves agent actions?** Just you, or Fabiola + team? Single approver or role-based?
6. **What is the stale-relationship threshold?** 30 / 60 / 90 days since last interaction?
7. **What counts as "network-ready"?** Is 90% readiness the target, or lower for MVP?
8. **Gmail account for drafts:** `dccmiami@gmail.com` or another inbox?

### Scope

9. **First pilot org after DCC:** Bakehouse, Oolite, or another?
10. **Run frequency:** Daily scan, weekly batch, or on-demand only?
11. **Budget for OpenAI runs:** OK to run scoring + draft generation on full contact list weekly?

### Technical

12. **Supabase migration:** OK to apply `network_*` tables to production Supabase?
13. **Airtable write access:** Can we create records in Agent Approvals via API (need write-scoped PAT)?

---

## Questions for GPT 5.4 (external strategy review)

Paste this document and ask GPT 5.4 to help with:

### Architecture

1. Given our existing Memory Agent + OpenClaw control plane + DCC CRM graph, is a **fourth parallel agent module** (`network-builder`) the right shape, or should we extend Memory Agent with a "network mode"?
2. For human-in-the-loop approval, is **Airtable as the approval UI** (with webhooks) sufficient for MVP, or should we build an in-app approval queue in Next.js first?
3. Should we adopt **LangGraph** now for durable multi-step runs (approval waits, scheduled follow-ups), or stay with custom orchestration until we hit complexity limits?

### Scoring & intelligence

4. Review our readiness weight model (see `lib/network-builder/readiness.ts`). Are the weights and thresholds reasonable for a cultural network where relationship warmth matters more than data completeness?
5. How should we combine **interaction recency from the Interactions table** with explicit `last_contacted_at` when both exist?
6. What is the best approach for **network memory** in MVP: rule-based patterns from outcomes, or pgvector embeddings over action history?

### Product

7. Is "Network Readiness Agent" the right first agent name for funders/partners, or should we lead with "Program Activation" for visibility?
8. How should the weekly report be delivered: email via Resend, Google Doc, in-app asset, or all three?
9. What governance guardrails are essential before any Gmail draft creation (even without send)?

### Multi-org

10. What is the minimum **org config surface** to support Bakehouse and Oolite without forking code?
11. Should each org have isolated Supabase rows (org_id scoped) or separate Supabase projects per org?

### Sequencing

12. Validate our sprint order: Readiness → Approval → Execution → Report → Multi-org → Other agents. Would you reorder anything given a 6-week timeline?

---

## Implementation started in this repo

| File | Purpose |
|------|---------|
| `lib/network-builder/types.ts` | Core types for contacts, scores, actions, runs |
| `lib/network-builder/org-config.ts` | Multi-org Airtable connection resolver |
| `lib/network-builder/field-map.ts` | Configurable field mapping per org |
| `lib/network-builder/read-contacts.ts` | `readNetworkContacts()` |
| `lib/network-builder/readiness.ts` | Scoring, gaps, stale detection, ranking |
| `lib/network-builder/actions.ts` | `generateRelationshipActions()` |
| `lib/network-builder/run-network-readiness.ts` | Orchestrates a full readiness run |
| `supabase/migrations/20260524120000_network_builder.sql` | Durable tables |
| `scripts/tools/run-network-readiness-agent.ts` | CLI dry-run |

### Run the MVP dry-run locally

```bash
npx tsx scripts/tools/run-network-readiness-agent.ts --org=dcc
npx tsx scripts/tools/run-network-readiness-agent.ts --org=dcc --limit=25 --json
```

Requires `AIRTABLE_DCC_CRM_*` env vars in `.env.local`.

---

## Success criteria (6-week horizon)

- [ ] 90%+ of DCC contacts scored with readiness + recommended action
- [ ] Agent Approvals table live with 10+ pending actions reviewed by team
- [ ] At least 5 approved actions executed as Gmail drafts or Airtable tasks
- [ ] First weekly DCC Network Growth Report generated
- [ ] One outcome logged and one network memory pattern recorded
- [ ] Config documented for a second org (Bakehouse or Oolite)

---

## Strategic positioning

**Name:** DCC Network Builder  
**Not:** "AI CRM" or "operations agent"  
**Story for funders:**

> DCC is building the infrastructure to help Miami's digital culture network become visible, organized, and activated.

The agent is proof that DCC practices what it teaches: using agentic systems to grow cultural infrastructure, not just talk about it.
