# DCC account onboarding — November 24, 2026 implementation checkpoint

**Status:** Draft PR #72. Branded Clerk pages implemented in code; private Supabase migrations APPLIED and checked; website-member enrollment **still OFF**. No real users migrated or public member dots created.

## Public naming
- **DCC Miami:** institution and platform identity
- **Join DCC:** new account / verified private membership intent
- **Sign in:** returning account
- **Your DCC:** account home (`/network/your-dcc`)
- **Your Passport:** owner-editable private profile (`/network/your-profile`)
- **Atlas:** approved public directory
- **Network sculpture:** public reviewed practice connections and separate delayed anonymous cohort
- **Smart Sign:** application one can use after signing into a DCC account, not universal auth brand
- **infra24:** internal code/database infrastructure, not end-user copy
- Supabase project *nickname* can be DCC Miami independently of database/project ref and production credentials. DO NOT change project ID or database integration URL merely to update a label.

## Code implemented
- Unified, mobile-first, branded Clerk v4 SignIn/SignUp pages using shared `DccAuthExperience` and `dccClerkAppearance`. Preserves email/password, OAuth and MFA flows managed by Clerk; app only changes presentation.
- Fixed local-only auth return-path validator and unit tests; preserves Smart Sign's explicit `/dashboard` redirect. Direct DCC member signups route to `Your DCC` when safe feature flags are on; while off, legacy `/dashboard` remains default.
- `Your DCC` home displays accurate signed-out, unavailable, verification-required, pending-sync, legacy identity-review and active states, with public Atlas access and optional Passport editing. No fake activation or redirection loop on an unverified account.
- Feature-gated Join/legacy CRM handoff to this shared DCC member home. Existing DCC contact intake remains distinctly labeled *not verified membership* during prelaunch.
- Post-auth website source hint persists privately when a verified membership exists; client-provided campaign is not identity evidence.
- Public named profiles need separate opt-in and review; instant anonymous signup dots remain prohibited.

## Supabase verified
Project ref: `gpprdwgyllgintrxekzg` (database project 'infra24', UI nickname may show DCC Miami). **ACTIVE_HEALTHY** (Postgres 17.4). Existing DCC RSVP migrations left unchanged.

The following four migrations succeeded November 24, 2026 and were renamed in GitHub to match the database's actual applied migration *versions/names*. This avoids attempting to apply them a second time via a future CLI `db push`:

1. `20261124130727_dcc_platform_member_event_ledger_20261122220000.sql`
2. `20261124130801_dcc_private_profile_and_sculpture_snapshots_20261122233000.sql`
3. `20261124130802_dcc_member_reconciliation_queue_20261122235000.sql`
4. `20261124130804_dcc_member_entry_attribution_20261122235500.sql`

Checks passed: new private tables have RLS enabled; anonymous/authenticated roles cannot SELECT them; service_role can SELECT; DCC privileged RPCs are executable by service_role but not anon/authenticated. Passport revision bump trigger exists. A synthetic, transaction-rolled-back DB smoke test verified create/event-replay, deletion tombstone, and revision increment. No synthetic member persisted. **These are database checks, not actual Clerk/Airtable/browser end-to-end tests.**

## Security release blocker
[Security issue #73](https://github.com/moisestech/infra24/issues/73): 7 legacy public tables have RLS disabled and anon/authenticated SELECT/INSERT grants, including bookings, donations and submissions. Existing `announcements_feed` security-definer view and mutable function search paths also flagged by Supabase advisors. Do NOT blindly change these legacy permissions without app dependency audit; fix before unrestricted public onboarding. New DCC private tables have separate secure permissions.

## Clerk customization and free-tier behavior
Use embedded Clerk `SignIn`/`SignUp` with the supported `appearance` prop (current repo's `@clerk/nextjs@^4.29.3`, Next 14). Our CSS establishes DCC's colors, type hierarchy, responsive layout and branded membership explanation without requiring a paid auth plan merely for this styling. Clerk-managed authentication UI branding removal / a more advanced custom domain may depend on plan: confirm in the account's current dashboard before promising an ad-free white-label experience. No unsupported custom password/session implementation.

## Vercel
GitHub has reported Vercel status for the PR branch (sometimes success, later pending after commits). The connected Vercel app lists no infra24 project/deployments and project lookup returns 404 in the visible team scope. Therefore **we have NOT checked production/preview environment variables, webhook secret, Clerk instance, project readiness or verified deployed behavior**. Do not claim a working production signup; need correct project/team authorization or Vercel dashboard confirmation.

## Remaining gate sequence
1. Verify account's Vercel project/team scope, preview deployment, build logs, and current public URLs. Confirm environment variable NAMES and their configured/disabled state without exposing key values.
2. Run repo Jest unit tests, type-check, lint and Next build; resolve any errors, including Clerk v4 prop/API compatibility. Inspect current PR head CI, not older successful commits.
3. Review existing Clerk webhook configuration and signups, set a deliberate cutover timestamp and correct instance only after test users are identified. Prior accounts must not silently backfill/migrate by email alone.
4. Test signed Clerk new account/verification/update/delete, duplicate webhook, and legacy Airtable People collision flow with a synthetic consenting user. Respect the serialized reconciliation queue and inspect failed writes before retrying.
5. Implement and test human-steward approval workflow with revision lock, audit, unique public slug, field allowlist, review consent and immediate enough withdrawal semantics.
6. Verify delayed, coarsened website presence never leaks join timing or name, never adds to WhatsApp-reported count, and published connections only represent explicitly approved practices.
7. Resolve security issue #73 and test existing legacy application workflows before general public launch.
8. Enable flags incrementally for a private beta, then verify live signup and mobile Safari/Android flows. Only afterwards consider merging and rollout.

**Feature switches remain OFF:** `DCC_MEMBER_EVENT_CAPTURE_ENABLED`, `DCC_MEMBER_RECONCILIATION_ENABLED`, `DCC_MEMBER_PROFILE_ENABLED`, `DCC_STEWARD_REVIEW_ENABLED`, `DCC_SCULPTURE_SNAPSHOTS_ENABLED`, `DCC_SCULPTURE_SNAPSHOT_PUBLISH_ENABLED`.

**No deployment, activation, or actual DCC website enrollment performed in this checkpoint.**
