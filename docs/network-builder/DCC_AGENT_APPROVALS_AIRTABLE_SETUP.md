# DCC Agent Approvals — Airtable setup

Manual setup for Sprint 2 approval loop. After creating the table, set env vars and verify with the schema gap report.

## 1. Create table: Agent Approvals

In the **INFRA24 DCC CRM** base, create a table named **Agent Approvals** with these columns (names must match [`lib/network-builder/approval-field-map.ts`](../../lib/network-builder/approval-field-map.ts)):

| Column | Type | Notes |
|--------|------|--------|
| Approval Name | Single line text | Primary field |
| Action ID | Single line text | Unique per proposed action |
| Organization | Single select | DCC, Oolite, Bakehouse, Soho House, Other |
| Goal | Single select | Network readiness, Program activation, … |
| Person / Partner | Link to People | Optional |
| Action Type | Single select | Ask for missing info, Invite to DCC Index, … |
| Relationship Stage | Single select | cold, warm, active, … |
| Agent Recommendation | Long text | |
| Reason | Long text | |
| Proposed Output | Long text | Draft message (no auto-send) |
| Risk Level | Single select | low, medium, high |
| Approval Status | Single select | pending, approved, rejected, deferred |
| Human Notes | Long text | |
| Execution Status | Single select | not_started, in_progress, completed, failed |
| Outcome | Single select | none, positive, neutral, negative |
| Run ID | Single line text | Links to Supabase `network_agent_runs` |
| Readiness Percent | Number | 0–100 |

Optional columns (future): Institution, Opportunity, Campaign, Approved By, Approved At, Execution Result.

## 2. People table MVP columns

Run the schema gap report against live Airtable:

```bash
npm run network-builder:schema-gap -- --org=dcc
```

Add any **missing** columns listed in the report. See [`PEOPLE_AIRTABLE_SCHEMA.md`](./PEOPLE_AIRTABLE_SCHEMA.md).

## 3. Environment variables

Add to `.env.local` and Vercel:

```bash
AIRTABLE_DCC_CRM_API_KEY=...
AIRTABLE_DCC_CRM_BASE_ID=...
AIRTABLE_DCC_CRM_TABLE_PEOPLE=...
AIRTABLE_DCC_CRM_TABLE_AGENT_APPROVALS=tblXXXXXXXX
DCC_NETWORK_ADMIN_ENABLED=true
```

## 4. Verify write path (dry run first)

```bash
npx tsx scripts/tools/run-network-readiness-agent.ts --org=dcc
npx tsx scripts/tools/run-network-readiness-agent.ts --org=dcc --write-approvals
```

Or use the admin UI: `/network/agent` → **Run network readiness**.

## 5. Demo checklist

- [ ] Schema gap report shows no blocking missing fields
- [ ] Agent Approvals table receives rows on `--write-approvals`
- [ ] Approver changes **Approval Status** manually in Airtable (no auto-send in pilot)
- [ ] Network agent UI shows proposed actions + link to Airtable
