# OpenClaw agent setup (control plane)

This complements [openclaw-control-plane.md](./openclaw-control-plane.md), the machine-readable manifest [openclaw-tools.json](./openclaw-tools.json), the agent-oriented [openclaw/TOOL_PACK_FOR_AGENTS.md](./openclaw/TOOL_PACK_FOR_AGENTS.md), and hosted ops [DEPLOY_SUPABASE_CONTROL.md](./DEPLOY_SUPABASE_CONTROL.md).

## Environment (agent host or Infra24 app)

| Variable | Purpose |
|----------|---------|
| `INFRA24_CONTROL_SERVICE_TOKEN` | Same value in OpenClaw and Infra24; sent as `Authorization: Bearer …` |
| `NEXT_PUBLIC_APP_URL` / agent `BASE_URL` | Origin for `POST /api/control/v1/propose` and `/commit` |

## Minimal conversation loop

1. **Map intent → action** using `openclaw-tools.json` (`tools[].action` + payload shapes).
2. **Propose** — `POST /api/control/v1/propose` with `organization_slug`, `action`, `payload`, and either:
   - `actor_clerk_id` (Clerk user id), or
   - `telegram_user_id` (must exist in `control_identities` for that org; configure in `/o/oolite/admin/control-identities`).
3. **Show preview** — For mutations, show `preview` and require explicit user confirmation in Telegram.
4. **Commit** — `POST /api/control/v1/commit` with `proposal_id`, `commit_token`, and the **same** actor fields as step 2.
5. **Reads** — Actions like `departments.list` return `preview` with `proposal_id: null`; no commit.

## Local verification

```bash
npx supabase db reset   # applies migrations + supabase/seed.sql
# Set INFRA24_CONTROL_SERVICE_TOKEN in .env.local (must match what the agent uses)
npm run dev
# In another terminal:
npm run smoke:display-control
# Telegram identity path:
TELEGRAM_ONLY=1 npm run smoke:display-control
```

## Hosted database

After `npx supabase link --project-ref <ref>`:

```bash
npm run supabase:push
```

Apply the same migration order as local (including `organizations.timezone`, `control_identities` RLS, display plane migrations).

## Safety

- Do not expose `INFRA24_CONTROL_SERVICE_TOKEN` to browsers or client bundles.
- Prefer **propose/commit** for agent-driven mutations; reserve **execute-immediate** for human session-only admin.
