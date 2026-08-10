# Vercel demo environment checklist

Use before partner or interview demos (Infra24 + DCC).

## Required

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Platform + pgvector |
| `SUPABASE_SERVICE_ROLE_KEY` | Memory Agent embeddings, assets |
| `OPENAI_API_KEY` | Ask, embeddings, Whisper |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Staff routes |
| `CLERK_SECRET_KEY` | Auth |

## DCC pilot

| Variable | Purpose |
|----------|---------|
| `DCC_NETWORK_ADMIN_ENABLED` | `true` — enables `/network/admin` and `/network/agent` |
| `AIRTABLE_DCC_CRM_API_KEY` | Network Builder + approvals write |
| `AIRTABLE_DCC_CRM_BASE_ID` | |
| `AIRTABLE_DCC_CRM_TABLE_PEOPLE` | |
| `AIRTABLE_DCC_CRM_TABLE_AGENT_APPROVALS` | After Airtable table created |

## Memory Agent (per org)

| Variable | Purpose |
|----------|---------|
| `AIRTABLE_OOLITE_ALUMNI_*` or legacy alumni vars | Oolite people data |
| `ELEVENLABS_API_KEY` | TTS |
| `ELEVENLABS_VOICE_ID` or `ELEVENLABS_VOICE_ID_OOLITE` | Voice |

## Optional polish

| Variable | Purpose |
|----------|---------|
| `NETWORK_BUILDER_LLM_POLISH` | `true` — warm draft rewrites (one OpenAI call per action) |

## Pre-demo commands (local or CI)

```bash
npm run sync:memory-agent-embeddings -- --org=dcc
npm run sync:memory-agent-embeddings -- --org=oolite   # if demoing Oolite memory
npm run eval:memory-agent -- --org=dcc --report=reports/memory-agent-eval.json
npm run network-builder:schema-gap -- --org=dcc
```

## Demo URLs

| Surface | URL |
|---------|-----|
| **Applied AI hub (recruiters)** | `/applied-ai` |
| DCC Memory Agent | `/o/dcc/memory-agent` |
| Oolite Memory Agent | `/o/oolite/memory-agent` |
| Network graph | `/network/admin` |
| Network agent | `/network/agent` |
| Public network | `/network` |

## Portfolio artifacts to capture

1. Screen recording (~90s): voice ask → citations → approval queue
2. Screenshot: `reports/memory-agent-eval.json` summary with passed count
3. Screenshot: Airtable Agent Approvals row (pending)

## AI24 (sibling repo)

Deploy separately; see `website/ai24/docs/AI24_SIX_WEEK_DEMO_ELEVATION_SPEC.md`.
