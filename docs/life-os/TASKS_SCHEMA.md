# LIFE OS — Tasks schema

Base: **LIFE OS** (`apprswzWnLrHBwFcx`)

Personal project management / career / art / life database. Used by Cursor agents to **read open tasks** and **write progress / deploy confirmation** (no copy-paste).

## Configure

```bash
# .env.local
AIRTABLE_LIFE_OS_API_KEY=pat…          # or fall back to AIRTABLE_API_KEY
AIRTABLE_LIFE_OS_BASE_ID=apprswzWnLrHBwFcx
AIRTABLE_LIFE_OS_TABLE_TASKS=tbl…      # set after discover
```

Discover live schema (requires PAT with `schema.bases:read` on this base):

```bash
npm run life-os:discover
# or
npx tsx scripts/tools/life-os-tasks.ts discover
```

## Default field map

Override any column with `AIRTABLE_LIFE_OS_FIELD_*`:

| Semantic | Default Airtable name | Env override |
|----------|----------------------|--------------|
| Title | Name | `AIRTABLE_LIFE_OS_FIELD_TITLE` |
| Status | Status | `…_FIELD_STATUS` |
| Repo | Repo | `…_FIELD_REPO` |
| Branch | Branch | `…_FIELD_BRANCH` |
| PR URL | PR URL | `…_FIELD_PR_URL` |
| Notes | Notes | `…_FIELD_NOTES` |
| Deployed At | Deployed At | `…_FIELD_DEPLOYED_AT` |
| Agent Run ID | Agent Run ID | `…_FIELD_AGENT_RUN_ID` |
| Agent | Agent | `…_FIELD_AGENT` |

## Status machine

`Todo` → `In Progress` → `In Review` → `Deployed` (+ `Blocked`, `Done`, `Ready`)

Open backlog filter: **Todo** or **Ready**.

If your single-select choices differ, rename them in Airtable to match, or patch [`lib/life-os/field-map.ts`](../../lib/life-os/field-map.ts).

## Agent write provenance

Every automated note is prefixed with `[cursor:life-os]`.

## CLI

```bash
npm run life-os:list
npm run life-os:tasks -- claim recXXXXXXXX [--agent=cursor] [--branch=feat/…]
npm run life-os:tasks -- done recXXXXXXXX --pr=https://github.com/…
npm run life-os:tasks -- deployed recXXXXXXXX --pr=…
npm run life-os:tasks -- note recXXXXXXXX "blocked on Bakehouse clearance"
```

## Code

- [`lib/life-os/config.ts`](../../lib/life-os/config.ts)
- [`lib/life-os/tasks.ts`](../../lib/life-os/tasks.ts) — named ops only (`listOpenTasks`, `claimTask`, `attachPr`, `markDeployed`, …)
- Shared HTTP: [`lib/airtable/client.ts`](../../lib/airtable/client.ts)

## Dual-base rule

| Base | Use |
|------|-----|
| LIFE OS | Engineering / strategy backlog for agents |
| DCC OS (`appWoYBRdklcz2RJH`) | Staff product data (machines, jobs, CRM) — not the coding backlog |
