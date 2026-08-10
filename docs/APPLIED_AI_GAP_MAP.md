# Applied AI Engineer — gap map & build plan

> Sync with moises.tech career orchestrators. Infra24 closes **RAG + vector + governance**; gaps below are what to build or document before specific employers.

---

## Updated evidence table

| Requirement | Was listed as | Now | Where |
|-------------|---------------|-----|-------|
| RAG | Missing | **Partial/Strong** | Memory Agent |
| Vector DB | Missing | **Strong** | pgvector migration + sync |
| Multi-agent orchestration | Missing | **Partial** | Memory + Network agents (hand-rolled) |
| Production agents | Missing | **Partial** | Vercel pilot + eval + approvals |
| LLM eval | Thin | **Partial** | Golden JSON + `eval:memory-agent` |
| n8n | Missing | **Strong (external)** | moises.tech automation specs |
| Make / Airtable ops | — | **Strong (external)** | Bookleggers scenario on moises.tech |
| Bedrock / Vertex | Missing | **Gap** | Build 1 small demo |
| Python ML | Thin | **Gap** | FastAPI RAG or Python eval mirror |
| LangGraph / CrewAI | Missing | **Gap** | Public Career Pipeline RAG repo |

---

## Build priority (Infra24 vs moises.tech)

### P0 — do before Pride Veterans / CoreStory outbound

| Task | Owner | Notes |
|------|-------|-------|
| Run eval green on staging | Infra24 | `npm run eval:memory-agent -- --org=dcc` |
| Sync embeddings on staging | Infra24 | `npm run sync:memory-agent-embeddings -- --org=dcc` |
| 90s demo recording | You | Script in `DCC_UNIFIED_DEMO_SCRIPT.md` |
| Export CV PDF with Memory Agent bullets | moises.tech | `constants/resume.ts` |
| Fill n8n label taxonomy on moises.tech | You | `automationProjects.ts` gap notes |

### P1 — before Deloitte / enterprise

| Task | Owner | Notes |
|------|-------|-------|
| Bedrock OR Vertex embedding + chat demo | New small repo or Infra24 branch | 1 corpus slice |
| Python eval script mirroring golden JSON | Infra24 or public repo | Proves DS track |
| LangGraph Career Pipeline RAG (public) | Public GitHub | 2–3 tool nodes |
| Deploy `/applied-ai` hub on production | Infra24 | Links demos + docs |

### P2 — polish

| Task | Owner |
|------|-------|
| Opportunity dossiers on moises.tech (7 roles) | moises.tech |
| MCP mini-server if Tekfortune requires | Public repo |
| Metrics dashboard for agent latency/cost | Infra24 |

---

## Per-employer gap focus

| Target | Lead evidence | Close before apply |
|--------|---------------|-------------------|
| Pride Veterans (Claude Code) | n8n + Infra24 + Airtable | n8n doc depth only |
| CoreStory / Vikas | Memory Agent RAG/pgvector | Optional LangGraph repo |
| NEOGOV | Governance + approvals | Production framing doc |
| Blue Acorn iCi | Demos + Make/Bookleggers | Playwire + automation case study |
| Deloitte DS Engineer | RAG architecture | Bedrock + Python OR timeline in cover letter |
| Deloitte Lead Applied AI | Teaching + architecture narrative | Less hyperscaler pressure |
| Tekfortune | Qualify first | MCP demo if required |

---

## What NOT to claim

- “LangChain orchestration in Infra24”
- “Bedrock production experience”
- “Multi-agent framework builder” (say hand-rolled + learning LangGraph)
- “Mass-scale production RAG”
- “Gmail agent in this repo” (n8n is separate)

---

## Open questions (need from Moises)

1. **Staging URL** — Is dcc.miami / preview deploy ready with env vars from `VERCEL_DEMO_ENV_CHECKLIST.md`?
2. **Airtable Agent Approvals table** — Created and wired? Run `network-builder:schema-gap`.
3. **n8n** — Can you export workflow JSON + label list for moises.tech case study?
4. **Bookleggers Make** — Sync frequency, field map, go-live date?
5. **Job posting URLs** — NEOGOV, Blue Acorn, CoreStory, Deloitte exact links?
6. **moises.tech deploy** — Should opportunity dossiers be `listed: false` (private links) like Playwire?

---

## File index (Infra24 applied AI)

```
lib/memory-agent/          — RAG pipeline
lib/network-builder/       — Network Readiness Agent
app/o/[slug]/memory-agent/ — Public agent UI
app/(marketing)/network/agent/ — Gated agent admin
app/(marketing)/applied-ai/    — Recruiter demo hub
scripts/tools/eval-memory-agent.ts
scripts/tools/sync-memory-agent-embeddings.ts
supabase/migrations/20260711120000_memory_agent_embeddings_pgvector.sql
docs/APPLIED_AI_ENGINEER_EVIDENCE.md  ← this pack
docs/DCC_UNIFIED_DEMO_SCRIPT.md
docs/VERCEL_DEMO_ENV_CHECKLIST.md
```
