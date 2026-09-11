# DCC permissions v0.1

Companion to [OPERATING-MODEL.md](./OPERATING-MODEL.md). Admin and Operator are **asymmetric jobs**, not the same dashboard with fewer buttons.

People auth fields: [AIRTABLE-CHECKLIST.md](./AIRTABLE-CHECKLIST.md) §1.

---

## Identity stack

```
Clerk session  →  “who is this authenticated human?”
        ↓
Airtable Person.Clerk User ID
        ↓
Person.DCC App Roles  (admin and/or operator)
```

Airtable **Person** remains the operational identity. Clerk is not the DCC database. **Do not** reuse Infra24 Clerk `org_memberships` (Supabase tenant roles written by [`app/api/webhooks/clerk/route.ts`](../../app/api/webhooks/clerk/route.ts)) as DCC authorization.

`DCC Signup Status` is network onboarding. **Account Status** (`none` | `invited` | `active` | `disabled`) is whether they have/may have a login. **DCC App Roles** is what they may do in the DCC app. **Operator Active** is whether they currently take production work.

Roles are a **multiple select**. An Admin may also fabricate; that Person has both `admin` and `operator`.

---

## Staff linking (required before a writable Jobs console)

The shared scale-up **password cookie** ([`lib/dcc/scale-up-auth.ts`](../../lib/dcc/scale-up-auth.ts)) is acceptable for the legacy CEO scorecard. It is **not** the authorization model for a console that shows customer records, quotes, operator compensation, or that mutates commercial state.

Writable `/dcc/admin/jobs` (when built) must sit in the **same implementation phase** as Clerk↔Person linking.

### Bind flow

1. A human sets **DCC App Roles** on the Airtable Person (`admin` and/or `operator`). Account Status may be `invited`.
2. That person signs in with Clerk using the email on the Person.
3. Lookup:
   - Prefer exact **Clerk User ID**.
   - If Clerk User ID is empty: match **exactly one** Person by normalized email **and** that Person already has a DCC App Role; then **stamp Clerk User ID** and set Account Status `active`.
   - Never grant roles from Clerk org membership, from user-controlled form input, or from “they know the password.”
4. After Clerk User ID is set, **do not re-bind by email** (prevents later email-change attacks).
5. Authorize the request from the linked Person’s roles.

Bootstrap of the first admin is **manual in Airtable**. There is no self-serve “become DCC Admin.”

---

## Admin vs Operator

### Admin can see

All people; all jobs; client price; estimates; quotes; payment status; costs; contribution/margin; operator rates and assignments; service configuration; activity/Change Log; internal notes.

### Admin can do

Qualify; quote; assign/offer; approve cost changes; record payment metadata; schedule; close jobs; rotate client portal tokens.

### Operator initially sees (“My Work”)

Assigned job; relevant client **requirements** (not client price); files; machine/material; deadline; estimated hours; their rate; projected compensation; actual approved hours; approved compensation; compensation/payment status for **their** assignment; production notes.

### Operator can do

Accept or decline (or see cancellation of) an assignment; start work; update production status on their assignment; log hours; add production notes; upload documentation; mark their work complete.

### Operator cannot

Send client quotes; alter client pricing; mark client payments; change another operator’s assignment; see administrative CRM; issue discounts; see DCC margin or the client total.

That is the transparency worth prioritizing: an operator should never wonder **how much they are getting paid**. They should not see **what the client paid DCC**.

---

## No raw Airtable base for operators

Jobs carry client price, margin inputs (material, labor summary, machine reserve, external cost), and internal notes. The full DCC OS base therefore leaks Admin economics.

Until `/dcc/operator` exists, operators use a **restricted Airtable Interface** (or equivalent) exposing only Assignment + production fields — never the full base, never Grid view on Jobs with Quote Amount visible.

Admins may use the full base. That is a different trust class.

---

## Client portal token

[`/fabricate/quote`](../../app/(marketing)/fabricate/quote/page.tsx) today is public intake. The future `/fabricate/q/[token]` is **authentication by secret**.

Token rules (schema + future implementation):

- Cryptographically random, high entropy
- Never generated from Job ID, email, name, or sequential ids
- Revocable by rotation
- Named **Client Portal Token** because the surface is not quote-only

The client is not a DCC Operator or Admin. The token authorizes only that Job’s client-facing snapshot and the binary actions (accept quote, approve completion, request adjustment). It must not expose Internal Notes, operator rates, or margin.

When implemented, add the route to [`lib/auth/public-routes.ts`](../../lib/auth/public-routes.ts) (Clerk-exempt) while still treating the token as a credential.

---

## Surfaces that are not DCC Admin auth

| Surface | Current gate | Status |
|---|---|---|
| `/dashboard/ceo` | Scale-up cookie and/or `DCC_CEO_DASHBOARD_ENABLED` | Legacy; migrate later; do not copy this pattern to Jobs |
| `/network/admin` | `DCC_NETWORK_ADMIN_ENABLED` only | Insufficient; no identity. Do not put job economics there |
| Tenant `/o/[slug]/admin/*` | Clerk **org** membership | Infra24 SaaS. Not DCC OS |
| `/scale-up` | Same cookie family | Legacy |

---

## People fields that authorize

| Field | Type | Purpose |
|---|---|---|
| Account Status | single select | none / invited / active / disabled |
| Clerk User ID | text | Link to Clerk; stamped on first successful bind |
| DCC App Roles | **multiple** select | `admin`, `operator` |
| Operator Active | checkbox | Eligibility to receive new assignments |

Authorization always verifies the **authenticated Clerk identity** against the linked Person. Never trust a `role` query param or hidden form field.

---

## Out of v1

Member-to-member messaging; public member directory as self-serve profiles; operator marketplace claiming; using Clerk organizations named “DCC” as a shortcut for Admin.
