# Demo assets capture checklist (Week 6)

Use with [`VERCEL_DEMO_ENV_CHECKLIST.md`](./VERCEL_DEMO_ENV_CHECKLIST.md) and [`DCC_UNIFIED_DEMO_SCRIPT.md`](./DCC_UNIFIED_DEMO_SCRIPT.md).

## Before recording

- [ ] pgvector migration applied
- [ ] `npm run sync:memory-agent-embeddings -- --org=dcc`
- [ ] `npm run eval:memory-agent -- --org=dcc --report=reports/memory-agent-eval.json` (prefer green)
- [ ] `DCC_NETWORK_ADMIN_ENABLED=true` on staging
- [ ] Agent Approvals table exists; schema-gap clean enough for demo

## Capture

1. **90s screen recording** — voice ask → citation panel → Network Agent run → Airtable Approvals row  
2. **Eval report screenshot** — `reports/memory-agent-eval.json` pass summary  
3. **Staging URLs** — list Memory Agent + `/network/agent` + `/applied-ai`  

## Honest résumé bullets (after verified live)

- Built pgvector-backed hybrid RAG over CRM + programming + DCC doc corpus for a multi-tenant cultural platform  
- Implemented grounding eval suite and approval-gated public asset pipeline  
- Shipped rule-based network readiness agent with human-in-the-loop Airtable approval queue for DCC CRM  

## Build-state vocabulary

Do not describe local builds as deployed or verified live until the checklist above is done on staging/production.
