# Deploy: Supabase migrations + control plane env

## 1. Link and push (hosted database)

```bash
npx supabase login
npx supabase link --project-ref <YOUR_PROJECT_REF>
npm run supabase:push
```

`npm run supabase:push` runs [`scripts/supabase-push-remote.sh`](../scripts/supabase-push-remote.sh) (`npx supabase db push`). Apply the full migration chain that you already verified locally with `npx supabase db reset` (display/control plane, `artist_spotlight`, `workshop_digest`, `control_identities` RLS, `organizations.timezone`, etc.).

## 2. Application environment (e.g. Vercel)

| Variable | Required | Purpose |
|----------|----------|---------|
| `INFRA24_CONTROL_SERVICE_TOKEN` | For OpenClaw / service `propose`+`commit` | Bearer secret; must match the token configured on the agent host |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Existing app config |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Existing app config |

Generate the control token with a CSPRNG (e.g. `openssl rand -hex 32`). Never commit it; never expose it to the browser.

## 3. Smoke test (staging or production origin)

With the Next app running and the same token in `.env.local`:

```bash
BASE_URL=https://your-deployment.example INFRA24_CONTROL_SERVICE_TOKEN=<secret> npm run smoke:display-control
TELEGRAM_ONLY=1 BASE_URL=https://... INFRA24_CONTROL_SERVICE_TOKEN=<secret> npm run smoke:display-control
```

Optional display JSON check (path must start with `/`; include `?token=` if the screen uses a display token):

```bash
BASE_URL=https://your-app.example \
SMOKE_DISPLAY_PLAYLIST_PATH=/api/display/v1/org/oolite/screens/<screenKey>/playlist \
INFRA24_CONTROL_SERVICE_TOKEN=<secret> \
npm run smoke:display-control
```

See [`scripts/smoke-display-control.mjs`](../scripts/smoke-display-control.mjs).

## 4. Seed data on remote (optional)

Local dev uses [`supabase/seed.sql`](../supabase/seed.sql) after `db reset`. For hosted Postgres, run equivalent SQL in the Supabase SQL editor if you need Oolite smoke users (or rely on production org data only).
