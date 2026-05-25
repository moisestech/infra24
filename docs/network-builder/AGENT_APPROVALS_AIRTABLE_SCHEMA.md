# Agent Approvals — Airtable Schema (INFRA24 CRM)

Create this table in **INFRA24 CRM** (`appWoYBRdklcz2RJH`), then set:

```env
AIRTABLE_DCC_CRM_TABLE_AGENT_APPROVALS=tblXXXXXXXX
```

Scaffold (print-only default):

```bash
npx tsx scripts/tools/scaffold-agent-approvals-table.ts
npx tsx scripts/tools/scaffold-agent-approvals-table.ts --apply  # requires schema.bases:write
```

PAT requires `data.records:write` for `--write-approvals`.

---

## Table name

**Agent Approvals**

---

## Fields

| Field name | Type | Notes |
|------------|------|-------|
| Approval Name | Single line text | `{Action Type} — {Person Name}` |
| Action ID | Single line text | Links to Supabase proposed action |
| Organization | Single select | DCC (MVP); Oolite, Bakehouse, Soho House, Other later |
| Goal | Single select | Network readiness (MVP default) |
| Person / Partner | Link to People | Main person |
| Institution | Link to Institutions | Optional |
| Opportunity | Link to Opportunities | Optional |
| Campaign | Link to Campaigns | Optional |
| Action Type | Single select | See below |
| Relationship Stage | Single select | New, Warm, Active, Partner, Dormant, Needs Review, Do Not Contact |
| Agent Recommendation | Long text | |
| Reason | Long text | |
| Proposed Output | Long text | Draft message/task |
| Risk Level | Single select | Low, Medium, High |
| Approval Status | Single select | Pending, Approved, Rejected, Needs Edit, Executed, Skipped |
| Human Notes | Long text | |
| Approved By | Single line text | Phase 1: Moises |
| Approved At | Date/time | |
| Execution Status | Single select | Not started, Running, Success, Failed, Skipped |
| Execution Result | Long text | |
| Outcome | Single select | See below |
| Run ID | Single line text | Supabase run reference |
| Readiness Percent | Number | 0–100 at proposal time |

---

## Phase 1 action types (agent may propose)

- Ask for missing info
- Invite to DCC Index
- Create follow-up task
- Draft partner follow-up

Full list (for Airtable options): see `AGENT_APPROVAL_SELECT_VALUES.actionType` in code.

---

## Approval policy (Phase 1)

| Step | Approval |
|------|----------|
| Score / detect / propose | Automatic |
| Create Agent Approval row | Automatic on `--write-approvals` |
| Approve draft/task | Moises only |
| Execute | After approval only |
| Send email | **Not allowed** |

---

## Code mapping

[`lib/network-builder/approval-field-map.ts`](../../lib/network-builder/approval-field-map.ts)  
[`lib/network-builder/write-approvals.ts`](../../lib/network-builder/write-approvals.ts)
