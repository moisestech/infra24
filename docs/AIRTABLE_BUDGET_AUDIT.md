# Airtable Budget Integration Audit

## 1. Read vs Write

**Current state: READ ONLY**

The Airtable integration only fetches data. There is no write support (create, update, delete records).

| Operation | Supported | Notes |
|-----------|-----------|-------|
| Read (fetch) | Yes | `fetchBudgetFromAirtable()` in `lib/airtable/budget-service.ts` |
| Create | No | Would require `POST` to Airtable API |
| Update | No | Would require `PATCH` to Airtable API |
| Delete | No | Would require `DELETE` to Airtable API |

**To add write support**, you would need:
- Airtable Personal Access Token with `data.records:write` scope
- API routes: `POST /api/organizations/by-slug/oolite/budget/items`, `PATCH .../items/[id]`, `DELETE .../items/[id]`
- UI: Edit forms, inline editing, or "Add item" buttons that call these routes
- The budget-service would need `createRecord`, `updateRecord`, `deleteRecord` functions

---

## 2. Visualization Flow Audit

### Data Flow (Static vs Airtable)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  SOURCE: Budget Config                                                       │
│  - Oolite + Airtable configured: fetch from /api/.../budget/config (Airtable) │
│  - Oolite + Airtable not configured: getBudgetConfig() (budget-data.ts)     │
│  - Other orgs: getBudgetConfig() (budget-data.ts)                            │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  convertBudgetConfigToItems(config) → BudgetItem[]                           │
│  - Maps name, category, amount, vendor, notes, date                         │
│  - categorizeItem() maps CSV categories to display categories               │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
┌───────────────────────────────┐   ┌───────────────────────────────────────────┐
│  budgetItems                  │   │  createMonthsFromBudgetItems()            │
│  (for Overview, Detailed)      │   │  → budgetMonths (for Dashboard)           │
└───────────────────────────────┘   └───────────────────────────────────────────┘
```

### Visualization Components

| Component | Data source | Airtable parity | Status |
|-----------|-------------|-----------------|--------|
| **Overview tab** | budgetItems | Same flow | OK |
| - Pie chart | getPieChartData() from budgetItems | Same | OK |
| - Category breakdown | budgetItems by category | Same | OK |
| - Search/filter | filteredItems | Same | OK |
| **Dashboard tab** | budgetMonths, totalBudget | Same flow | OK |
| - Summary cards | totalBudget, totalSpent, remaining | Same | OK |
| - Monthly bar chart | budgetMonths | Same | OK |
| - Category pie | BUDGET_CATEGORIES vs lineItems | Partial | See note |
| **Detailed tab** | filteredItems table | Same | OK |
| **Export CSV** | budgetItems or filteredItems | Same | OK |
| **Monthly page** `/o/[slug]/budget/monthly/[month]` | API route | Uses static config | Gap |

### Gaps

1. **Monthly budget page** (`/o/oolite/budget/monthly/2026-01`): Uses `generateMockBudgetData(year)` without passing Airtable config. It always uses `getBudgetConfig(slug)` (static). For Oolite with Airtable, this page would show static data, not Airtable data.

2. **BudgetDashboard category pie**: Uses `BUDGET_CATEGORIES` from budget-utils (hardware-materials, program-salaries, etc.). The lineItems in budgetMonths have display categories like "Large Format Printer", "Community Event". `getCategoryTotal(months, category.id)` filters by `item.category === category.id`. So "Large Format Printer" would never match "hardware-materials". The dashboard category pie may show empty or incorrect for Airtable data because the category IDs don't align.

3. **Airtable record IDs**: We don't store Airtable record IDs for future edits. If we add write support, we'd need to pass record IDs through.

---

## 3. Category Mapping

Airtable/CSV categories → Display categories:

| Airtable Category | Display Category | Pass-through |
|-------------------|-------------------|--------------|
| Displays & Projection | Displays & Projection | Yes |
| Peripherals & Creation | Peripherals & Creation | Yes |
| Furniture & Fixtures | Furniture & Fixtures | Yes |
| Room Build-Out | Room Build-Out | Yes |
| Large Format Printer | Large Format Printer | Yes |
| Streaming | Streaming | Yes |
| Compute | Compute | Yes |
| Audio | Audio | Yes |
| Community Event | Community Event | Yes (fixed) |

---

## 4. Recommendations

### To enable write (updates from app to Airtable)

1. Add `data.records:write` to Airtable token scope
2. Create `lib/airtable/budget-service.ts` functions: `createBudgetRecord`, `updateBudgetRecord`, `deleteBudgetRecord`
3. Create API routes for CRUD
4. Add UI: edit modal, add row, delete row

### To fix monthly page

1. Update `app/api/organizations/by-slug/[slug]/budget/monthly/[month]/route.ts` to fetch Airtable config for oolite (same as main budget route) and pass to `generateMockBudgetData`

### To fix dashboard category pie

1. Either: Map display categories to BUDGET_CATEGORIES in getCategoryTotal, or
2. Pass a dynamic category list based on actual lineItem categories when using Airtable
