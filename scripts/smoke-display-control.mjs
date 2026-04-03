#!/usr/bin/env node
/**
 * Smoke test: control plane propose (read + optional mutation) against a running Next app.
 *
 * Prerequisites:
 *   - Local: npm run dev (default http://127.0.0.1:3000)
 *   - supabase db reset (seed creates user_smoke_display + telegram 999999001)
 *   - .env.local: INFRA24_CONTROL_SERVICE_TOKEN must match the app
 *
 * Usage:
 *   INFRA24_CONTROL_SERVICE_TOKEN=secret npm run smoke:display-control
 *   BASE_URL=http://127.0.0.1:3000 TELEGRAM_ONLY=1 npm run smoke:display-control
 *
 * Optional display player JSON (no Bearer; use query token if screen requires it):
 *   SMOKE_DISPLAY_PLAYLIST_PATH=/api/display/v1/org/oolite/screens/<key>/playlist?token=...
 */

const base = process.env.BASE_URL || 'http://127.0.0.1:3000'
const token = process.env.INFRA24_CONTROL_SERVICE_TOKEN
const actor = process.env.SMOKE_ACTOR_CLERK_ID || 'user_smoke_display'
const telegramOnly = process.env.TELEGRAM_ONLY === '1'

async function post(path, body, headers = {}) {
  const url = `${base.replace(/\/$/, '')}${path}`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...headers,
    },
    body: JSON.stringify(body),
  })
  const text = await res.text()
  let json
  try {
    json = JSON.parse(text)
  } catch {
    json = { raw: text }
  }
  return { ok: res.ok, status: res.status, json }
}

async function get(path) {
  const url = `${base.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`
  const res = await fetch(url)
  const text = await res.text()
  let json
  try {
    json = JSON.parse(text)
  } catch {
    json = { raw: text }
  }
  return { ok: res.ok, status: res.status, json }
}

async function main() {
  if (!token) {
    console.error('Missing INFRA24_CONTROL_SERVICE_TOKEN')
    process.exit(1)
  }

  console.log(`Base: ${base}`)

  const readBody = telegramOnly
    ? {
        organization_slug: 'oolite',
        telegram_user_id: '999999001',
        action: 'departments.list',
        payload: {},
      }
    : {
        organization_slug: 'oolite',
        actor_clerk_id: actor,
        action: 'departments.list',
        payload: {},
      }

  const r1 = await post('/api/control/v1/propose', readBody)
  if (!r1.ok) {
    console.error('departments.list failed', r1.status, r1.json)
    process.exit(1)
  }
  console.log('OK departments.list preview keys:', Object.keys(r1.json.preview || {}))

  const deviceKey = `smoke-${Date.now()}`
  const proposeCreate = {
    organization_slug: 'oolite',
    ...(telegramOnly
      ? { telegram_user_id: '999999001' }
      : { actor_clerk_id: actor }),
    action: 'screen.create',
    payload: {
      name: `Smoke screen ${deviceKey}`,
      device_key: deviceKey,
    },
  }

  const r2 = await post('/api/control/v1/propose', proposeCreate)
  if (!r2.ok) {
    console.error('screen.create propose failed', r2.status, r2.json)
    process.exit(1)
  }
  const { proposal_id, commit_token } = r2.json
  if (!proposal_id || !commit_token) {
    console.error('Expected proposal_id and commit_token', r2.json)
    process.exit(1)
  }

  const r3 = await post('/api/control/v1/commit', {
    organization_slug: 'oolite',
    ...(telegramOnly
      ? { telegram_user_id: '999999001' }
      : { actor_clerk_id: actor }),
    proposal_id,
    commit_token,
  })
  if (!r3.ok) {
    console.error('commit failed', r3.status, r3.json)
    process.exit(1)
  }
  console.log('OK screen.create committed:', r3.json.result)

  const playlistPath = process.env.SMOKE_DISPLAY_PLAYLIST_PATH?.trim()
  if (playlistPath) {
    const g = await get(playlistPath)
    if (!g.ok) {
      console.error('SMOKE_DISPLAY_PLAYLIST_PATH fetch failed', g.status, g.json)
      process.exit(1)
    }
    const slides = g.json?.slides
    console.log(
      'OK display playlist:',
      Array.isArray(slides) ? `${slides.length} slide(s)` : 'response received'
    )
  }

  console.log('Smoke passed.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
