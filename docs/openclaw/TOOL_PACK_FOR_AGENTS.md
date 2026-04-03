# OpenClaw / agent tool pack (HTTP mapping)

Source manifest: [`openclaw-tools.json`](../openclaw-tools.json) (all actions and payload hints).

Deploy checklist: [`DEPLOY_SUPABASE_CONTROL.md`](../DEPLOY_SUPABASE_CONTROL.md).

Conversation flow: [`openclaw-agent-setup.md`](../openclaw-agent-setup.md).

## Minimal tool surface

Most agents only need **two HTTP tools** wired to your app origin (`BASE_URL`):

| Tool name | Method | Path | Body |
|-----------|--------|------|------|
| `infra24_control_propose` | POST | `/api/control/v1/propose` | JSON: `organization_slug`, `action`, `payload`, and either `actor_clerk_id` or `telegram_user_id` (service token), plus optional `correlation_id`, `idempotency_key` |
| `infra24_control_commit` | POST | `/api/control/v1/commit` | JSON: `organization_slug`, `proposal_id`, `commit_token`, same actor fields as propose |

Headers (both):

```http
Authorization: Bearer <INFRA24_CONTROL_SERVICE_TOKEN>
Content-Type: application/json
```

## OpenAI-style function schema (reference)

Use as a template for your agent framework’s “function” or “tool” definitions:

```json
{
  "type": "function",
  "function": {
    "name": "infra24_control_propose",
    "description": "Validate a typed display/control action; for mutations returns proposal_id and commit_token for confirmation.",
    "parameters": {
      "type": "object",
      "properties": {
        "organization_slug": { "type": "string" },
        "action": { "type": "string" },
        "payload": { "type": "object" },
        "actor_clerk_id": { "type": "string", "description": "Clerk user id (omit if using telegram_user_id)" },
        "telegram_user_id": { "type": "string", "description": "Telegram numeric id if mapped in control_identities" },
        "correlation_id": { "type": "string" }
      },
      "required": ["organization_slug", "action"]
    }
  }
}
```

```json
{
  "type": "function",
  "function": {
    "name": "infra24_control_commit",
    "description": "Apply a pending proposal after user confirmation.",
    "parameters": {
      "type": "object",
      "properties": {
        "organization_slug": { "type": "string" },
        "proposal_id": { "type": "string" },
        "commit_token": { "type": "string" },
        "actor_clerk_id": { "type": "string" },
        "telegram_user_id": { "type": "string" }
      },
      "required": ["organization_slug", "proposal_id", "commit_token"]
    }
  }
}
```

Restrict which `action` values the agent may send (allowlist) before production cutover.
