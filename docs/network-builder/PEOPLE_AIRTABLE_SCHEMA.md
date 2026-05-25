# People Table — Final Airtable Schema (INFRA24 CRM)

Base: **INFRA24 CRM** (`appWoYBRdklcz2RJH`)  
Table: **People** (`tbltHiqscY80ybsGE`)

Do **not** replace the existing CRM structure — extend it with the MVP fields below.

Code mapping: [`lib/network-builder/field-map.ts`](../../lib/network-builder/field-map.ts)  
Select options: [`lib/network-builder/people-select-options.ts`](../../lib/network-builder/people-select-options.ts)

---

## Existing fields (keep)

Full Name, Title / Role, Department, Institution, City, Email, LinkedIn, Relationship Strength, Relationship Type, Can Open Doors For, Warm Intro Possible, Introduced By, Last Contact Date, Next Follow-Up Date, Follow-Up Status, Strategic Value, Works Best With, Notes, Opportunities, Interactions, Miami Area?, Contact Category, Warmth, Can Help With, Next Best Ask, Source, Patron Potential, Space Access Potential, Record Type, Last Meaningful Touch, Campaigns

---

## MVP fields to add

| Field | Type | Purpose |
|-------|------|---------|
| Practice Tags | Multiple select | Digital/creative practice classification |
| Interest Tags | Multiple select | Program/opportunity matching |
| Website | URL | Public signifier |
| Instagram | Single line text | Social signifier |
| Consent Status | Single select | Contact permission |
| DCC Signup Status | Single select | Onboarding state |
| Digital Orientation Statement | Long text | Core digitally-oriented signal |
| Network Readiness Score | Number | Agent 0–100 score |
| Network Readiness Status | Single select | Human-readable band |
| Follow-Up Cadence | Single select | 30/60/90/custom rhythm |
| Agent Notes | Long text | Latest recommendation |
| Agent Last Scored At | Date/time | Audit trail |

Option lists are locked in `people-select-options.ts`.

---

## 100-point readiness model

| Component | Points |
|-----------|-------:|
| Full Name | 10 |
| Email | 15 |
| Role / Contact Category | 10 |
| Practice Tags | 15 |
| Interest Tags | 10 |
| Digital Orientation Statement | 15 |
| Website / Instagram / LinkedIn | 10 |
| Consent Status | 10 |
| Last Meaningful Touch / Last Contact Date | 5 |
| **Total** | **100** |

## Network-ready threshold

**70+** score plus gates:

- Name, email, role/category
- One digital/practice signal (statement or practice tags)
- One interest tag
- One social signifier (website, Instagram, or LinkedIn)
- Consent: Permission to Contact or Subscribed

## Goals

- MVP: **100** network-ready artists/creators/creative technologists
- Stretch: **1,000** total contacts in 12 months

---

## Human workflow

1. Add MVP columns in Airtable (or run schema gap report)
2. Configure `.env.local` with PAT (`data.records:read`, `data.records:write` for approvals)
3. Dry-run: `npx tsx scripts/tools/run-network-readiness-agent.ts`
4. Review report; then `--write-approvals` when ready

Schema gap: `npx tsx scripts/tools/network-builder-schema-gap-report.ts`
