# Dual Airtable operating model (infra24)

| Base | ID | Role |
|------|-----|------|
| **LIFE OS** | `apprswzWnLrHBwFcx` | Engineering / strategy backlog. Agents claim tasks and write Deployed / PR URL. |
| **DCC OS** | `appWoYBRdklcz2RJH` | Staff product data (Machines, Services, Jobs, CRM People, Programming, …). |

Do **not** treat DCC Jobs as the coding backlog.

## Daily loop

1. Create / refine work in LIFE OS (or Claude → Airtable task).
2. In Cursor: `npm run life-os:list` → `claim <rec>` → implement → `done` / `deployed`.
3. Staff-facing product reads/writes go through `lib/dcc/*` against DCC OS.

## Docs

- [LIFE OS Tasks schema](../life-os/TASKS_SCHEMA.md)
- DCC product surfaces: `/machines`, `/pricing`, `/make`, `/scale-up`, `/dashboard/ceo`
- Signage feed: `GET /api/signage`
