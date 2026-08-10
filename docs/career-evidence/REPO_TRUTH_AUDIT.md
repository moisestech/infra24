# Repo truth audit (Stage 0)

**Date:** 2026-08-10  
**Branch intent:** ship Applied AI pilot surfaces with honest claims  
**Package manager (canonical):** **npm** + `package-lock.json` (CI uses `npm ci`). Do not treat the former `packageManager: pnpm` field as authoritative.

## Present / partial / absent

| Capability | Status | Notes |
|---|---|---|
| Multi-tenant org platform (Clerk + Supabase) | **Present** | Live product surface |
| Memory Agent ask path (keyword + request-time embeddings) | **Present** | `/o/{org}/memory-agent`; recruiter alias `/memory-agent` → DCC |
| Citation / source IDs in ask responses | **Present** | Staff inspector surfaces sources |
| Staff / public / leadership modes + allowlists | **Present** | Governed outputs |
| DCC markdown corpus (`content/dcc/*`) | **Present** | Workshop/network/governance docs |
| Network Readiness Agent (rule scoring → Airtable approvals) | **Present** | `/network/agent` + `POST /api/network-builder/run`; no auto-send |
| Golden fixture + `eval:memory-agent` | **Present** | Scripts + `__tests__/fixtures/memory-agent-golden.json`; suite not green as a claim |
| Offline unit tests for embedding sync | **Present** | `__tests__/lib/embedding-sync.test.ts` |
| pgvector migration + sync + hybrid boost code | **Partial** | Code in repo; **not a verified-live public claim** until migration applied + embeddings synced + live eval |
| Green eval scoreboard | **Absent** | Do not claim green until dated report passes targets |
| LangChain / LangGraph orchestration | **Absent** | Not used |
| Career/CV opportunity site | **Absent here** | Lives on moises.tech, not Infra24 |
| Tracked `.env.local.local-backup` | **Remediated (tree)** | Removed from index; still may exist in git history — **rotate secrets**; no history rewrite in Stage 0 |

## Safe public claims

- Governed Memory Agent with hybrid retrieval and citations on DCC.
- Approval-gated Network Readiness drafts written to Airtable (human-in-the-loop).
- Eval harness and golden questions exist for regression measurement.
- Multi-tenant cultural-institution platform with live deployments.

## Prohibited until verified live

- “Shipped pgvector RAG in production”
- “Green Memory Agent eval”
- LangChain/LangGraph
- Measured user-time productivity wins without instrumentation

## Demo URLs (recruiter-safe)

| Path | Target |
|---|---|
| `/memory-agent` | Redirect → `/o/dcc/memory-agent` |
| `/applied-ai` | Hub (noindex) |
| `/network/agent` | Network Readiness UI (admin env) |

Canonical product host is whatever Vercel production maps for this project (confirm `dcc.miami` vs project URL before sending links).

## Security / reproducibility debt

1. **Rotate** any credentials that may have lived in the previously tracked backup (OpenAI, Airtable, Supabase, Clerk, Resend, Google/Microsoft, Stripe, control-plane). Do not paste values into chat.
2. Git history still contains the backup blob until an approved rewrite; Stage 0 does **not** rewrite history.
3. `package-lock.json` historically contained many `registry.npmmirror.com` entries. `.npmrc` now pins `registry.npmjs.org`. Full lockfile regeneration is follow-up if `npm ci` fails on a clean clone.
4. `reports/` is gitignored — do not commit raw eval dumps as portfolio proof until a green dated run is intentional.

## Verify command

```bash
npm run verify:career
```

Runs `secret-scan`, lint, unit tests, and a placeholder-env build.

**Note:** `npm run type-check` currently fails on `main` with pre-existing TS debt (Next.js build uses `ignoreBuildErrors: true`). Stage 0 does not expand that scope; CI still runs type-check for visibility.
