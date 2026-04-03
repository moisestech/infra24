# OpenClaw / Telegram control plane

Step-by-step agent wiring (env, loop, local smoke): [openclaw-agent-setup.md](./openclaw-agent-setup.md).

Infra24 exposes a **typed control API** for conversational agents (e.g. OpenClaw with Telegram). Agents must **not** write to the database directly; they call these HTTP endpoints.

## Environment

| Variable | Purpose |
|----------|---------|
| `INFRA24_CONTROL_SERVICE_TOKEN` | Bearer token for service-authenticated `propose` / `commit` requests |
| `NEXT_PUBLIC_SUPABASE_URL` | Already required for the app |
| `SUPABASE_SERVICE_ROLE_KEY` | Already required for the app |

Map Telegram users to Clerk with the `control_identities` table (migration `20250331000001_display_control_plane.sql`). Web admin: `/o/[slug]/admin/control-identities`. With the service token you may send **`telegram_user_id`** on **propose** and **commit** instead of `actor_clerk_id` when a row exists for that Telegram id and organization.

## Authentication

**Service (OpenClaw)**

```http
Authorization: Bearer <INFRA24_CONTROL_SERVICE_TOKEN>
Content-Type: application/json
```

Include the staff member’s Clerk user id, or a mapped Telegram id:

- JSON field `actor_clerk_id` on **propose** and **commit**, or
- Header `X-Actor-Clerk-Id` (supported when using Bearer auth), or
- JSON field `telegram_user_id` on **propose** and **commit** (looked up in `control_identities` for `organization_slug`’s org)

**Browser (web admin)**

- Session uses Clerk cookies automatically.
- Fast mutations: `POST /api/control/v1/execute-immediate` (session only; rejects service token).
- Safer two-phase flow: `propose` then `commit` (works with service token).

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/control/v1/propose` | Validate action, return preview; for mutations, create `proposal_id` + `commit_token` |
| `POST` | `/api/control/v1/commit` | Apply a pending proposal |
| `POST` | `/api/control/v1/execute-immediate` | Session-only direct mutation (web admin) |
| `GET` | `/api/display/v1/screens/:screenId/playlist?token=` | Resolved slides for a player |
| `GET` | `/api/display/v1/org/:slug/screens/:screenKey/playlist?token=` | Same, keyed by org slug + `public_slug` or `device_key` |
| `GET` | `/api/display-admin/:slug/overview` | Session-only: screens, playlists, departments |
| `GET/POST/DELETE` | `/api/display-admin/:slug/control-identities` | Session-only: list/create/delete Telegram → Clerk mappings |

Machine-readable action list: [openclaw-tools.json](./openclaw-tools.json). Agent tool wiring: [openclaw/TOOL_PACK_FOR_AGENTS.md](./openclaw/TOOL_PACK_FOR_AGENTS.md). Hosted DB + env: [DEPLOY_SUPABASE_CONTROL.md](./DEPLOY_SUPABASE_CONTROL.md).

## Propose / commit example (curl)

**1. Propose** (mutation stores preview + returns tokens)

```bash
curl -sS -X POST "$BASE/api/control/v1/propose" \
  -H "Authorization: Bearer $INFRA24_CONTROL_SERVICE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "organization_slug": "oolite",
    "actor_clerk_id": "user_xxx",
    "action": "playlist.create",
    "payload": { "name": "Lobby rotation" },
    "correlation_id": "tg-msg-123"
  }'
```

**2. Commit** (after user confirms in Telegram)

```bash
curl -sS -X POST "$BASE/api/control/v1/commit" \
  -H "Authorization: Bearer $INFRA24_CONTROL_SERVICE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "organization_slug": "oolite",
    "actor_clerk_id": "user_xxx",
    "proposal_id": "<uuid from propose>",
    "commit_token": "<token from propose>"
  }'
```

## Read-only actions (single `propose` call)

These return `preview` with `proposal_id: null`:

- `display.resolver_preview` — payload `{ "screen_id": "<uuid>" }`
- `display.screens_overview` — all org screens with resolved playlist name, slide count, first slide title
- `departments.list`
- `screen.list`
- `playlist.list`
- `audit.list_recent` — optional payload `{ "limit": 40 }` (max 100)

## Mutation actions (propose + commit)

- `screen.create`
- `screen.patch`
- `screen.assign_playlist`
- `playlist.create`
- `playlist.add_announcement`
- `playlist.add_dynamic_feed`
- `playlist.add_media` — `{ "playlist_id", "media_url", "title_override?", "duration_seconds?" }`
- `playlist.reorder_items` — `{ "playlist_id", "item_ids": ["uuid", ...] }` (full permutation)
- `playlist.add_artist_spotlight` — `{ "playlist_id", "artist_profile_id", ... }`
- `playlist.add_workshop_digest` — `{ "playlist_id" }` (slide lists today’s sessions in org timezone)
- `playlist.set_department_filter`
- `announcement.set_department`
- `announcement.publish`
- `announcement.create_draft` — `{ "title", "body", ... }` (draft only; optional `department_id`, `visibility`, etc.)

Payload shapes are summarized in [control-actions.schema.json](./control-actions.schema.json).

## Player URL

```
/display/<orgSlug>/<public_slug_or_device_key>?token=<optional display_token>
```

If the screen has `settings.display_token`, the same value must be passed as `token` on both the player page and the playlist API.

## Audit

All calls write to `control_action_logs`. Proposals expire after **15 minutes** (`control_proposals.expires_at`).

## Operational rules

1. Treat Telegram as the **fast** control surface, not the only one: web admin remains at `/o/[slug]/admin/screens`.
2. Use **propose/commit** for anything triggered by an agent; use **execute-immediate** only from an authenticated browser session.
3. Map natural language to **structured actions** in OpenClaw; never pass raw SQL or arbitrary Supabase operations.
