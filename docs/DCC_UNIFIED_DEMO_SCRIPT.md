# DCC unified demo script

Partner (12 min) and interview (8 min) flows for Infra24 + DCC pilot.

**Recruiter hub:** `/applied-ai` · **Evidence pack:** `docs/APPLIED_AI_ENGINEER_EVIDENCE.md` · **Week-6 capture:** `docs/DEMO_ASSETS_CHECKLIST.md`

## Prerequisites

- Migrations applied through `20260711120000_memory_agent_embeddings_pgvector.sql`
- `npm run sync:memory-agent-embeddings -- --org=dcc` (and `--org=oolite` if demoing Oolite)
- Env: `OPENAI_API_KEY`, `DCC_NETWORK_ADMIN_ENABLED=true`, DCC Airtable vars (for network agent write)
- Optional: `npm run eval:memory-agent -- --org=dcc` green locally

---

## Partner demo (~12 minutes)

### 1. Frame (1 min)

> DCC runs on shared cultural infrastructure: a network graph, governed institutional memory, and a human approval queue before anything goes public.

### 2. Network graph (2 min)

- Open `/network/admin` (requires `DCC_NETWORK_ADMIN_ENABLED=true`)
- Show consent, readiness scores, relationship metadata on the graph

### 3. Institutional Memory + voice (4 min)

- Open `/o/dcc/memory-agent` (or `/o/oolite/memory-agent` if DCC CRM not wired)
- **Hero question (voice):** “What DCC programming covers vibecoding or creative code workshops?”
- Expand **Memory context inspector** (staff mode): show pgvector hits, citation IDs, allowed artist IDs
- Show triple outputs (public / staff / leadership) if generated
- Approve one **QR handoff** asset if signage draft appears

### 4. Network Readiness Agent (3 min)

- Open `/network/agent`
- Run **without** write first (fixture or live preview)
- Enable **Write to Airtable** → run again
- Open Agent Approvals in Airtable → show pending row with draft text (no auto-send)

### 5. Close (2 min)

> Pilot scope: governed retrieval, approval-gated public outputs, CRM action proposals. Production would add Gmail drafts, webhooks, and broader org rollout.

---

## Interview demo (~8 minutes)

### 1. Architecture (2 min)

- Hand-rolled pipeline: intent → hybrid retrieval (keyword + pgvector + query-time embed) → JSON LLM → ID allowlist → citations
- Point to: `lib/memory-agent/ask.ts`, `lib/memory-agent/vector-retrieve.ts`, `supabase/migrations/20260711120000_memory_agent_embeddings_pgvector.sql`

### 2. Live ask + citations (2 min)

- Staff mode ask with citation panel visible
- Mention fallback when pgvector index empty (in-memory embed path)

### 3. Eval (2 min)

```bash
npm run eval:memory-agent -- --org=dcc
```

- Show golden fixture in `__tests__/fixtures/memory-agent-golden.json`
- Optional: break a citation rule → eval fails → fix

### 4. Network agent code walkthrough (2 min)

- Rule-based readiness scoring: `lib/network-builder/readiness.ts`
- Propose → Airtable: `lib/network-builder/write-approvals.ts`
- No LangChain; optional `NETWORK_BUILDER_LLM_POLISH=true` for one-shot draft polish

---

## Creative counterpart (AI24)

For breadth, mention **AI24 Social Orchestra** (Inngest + ElevenLabs live audio) — spec at `website/ai24/docs/AI24_SIX_WEEK_DEMO_ELEVATION_SPEC.md` (implement separately).

---

## Honest limits (say these if asked)

- Not production HR/finance; pilot governance only
- No Gmail send in MVP; Airtable draft queue only
- No LangGraph / Bedrock / Pinecone — Supabase pgvector + OpenAI direct
- Life OS / Gmail agent workflows not in this repo
